import {
  Avatar,
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
import { Header } from './Header';
import { AnimatePresence } from 'framer-motion';

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
          <Box
            display='grid'
            gridTemplateRows='max-content 1fr max-content'
            gridTemplateColumns='minmax(300px, 1fr)'
            height='100vh'
          >
            <Header />
            <main>
              <AnimatePresence>
                <Outlet />
              </AnimatePresence>
            </main>
            <div></div>
          </Box>
        </CartProvider>
      )}
    </div>
  );
};
