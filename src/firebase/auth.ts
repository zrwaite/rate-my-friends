import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, User } from 'firebase/auth'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { db, auth } from './firebase'
import { generateDefaultUserDoc } from './account'

const googleProvider = new GoogleAuthProvider()
const signInWithGoogle = async (): Promise<boolean> => {
	try {
		const res = await signInWithPopup(auth, googleProvider)
		if (!res.user) return false
		const user = res.user
		const userDoc = await getDoc(doc(db, 'users', user.uid))
		if (!userDoc.exists()) {
			await setDoc(doc(db, 'users', user.uid), generateDefaultUserDoc(user, 'google'))
		}
		return true
	} catch (err) {
		console.error(err)
		alert((err as Error).message)
		return false
	}
}

const logInWithEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		return userCredential.user
	} catch (err) {
		console.error(err)
		alert((err as Error).message)
		return null
	}
}

const registerWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password)
		await setDoc(doc(db, 'users', res.user.uid), generateDefaultUserDoc(res.user, 'local'))
		return true
	} catch (err) {
		console.error(err)
		alert((err as Error).message)
		return false
	}
}

const sendPasswordReset = async (email: string): Promise<boolean> => {
	try {
		await sendPasswordResetEmail(auth, email)
		return true
	} catch (err) {
		console.error(err)
		alert((err as Error).message)
		return false
	}
}

const logout = (): void => {
	signOut(auth)
}

const isLoggedIn = (): boolean => {
	return auth.currentUser !== null
}

export { 
	signInWithGoogle, 
	logInWithEmailAndPassword, 
	registerWithEmailAndPassword, 
	sendPasswordReset, 
	logout,
	isLoggedIn,
}
