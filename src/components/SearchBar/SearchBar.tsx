import { useEffect, useState } from 'react'
import './SearchBar.scss'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { searchFriends } from 'src/firebase/friends'
import { Friend } from 'src/types/friend'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'
import { useDisplay } from 'src/hooks/display'

export const SearchBar = (props: {
	initialValue?: string
	style?: React.CSSProperties
	setFriends?: (friends: Friend[] | undefined) => void
}): JSX.Element => {
	const navigate = useNavigate()
	const q = new URLSearchParams(window.location.search).get('q')
	const { account } = useAccount()
	const { cache } = useCache()
	const [input, setInput] = useState(props.initialValue || q || '')
	const { width } = useDisplay()
	const shrink = width < 32

	useEffect(() => {
		if (account === undefined) return
		const getSearchResults = async (): Promise<void> => {
			if (!q) return
			const friends = await searchFriends(q, account || null, cache)
			props.setFriends?.(friends.filter((friend) => friend.uid !== account?.uid))
		}
		getSearchResults()
	}, [q, account?.uid])

	const search = (): void => {
		navigate('/add-friends?q=' + input)
	}

	return (
		<div className={'search-bar'} style={props.style}>
			<SearchIcon onClick={() => search()} style={{ cursor: 'pointer' }} />
			<input 
				className='rmf-searchbar'
				style={{ width: shrink ? '8rem' : '12rem' }}
				type='text' 
				placeholder={shrink ? 'Find friends...' : 'Find your friends...'}
				onChange={(e) => setInput(e.target.value)}
				defaultValue={input}
				onKeyDown={(e) => {
					if (e.key === 'Enter') search()
				}}
			/>
		</div>
	)
}
