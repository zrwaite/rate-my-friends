import { useAccount } from 'src/hooks/account'
import { Link } from 'react-router-dom'
import { ProfileIcon } from './ProfileIcon'

export const MyProfileIcon = (): JSX.Element => {
	const { account } = useAccount()
	const photoURL = account?.photoURL

	return (
		<Link to='/profile' style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '2.5rem',
			width: '2.5rem',
			border: '1px solid black',
			borderRadius: '30%',
			overflow: 'hidden',
			// TODO: hover styles
			// '&:hover': {
			// 	opacity: '0.5'
			// }	
		}} 
		>
			<ProfileIcon photoURL={photoURL} />
		</Link>
	)
}
