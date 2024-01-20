import { Logo } from '../Logo'
import { SearchBar } from '../SearchBar'
import { Link } from 'react-router-dom'
import { useAccount } from 'src/hooks/account'
import './Navbar.scss'
import { NotificationIcon } from '../NotificationIcon/NotificationIcon'
import { MyProfileIcon } from '../MyProfileIcon'
import { StyleType } from 'src/styles'
import { useDisplay } from 'src/hooks/display'

export const Navbar = (props: {
	disableSearch?: boolean,
	disableLogin?: boolean,
	disableSignup?: boolean,
	title?: string
}): JSX.Element => {
	const { account } = useAccount()
	const loaded = account !== undefined
	const isLoggedIn = !!account
	const { width } = useDisplay()
	const mobile = width < 26

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
					{!props.disableLogin && <Link to="/login" className={'rmf-button'} style={{
						margin: '0 0.5rem',
						width: mobile ? '4rem' : '5rem',
						height: '2rem',
						padding: '0.1rem 0',
					}}>
						Log In
					</Link>}
					{!props.disableSignup && (!mobile || props.disableLogin) && <Link to='/register' className={'rmf-button'} style={{
						backgroundColor: 'var(--color-primary)',
						width: '5.5rem',
						height: '2rem',
						padding: '0.1rem 0',
					}}>
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
