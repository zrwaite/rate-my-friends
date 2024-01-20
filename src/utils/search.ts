import { RMFAccount } from 'src/types/account'

export const generateSearchTerms = (account: RMFAccount): string[] => {
	const { firstName, middleName, lastName, nickName, location } = account
	const terms = [firstName, middleName, lastName, nickName].filter(term => !!term) as string[]
	const locationTerms = location ? location.split(',').map(term => term.trim()) : []
	terms.push(...locationTerms)
	return terms.map(term => term.toLowerCase())
}
