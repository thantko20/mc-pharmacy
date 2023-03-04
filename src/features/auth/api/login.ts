import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { TUser } from '../types';
import { useMutation } from 'react-query';

type TLoginResponse = TSuccessResponse<{
  accessToken: string;
  user: TUser;
}>;

type TLoginCredentials = {
  email: string;
  password: string;
};

export const login = (data: TLoginCredentials) => {
  return axios.post<never, TLoginResponse>('/auth/login', data);
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
