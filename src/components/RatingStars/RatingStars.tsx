import { CSSProperties } from 'react'
import { flexRow, flexColumn } from 'src/styles'

export const RatingStars = (props: {
	rating?: number,
	editable?: false
	setRating?: undefined
	size?: number
	style?: CSSProperties
	count?: number
} | {
	rating?: number,
	editable: true
	setRating: (rating: number) => void,
	size?: number
	style?: CSSProperties
	count?: number
}): JSX.Element => {
	const { rating, setRating, editable, count, style } = props
	const size = props.size || 10
	const oneDecimalRating = rating !== undefined ? Math.round(rating * 10) / 10 : undefined
	const halfStarRating = rating !== undefined ? Math.round(rating * 2) / 2 : undefined
	const containerStyle = {
		...flexColumn, 
		margin: `${size/40}rem`,
		width: `${size}rem`,
		...style
	}
	const decimalStyle = {
		fontSize: `${size/7}rem`,
		marginTop: `${size/40}rem`,
		marginRight: `${size/30}rem`,
		color: '#78d5d7',
	}
	const countStyle = {
		fontSize: `${size/12}rem`,
		color: '#78d5d7',
	}
	
	return (
		<div style={containerStyle}>
			<div style={{ ...flexRow, width: '100%' }}>
				<p style={decimalStyle}>{oneDecimalRating}</p>
				<div style={{ ...flexRow, width: '100%' }}>
					{[1, 2, 3, 4, 5].map((r) => {
						let star = '/empty-rating-star.svg'
						if (rating !== undefined && halfStarRating) {
							if (r <= halfStarRating) star = '/filled-rating-star.svg'
							else if (r - 0.5 === halfStarRating) star = '/half-rating-star.svg'
						}
						return (
							<img 
								key={r}
								className={'fill-image'} 
								src={star} 
								alt={`rating ${r}`}
								onClick={editable ? () => {
									if (r === rating) setRating(r - 1)
									else setRating(r)
								} : undefined}
								style={{ cursor: editable ? 'pointer' : undefined }}
							/>
						)
					})}
				</div>
			</div>
			{count !== undefined && <div style={flexRow}>
				<p style={countStyle}>{count} review{count === 1 ? '' : 's'}</p>
			</div>}
		</div>
	)
}
