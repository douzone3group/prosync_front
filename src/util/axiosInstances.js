import axios from 'axios';
import { redirect } from 'react-router-dom';
import { setCookie, getCookie } from './cookies';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoggedIn } from '../redux/reducers/loginSlice';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }

    if (refreshToken) {
      config.headers['Refresh'] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = await error.config;
    const accessToken = getCookie('accessToken');
    console.log('interceptor 지나감');

    if (error.response.headers && error.response.headers.authorization) {
      // 헤더에 새 토큰이 있을 경우 - 토큰 변경 및 기존 요청을 재요청
      const newToken = error.response.headers.authorization;
      if (newToken) {
        originalRequest.headers.authorization = newToken;
        setCookie('accessToken', newToken, { path: '/' });
        return axiosInstance(originalRequest);
      }
      //리프레시 토큰 만료시 - 로그아웃 처리
      else if (error.response.status === 401 && accessToken) {
        setCookie('accessToken', 'EXPIRED', { path: '/' });
      }
    }

    console.log('axiosInstance interceptor response error :');
    console.log(error);
    console.log('Promise reject 객체');
    return Promise.reject(error);
  }
);

export default axiosInstance;