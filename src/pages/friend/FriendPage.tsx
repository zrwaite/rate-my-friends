import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FriendshipButtons } from 'src/components/FriendshipButtons'
import { Navbar } from 'src/components/Navbar'
import { getFriend } from 'src/firebase/friends'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'
import { Friend } from 'src/types/friend'
import { StyleType, flexColumn, flexRow, flexStartRow } from 'src/styles'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { getName } from 'src/utils/friend'
import { ProfileIcon } from 'src/components/ProfileIcon'
import { Review } from 'src/types/review'
import { getRevieweeReviews } from 'src/firebase/review'
import { ReviewCard } from './components/ReviewCard'

export const FriendPage = (): JSX.Element => {
	const { id } = useParams<{ id: string }>()
	const { account } = useAccount()
	const { cache } = useCache()
	const [friend, setFriend] = useState<Friend | null>()
	const [reviews, setReviews] = useState<Review[]>()
	useEffect(() => {
		if (account === undefined) return
		const loadFriend = async (): Promise<void> => {
			setFriend(undefined)
			if (!id) return
			console.log('cache', cache)
			const friend = await getFriend(id, account || null, cache)
			console.log('friend', friend)
			setFriend(friend)
		}
		loadFriend()
	}, [id, account?.uid])

	useEffect(() => {
		if (account === undefined) return
		if (!friend) return
		const loadReviews = async (): Promise<void> => {
			setReviews(undefined)
			const reviews = await getRevieweeReviews(friend.uid, account || null, cache)
			setReviews(reviews)
		}
		loadReviews()
	}, [account?.uid, friend?.uid])

	return (
		<>
			<Navbar title={'Friend'} disableSearch/>
			<div style={flexColumn}>
				{friend && account && <div style={styles.container}>
					<h2 style={{ marginBottom: '1rem' }}>{getName(friend)}</h2>
					<div style={flexRow}>
						<ProfileIcon photoURL={friend.photoURL} style={{
							width: '5rem',
							minWidth: '5rem',
							height: '5rem',
							minHeight: '5rem',
						}} />
						<div style={flexColumn}>
							<RatingStars rating={friend.rating} style={styles.ratingStars} count={friend.ratingCount} />
							<div style={flexStartRow}>
								<LocationOnIcon style={{ height: '1rem' }} />
								<p>{friend.location}</p>
							</div>
						</div>
					</div>
					<div style={{ margin: '2rem 0' }}>
						<FriendshipButtons friend={friend} setFriend={setFriend} />
					</div>
					<h3>Reviews:</h3>
					<div style={flexColumn}>
						{reviews?.map((review, i) => (
							<ReviewCard key={i} review={review}/>
						))}
					</div>
				</div>}
				{friend === undefined || account === undefined && <CircularProgress />}
				{friend === null && <p>Friend not found</p>}
			</div>
		</>
	)
}

const styles: StyleType = {
	container: {
		...flexColumn,
		padding: '0.5rem',
		width: '100%',
		maxWidth: '25rem',
	},
	defaultView: {
		display: 'flex',
		// width: '100%',
		alignItems: 'space-between',
	},
	ratingStars: {
		width: '10rem',
		marginLeft: '0.8rem'
	},
	info: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '100%',
		margin: '0 0.3rem',
	},
	expandButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		cursor: 'pointer',
		height: '0.8rem',
	}
}
