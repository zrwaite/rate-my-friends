import { Button, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { getActivityFeed } from 'src/firebase/activity'
import { useAccount } from 'src/hooks/account'
import { Activity } from 'src/types/activity'
import { ActivityCard } from './components/ActivityCard'
import { useCache } from 'src/hooks/cache'
import { RmfCard } from '../RmfCard'
import { useNavigate } from 'react-router-dom'
import { AddFriendsCard } from '../AddFriendsCard'

export const ActivityFeed = ({ hidden }: { hidden: boolean }): JSX.Element => {
	const { account } = useAccount()
	const { cache } = useCache()
	const [activity, setActivity] = useState<Activity[]>()
	const [page, setPage] = useState<number>(0)
	const navigate = useNavigate()
	useEffect(() => {
		if (!account?.uid) return
		const loadActivity = async (): Promise<void> => {
			const activity = await getActivityFeed(account, page, cache)
			setActivity(activity)
		}
		loadActivity()
	}, [account?.uid])
	return (
		<div 
			className='center-page' 
			style={{ margin: '1rem', width: '100%', maxWidth: '25rem', display: hidden ? 'none' : 'flex' }}
		>
			{activity?.map((activity, i) => (
				<ActivityCard key={i} activity={activity} />
			))}
			{activity === undefined && <CircularProgress />}
			{activity && activity.length === 0 && account?.friends.length === 0 && (
				<AddFriendsCard />
			)}
			{activity && activity.length === 0 && !!account?.friends.length && (
				<RmfCard style={{ width: '100%', margin: '1rem' }}>
					<p style={{ textAlign: 'center' }}>No activity yet - you should write a review!</p>
				</RmfCard>
			)}
		</div>
	)
}
