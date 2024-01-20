import { Button } from '@mui/material'
import { useState } from 'react'
import { ActivityFeed } from 'src/components/ActivityFeed/ActivityFeed'
import { AddFriendsCard } from 'src/components/AddFriendsCard'
import { FriendList } from 'src/components/FriendsList'
import { Navbar } from 'src/components/Navbar'
import { useAccount } from 'src/hooks/account'
import { flexRow } from 'src/styles'
import { Friend } from 'src/types/friend'

export const HomePage = (): JSX.Element => {
	const { account, setAccount } = useAccount()
	const [tab, setTab] = useState<'feed' | 'friends'>('feed')
	const setFriends = (newFriends: Friend[]): void => {
		if (!account) return
		setAccount({
			...account,
			friends: newFriends,
		})
	}

	return (
		<>
			<Navbar />
			<div className='center-page'>
				<h1 style={{ marginBottom: '1rem' }}>Rate My Friends!</h1>
				
				{account && <>
					<div style={flexRow}>
						<Button 
							onClick={() => setTab('feed')}
							variant={tab === 'feed' ? 'contained' : 'outlined'}
							style={{ marginRight: '1rem', width: '8rem' }}
						>Feed</Button>
						<Button 
							onClick={() => setTab('friends')}
							variant={tab === 'friends' ? 'contained' : 'outlined'}
							style={{ width: '8rem' }}
						>Friends</Button>
					</div>
					<ActivityFeed hidden={tab !== 'feed'} />
					<div 
						className='center-page' 
						style={{ margin: '1rem', width: '100%', maxWidth: '25rem', display: tab === 'friends' ? 'flex' : 'none' }}
					>
						{(!account.friends || account.friends.length > 0) ? (
							<FriendList friends={account.friends} setFriends={setFriends} />
						) : (
							<AddFriendsCard />
						)}
					</div>
				</>}
			</div>
		</>
	)
}
