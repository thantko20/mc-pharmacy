import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { useQuery } from 'react-query';
import { TMedicine } from '../types';

type TGetMedicinesResponse = TSuccessResponse<TMedicine[]>;

export const getMedicines = async () => {
  return axios.get<TGetMedicinesResponse>('/medicines').then((res) => res.data);
};

export const useGetMedicines = () => {
  return useQuery({
    queryFn: getMedicines,
    queryKey: ['medicines'],
  });
};
