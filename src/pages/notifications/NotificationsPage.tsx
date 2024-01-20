import { Navbar } from 'src/components/Navbar'
import { useNotifications } from 'src/hooks/notifications'
import { NotificationCard } from './components/NotificationCard'
import { flexColumn } from 'src/styles'

export const NotificationsPage = (): JSX.Element => {
	const { notifications } = useNotifications()
	const unreadNotifications = notifications.filter((notification) => !notification.cleared)
	const readNotifications = notifications.filter((notification) => notification.cleared)
	return (
		<div>
			<Navbar title='Notifications' disableSearch />
			<div style={flexColumn}>
				<h3>New Notifications:</h3>
				{unreadNotifications.map((notification) => (
					<NotificationCard key={notification.id} notification={notification} />
				))}
				{unreadNotifications.length === 0 && (
					<p style={{ margin: '1rem' }}>You are all caught up!</p>
				)}
				<h3>Read Notifications:</h3>
				{readNotifications.map((notification) => (
					<NotificationCard key={notification.id} notification={notification} />
				))}
				{readNotifications.length === 0 && unreadNotifications.length === 0 && (
					<p style={{ margin: '1rem' }}>No old notifications</p>
				)}
			</div>
		</div>
	)
}
