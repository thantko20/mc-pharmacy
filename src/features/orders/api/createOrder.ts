import { axios } from '@/lib/axios';
import { TCreateOrderPayload, TOrder } from '../types';
import { TSuccessResponse } from '@/types';
import { useMutation } from 'react-query';

type TCreateOrderResponsePayload = TSuccessResponse<TOrder>;

const createOrder = (data: TCreateOrderPayload) => {
  return axios.post<never, TCreateOrderResponsePayload>('/orders', data);
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};
