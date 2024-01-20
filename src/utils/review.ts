import { Review } from 'src/types/review'

export const nicelyFormatReviewType = (type: Review['type']): string => {
	switch (type) {
		case 'event':
			return 'Event Review'
		case 'historical':
			return 'Historical Review'
		case 'firstImpression':
			return 'First Impression'
		default:
			throw new Error('Invalid review type')
	}
}
