import React from 'react'
import { RMFNotification } from 'src/types/notifications'

export interface NotificationsValueType {
	notifications: RMFNotification[],
	setNotifications: (newNotifications: RMFNotification[]) => void,
}

export const NotificationsContext = React.createContext<NotificationsValueType>({
	notifications: [],
	// eslint-disable-next-line 
	setNotifications: () => {},
})
