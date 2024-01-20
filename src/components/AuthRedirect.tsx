import { Navigate, useParams } from 'react-router-dom'
import { hasFriend } from 'src/firebase'
import { useAccount } from 'src/hooks/account'

export const AuthRedirect = (props: {
	element: JSX.Element,
	type: 'basic' | 'reverse' | 'friend'
}): JSX.Element => {
	const { element, type } = props
	const { account } = useAccount()
	let authorized = false
	const loaded = account !== undefined
	let redirect = '/'
	if (type === 'basic') {
		authorized = account !== null
		redirect = '/login'
	} else if (type === 'reverse') {
		authorized = !account
		redirect = '/profile'
	} else if (type === 'friend') {
		const { id } = useParams<{ id: string }>()
		authorized = hasFriend(account, id || '')
		redirect = `/friend/${id}?e=not-friends`
	}
	return !loaded ? (<></>) : authorized ? element : (
		<Navigate to={redirect || '/login?r=' + window.location.pathname} />
	)
}
