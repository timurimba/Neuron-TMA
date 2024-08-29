import { useEffect, useState } from 'react'

export const usePageVisibility = () => {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		window.addEventListener('blur', () => {
			setIsVisible(false)
		})

		window.addEventListener('focus', () => {
			setIsVisible(true)
		})
	}, [])

	return isVisible
}
