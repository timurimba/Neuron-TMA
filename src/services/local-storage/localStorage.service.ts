export const LocalStorageService = {
	setItem: (key: string, value: string) => {
		localStorage.setItem(key, value)
	},
	getItem: (key: string) => {
		return localStorage.getItem(key)
	},
	clear: () => {
		localStorage.clear()
	}
}
