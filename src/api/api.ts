import axios from 'axios'

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
