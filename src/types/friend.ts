export interface Friend {
	uid: string
	photoURL?: string
	photoFilename?: string
	location?: string
	firstName?: string
	middleName?: string
	lastName?: string
	nickName?: string
	friendship?: Friendship
	rating?: number
	ratingCount?: number
	rmf?: boolean
}

export interface Friendship {
	senderId: string
	receiverId: string
	status: 'pending' | 'accepted' | 'declined'
	public: boolean
	createdAt: number
}
