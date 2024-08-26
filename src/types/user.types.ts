export interface ITimer {
	isProcessing: boolean
	duration: number
	durationExit: number
	dateStartingTimer: number
}

export interface IUser {
	points: number
	referrals: number[]
	timer: ITimer
	isHadNft: boolean
}
