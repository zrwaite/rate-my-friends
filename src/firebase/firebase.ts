import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyBsCaNAu2f-Dd41U-e3V2ywcbE2WUDvDM8',
	authDomain: 'rate-my-friends-com.firebaseapp.com',
	databaseURL: 'https://rate-my-friends-com-default-rtdb.firebaseio.com',
	projectId: 'rate-my-friends-com',
	storageBucket: 'rate-my-friends-com.appspot.com',
	messagingSenderId: '950368992782',
	appId: '1:950368992782:web:7888ed4b260dc6a15e465f',
	measurementId: 'G-H0XNDGVGRG',
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)
const auth = getAuth(app)
const analytics = getAnalytics(app)

export { db, analytics, auth, storage }
