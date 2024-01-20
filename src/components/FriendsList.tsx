import { Friend } from 'src/types/friend'
import { FriendCard } from './FriendCard'
import { CircularProgress } from '@mui/material'

export const FriendList = ({ friends, setFriends, limit }: {
	limit?: number,
	friends: Friend[] | undefined,
	setFriends: (friends: Friend[]) => void
}): JSX.Element => {
	const friendsList = limit ? friends?.slice(0, limit) : friends
	return (<>
		{friends === undefined && <CircularProgress />}
		{friends && friends.length === 0 && <p>No results</p>}
		{friends && friendsList?.map((friend) => {
			const setFriend = (newFriend: Friend): void => {
				const newFriends = friends.map((friend) => {
					if (friend.uid === newFriend.uid) return newFriend
					return friend
				})
				setFriends(newFriends)
			}
			return <FriendCard key={friend.uid} friend={friend} setFriend={setFriend}/>
		})}
	</>)
}
