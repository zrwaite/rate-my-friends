import { useContext } from 'react'
import { AccountContext, AccountValueType } from 'src/contexts/account'

export const useAccount = (): AccountValueType => {
	return useContext(AccountContext)
}
