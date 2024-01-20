/*
label: 'Last Name',
	key: 'lastName',
	value: lastName,
	setValue: setLastName,
	required: true,
*/

import { CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { flexRow } from 'src/styles'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import { doc, updateDoc } from 'firebase/firestore'
import { useAccount } from 'src/hooks/account'
import { db } from 'src/firebase'
import { generateSearchTerms } from 'src/utils/search'

export const AccountFieldEdit = (props: {
	label: string,
	valueKey: string,
	value?: string,
	required?: boolean
}): JSX.Element => {
	const { account, setAccount } = useAccount()
	const [editing, setEditing] = useState(false)
	const [loading, setLoading] = useState(false)
	const [editValue, setEditValue] = useState(props.value)
	if (!account) return <></>

	const saveValue = async (): Promise<void> => {
		const accountUpdate = {
			[props.valueKey]: editValue,
			searchTerms: [''],
		}
		accountUpdate.searchTerms = generateSearchTerms({ ...account, ...accountUpdate })
		setLoading(true)
		await updateDoc(doc(db, 'users', account.uid), accountUpdate)
		setAccount({
			...account,
			...accountUpdate,
		})
		setLoading(false)
		setEditing(false)
	}
	
	return (
		<div style={flexRow}>
			<TextField
				key={props.label}
				sx={{ 
					m: '0.5rem',
					width: '15rem',
				}}
				onChange={(newElement) => {
					setEditValue(newElement.target.value)
				}} 
				value={editing ? editValue : props.value} 
				label={props.label} 
				disabled={!editing}
				variant='outlined' required={props.required}
			/>
			<div style={{ width: '2rem' }}>
				{loading ? <CircularProgress /> : editing ? <CheckIcon 
					onClick={saveValue}
					style={{ cursor: 'pointer' }}
				/> : <EditIcon
					onClick={() => setEditing(!editing)}
					style={{ cursor: 'pointer' }}
				/>}
			</div>
		</div>
	)
}
