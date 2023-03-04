import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';

import { SectionContainer } from './SectionContainer';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { CartProvider } from '@/features/orders/components/CartProvider';
import { CallNotification } from '@/features/calls/components/CallNotification';
import { Cart } from '@/features/orders/components/Cart';
import { green } from '@mui/material/colors';

export const Header = () => {
  const { user, logoutFn } = useAuth();
  const navigate = useNavigate();

  return (
    <header>
      <SectionContainer>
        <Stack direction='row' justifyContent='space-between'>
          <Box
            color={green[400]}
            sx={{
              textDecoration: 'none',
            }}
            fontSize={{ xs: '1.25rem', md: '2rem' }}
            fontWeight={600}
            component={RouterLink}
            to='/'
          >
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
                <Cart />
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
  const { isCheckingAuth } = useAuth();

  return (
    <div>
      {isCheckingAuth ? (
        <Box
          position='fixed'
          top={0}
          left={0}
          width='100vw'
          height='100vh'
          display='flex'
          justifyContent='center'
          alignItems='center'
          bgcolor='white'
          zIndex={10}
        >
          <CircularProgress />
        </Box>
      ) : (
        <CartProvider>
          <CallNotification />
          <Header />
          <main>
            <Outlet />
          </main>
        </CartProvider>
      )}
    </div>
  );
};
