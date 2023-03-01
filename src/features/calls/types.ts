import { TUser } from '../auth/types';

export type TCallDeclinePayload = {
  callerId: string;
  calleeId: string;
  roomSid: string;
  roomName: string;
};

export type TListenCallPayload = {
  roomName: string;
  token: string;
  caller: TUser;
  roomSid: string;
};
