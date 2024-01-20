import React from 'react'
import { RMFAccount } from 'src/types/account'

export interface AccountValueType {
	account: RMFAccount | null | undefined,
	setAccount: (newAccount: RMFAccount | null) => void,
}

export const AccountContext = React.createContext<AccountValueType>({
	account: null,
	// eslint-disable-next-line 
	setAccount: () => {},
})
