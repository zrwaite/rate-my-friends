import { MutableRefObject } from 'react'
import { Friend } from './friend'
import { Review } from './review'

export interface RMFCacheValue {
	reviews: Review[]
	fullyCachedRevieweeIds: string[]
	fullyCachedReviewerIds: string[]
	friends: Friend[]
}

export const defaultRMFCacheValue: RMFCacheValue = {
	reviews: [],
	fullyCachedRevieweeIds: [],
	fullyCachedReviewerIds: [],
	friends: [],
}

export type RMFCache = MutableRefObject<RMFCacheValue>
