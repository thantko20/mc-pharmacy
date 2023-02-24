import originalAxios from 'axios';
import { MyStorage } from '../utils/MyStorage';

export const axios = originalAxios.create({
  baseURL: 'https://pharmacydelivery-production.up.railway.app/api',
  headers: {
    Authorization: MyStorage.getAccessToken(),
  },
});

axios.interceptors.request.use(function (config) {
  const token = MyStorage.getAccessToken();
  config.headers.Authorization = token;

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (originalAxios.isAxiosError(error)) {
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  },
);
