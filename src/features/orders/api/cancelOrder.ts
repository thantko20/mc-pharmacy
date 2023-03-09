import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { useMutation } from 'react-query';

type TCancelOrderResponse = TSuccessResponse<{}>;

const cancelOrder = (id: string) => {
  return axios.put<never, TCancelOrderResponse>(`/orders/cancel/${id}`);
};

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: cancelOrder,
  });
};
