import { useState } from 'react'
import { FriendList } from 'src/components/FriendsList'
import { Navbar } from 'src/components/Navbar'
import { RmfCard } from 'src/components/RmfCard'
import { SearchBar } from 'src/components/SearchBar'
import { Friend } from 'src/types/friend'

export const AddFriendsPage = (): JSX.Element => {
	const q = new URLSearchParams(window.location.search).get('q')
	const [friends, setFriends] = useState<Friend[]>()
	const isRmf = q === 'Rate My Friends' && friends?.length && friends?.length > 0
	const rmfFriend = isRmf ? friends?.[0] : undefined
	return (
		<>
			<Navbar title='Add Friends' disableSearch />
			<div className='center-page'>
				<SearchBar 
					setFriends={setFriends} 
					initialValue={q || ''} 
					style={{ maxWidth: '20rem' }}
				/>
				{isRmf && <RmfCard>
					<p>{'Hey, you found me, Ray Tim-Eye Friends!'}</p>
					{rmfFriend?.friendship ? <p>{'Feel free to review me below!'}</p> : 
						<p>{'Feel free to send me a friend request below!'}</p>}
					<p>{'Or just search for your friends above instead!'}</p>
				</RmfCard>}
				{!!q && <FriendList friends={friends} setFriends={setFriends} limit={isRmf ? 1 : undefined}/>}
			</div>
		</>
	)
}
