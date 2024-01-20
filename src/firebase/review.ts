import { DocumentData, DocumentSnapshot, QueryCompositeFilterConstraint, QueryFieldFilterConstraint, addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { Review } from 'src/types/review'
import { db } from './firebase'
import { getFriend } from './friends'
import { Friend } from 'src/types/friend'
import { RMFAccount } from 'src/types/account'
import { RMFCache } from 'src/types/cache'
import { sendReviewAddedNotification } from './notifications'

const getReviewFromReviewDoc = async (reviewDoc: DocumentSnapshot<DocumentData, DocumentData>, account: RMFAccount | null, cache: RMFCache): Promise<Review | null> => {
	const review = reviewDoc.data() as Review
	const reviewer = await getFriend(review.reviewerId, account, cache)
	const reviewee = await getFriend(review.revieweeId, account, cache)
	if (!reviewer || !reviewee) return null
	return {
		...review,
		id: reviewDoc.id,
		reviewer,
		reviewee,
	}
}

export const getReviewsFromConstraint = async (qc: QueryFieldFilterConstraint | QueryCompositeFilterConstraint, account: RMFAccount | null, cache: RMFCache): Promise<Review[]> => {
	// TODO: Add pagination
	const reviewsRef = collection(db, 'reviews')
	const q = query(reviewsRef, qc as QueryFieldFilterConstraint, orderBy('createdAt', 'desc'))
	const querySnapshot = await getDocs(q)
	const reviews: Review[] = []
	for (const doc of querySnapshot.docs) {
		const review = await getReviewFromReviewDoc(doc, account, cache)
		if (review) reviews.push(review)
	}
	reviews.forEach((review) => {
		const cachedReview = cache.current.reviews.find((r) => r.id === review.id)
		if (!cachedReview) cache.current.reviews.push(review)
	})
	return reviews
}

export const getRevieweeReviews = async (revieweeId: string, account: RMFAccount | null, cache: RMFCache): Promise<Review[]> => {
	if (cache.current.fullyCachedRevieweeIds.includes(revieweeId)) {
		return cache.current.reviews.filter((review) => review.revieweeId === revieweeId)
	}
	const qc = where('revieweeId', '==', revieweeId)
	const reviews = await getReviewsFromConstraint(qc, account, cache)
	cache.current.fullyCachedRevieweeIds.push(revieweeId)
	return reviews
}

export const getReviewerReviews = async (reviewerId: string, account: RMFAccount| null, cache: RMFCache): Promise<Review[]> => {
	if (cache.current.fullyCachedReviewerIds.includes(reviewerId)) {
		return cache.current.reviews.filter((review) => review.reviewerId === reviewerId)
	}
	const qc = where('reviewerId', '==', reviewerId)
	const reviews = await getReviewsFromConstraint(qc, account,cache)
	cache.current.fullyCachedReviewerIds.push(reviewerId)
	return reviews
}

export const getReview = async (reviewId: string, account: RMFAccount, cache: RMFCache): Promise<Review | null> => {
	const cachedReview = cache.current.reviews.find((review) => review.id === reviewId)
	if (cachedReview) return cachedReview
	const reviewDoc = await getDoc(doc(db, 'reviews', reviewId))
	if (!reviewDoc.exists()) return null
	const review = reviewDoc.data() as Review
	const reviewer = await getFriend(review.reviewerId, account, cache)
	const reviewee = await getFriend(review.revieweeId, account, cache)
	if (!reviewer || !reviewee) return null
	review.reviewer = reviewer
	review.reviewee = reviewee
	review.id = reviewId
	return review
}

export const getUserRating = async (userId: string, cache: RMFCache): Promise<{
	rating: number
	count: number	
}> => {
	let reviews: Review[] = []
	if (cache.current.fullyCachedRevieweeIds.includes(userId)) {
		reviews = cache.current.reviews.filter((review) => review.revieweeId === userId)
	}
	const reviewsRef = collection(db, 'reviews')
	const q = query(reviewsRef, where('revieweeId', '==', userId))
	const querySnapshot = await getDocs(q)
	for (const doc of querySnapshot.docs) {
		const review = doc.data() as Review
		if (review) reviews.push(review)
	}
	if (reviews.length === 0) return { rating: 0, count: 0 }
	const total = reviews.reduce((acc, review) => acc + review.rating, 0)
	return {
		rating: total / reviews.length,
		count: reviews.length,
	}
}

export const submitReview = async (
	type: Review['type'], 
	rating: number, 
	text: string, 
	account: RMFAccount,
	friend: Friend,
): Promise<Review> => {
	// TODO: Add photo submit?
	const reviewRef = collection(db, 'reviews')
	const review = {
		type,
		rating,
		text,
		public: true,
		reviewerId: account.uid,
		revieweeId: friend.uid,
		createdAt: Date.now(),
	}
	const reviewDoc = await addDoc(reviewRef, review)
	await sendReviewAddedNotification(account.uid, friend.uid, reviewDoc.id)
	return {
		...review,
		reviewer: friend,
		reviewee: account,
		id: reviewDoc.id,
	}
}
