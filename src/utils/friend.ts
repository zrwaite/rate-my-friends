import { Friend } from 'src/types/friend'

export const getShortName = (friend: Friend): string => {
	const { firstName, nickName, lastName } = friend
	if (nickName) return nickName
	return `${firstName} ${lastName}`
}

export const getName = (friend: Friend): string => {
	const { firstName, nickName, middleName, lastName } = friend
	if (nickName) return `${firstName} ${middleName || ''} ${lastName} (${nickName})`
	return `${firstName} ${middleName || ''} ${lastName}`
}
