import { signInWithGoogle } from 'src/firebase'
import './GoogleLogin.scss'
import { useNavigate } from 'react-router-dom'

export const GoogleLogin = (props: {
	register?: boolean,
}): JSX.Element => {
	const navigate = useNavigate()
	const signInAndRedirect = async (): Promise<void> => {
		const success = await signInWithGoogle()
		if (!success) return
		navigate('/profile')
	}
	return (
		<button className="google-button" onClick={signInAndRedirect}>
			<img src="/google-icon.svg" alt="Google" />
			<p>{props.register ? 'Register' : 'Login'} with Google</p>
		</button>
	)
}
