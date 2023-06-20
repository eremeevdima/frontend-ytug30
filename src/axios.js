import axios from "axios";

const initince = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

initince.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem('token');
	return config;
});

export default initince;