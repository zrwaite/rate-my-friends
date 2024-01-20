import { Review } from './review'

interface ReviewActivity {
	createdAt: number
	type: 'friendWasReviewed' | 'friendWroteReview' | 'youWereReviewed' | 'youWroteReview'
	review: Review
}

export type Activity = ReviewActivity
