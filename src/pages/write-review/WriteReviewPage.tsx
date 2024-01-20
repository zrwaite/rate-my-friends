import { Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from 'src/components/Navbar'
import { ProfileIcon } from 'src/components/ProfileIcon'
import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { getFriend } from 'src/firebase/friends'
import { submitReview } from 'src/firebase/review'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'
import { flexRow } from 'src/styles'
import { Friend } from 'src/types/friend'
import { Review } from 'src/types/review'
import { getName } from 'src/utils/friend'

const reviewTypes = [{
	name: 'Historical',
	value: 'historical',
	info: 'Give a review for a friend at any time'
}, {
	name: 'Event',
	value: 'event',
	info: 'Give a review for a friend at a specific event'
}, {
	name: 'First Impression',
	value: 'firstImpression',
	info: 'Give a review for a friend the first time you meet them'
}]

export const WriteReviewPage = (): JSX.Element => {
	const { id } = useParams<{ id: string }>()
	const { account } = useAccount()
	const { cache } = useCache()
	const navigate = useNavigate()
	const [friend, setFriend] = useState<Friend | null>()
	const [reviewType, setReviewType] = useState<Review['type']>('historical')
	const [reviewText, setReviewText] = useState<string>('')
	const [reviewRating, setReviewRating] = useState<number>(3)

	useEffect(() => {
		if (!account?.uid) return
		const loadFriend = async (): Promise<void> => {
			setFriend(undefined)
			if (!id) return
			const friend = await getFriend(id, account, cache)
			setFriend(friend)
		}
		loadFriend()
	}, [id, account?.uid])

	const helperText = reviewTypes.find((type) => type.value === reviewType)?.info

	const submitEnabled = !!account && !!friend && !!reviewText && reviewText.length <= 1000

	const trySubmitReview = async (): Promise<void> => {
		if (!submitEnabled) return
		const review = await submitReview(reviewType, reviewRating, reviewText, account, friend)
		navigate(`/review/${review.id}`)
	}

	return (
		<>
			<Navbar title='Review' disableSearch />
			<div className='center-page'>
				{friend === undefined && <CircularProgress />}
				{friend === null && <p>Friend not found</p>}
				{!!friend && (<>
					<div style={flexRow}>
						<ProfileIcon photoURL={friend?.photoURL} />
						<p>{getName(friend)}</p>
					</div>
					<FormControl sx={{ m: 1, minWidth: '20rem', margin: '1rem', alignItems: 'center' }}>
						<InputLabel sx={{ fontSize:'large' }} id='review-type-label'>Select Review Type</InputLabel>
						<Select
							value={reviewType}
							onChange={(e) => setReviewType(e.target.value as Review['type'])}
							label="Select Review Type"
							labelId="review-type-label"
							style={{ width: '100%', fontSize: 'large' }}
						>
							{reviewTypes.map((type) => (
								<MenuItem key={type.value} value={type.value}>{type.name}</MenuItem>
							))}
						</Select>
						<FormHelperText>{helperText}</FormHelperText>
						<TextField 
							style={{ width: '100%', fontSize: 'large', marginTop: '1rem' }}
							minRows={10}
							placeholder='Write your review here...'
							label="Write your Review!"
							multiline
							inputProps={{ maxLength: 1000 }}
							value={reviewText}
							onChange={(e) => setReviewText(e.target.value)}
						/>
						<FormHelperText
							style={{ color: reviewText.length >= 1000 ? 'red' : undefined }}
						>Max 1000 characters ({reviewText.length}/1000)</FormHelperText>
						<h3 style={{ margin: '1rem' }}>Rating:</h3>
						<RatingStars rating={reviewRating} setRating={setReviewRating} editable style={{ maxWidth: '12rem' }}/>
						<Button 
							onClick={trySubmitReview} 
							disabled={!submitEnabled} 
							variant='contained' 
							style={{ marginTop: '2rem' }}
						>Submit</Button>
					</FormControl>
				</>)}
			</div>
		</>
	)
}
