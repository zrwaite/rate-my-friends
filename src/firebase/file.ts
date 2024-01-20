import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { RMFAccount } from 'src/types/account'
import { storage } from './firebase'

export const uploadFile = async (file: File, account: RMFAccount): Promise<string> => {
	const fileType = file.type.split('/')[1]
	const filename = `pp-${Date.now()}.${fileType}`
	const metadata = {
		contentType: file.type,
	}
	const storageRef = ref(storage, `images/${account.uid}/${filename}`)
	await uploadBytes(storageRef, file, metadata)
	return filename
}

export const getFileUrl = async (filename: string, uid: string): Promise<string> => {
	const storageRef = ref(storage, `images/${uid}/${filename}`)
	const url = await getDownloadURL(storageRef)
	return url
}

export const cleanUpProfilePhotos = async (account: RMFAccount, currentProfilePhotoFileName: string): Promise<void> => {
	const folderPath = `images/${account.uid}/`
	const folderRef = ref(storage, folderPath)
	const { items } = await listAll(folderRef)
	const filesToDelete = items.filter(itemRef => (
		itemRef.name.startsWith('pp-') &&
		itemRef.name !== currentProfilePhotoFileName
	))

	for (const fileRef of filesToDelete) {
		await deleteObject(fileRef)
		console.log(`Deleted file: ${fileRef.name}`)
	}
}
