import { Friend, Friendship } from 'src/types/friend'
import { QueryCompositeFilterConstraint, QueryFieldFilterConstraint, collection, deleteDoc, doc, getDoc, getDocs, or, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'
import { PublicUserDoc } from 'src/types/user'
import { getFileUrl } from './file'
import { sendFriendRequestAcceptedNotification, sendFriendRequestDeclinedNotification, sendFriendRequestNotification } from './notifications'
import { RMFAccount } from 'src/types/account'
import { RMFCache } from 'src/types/cache'
import { getUserRating } from './review'

export const getFriendFromPublicUserDoc = async (userDoc: PublicUserDoc, account: RMFAccount | null, cache: RMFCache): Promise<Friend> => {
	const photoURL = userDoc?.photoFilename ? await getFileUrl(userDoc?.photoFilename, userDoc?.uid) : undefined
	const friendship = account?.friendships.find((friendship) => friendship.senderId === userDoc.uid || friendship.receiverId === userDoc.uid)
	const { rating, count } = await getUserRating(userDoc.uid, cache)
	return {
		uid: userDoc.uid,
		photoFilename: userDoc.photoFilename,
		photoURL: photoURL,
		firstName: userDoc.firstName,
		middleName: userDoc.middleName,
		lastName: userDoc.lastName,
		nickName: userDoc.nickName,
		location: userDoc.location,
		rmf: userDoc.rmf,
		friendship,
		rating,
		ratingCount: count,
	}
}

const getFriendsFromConstraint = async (qc: QueryFieldFilterConstraint | QueryCompositeFilterConstraint, account: RMFAccount | null, cache: RMFCache): Promise<Friend[]> => {
	const usersRef = collection(db, 'users')
	const q = query(usersRef, qc as QueryFieldFilterConstraint) // For some reason it doesn't like '|' operator with overloads
	const querySnapshot = await getDocs(q)
	const friends: Friend[] = []
	for (const doc of querySnapshot.docs) {
		const friend = await getFriendFromPublicUserDoc(doc.data() as PublicUserDoc, account, cache)
		friends.push(friend)
	}
	return friends
}

export const searchFriends = async (search: string, account: RMFAccount | null, cache: RMFCache): Promise<Friend[]> => {
	if (!search) return []
	const maxSearchTerms = 8
	const names = search.split(' ').slice(0, maxSearchTerms).map((name) => name.toLowerCase())
	const qc = where('searchTerms', 'array-contains-any', names)
	return getFriendsFromConstraint(qc, account, cache)
}

export const getFriendshipsFromUserAuth = async (user: User): Promise<Friendship[]> => {
	const friendshipsRef = collection(db, 'friendships')
	const q = query(friendshipsRef, or(
		where('senderId', '==', user.uid),
		where('receiverId', '==', user.uid)
	))
	const querySnapshot = await getDocs(q)
	const friendships: Friendship[] = []
	querySnapshot.forEach((doc) => {
		friendships.push(doc.data() as Friendship)
	})
	return friendships
}

export const getFriendsFromFriendships = async (user: User, friendships: Friendship[], account: RMFAccount, cache: RMFCache): Promise<Friend[]> => {
	const friendIds = friendships.map((friendship) => friendship.senderId === user.uid ? friendship.receiverId : friendship.senderId)
	const cachedFriends = []
	const unCachedFriendIds = []
	for (const friendId of friendIds) {
		const cachedFriend = cache.current.friends.find((friend) => friend.uid === friendId)
		if (cachedFriend) cachedFriends.push(cachedFriend)
		else unCachedFriendIds.push(friendId)
	}
	if (unCachedFriendIds.length === 0) return cachedFriends
	const maxIds = 10
	const batches = []
	for (let i = 0; i < unCachedFriendIds.length; i += maxIds) {
		batches.push(unCachedFriendIds.slice(i, i + maxIds))
	}
	const unCachedFriends = []
	for (const batch of batches) {
		const qc = where('uid', 'in', batch)
		const newUnCachedFriends = await getFriendsFromConstraint(qc, account, cache)
		unCachedFriends.push(...newUnCachedFriends)
	}
	cache.current.friends.push(...unCachedFriends)
	return [...cachedFriends, ...unCachedFriends]
}

export const getFriend = async (id: string, account: RMFAccount | null, cache: RMFCache): Promise<Friend | null> => {
	const cachedFriend = cache.current.friends.find((friend) => friend.uid === id)
	if (cachedFriend) return cachedFriend
	const userDoc = await getDoc(doc(db, 'users', id))
	if (!userDoc.exists()) return null
	const friend = await getFriendFromPublicUserDoc(userDoc.data() as PublicUserDoc, account, cache)
	cache.current.friends.push(friend)
	return friend
}

export const sendFriendRequest = async (uid: string, friend: Friend): Promise<void> => {
	const friendshipRef = doc(db, 'friendships', `${uid}_${friend.uid}`)
	const isRmf = !!friend.rmf
	if (isRmf) {
		console.log('its rmf time baby')
	}
	await setDoc(friendshipRef, {
		senderId: uid,
		receiverId: friend.uid,
		status: isRmf ? 'accepted' : 'pending',
		createdAt: Date.now(),
		public: true,
	})
	if (isRmf) {
		await sendFriendRequestAcceptedNotification(friend.uid, uid)
	} else {
		await sendFriendRequestNotification(uid, friend.uid)
	}
}

export const acceptFriendRequest = async (uid: string, friendUid: string): Promise<void> => {
	const friendshipRef = doc(db, 'friendships', `${friendUid}_${uid}`)
	await updateDoc(friendshipRef, {
		status: 'accepted',
	})
	await sendFriendRequestAcceptedNotification(uid, friendUid)
}

export const declineFriendRequest = async (uid: string, friendUid: string): Promise<void> => {
	const friendshipRef = doc(db, 'friendships', `${friendUid}_${uid}`)
	await updateDoc(friendshipRef, {
		status: 'declined',
	})
	await sendFriendRequestDeclinedNotification(uid, friendUid)
}

export const cancelFriendRequest = async (uid: string, friendUid: string): Promise<void> => {
	const friendshipRef = doc(db, 'friendships', `${uid}_${friendUid}`)
	await deleteDoc(friendshipRef)
}
