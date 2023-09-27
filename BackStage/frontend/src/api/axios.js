import axios from 'axios';

// 後端伺服器的Port
const BASE_URL = 'http://localhost:8000';

// 一般的axios
export default axios.create({
    baseURL: BASE_URL
});

// 使用攔截器的axios
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});