import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { Link } from 'react-router-dom'
import { useNotifications } from 'src/hooks/notifications'
import './NotificationIcon.scss'

export const NotificationIcon = (): JSX.Element => {
	const { notifications } = useNotifications()

	return (
		<Link to='/notifications' className='rmf-notification-link'>
			{notifications.filter((n) => !n.cleared).length > 0 ? (
				<NotificationsActiveIcon className='rmf-notification-icon' />
			) : (
				<NotificationsIcon className='rmf-notification-icon' />
			)}
		</Link>
	)
}
