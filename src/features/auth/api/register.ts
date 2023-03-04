import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { TUser } from '../types';
import { useMutation } from 'react-query';

type TRegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

type TRegisterResponse = TSuccessResponse<{
  user: TUser;
  accessToken: string;
}>;

const register = (data: TRegisterCredentials) => {
  return axios.post<never, TRegisterResponse>('/auth/register', data);
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
