import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { RmfCard } from 'src/components/RmfCard'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'
import { cleanUpProfilePhotos } from 'src/firebase/file'
import { useAccount } from 'src/hooks/account'
import { StyleType } from 'src/styles'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase'
import { generateSearchTerms } from 'src/utils/search'

export const ProfileOnboarding = (): JSX.Element => {
	const { account, setAccount } = useAccount()
	if (!account) {
		return <></>
	}
	const [firstName, setFirstName] = useState('')
	const [nickName, setNickName] = useState('')
	const [middleName, setMiddleName] = useState('')
	const [lastName, setLastName] = useState('')
	const [location, setLocation] = useState('')
	const [photoFilename, setPhotoFilename] = useState<string>()
	const [photoURL, setPhotoURL] = useState<string>()
	const [publicAccount, setPublicAccount] = useState(true)
	const onboardProfile = async (): Promise<void> => {
		const accountUpdate = {
			firstName,
			nickName,
			middleName,
			lastName,
			location,
			searchTerms: [''],
			photoFilename,
			public: publicAccount,
		}
		accountUpdate.searchTerms = generateSearchTerms({ ...account, ...accountUpdate })
		await updateDoc(doc(db, 'users', account.uid), accountUpdate)
		await cleanUpProfilePhotos(account, photoFilename || '')
		setAccount({
			...account,
			...accountUpdate,
			photoURL: photoURL || account.photoURL,
		})
	}

	const submitEnabled = (
		firstName &&
		lastName &&
		location &&
		photoFilename
	)

	const accountDetailsFields = [{
		label: 'First Name',
		value: firstName,
		setValue: setFirstName,
		required: true,
	}, {
		label: 'Nickname',
		value: nickName,
		setValue: setNickName,
	}, {
		label: 'Middle Name',
		value: middleName,
		setValue: setMiddleName,
	}, {
		label: 'Last Name',
		value: lastName,
		setValue: setLastName,
		required: true,
	}, {
		label: 'Location',
		value: location,
		setValue: setLocation,
		required: true,
	}]

	return (
		<RmfCard style={styles.profileOnboardingCard}>
			<h3>Finish your account setup</h3>
			<h4>Add your account details to help friends find your account:</h4>
			{accountDetailsFields.map((field) => (
				<TextField
					key={field.label}
					sx={{ 
						m: '0.5rem',
						width: '15rem',
					}}
					onChange={(newElement) => {
						field.setValue(newElement.target.value)
					}} 
					value={field.value} 
					label={field.label} 
					variant='outlined' required={field.required}
				/>
			))}
			<h4>Upload your profile picture (should help identify you):</h4>
			<ProfilePhotoUpload 
				buttonText='Upload'
				profilePhotoFilename={photoFilename} 
				setProfilePhotoFilename={setPhotoFilename}
				profilePhotoURL={photoURL}
				setProfilePhotoURL={setPhotoURL}
			/>
			
			<h4>Select your profile visibility:</h4>
			<p style={{ textAlign: 'center' }}>This controls if non-friends can see reviews and ratings on your profile.</p>
			<div>
				<Button 
					variant={!publicAccount ? 'contained' : 'outlined'} 
					sx={{ m: '0.5rem' }}
					onClick={() => setPublicAccount(false)}
				>Private {!publicAccount && '✔️'}</Button>
				<Button 
					variant={publicAccount ? 'contained' : 'outlined'} 
					sx={{ m: '0.5rem' }}
					onClick={() => setPublicAccount(true)}
				>Public {publicAccount && '✔️'}</Button>
			</div>
			<Button
				disabled={!submitEnabled}
				sx={{ m: '0.5rem' }}
				variant='contained'
				onClick={onboardProfile}
			>Finish</Button>
		</RmfCard>
	)
}

const styles: StyleType = {
	profileOnboardingCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		maxWidth: '30rem',
		width: 'calc(100% - 4rem)',
		margin: '1rem 2rem',
	}
}
