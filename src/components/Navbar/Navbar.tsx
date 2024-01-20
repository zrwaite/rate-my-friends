import { Logo } from '../Logo'
import { SearchBar } from '../SearchBar'
import { Link } from 'react-router-dom'
import { useAccount } from 'src/hooks/account'
import './Navbar.scss'
import { NotificationIcon } from '../NotificationIcon/NotificationIcon'
import { MyProfileIcon } from '../MyProfileIcon'
import { StyleType } from 'src/styles'

export const Navbar = (props: {
	disableSearch?: boolean,
	disableLogin?: boolean,
	disableSignup?: boolean,
	title?: string
}): JSX.Element => {
	const { account } = useAccount()
	const loaded = account !== undefined
	const isLoggedIn = !!account
	return (
		<nav>
			<div style={styles.navbarSide}>
				<Logo className='mr-1'/>
				{!props.disableSearch && <SearchBar />}
			</div>
			<div className='navbar-center'>
				{props.title && <h1>{props.title}</h1>}
			</div>
			<div style={{ ...styles.navbarSide, justifyContent: 'flex-end' }}>
				{loaded && isLoggedIn && (<>
					<NotificationIcon />
					<MyProfileIcon />
				</>)}
				{loaded && !isLoggedIn && (<>
					{!props.disableLogin && <Link to="/login" className='rmf-button login-button'>
						Log In
					</Link>}
					{!props.disableSignup && <Link to='/register' className='rmf-button signup-button'>
						Sign Up
					</Link>}
				</>)}
			</div>
		</nav>
	)
}

const styles: StyleType = {
	navbarSide: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	}
}
