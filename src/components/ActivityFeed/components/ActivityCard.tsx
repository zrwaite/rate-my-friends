import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ProfileIcon } from 'src/components/ProfileIcon'
import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { RmfCard } from 'src/components/RmfCard'
import { flexRow } from 'src/styles'
import { Activity } from 'src/types/activity'
import { nicelyFormatDate } from 'src/utils/date'
import { getShortName } from 'src/utils/friend'

export const ActivityCard = ({ activity }: { activity: Activity }): JSX.Element => {
	let title = 'Activity'
	const reviewerPhotoUrl = activity.review.reviewer.photoURL
	const revieweePhotoUrl = activity.review.reviewee.photoURL
	switch (activity.type) {
		case 'youWroteReview':
			title = `You wrote a review for ${getShortName(activity.review.reviewee)}`
			break
		case 'youWereReviewed':
			title = `You were reviewed by ${getShortName(activity.review.reviewer)}`
			break
		case 'friendWroteReview':
			title = `${getShortName(activity.review.reviewer)} wrote a review for ${getShortName(activity.review.reviewee)}`
			break
		case 'friendWasReviewed':
			title = `${getShortName(activity.review.reviewee)} was reviewed by ${getShortName(activity.review.reviewer)}`
			break
	}

	return (
		<RmfCard style={{ width: 'calc(100% - 2rem)' }}>
			<p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}:</p>
			<p style={{ marginBottom: '0.5rem', fontStyle: 'italic', textAlign: 'center' }}>{activity.review.text.slice(0, 40)}...</p>
			<div style={flexRow}>
				<ProfileIcon photoURL={reviewerPhotoUrl} />
				<Link to={`/review/${activity.review?.id}`} style={{ margin: '0.5rem' }}>
					<Button>View Review</Button>
				</Link>
				<ProfileIcon photoURL={revieweePhotoUrl} />
			</div>
			<RatingStars rating={activity.review.rating} size={8} style={{ marginBottom: '0.5rem' }}/>
			<p>{nicelyFormatDate(activity.createdAt)}</p>
		</RmfCard>
	)
}
