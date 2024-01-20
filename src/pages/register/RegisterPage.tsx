import { useState } from 'react'
import { Navbar } from 'src/components/Navbar'
import { validateEmail, validatePassword } from 'src/utils/validation'
import { registerWithEmailAndPassword } from 'src/firebase'
import { useNavigate } from 'react-router-dom'
import { redirectFromParams } from 'src/utils/redirect'
import { LoginRegisterCard } from 'src/components/LoginRegisterCard/LoginRegisterCard'

export const RegisterPage = (): JSX.Element => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState<string>()
	const [passwordError, setPasswordError] = useState<string>()
	const navigate = useNavigate()
	const handleSubmit = async (): Promise<void> => {
		const newEmailError = validateEmail(email)
		const newPasswordError = validatePassword(password)
		setEmailError(newEmailError)
		setPasswordError(newPasswordError)
		if (newEmailError || newPasswordError) {
			return
		}
		const res = await registerWithEmailAndPassword(email, password)
		if (!res) {
			setEmailError('Email already in use')
			return
		}
		redirectFromParams(navigate, '/profile')
	}
	return (
		<div>
			<Navbar title='Sign Up' disableSearch disableSignup/>
			<div className={'center-page'}>
				<LoginRegisterCard 
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					emailError={emailError}
					setEmailError={setEmailError}
					passwordError={passwordError}
					setPasswordError={setPasswordError}
					handleSubmit={handleSubmit}
					type='register'
				/>
			</div>
		</div>
	)
}
