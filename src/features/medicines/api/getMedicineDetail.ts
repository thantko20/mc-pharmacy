import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { TMedicine } from '../types';
import { useQuery } from 'react-query';

type TGetMedicinePayload = {
  id: string;
};

export const getMedicineDetail = ({ id }: TGetMedicinePayload) => {
  return axios.get<never, TSuccessResponse<TMedicine>>(`/medicines/${id}`);
};

export const useGetMedicineDetail = ({ id }: TGetMedicinePayload) => {
  return useQuery({
    queryFn: () => getMedicineDetail({ id }),
    queryKey: ['medicines', id],
  });
};
