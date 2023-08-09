import axios from 'axios'
import { getItem, KEY_ACCESS_TOKEN, removItem, setItem } from './localStorageManager'
import { setLoading, showToast } from '../redux/slices/appConfigSlice';
import { TOAST_FAILURE } from '../App';
import store from '../redux/store'

let baseURL = 'http://localhost:4000';
if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.REACT_APP_SERVER_BASE_URL;
}

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true

})


axiosClient.interceptors.request.use(
    (request) => {

        const accessToken = getItem(KEY_ACCESS_TOKEN);
        request.headers['Authorization'] = `Bearer ${accessToken}`;
        store.dispatch(setLoading(true));
        return request
    }
);

axiosClient.interceptors.response.use(
    async (response) => {
        store.dispatch(setLoading(false));
        const data = response.data;
        if (data.status === 'ok') {
            return data;
        }
        const originalRequest = response.config;
        const statusCode = data.statusCode;
        const error = data.message;

        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message: error
        }))
        //when refresh token expire, send user to login page
        // if (statusCode === 401 && originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`) {
        //     removItem(KEY_ACCESS_TOKEN);
        //     window.location.replace('/login', '_self');
        //     return Promise.reject(error);
        // }

        //when the access token has expired
        if (statusCode === 401 && !originalRequest.retry) {
            originalRequest.retry = true;
            // const response = await axiosClient.get(`/auth/refresh`);
            const response = await axios.create({
                withCredentials: true
            }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`)
            // console.log('response from backend', response)

            if (response.data.status === 'ok') {
                // setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
                setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${response.data.result.accessToken}`

                return axios(originalRequest);
            }
            else {
                removItem(KEY_ACCESS_TOKEN);
                window.location.replace('/login', '_self');
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }, async (error) => {
        store.dispatch(setLoading(false))
        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message: error.message
        }))
        return Promise.reject(error)
    }
)