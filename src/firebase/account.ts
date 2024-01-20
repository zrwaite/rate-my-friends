import { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from 'src/firebase'
import { RMFAccount, UserDocToAccount } from 'src/types/account'
import { UserDoc } from 'src/types/user'
import { getFriendsFromFriendships, getFriendshipsFromUserAuth } from './friends'
import { getFileUrl } from './file'
import { RMFCache } from 'src/types/cache'
import { getUserRating } from './review'

export const generateDefaultUserDoc = (user: User, authProvider: string): UserDoc => ({
	uid: user.uid,
	public: true,
	searchTerms: [],
	protected: {
		friendIds: [],
	},
	private: {
		authProvider,
		email: user.email,
	},
})

export const getAccountFromUserAuth = async (user: User | null, cache: RMFCache): Promise<RMFAccount | null> => {
	if (!user) return null
	const userDoc = await getDoc(doc(db, 'users', user.uid))
	const userData = userDoc.data() as UserDoc
	const friendships = await getFriendshipsFromUserAuth(user)
	const account = {
		uid: user.uid,
		friendships
	} as RMFAccount
	const friends = await getFriendsFromFriendships(user, friendships, account, cache)
	const photoURL = userData.photoFilename ? await getFileUrl(userData.photoFilename, user.uid) : undefined
	const { rating, count } = await getUserRating(user.uid, cache)

	if (!userDoc.exists()) {
		// TODO: this happens on first signup...
		console.error('User does not exist in database')
		return null
	}
	return UserDocToAccount(userData, friendships, friends, photoURL, rating, count)
}

export const hasFriend = (account: RMFAccount | null | undefined, friendUid: string): boolean => {
	return account?.friends.some((f) => f.uid === friendUid) ?? false
}
