import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { useQuery } from 'react-query';
import { TMedicine } from '../types';
import { useState } from 'react';

type TGetMedicinesResponse = TSuccessResponse<TMedicine[]>;

export const getMedicines = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return axios.get<never, TGetMedicinesResponse>(
    `/medicines?page=${page}&limit=${limit}`,
  );
};

export const useGetMedicines = ({
  page = 1,
  limit = 12,
}: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryFn: () => getMedicines({ page, limit }),
    queryKey: ['medicines', { page }],
  });
};
