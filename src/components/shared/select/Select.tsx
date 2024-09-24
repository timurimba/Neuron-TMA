import type { FC } from 'react'
import { Controller, useForm, useFormState } from 'react-hook-form'
import SelectReact from 'react-select'

import './Select.scss'
import { ISelectProps } from './select.types'
import { usePointsStore } from '@/store/store'

const Select: FC<ISelectProps> = ({ options, placeholder, control, name }) => {
	const { setError, clearErrors } = useForm()
	const { errors } = useFormState({ control })
	return (
		<Controller
			control={control}
			name={name}
			rules={{
				required: true,
				validate: selectedOption => {
					if (usePointsStore.getState().points < selectedOption) {
						return false
					}
					return true
				}
			}}
			render={({ field: { onChange, value } }) => {
				const hasError = !!errors[name]
				return (
					<SelectReact
						onChange={selectedOption => {
							clearErrors(name)
							if (
								selectedOption &&
								selectedOption.value > usePointsStore.getState().points
							) {
								setError(name, {
									type: 'manual',
									message: 'Not enough points'
								})
							}
							onChange(selectedOption ? selectedOption.value : null)
						}}
						value={options.find(option => option.value === value)}
						classNamePrefix={'select'}
						className={`${hasError ? 'select--error' : ''}`}
						isSearchable={false}
						isClearable
						options={options}
						placeholder={placeholder}
					/>
				)
			}}
		/>
	)
}

export default Select
