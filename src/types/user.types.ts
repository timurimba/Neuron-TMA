export interface IUser {
	points: number
	referrals: number[]
	referralReward: number
	referrer: string
	startTimer: number
	countDownTime: number
	isHadNft: boolean
	completedTasks: string[]
}
