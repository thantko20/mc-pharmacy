import originalAxios from 'axios';
import { MyStorage } from '../utils/MyStorage';

export const axios = originalAxios.create({
  baseURL: 'https://pharmacy-delivery.onrender.com/api',
  headers: {
    Authorization: MyStorage.getAccessToken(),
  },
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
