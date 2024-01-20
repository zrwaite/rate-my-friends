import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from 'src/components/Navbar'
import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { RmfCard } from 'src/components/RmfCard'
import { getReview } from 'src/firebase/review'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'
import { Review } from 'src/types/review'
import { nicelyFormatDate } from 'src/utils/date'
import { nicelyFormatReviewType } from 'src/utils/review'

export const ReviewPage = (): JSX.Element => {
	const { id } = useParams<{ id: string }>()
	const { account } = useAccount()
	const { cache } = useCache()
	const [review, setReview] = useState<Review | null>()
	useEffect(() => {
		if (!account) return
		const loadReview = async (): Promise<void> => {
			setReview(undefined)
			if (!id) return
			const review = await getReview(id, account, cache)
			setReview(review)
		}
		loadReview()
	}, [id, account?.uid])

	return (
		<>
			<Navbar title={'Review'} disableSearch/>
			<div className='center-page'>
				{review && account && <>
					<RmfCard style={{ width: '20rem' }}>
						<p>{review.text}</p>
						<p style={{ margin: '0.5rem 0' }}>- {nicelyFormatReviewType(review.type)}, {nicelyFormatDate(review.createdAt)}</p>
						<RatingStars rating={review.rating} />
					</RmfCard>
				</>}
				{review === undefined || account === undefined && <CircularProgress />}
				{review === null && <p>Review not found</p>}
			</div>
		</>
	)
}
