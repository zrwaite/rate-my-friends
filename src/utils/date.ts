import dayjs from 'dayjs'

export const nicelyFormatDate = (timestamp: number): string => {
	let formattedDate = 'Just Now'
	const date = dayjs(timestamp)
	const diff = dayjs().diff(date, 'day')
	if (diff < 1) {
		if (dayjs().diff(date, 'hour') < 1) {
			if (dayjs().diff(date, 'minute') < 1) formattedDate = 'Just now'
			else {
				const minutes = dayjs().diff(date, 'minute')
				formattedDate = `${minutes} minute${minutes === 1 ? '' : 's'} ago`
			}
		} else {
			const hours = dayjs().diff(date, 'hour')
			formattedDate = `${hours} hour${hours === 1 ? '' : 's'} ago`
		}
	} else if (diff < 7) {
		if (diff === 1) formattedDate = 'Yesterday'
		else formattedDate = date.format('dddd')
	} else if (diff < 365) {
		formattedDate = date.format('MMMM D')
	} else {
		formattedDate = date.format('MMMM D, YYYY')
	}
	return formattedDate
}
