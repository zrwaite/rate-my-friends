import React from 'react'

export interface DisplayValueType {
	width: number,
	setWidth: (newWidth: number) => void,
}

export const DisplayContext = React.createContext<DisplayValueType>({
	width: 0,
	// eslint-disable-next-line 
	setWidth: () => {},
})
