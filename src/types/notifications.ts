export interface RMFNotification {
	id: string
	receiverId: string
	senderId: string
	resourceId?: string
	cleared: boolean
	type: 'friendRequest' | 'friendRequestAccepted' | 'friendRequestDeclined' | 'reviewAdded'
	createdAt: number
}
