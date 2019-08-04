import axios from 'axios';
export const JWT = 'JWT';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(JWT);
    if (token) {
        config.headers[JWT] =  `${token}`;
    }
    return config;
}, (err) => Promise.reject(err));

export function login(code: string): Promise <any> {
    return axios.get('http://localhost:3000/login', {
        params: {
            code,
        },
    });
}
