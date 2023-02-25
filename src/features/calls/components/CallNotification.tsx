import { TUser } from '@/features/auth/types';
import { socket } from '@/lib/socket-io';
import { Slide, Stack, Paper, Typography, Button } from '@mui/material';
import { ReactNode, createContext, useEffect } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type TListenCallPayload = {
  roomName: string;
  token: string;
  caller: TUser;
};

type IncomingCallToastProps = {
  t: Toast;
  payload: TListenCallPayload;
  onPick: () => void;
  onDismiss: () => void;
};

const IncomingCallToast = ({
  t,
  payload,
  onPick,
  onDismiss,
}: IncomingCallToastProps) => {
  return (
    <Slide in={t.visible} mountOnEnter unmountOnExit direction='down'>
      <Stack
        direction='row'
        spacing={4}
        bgcolor='white'
        component={Paper}
        padding={2}
        elevation={4}
      >
        <Typography variant='h6'>{payload.caller.name}</Typography>
        <Stack direction='row' spacing={2}>
          <Button
            variant='contained'
            color='success'
            onClick={() => {
              toast.dismiss(t.id);
              onPick();
            }}
          >
            Pick Up
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              toast.dismiss(t.id);
              onDismiss();
            }}
          >
            Dismiss
          </Button>
        </Stack>
      </Stack>
    </Slide>
  );
};

type TCallNotiContext = {};

// const CallNotiContext = createContext();

export const CallNotification = () => {
  const navigate = useNavigate();

  const listenCall = (payload: TListenCallPayload) => {
    toast.custom(
      (t) => (
        <IncomingCallToast
          t={t}
          payload={payload}
          onPick={() =>
            navigate(`/rooms/${payload.roomName}`, {
              state: { token: payload.token, roomName: payload.roomName },
            })
          }
          onDismiss={() => {}}
        />
      ),
      {
        duration: Infinity,
      },
    );
  };

  useEffect(() => {
    socket.on('calling', listenCall);

    return () => {
      socket.off('calling', listenCall);
    };
  }, []);

  return <></>;
};
