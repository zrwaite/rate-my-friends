import { Button } from '@mui/material'
import { RmfCard } from './RmfCard'
import { useNavigate } from 'react-router-dom'

export const AddFriendsCard = (): JSX.Element => {
	const navigate = useNavigate()
	return (
		<RmfCard style={{ margin: '1rem', width: '16rem' }}>
			<p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{'Looks like you don\'t have any friends - let\'s find you some!'}</p>
			<Button variant='contained' onClick={() => navigate('/add-friends?q=Rate My Friends')}>Find Friends</Button>
		</RmfCard>
	)
}
