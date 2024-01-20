import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { RmfCard } from 'src/components/RmfCard'
import { Review } from 'src/types/review'
import { nicelyFormatDate } from 'src/utils/date'
import { nicelyFormatReviewType } from 'src/utils/review'

export const ReviewCard = ({ review }: { review: Review }): JSX.Element => {
	return (
		<RmfCard style={{ width: '20rem' }}>
			<p>{review.text}</p>
			<p style={{ margin: '0.5rem 0' }}>- {nicelyFormatReviewType(review.type)}, {nicelyFormatDate(review.createdAt)}</p>
			<RatingStars rating={review.rating} />
		</RmfCard>
	)
}
