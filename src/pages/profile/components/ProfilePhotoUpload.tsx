import { useEffect, useRef, useState } from 'react'
import { getFileUrl, uploadFile } from 'src/firebase/file'
import { useAccount } from 'src/hooks/account'
import { Button } from '@mui/material'

export const ProfilePhotoUpload = (props: {
	buttonText: string
	hidePreview?: boolean
	profilePhotoFilename?: string
	setProfilePhotoFilename: (newFilename: string) => void	
	profilePhotoURL?: string
	setProfilePhotoURL: (newURL: string) => void
}): JSX.Element => {
	const { account } = useAccount()
	const inputRef = useRef<HTMLInputElement>(null)
	if (!account) {
		return <></>
	}
	const [loading, setLoading] = useState(false)
	const handleChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		if (loading) {
			return
		}
		setLoading(true)
		const files = event.target.files
		if (!files) {
			return
		}
		const file = files[0]
		const filename = await uploadFile(file, account)
		props.setProfilePhotoFilename(filename)
		setLoading(false)
	}

	useEffect(() => {
		const getPhotoURL = async (): Promise<void> => {
			if (!props.profilePhotoFilename) return
			setLoading(true)
			const url = await getFileUrl(props.profilePhotoFilename, account.uid)
			props.setProfilePhotoURL(url)
			setLoading(false)
		}
		getPhotoURL()
	}, [props.profilePhotoFilename, account.uid])

	return (<>
		<input ref={inputRef} type="file" onChange={handleChange} style={{ display: 'none' }} />
		<Button	
			disabled={loading}
			sx={{ m: '0.5rem' }}
			variant='outlined'
			onClick={() => inputRef.current?.click()}
		>{props.buttonText}</Button>
		{props.profilePhotoURL && !loading && !props.hidePreview && <img 
			src={props.profilePhotoURL} 
			style={{ 
				width: '8rem',
				height: '8rem',
				borderRadius: '30%',
			}}
			alt='profile'
		/>}
	</>)
}
