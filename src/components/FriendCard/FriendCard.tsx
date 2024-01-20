import { Friend } from 'src/types/friend'
import { RmfCard } from '../RmfCard'
import { StyleType, flexRow } from 'src/styles'
import { ProfileIcon } from '../ProfileIcon'
import { getName } from 'src/utils/friend'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { RatingStars } from '../RatingStars/RatingStars'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FriendshipButtons } from '../FriendshipButtons'

export const FriendCard = ({ friend, setFriend }: { 
	friend: Friend
	setFriend: (friend: Friend) => void
}): JSX.Element => {
	const [expanded, setExpanded] = useState(false)
	return (
		<RmfCard key={friend.uid} style={styles.friendCard}>
			<div style={styles.defaultView}>
				<Link to={`/friend/${friend.uid}`}>
					<ProfileIcon photoURL={friend.photoURL} />
				</Link>
				<div style={styles.info}>
					<p style={{ marginLeft: '0.2rem' }}>{getName(friend)}</p>
					<div style={styles.bottomInfo}>
						<div style={{ ...flexRow, marginTop: '0.2rem' }}>
							<LocationOnIcon style={{ height: '1rem' }} />
							<p>{friend.location}</p>
						</div>
						<RatingStars rating={friend.rating} size={7} style={styles.ratingStars} count={expanded ? friend.ratingCount : undefined} />
					</div>
				</div>
			</div>
			{expanded && (
				<div style={{ marginTop: '0.5rem' }}>
					<FriendshipButtons friend={friend} setFriend={setFriend} />
				</div>
			)}
			<div style={{ ...styles.expandButton, marginTop: expanded ? '0.5rem' : 0 }} onClick={() => setExpanded(!expanded)}>
				{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
			</div>
		</RmfCard>
	)
}

const styles: StyleType = {
	friendCard: {
		padding: '0.5rem',
		width: '20rem',
	},
	defaultView: {
		display: 'flex',
		width: '100%',
		alignItems: 'space-between',
	},
	ratingStars: {
		marginLeft: '0.8rem'
	},
	info: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '100%',
		margin: '0 0.3rem',
	},
	bottomInfo: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
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
