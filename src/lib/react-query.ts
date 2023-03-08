import { TSuccessResponse } from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(
            (error.response?.data as TSuccessResponse<{}>).message ||
              'Something went wrong!',
          );
        }
      },
    },
  },
});
