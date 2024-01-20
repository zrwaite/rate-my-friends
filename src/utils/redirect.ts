export const redirectFromParams = (navigate: (path: string) => void, defaultPath: string): void => {
	const params = new URLSearchParams(window.location.search)
	const redirectPath = params.get('r')
	navigate(redirectPath || defaultPath)
}
