import { axios } from '@/lib/axios';
import { TLoginFormData } from '../components/LoginForm';
import { TSuccessResponse } from '@/types';
import { TUser } from '../types';
import { useMutation } from 'react-query';

type TLoginResponse = TSuccessResponse<{
  accessToken: string;
  user: TUser;
}>;

export const login = (data: TLoginFormData) => {
  return axios.post<never, TLoginResponse>('/auth/login', data);
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
