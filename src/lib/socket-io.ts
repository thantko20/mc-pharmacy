import { TListenCallPayload } from '@/features/calls/components/CallNotification';
import { TCallEndedPayload, TEndCallPayload } from '@/pages/RoomPage';
import { MyStorage } from '@/utils/MyStorage';
import { Socket, io } from 'socket.io-client';

interface ServerToClientEvents {
  call_declined: (payload: { roomName: string }) => void;
  callEnded: (payload: TCallEndedPayload) => void;
  calling: (payload: TListenCallPayload) => void;
}
interface ClientToServerEvents {
  startCall: (payload: {
    callerId: string;
    calleeId: string;
    roomName: string;
  }) => void;
  callEnded: (payload: TEndCallPayload) => void;
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
