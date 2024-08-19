interface TelegramWebAppThemeParams {
	bg_color?: string
	text_color?: string
	hint_color?: string
	link_color?: string
	button_color?: string
	button_text_color?: string
}

interface TelegramWebAppUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
}

interface TelegramWebAppChat {
	id: number
	type: string
	title?: string
	username?: string
}

interface TelegramWebApp {
	initData: string
	initDataUnsafe: {
		query_id?: string
		user?: TelegramWebAppUser
		chat?: TelegramWebAppChat
		auth_date: number
		hash: string
	}
	version: string
	platform: string
	themeParams: TelegramWebAppThemeParams
	colorScheme: 'light' | 'dark'
	isExpanded: boolean
	viewportHeight: number
	viewportStableHeight: number
	HeaderColor: {
		color: string
		setColor(color: string): void
	}
	BackButton: {
		isVisible: boolean
		show(): void
		hide(): void
		onClick(callback: () => void): void
		offClick(callback: () => void): void
	}
	MainButton: {
		text: string
		color: string
		textColor: string
		isVisible: boolean
		isActive: boolean
		setText(text: string): void
		onClick(callback: () => void): void
		offClick(callback: () => void): void
		show(): void
		hide(): void
		enable(): void
		disable(): void
	}
	onEvent(eventType: string, callback: () => void): void
	offEvent(eventType: string, callback: () => void): void
	sendData(data: string): void
	close(): void
}

interface Telegram {
	WebApp: TelegramWebApp
}

interface Window {
	Telegram: Telegram
}
