import { Link } from 'react-router-dom'
import './Logo.scss'

export const Logo = (props: {
	className?: string	
}): JSX.Element => {
	return (
		<Link to='/' className={`rmf-logo ${props.className}`}>
			<img className={'fill-image'} src='/logo.svg' alt='logo' />
		</Link>
	)
}
