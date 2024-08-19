interface ITimer {
	isProcessing: boolean
	value: number
	exitTime: number
}

export interface IUser {
	points: number
	referrals: number[]
	timer: ITimer
}
