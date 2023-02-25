import { useEffect, useRef } from 'react';
import { Box, Button, Paper, Slide, Stack, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

import { SectionContainer } from './SectionContainer';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { socket } from '@/lib/socket-io';
import { toast } from 'react-hot-toast';
import { TUser } from '@/features/auth/types';
import { CallNotification } from '@/features/calls/components/CallNotification';

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
  return (
    <div>
      <CallNotification />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
