import { TUser } from '@/features/auth/types';

type TListenCallPayload = {
  roomName: string;
  token: string;
  user: TUser;
};

export const listenCall = (payload: TListenCallPayload) => {
  console.log(payload);
};
