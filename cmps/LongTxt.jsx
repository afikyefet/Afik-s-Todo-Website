const { useState, useEffect } = React

export function LongTxt({ txt = " ", length = 100 }) {
	const [isLong, setIsLong] = useState(false)

	function toggleIsLong() {
		setIsLong((long) => !long)
	}

	const isTextTooLong = txt && txt.length > length
	const shortText =
		isLong || !isTextTooLong ? txt : txt.substring(0, length) + "..."

	if (!shortText) return <span>loading</span>
	return (
		<React.Fragment>
			<span className="txt">{shortText}</span>
			<br></br>
			{isTextTooLong && (
				<span className="show-text-btn">
					<a onClick={toggleIsLong}> {isLong ? "Show Less" : "Read More"}</a>
				</span>
			)}
		</React.Fragment>
	)
}
