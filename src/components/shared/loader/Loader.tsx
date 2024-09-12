import cn from 'clsx'
import { LoaderCircle } from 'lucide-react'
import type { FC } from 'react'

import styles from './Loader.module.scss'
import { ILoaderProps } from './loader.types'

const Loader: FC<ILoaderProps> = ({ isBlack = false, className }) => {
	return (
		<LoaderCircle
			className={cn(styles.loader, className, {
				'!text-black': isBlack
			})}
		/>
	)
}

export default Loader
