import { useEffect } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Slide,
  Stack,
  Paper,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import { CancelRounded, CheckCircleRounded } from '@mui/icons-material';
import { TUser } from '@/features/auth/types';
import { socket } from '@/lib/socket-io';

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
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar
            alt={payload.caller.name}
            src={payload.caller.pictureUrls[0]}
          />
          <Typography fontSize={18} fontWeight='600'>
            {payload.caller.name}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2}>
          <IconButton
            color='success'
            onClick={() => {
              toast.dismiss(t.id);
              onPick();
            }}
          >
            <CheckCircleRounded />
          </IconButton>
          <IconButton
            color='error'
            onClick={() => {
              toast.dismiss(t.id);
              onDismiss();
            }}
          >
            <CancelRounded />
          </IconButton>
        </Stack>
      </Stack>
    </Slide>
  );
};

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
              state: {
                token: payload.token,
                roomName: payload.roomName,
                otherParticipant: payload.caller,
              },
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
