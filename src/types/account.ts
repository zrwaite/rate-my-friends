import { Friend, Friendship } from './friend'
import { UserDoc } from './user'

export interface RMFAccount extends Friend {
	email: string | null
	public: boolean
	friends: Friend[]
	friendships: Friendship[]
	friendship?: undefined
}

export const UserDocToAccount = (
	userDoc: UserDoc, 
	friendships: Friendship[], 
	friends: Friend[], 
	photoURL: string | undefined,
	rating: number,
	count: number
): RMFAccount => ({
	uid: userDoc.uid,
	email: userDoc.private.email,
	firstName: userDoc.firstName,
	lastName: userDoc.lastName,
	photoURL: photoURL,
	photoFilename: userDoc.photoFilename,
	location: userDoc.location,
	public: userDoc.public,
	friendships,
	friends,
	rating,
	ratingCount: count,
})
