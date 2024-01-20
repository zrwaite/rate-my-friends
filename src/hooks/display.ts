import { useContext } from 'react'
import { DisplayContext, DisplayValueType } from 'src/contexts/display'

export const useDisplay = (): DisplayValueType => {
	return useContext(DisplayContext)
}
