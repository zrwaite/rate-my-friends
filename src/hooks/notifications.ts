import { useContext } from 'react'
import { NotificationsContext, NotificationsValueType } from 'src/contexts/notifications'

export const useNotifications = (): NotificationsValueType => {
	return useContext(NotificationsContext)
}
