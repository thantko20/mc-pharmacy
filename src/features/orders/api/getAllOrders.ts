import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { TOrder, TOrderStatus } from '../types';
import { useQuery } from 'react-query';

type TGetAllOrdersResponsePayload = TSuccessResponse<TOrder[]>;

export type TGetAllOrdersQuery = {
  page?: number | string;
  status?: TOrderStatus;
};

const getAllOrders = ({ page = 1, status }: TGetAllOrdersQuery) => {
  return axios.get<never, TGetAllOrdersResponsePayload>(
    `/orders/me?page=${page}&${status ? 'status' + status : ''}`,
  );
};

export const useGetAllOrders = (query: TGetAllOrdersQuery) => {
  return useQuery({
    queryFn: () => getAllOrders(query),
    queryKey: ['orders', query],
  });
};
