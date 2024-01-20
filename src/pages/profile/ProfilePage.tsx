import { Navbar } from 'src/components/Navbar'
import { db, logout } from 'src/firebase'
import { ProfileOnboarding } from './components/ProfileOnboarding'
import { useAccount } from 'src/hooks/account'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ProfileIcon } from 'src/components/ProfileIcon'
import { flexRow, flexColumn } from 'src/styles'
import { getName } from 'src/utils/friend'
import { RatingStars } from 'src/components/RatingStars/RatingStars'
import { AccountFieldEdit } from './components/AccountFieldEdit'
import { ProfilePhotoUpload } from './components/ProfilePhotoUpload'
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { cleanUpProfilePhotos } from 'src/firebase/file'
import { RmfCard } from 'src/components/RmfCard'
import { AddFriendsCard } from 'src/components/AddFriendsCard'

export const ProfilePage = (): JSX.Element => {
	const { account, setAccount } = useAccount()
	if (!account) return <></>
	const [newPhotoFilename, setNewPhotoFilename] = useState<string>()
	const [newPhotoURL, setNewPhotoURL] = useState<string>()
	const navigate = useNavigate()
	const onboarded = account && (
		account.firstName &&
		account.lastName &&
		account.location &&
		account.photoFilename
	)

	const needsFriends = account && (
		!account.friends ||
		account.friends.length === 0
	)

	const changeProfilePhoto = async (photoURL: string): Promise<void> => {
		const accountUpdate = {
			photoFilename: newPhotoFilename,
		}
		await updateDoc(doc(db, 'users', account.uid), accountUpdate)
		await cleanUpProfilePhotos(account, newPhotoFilename || '')
		setAccount({
			...account,
			...accountUpdate,
			photoURL: photoURL || account.photoURL,
		})
		setNewPhotoURL(photoURL)
	}

	const accountFields = [{
		label: 'First Name',
		key: 'firstName',
		value: account.firstName,
		required: true,
	}, {
		label: 'Nickname',
		key: 'nickName',
		value: account.nickName,
	}, {
		label: 'Middle Name',
		key: 'middleName',
		value: account.middleName,
	}, {
		label: 'Last Name',
		key: 'lastName',
		value: account.lastName,
		required: true,
	}, {
		label: 'Location',
		key: 'location',
		value: account.location,
		required: true,
	}]

	return (
		<>
			<Navbar title='Profile' disableSearch/>
			<div className={'center-page'}>
				{onboarded ? <>
					<h2 style={{ marginBottom: '1rem' }}>{getName(account)}</h2>
					<div style={flexRow}>
						<ProfileIcon photoURL={account.photoURL} style={{
							width: '5rem',
							minWidth: '5rem',
							height: '5rem',
							minHeight: '5rem',
						}} />
						<RatingStars rating={account.rating} count={account.ratingCount} />
					</div>
					{needsFriends && <AddFriendsCard />}
					<ProfilePhotoUpload 
						buttonText='Change Your Profile Photo'
						hidePreview
						profilePhotoFilename={newPhotoFilename} 
						setProfilePhotoFilename={setNewPhotoFilename}
						profilePhotoURL={newPhotoURL}
						setProfilePhotoURL={changeProfilePhoto}
					/>
					<div style={{ ...flexColumn, margin: '1rem 0' }}>
						{accountFields.map((field) => (
							<AccountFieldEdit
								key={field.key}
								valueKey={field.key}
								label={field.label}
								value={field.value}
								required={field.required}
							/>
						))}
					</div>
					
					{/* //TODO: Add my reviews page <h3>Reviews:</h3>
					<div style={flexColumn}>
						{reviews?.map((review, i) => (
							<ReviewCard key={i} review={review}/>
						))}
					</div> */}
				</> : <ProfileOnboarding />}
				<Button variant='contained' onClick={() => {
					logout()
					setAccount(null)
					navigate('/')
				}} style={{
					marginTop: '2rem',	
				}}>Log out</Button>
			</div>
		</>
	)
}
