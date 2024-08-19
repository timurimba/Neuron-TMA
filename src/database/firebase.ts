import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDgRzEThbi5gK7JvIB14_j0MpwFJtp7snI',
	authDomain: 'neuron-app-6f52c.firebaseapp.com',
	databaseURL: 'https://neuron-app-6f52c-default-rtdb.firebaseio.com',
	projectId: 'neuron-app-6f52c',
	storageBucket: 'neuron-app-6f52c.appspot.com',
	messagingSenderId: '594751199947',
	appId: '1:594751199947:web:569d7d62c43f27e4c9994e',
	measurementId: 'G-9CDQC1WRWV',
};

const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);
