import { useState } from 'react'
import { Navbar } from 'src/components/Navbar'
import { useNavigate } from 'react-router-dom'
import { logInWithEmailAndPassword } from 'src/firebase'
import { redirectFromParams } from 'src/utils/redirect'
import { LoginRegisterCard } from 'src/components/LoginRegisterCard/LoginRegisterCard'

export const LoginPage = (): JSX.Element => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState<string>()
	const navigate = useNavigate()
	const handleSubmit = async (): Promise<void> => {
		const res = await logInWithEmailAndPassword(email, password)
		if (!res) {
			setPasswordError('Email or password is incorrect')
			return
		}
		redirectFromParams(navigate, '/profile')
	}

	return (
		<>
			<Navbar title='Log In' disableSearch disableLogin/>
			<div className={'center-page'}>
				<LoginRegisterCard
					type='login'
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					passwordError={passwordError}
					setPasswordError={setPasswordError}
					handleSubmit={handleSubmit}
				/>
			</div>
		</>
	)
}
