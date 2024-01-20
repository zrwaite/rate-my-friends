import { useEffect, useState } from 'react'
import './SearchBar.scss'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { searchFriends } from 'src/firebase/friends'
import { Friend } from 'src/types/friend'
import { useAccount } from 'src/hooks/account'
import { useCache } from 'src/hooks/cache'

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
	const [mobile, setMobile] = useState(false)

	useEffect(() => {
		const handleResize = (): void=> {
			if (window.innerWidth < 32 * 16) setMobile(true)
			else setMobile(false)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

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
			<SearchIcon />
			<input 
				className='rmf-searchbar'
				style={{ width: mobile ? '8rem' : '12rem' }}
				type='text' 
				placeholder={mobile ? 'Find friends...' : 'Find your friends...'}
				onChange={(e) => setInput(e.target.value)}
				defaultValue={input}
				onKeyDown={(e) => {
					if (e.key === 'Enter') search()
				}}
			/>
		</div>
	)
}
