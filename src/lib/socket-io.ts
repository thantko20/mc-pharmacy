import { MyStorage } from '@/utils/MyStorage';
import { io } from 'socket.io-client';

export const socket = io('https://pharmacy-delivery.onrender.com', {
  autoConnect: false,
  auth(cb) {
    cb({
      token: MyStorage.getAccessToken(),
    });
  },
});
