import { useContext } from 'react'
import { CacheContext, CacheValueType } from 'src/contexts/cache'

export const useCache = (): CacheValueType => {
	return useContext(CacheContext)
}
