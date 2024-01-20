import './RmfCard.scss'

export const RmfCard = (props: {
	children?: React.ReactNode
	className?: string
	style?: React.CSSProperties
}): JSX.Element => {
	return (
		<div style={props.style} className={`rmf-card ${props.className}`}>
			{props.children}
		</div>
	)
}
