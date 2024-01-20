import { Friend } from './friend'

export const reviewTypes = ['event', 'historical', 'firstImpression'] as const

export interface Review {
	id: string
	type: typeof reviewTypes[number]
	rating: number
	text: string
	photoFilename?: string
	reviewerId: string
	reviewer: Friend
	revieweeId: string
	reviewee: Friend
	createdAt: number
}
