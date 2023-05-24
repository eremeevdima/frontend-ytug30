import axios from "axios";

const initince = axios.create({
	baseURL: 'http://localhost:4444',
});

initince.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem('token');
	return config;
});

export default initince;