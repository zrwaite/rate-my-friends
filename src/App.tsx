import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import * as Pages from 'src/pages'
import { AccountContext } from 'src/contexts/account'
import { useEffect, useRef, useState } from 'react'
import { AuthRedirect } from 'src/components/AuthRedirect'
import { onAuthStateChanged } from 'firebase/auth'
import { getAccountFromUserAuth, auth } from 'src/firebase'
import { RMFAccount } from 'src/types/account'
import { subscribeToNotifications } from './firebase/notifications'
import { RMFNotification } from './types/notifications'
import { NotificationsContext } from './contexts/notifications'
import { RMFCacheValue, defaultRMFCacheValue } from './types/cache'
import { CacheContext } from './contexts/cache'
import { DisplayContext } from './contexts/display'

const App = (): JSX.Element => {
	const [account, setAccount] = useState<RMFAccount|null|undefined>()
	const [notifications, setNotifications] = useState<RMFNotification[]>([])
	const [width, setWidth] = useState(window.innerWidth / 16)
	const cache = useRef<RMFCacheValue>(defaultRMFCacheValue)
	const accountValue = { account, setAccount }
	const notificationsValue = { notifications, setNotifications }
	const cacheValue = { cache }
	const displayValue = { width, setWidth }
	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			setAccount(await getAccountFromUserAuth(user, cache))
		})
	}, [])
	useEffect(() => {
		if (!account?.uid) return
		const unsubscribe = subscribeToNotifications(account.uid, setNotifications, cache)
		return () => unsubscribe()
	}, [account?.uid])
	useEffect(() => {
		const handleResize = (): void => {
			setWidth(window.innerWidth / 16)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<AccountContext.Provider value={accountValue}>
			<NotificationsContext.Provider value={notificationsValue}>
				<CacheContext.Provider value={cacheValue}>
					<DisplayContext.Provider value={displayValue}>
						<Router>
							<Routes>
								<Route path="/" element={<Pages.HomePage />}/>
								<Route path="/login" element={
									<AuthRedirect type='reverse' element={<Pages.LoginPage />}/>
								}/>
								<Route path="/register" element={
									<AuthRedirect type='reverse' element={<Pages.RegisterPage />}/>
								}/>
								<Route path={'/profile'} element={
									<AuthRedirect type='basic' element={<Pages.ProfilePage />}/>
								} />
								<Route path={'/notifications'} element={
									<AuthRedirect type='basic' element={<Pages.NotificationsPage />}/>
								} />
								<Route path="/add-friends" element={<Pages.AddFriendsPage />}/>
								<Route path="/friend">
									<Route path=":id" element={<Pages.FriendPage />}/>
									<Route path=":id/review" element={
										<AuthRedirect type='friend' element={<Pages.WriteReviewPage />}/>}
									/>
								</Route>
								<Route path="/review">
									<Route path=":id" element={<Pages.ReviewPage />}/>
								</Route>
							</Routes>
						</Router>
					</DisplayContext.Provider>
				</CacheContext.Provider>
			</NotificationsContext.Provider>
		</AccountContext.Provider>
	)
}

export default App
