import { TUser } from '@/features/auth/types';
import { Box, Button, Stack, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

type TListenCallPayload = {
  roomName: string;
  token: string;
  caller: TUser;
};

export const listenCall = (cb: (redirectUrl: string) => any) => {
  return (payload: TListenCallPayload) => {
    console.log('Hello');
    toast.custom(
      <Stack>
        <Typography variant='h6'>{payload.caller.name}</Typography>
        <Button onClick={() => cb(`/rooms/`)}>Pick Up</Button>
      </Stack>,
    );
  };
};
