import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { useQuery } from 'react-query';

export type TRoomResponsePayload = {
  token: string;
  roomName: string;
  roomSid: string;
};

export const getTokenAndRoomName = () => {
  return axios.post<never, TSuccessResponse<TRoomResponsePayload>>('/rooms');
};
