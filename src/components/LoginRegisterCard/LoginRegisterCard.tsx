import { Button, TextField } from '@mui/material'
import { RmfCard } from '../RmfCard'
import { GoogleLogin } from '../GoogleLogin'
import './LoginRegisterCard.scss'

export const LoginRegisterCard = ({
	email,
	setEmail,
	password,
	setPassword,
	emailError,
	setEmailError,
	passwordError,
	setPasswordError,
	handleSubmit,
	type,
}: {
	email: string
	setEmail: (email: string) => void
	password: string
	setPassword: (password: string) => void
	emailError?: string
	setEmailError?: (emailError: string | undefined) => void
	passwordError?: string
	setPasswordError?: (passwordError: string | undefined) => void
	handleSubmit: () => Promise<void>,
	type: 'login' | 'register'
}): JSX.Element => {
	const title = type === 'login' ? 'Log in to your RateMyFriends Account' : 'Sign up for your RateMyFriends Account'
	return (
		<RmfCard className={'login-register-card'}>
			<h3>{title}</h3>
			<TextField
				sx={{ 
					m: '0.5rem',
					width: '15rem'
				}}
				className={'email-input'}
				onChange={(newUsername) => {
					setEmail(newUsername.target.value)
					if (setEmailError) setEmailError(undefined)
				}} 
				value={email} 
				error={!!emailError} helperText={emailError} 
				id='email-input' label='Email' 
				variant='outlined' required
			/>
			<TextField 
				sx={{ 
					m: '0.5rem',
					width: '15rem'
				}}
				className={'password-input'}
				onChange={(newPassword) => {
					setPassword(newPassword.target.value)
					if (setPasswordError) setPasswordError(undefined)
				}} 
				value={password} 
				error={!!passwordError} helperText={passwordError}
				id='password-input' label='Password' 
				type='password' 
				variant='outlined' required
			/>
			<Button
				sx={{ m: '0.5rem' }}
				variant='outlined'
				onClick={handleSubmit}
			>Submit</Button>
			<p className='or-divider'>or</p>
			<GoogleLogin register={type === 'register'}/>
		</RmfCard>
	)
}
