import React from 'react'
import { RMFCache, defaultRMFCacheValue } from 'src/types/cache'

export interface CacheValueType {
	cache: RMFCache
}

export const CacheContext = React.createContext<CacheValueType>({
	cache: { current: defaultRMFCacheValue },
})
