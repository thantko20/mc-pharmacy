import { useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

import { SectionContainer } from './SectionContainer';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { socket } from '@/lib/socket-io';
import { listenCall } from '@/features/calls/socket/listenCall';
import { toast } from 'react-hot-toast';
import { TUser } from '@/features/auth/types';

type TListenCallPayload = {
  roomName: string;
  token: string;
  caller: TUser;
};

export const Header = () => {
  const { user, logoutFn } = useAuth();
  const navigate = useNavigate();

  return (
    <header>
      <SectionContainer>
        <Stack direction='row' justifyContent='space-between'>
          <Box fontSize='2rem' fontWeight={600}>
            MC Pharmacy
          </Box>
          <Stack direction='row' alignItems='center' spacing={2}>
            {user ? (
              <>
                <Typography variant='subtitle1' component='span'>
                  {user.name}
                </Typography>
                <Button color='error' onClick={logoutFn}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/auth/login')}>Login</Button>
                <Button
                  variant='contained'
                  onClick={() => navigate('/auth/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </SectionContainer>
    </header>
  );
};

export const MainLayout = () => {
  const navigate = useNavigate();
  const toastRef = useRef<string | null>(null);

  const listenCall = (payload: TListenCallPayload) => {
    toastRef.current = toast.custom(
      <Stack>
        <Typography variant='h6'>{payload.caller.name}</Typography>
        <Button
          variant='contained'
          color='success'
          onClick={() => {
            toast.dismiss(toastRef.current as string);
            navigate(`/rooms/${payload.roomName}`, {
              state: { token: payload.token, roomName: payload.roomName },
            });
          }}
        >
          Pick Up
        </Button>
      </Stack>,
    );
  };

  useEffect(() => {
    socket.on('calling', listenCall);

    return () => {
      socket.off('calling', listenCall);
    };
  }, []);

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
