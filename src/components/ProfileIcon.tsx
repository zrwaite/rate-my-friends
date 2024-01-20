import AccountIcon from '@mui/icons-material/AccountBox'

export const ProfileIcon = ({ photoURL, style }: {
	photoURL?: string | null,
	style?: React.CSSProperties
}): JSX.Element => {
	const imgStyle = {
		height: '2.5rem',
		width: '2.5rem',
		borderRadius: '30%',
		margin: 0,
		...style
	}
	return photoURL ? (
		<img style={imgStyle} src={photoURL} alt='profile' />
	) : (
		<AccountIcon style={imgStyle} />
	)
}
