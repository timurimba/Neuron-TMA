import { Control } from 'react-hook-form'

export interface ISelectProps {
	options: IOption[]
	placeholder: string
	control: Control<any, any>
	name: string
	className?: string
}

export interface IOption {
	value: number
	label: string
}
