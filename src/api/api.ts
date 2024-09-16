import { TonClient } from '@ton/ton'
import axios from 'axios'

export const client = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
	apiKey: import.meta.env.VITE_API_TOKEN_TONCENTER
})

export const apiBlockchain = axios.create({
	baseURL: 'https://tonapi.io/v2',
	headers: {
		Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
		'Content-type': 'application/json'
	}
})

export const apiTelegramBot = axios.create({
	baseURL: 'https://neuronforbot.hopto.org',
	headers: {
		'Content-type': 'application/json'
	}
})
