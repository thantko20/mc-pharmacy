import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { TOrder } from '../types';
import { useQuery } from 'react-query';

type TGetAllOrdersResponsePayload = TSuccessResponse<TOrder[]>;

const getAllOrders = () => {
  return axios.get<never, TGetAllOrdersResponsePayload>('/orders/me');
};

export const useGetAllOrders = () => {
  return useQuery({
    queryFn: getAllOrders,
    queryKey: ['orders'],
  });
};
