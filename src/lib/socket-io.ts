import {
  TCallDeclinePayload,
  TCallEndedPayload,
  TEndCallPayload,
  TListenCallPayload,
  TMissedCallPayload,
} from '@/features/calls/types';
import { MyStorage } from '@/utils/MyStorage';
import { Socket, io } from 'socket.io-client';

interface ServerToClientEvents {
  declineCall: (payload: TCallDeclinePayload) => void;
  callEnded: (payload: TCallEndedPayload) => void;
  calling: (payload: TListenCallPayload) => void;
  missedCall: (payload: TMissedCallPayload) => void;
}
interface ClientToServerEvents {
  startCall: (payload: {
    callerId: string;
    calleeId: string;
    roomName: string;
    roomSid: string;
  }) => void;
  callEnded: (payload: TEndCallPayload) => void;
  declineCall: (payload: TCallDeclinePayload) => void;
  acceptCall: (payload: TCallDeclinePayload) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'https://pharmacydelivery-production.up.railway.app',
  {
    autoConnect: false,
    auth(cb) {
      cb({
        token: MyStorage.getAccessToken(),
      });
    },
  },
);
