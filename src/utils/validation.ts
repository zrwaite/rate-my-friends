import { z } from 'zod'

export const validateEmail = (email: string): string | undefined => {
	const emailSchema = z.string().email()
	try {
		emailSchema.parse(email)
	} catch (err) {
		return 'Invalid email address'
	}
}

export const validatePassword = (password: string): string | undefined => {
	const passwordLength = password.length >= 8
	const passwordUppercase = /[A-Z]/.test(password)
	const passwordLowercase = /[a-z]/.test(password)
	const passwordNumber = /[0-9]/.test(password)
	const passwordSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
	const invalidPassword = !(
		passwordLength &&
		passwordUppercase &&
		passwordLowercase &&
		passwordNumber &&
		passwordSpecial
	)
	if (invalidPassword) {
		let error = 'Password must contain '
		if (!passwordLength) error += 'at least 8 characters, '
		if (!passwordUppercase) error += 'at least one uppercase letter, '
		if (!passwordLowercase) error += 'at least one lowercase letter, '
		if (!passwordNumber) error += 'at least one number, '
		if (!passwordSpecial) error += 'at least one special character, '
		return error.slice(0, -2)
	}
}
