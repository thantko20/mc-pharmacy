import { MyStorage } from '@/utils/MyStorage';
import { io } from 'socket.io-client';

export const socket = io('https://pharmacydelivery-production.up.railway.app', {
  autoConnect: false,
  auth(cb) {
    cb({
      token: MyStorage.getAccessToken(),
    });
  },
});
