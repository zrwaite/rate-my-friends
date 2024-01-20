import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { acceptFriendRequest, cancelFriendRequest, declineFriendRequest, sendFriendRequest } from 'src/firebase/friends'
import { useAccount } from 'src/hooks/account'
import { Friend } from 'src/types/friend'

export const FriendshipButtons = ({ friend, setFriend }: {
	friend: Friend,
	setFriend: (friend: Friend) => void
}): JSX.Element => {
	const { account, setAccount } = useAccount()
	const navigate = useNavigate()
	const sentFriendRequestPending = friend?.friendship?.status === 'pending' && friend.friendship.senderId === account?.uid
	const receivedFriendRequestPending = friend?.friendship?.status === 'pending' && friend.friendship.senderId !== account?.uid
	const areFriends = friend?.friendship?.status === 'accepted'

	const updateFriendshipStatus = (status: 'pending' | 'accepted' | 'declined', force = false): void => {
		if (!account || (!friend?.friendship && !force)) return
		const newFriendship = force || !friend?.friendship ? {
			senderId: account.uid,
			receiverId: friend.uid,
			status,
			public: true,
			createdAt: Date.now()
		} : {
			...friend.friendship,
			status
		}
		setAccount({
			...account,
			friendships: [
				...account.friendships.filter((friendship) => friendship.receiverId !== friend.uid && friendship.senderId !== friend.uid),
				newFriendship
			],
			friends: force ? [...account.friends, friend] : account.friends
		})
		setFriend({
			...friend,
			friendship: newFriendship
		})
	}

	const trySendFriendRequest = async (): Promise<void> => {
		if (!account || !friend) return
		if (!friend?.friendship) {
			await sendFriendRequest(account.uid, friend)
			if (friend.rmf) {
				console.log('updating status...')
				updateFriendshipStatus('accepted', true)
			}
		}
	}

	const tryCancelFriendRequest = async (): Promise<void> => {
		if (!account || !friend) return
		if (sentFriendRequestPending) {
			await cancelFriendRequest(account.uid, friend.uid)
		}
	}

	const tryAcceptFriendRequest = async (): Promise<void> => {
		if (!account || !friend?.friendship) return
		if (receivedFriendRequestPending) {
			await acceptFriendRequest(account.uid, friend.uid)
			updateFriendshipStatus('accepted')
		}
	}

	const tryDeclineFriendRequest = async (): Promise<void> => {
		if (!account || !friend?.friendship) return
		if (receivedFriendRequestPending) {
			await declineFriendRequest(account.uid, friend.uid)
			updateFriendshipStatus('declined')
		}
	}

	return (<>
		{!friend?.friendship && <Button onClick={trySendFriendRequest} variant='contained'>
			Send Friend Request
		</Button>}
		{sentFriendRequestPending && <Button onClick={tryCancelFriendRequest} variant='contained'>
			Cancel Friend Request
		</Button>}
		{receivedFriendRequestPending && <>
			<Button onClick={tryAcceptFriendRequest} variant='contained'>
				Accept Friend Request
			</Button>
			<Button onClick={tryDeclineFriendRequest} variant='contained'>
				Decline Friend Request
			</Button>
		</>}
		{areFriends && <Button onClick={() => navigate(`/friend/${friend.uid}/review`)} variant='contained'>
			Review Friend
		</Button>}
	</>)
}
