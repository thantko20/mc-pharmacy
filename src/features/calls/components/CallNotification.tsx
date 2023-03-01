import { useEffect } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Slide, Stack, Paper, Typography, Button, Avatar } from '@mui/material';
import { Call, CallEnd } from '@mui/icons-material';
import { socket } from '@/lib/socket-io';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { TListenCallPayload } from '../types';

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
          <Button
            color='error'
            onClick={() => {
              toast.dismiss(t.id);
              onDismiss();
            }}
            aria-label='decline call'
            variant='contained'
          >
            <CallEnd />
          </Button>
          <Button
            color='success'
            onClick={() => {
              toast.dismiss(t.id);
              onPick();
            }}
            aria-label='pick up call'
            variant='contained'
          >
            <Call />
          </Button>
        </Stack>
      </Stack>
    </Slide>
  );
};

export const CallNotification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const listenCall = (payload: TListenCallPayload) => {
    toast.custom(
      (t) => (
        <IncomingCallToast
          t={t}
          payload={payload}
          onPick={() => {
            socket.emit('acceptCall', {
              calleeId: user?._id as string,
              callerId: payload.caller._id,
              roomName: payload.roomName,
              roomSid: payload.roomSid,
            });
            navigate(`/rooms/${payload.roomName}`, {
              state: {
                token: payload.token,
                roomName: payload.roomName,
                otherParticipant: payload.caller,
                isMeCaller: false,
              },
            });
          }}
          onDismiss={() => {
            socket.emit('declineCall', {
              calleeId: user?._id as string,
              callerId: payload.caller._id,
              roomName: payload.roomName,
              roomSid: payload.roomSid,
            });
          }}
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
