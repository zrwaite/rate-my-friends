import { and, collection, doc, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from './firebase'
import { RMFNotification } from 'src/types/notifications'
import { RMFCache } from 'src/types/cache'

export const subscribeToNotifications = (uid: string, setNotifications: (notifications: RMFNotification[]) => void, cache: RMFCache): (() => void) => {
	const q = query(collection(db, 'notifications'), and(
		where('receiverId', '==', uid),
	), orderBy('createdAt', 'desc'), limit(20))

	const unsubscribe = onSnapshot(q, (snapshot) => {
		const newNotifications = snapshot.docs.map((doc) => ({
			...doc.data() as RMFNotification,
			id: doc.id,
		})).sort((a, b) => b.createdAt - a.createdAt)
		if (newNotifications.length > 0) {
			const newestNotification = newNotifications[0]
			if (newestNotification.type === 'reviewAdded') {
				// This user has written a new review, so they are no longer fully cached
				cache.current.fullyCachedReviewerIds.filter((id) => id !== newestNotification.senderId)
			} else {
				// The friendship status of this user has changed, so they are no longer fully cached
				cache.current.friends = cache.current.friends.filter((friend) => friend.uid !== newestNotification.senderId)
			}
			// TODO: Update cache elsewhere when review is created
		}
		setNotifications(newNotifications)
	})
	return unsubscribe
}

export const generateNotificationId = (senderId: string, receiverId: string, type: RMFNotification['type'], resourceId?: string): string => {
	const id = `${senderId}_${receiverId}_${type}`
	return resourceId ? `${id}_${resourceId}` : id
}

interface PartialRMFNotification {
	receiverId: string
	senderId: string
	resourceId?: string
	type: 'friendRequest' | 'friendRequestAccepted' | 'friendRequestDeclined' | 'reviewAdded'
}

export const sendNotification = async (notification: PartialRMFNotification): Promise<void> => {
	const notificationRef = doc(db, 'notifications', generateNotificationId(
		notification.senderId, 
		notification.receiverId, 
		notification.type,
		notification.resourceId
	))
	await setDoc(notificationRef, {
		...notification,
		cleared: false,
		createdAt: Date.now(),	
	})
}

export const sendFriendRequestNotification = async (senderId: string, receiverId: string): Promise<void> => {
	await sendNotification({
		senderId,
		receiverId,
		type: 'friendRequest',
	})
}

export const sendFriendRequestAcceptedNotification = async (senderId: string, receiverId: string): Promise<void> => {
	await sendNotification({
		senderId,
		receiverId,
		type: 'friendRequestAccepted',
	})
}

export const sendFriendRequestDeclinedNotification = async (senderId: string, receiverId: string): Promise<void> => {
	await sendNotification({
		senderId,
		receiverId,
		type: 'friendRequestDeclined',
	})
}

export const sendReviewAddedNotification = async (senderId: string, receiverId: string, reviewId: string): Promise<void> => {
	await sendNotification({
		senderId,
		receiverId,
		type: 'reviewAdded',
		resourceId: reviewId,
	})
}

export const clearNotification  = async (notificationId: string): Promise<void> => {
	const notificationRef = doc(db, 'notifications', notificationId)
	await updateDoc(notificationRef, {
		cleared: true,
	})
}
