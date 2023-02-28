import { MyStorage } from '@/utils/MyStorage';
import { Socket, io } from 'socket.io-client';

interface ServerToClientEvents {
  call_declined: (payload: { roomName: string }) => void;
}
interface ClientToServerEvents {
  'start-call': (payload: {
    callerId: string;
    calleeId: string;
    roomName: string;
  }) => void;
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
