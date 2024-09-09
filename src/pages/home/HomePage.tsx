import { Button } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivityFeed } from 'src/components/ActivityFeed/ActivityFeed'
import { AddFriendsCard } from 'src/components/AddFriendsCard'
import { FriendList } from 'src/components/FriendsList'
import { Navbar } from 'src/components/Navbar'
import { useAccount } from 'src/hooks/account'
import { flexColumn, flexRow } from 'src/styles'
import { Friend } from 'src/types/friend'

export const HomePage = (): JSX.Element => {
	const { account, setAccount } = useAccount()
	const navigate = useNavigate()
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
				<h1 style={{ marginBottom: '0.2rem' }}>Rate My Friends!</h1>
				<h3 style={{ color: '#78d5d7', marginBottom: '1rem', fontStyle: 'italic' }}>Yelp For People</h3>
				{account === null && (
					<div style={flexColumn}>
						<p style={{ textAlign: 'center', margin: '0 0.5rem' }}>Find your friends on Rate My Friends to rate and review them!</p>
						<div style={{ backgroundColor: 'black', width: 'calc(100% - 2rem)', maxWidth: '30rem', border: '0.2rem solid #78d5d7', borderRadius: '1rem', margin: '1rem', overflow: 'hidden' }}>
							<img src='/preview.png' style={{ width: '100%', opacity: '0.8' }} />
						</div>
						<p style={{ textAlign: 'center', margin: '0 0.5rem' }}>From first impressions, to events, to general reviews, see what your friends think of you and give your own perspective right back!</p>
						<p style={{ textAlign: 'center', margin: '1rem 0.5rem 0' }}>Sign up now:</p>
						<Button 
							variant='contained'
							style={{ margin: '1rem', width: '10rem' }}
							onClick={() => navigate('/register')}
						>Get Started</Button>
						<p style={{ textAlign: 'center', margin: '1rem 0.5rem 0' }}>Or look for your friends first:</p>
						<Button 
							variant='contained'
							style={{ margin: '1rem', width: '10rem' }}
							onClick={() => navigate('/add-friends')}
						>Find Friends</Button>
					</div>
				)}
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
