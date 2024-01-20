import { RMFAccount } from 'src/types/account'
import { Activity } from 'src/types/activity'
import { or, where } from 'firebase/firestore'
import { getReviewsFromConstraint } from './review'
import { RMFCache } from 'src/types/cache'

export const getActivityFeed = async (account: RMFAccount, page: number, cache: RMFCache): Promise<Activity[]> => {
	// TODO: Batch this to not need to limit to 10 friends
	// TODO: Use cache here somehow
	const friendIds = account.friends.filter(friend => !friend.rmf).map(friend => friend.uid).slice(0, 9)
	const reviewConstraint = or(
		where('revieweeId', 'in', [...friendIds, account.uid]),
		where('reviewerId', 'in', [...friendIds, account.uid])
	)
	const reviews = await getReviewsFromConstraint(reviewConstraint, account, cache)
	const reviewActivities: Activity[] = reviews.map(review => {
		let type: Activity['type']
		if (review.revieweeId === account.uid) {
			type = 'youWereReviewed'
		} else if (review.reviewerId === account.uid) {
			type = 'youWroteReview'
		} else if (friendIds.includes(review.revieweeId)) {
			type = 'friendWasReviewed'
		} else if (friendIds.includes(review.reviewerId)) {
			type = 'friendWroteReview'
		} else {
			throw new Error('Review does not involve user or any of their friends')
		}
		return {
			createdAt: review.createdAt,
			type,
			review,
		}
	})
	return reviewActivities
}
