import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProfileIcon } from 'src/components/ProfileIcon'
import { RmfCard } from 'src/components/RmfCard'
import { getFriend } from 'src/firebase/friends'
import { clearNotification } from 'src/firebase/notifications'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'
import { flexRow } from 'src/styles'
import { Friend } from 'src/types/friend'
import { RMFNotification } from 'src/types/notifications'
import { nicelyFormatDate } from 'src/utils/date'
import { getShortName } from 'src/utils/friend'

export const NotificationCard = ({ notification }: { notification: RMFNotification }): JSX.Element => {
	const [sender, setSender] = useState<Friend | null>()
	const { account } = useAccount()
	const { cache } = useCache()
	useEffect(() => {
		if (!account) return
		const loadSender = async (): Promise<void> => {
			setSender(undefined)
			setSender(await getFriend(notification.senderId, account, cache))
		}
		loadSender()
	}, [notification.senderId, account?.uid])
	useEffect(() => {
		clearNotification(notification.id)
	}, [account?.uid])


	const getMessage = (): string => {
		if (!sender) return ''
		const senderName = getShortName(sender)
		if (notification.type === 'friendRequest') {
			return `${senderName} sent you a friend request`
		} else if (notification.type === 'friendRequestAccepted') {
			return `${senderName} accepted your friend request`
		} else if (notification.type === 'friendRequestDeclined') {
			return `${senderName} declined your friend request`
		} else if (notification.type === 'reviewAdded') {
			return `${senderName} reviewed you`
		}
		return ''
	}

	const isReview = notification.type === 'reviewAdded'

	return (
		<RmfCard style={{ width: '20rem' }}>
			{sender === undefined && <CircularProgress />}
			{sender === null && <p>Failed to find sender</p>}
			{sender && (
				<>
					<p>{getMessage()}</p>
					<div style={flexRow}>
						<ProfileIcon photoURL={sender.photoURL} />
						<Link 
							to={isReview ? `/review/${notification.resourceId}` : `/friend/${sender.uid}`} 
							onClick={isReview ? () => clearNotification(notification.id) : undefined} 
							style={{ margin: '0.5rem' }}
						>
							<Button>View {isReview ? 'Review' : 'Friend'}</Button>
						</Link>
					</div>
					<p>{nicelyFormatDate(notification.createdAt)}</p>
				</>
			)}
		</RmfCard>
	)
}
