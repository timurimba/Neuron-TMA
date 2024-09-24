import { useMutation, useQuery } from '@tanstack/react-query'
import { Address, toNano } from '@ton/core'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { TonService } from '@/services/ton/ton.service'
import { UserService } from '@/services/user/user.service'

import { IUser } from '@/types/user.types'

import { useWallet } from '@/hooks/useWallet'

import {
	BUY_NP,
	BUY_TEXT_FULL,
	BUY_TEXT_SHORT,
	SALE_TEXT_FULL,
	SALE_TEXT_SHORT,
	telegramId
} from '../../../../consts/consts'

import styles from './Market.module.scss'
import Button from './button-market/ButtonMarket'
import { usePointsStore } from '@/store/store'

const Market: React.FC = () => {
	const [activeButton, setActiveButton] = useState<'buy' | 'sale' | null>(null)
	const { setPoints } = usePointsStore(state => state)

	const { mutate: mutateBuyPoints, isPending: isPendingBuyPoints } =
		useMutation({
			mutationKey: ['buy-points'],
			mutationFn: (data: any) =>
				UserService.updatePoints(data.telegramId, data.points),
			onSuccess: () => {
				toast.success("You've successfully bought NP")
				setPoints(usePointsStore.getState().points + 10000)
				UserService.addTransactionBuy(wallet!)
				UserService.awardPointsToUser(telegramId, BUY_NP)
			}
		})

	const { mutate: mutateSellPoints, isPending: isPendingSellPoints } =
		useMutation({
			mutationKey: ['sell-points'],
			mutationFn: (data: any) =>
				UserService.updatePoints(data.telegramId, data.points),
			onSuccess: () => {
				toast.success("You've successfully sold NP")
				setPoints(usePointsStore.getState().points - 100000)
				TonService.sellTon(wallet!)
				UserService.addTransactionSell(wallet!)
			}
		})

	const { data: user } = useQuery({
		queryKey: ['get-user'],
		queryFn: () => UserService.getUserFields<IUser>(telegramId)
	})

	const { sender, wallet } = useWallet()

	// Проверяем, активна ли хоть одна кнопка
	const isAnyButtonActive = activeButton !== null

	const buyPoints = async () => {
		try {
			if (activeButton === 'buy') {
				if (!wallet) {
					toast.error('Connect Wallet')
					return
				}
				await sender.send({
					to: Address.parse(import.meta.env.VITE_OWNER_WALLET_ADDRESS),
					value: toNano(2)
				})
				mutateBuyPoints({
					telegramId,
					points: usePointsStore.getState().points + BUY_NP
				})
			} else {
				setActiveButton('buy')
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const sellPoints = async () => {
		if (activeButton === 'sale') {
			if (!wallet) {
				toast.error('Connect Wallet')
			}
			if (usePointsStore.getState().points < 100000) {
				toast.error('insufficient NP balance')
			}
			if (!user?.referrals || user.referrals.length < 3) {
				toast.error('Invite 3 or more friends to open Sell button')
			}

			if (wallet && usePointsStore.getState().points >= 100000) {
				mutateSellPoints({
					telegramId,
					points: usePointsStore.getState().points - 100000
				})
			}
		} else {
			setActiveButton('sale')
		}
	}

	return (
		<div className={styles.container}>
			<Button
				isDisabled={isPendingBuyPoints}
				active={activeButton === 'buy'}
				onClick={buyPoints}
				shortText={BUY_TEXT_SHORT}
				fullText={BUY_TEXT_FULL}
				type='buy'
				isAnyButtonActive={isAnyButtonActive}
			/>
			<Button
				isDisabled={isPendingSellPoints}
				active={activeButton === 'sale'}
				onClick={sellPoints}
				shortText={SALE_TEXT_SHORT}
				fullText={SALE_TEXT_FULL}
				type='sale'
				isAnyButtonActive={isAnyButtonActive}
			/>
		</div>
	)
}

export default Market
