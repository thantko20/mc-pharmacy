import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import MainPage from './pages/MainPage';
import { LoginPage } from './pages/LoginPage';
import TestPage from './pages/TestPage';
import RoomPage from './pages/RoomPage';
import { useAuth } from './features/auth/components/AuthProvider';
import { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { user, isCheckingAuth } = useAuth();

  return (
    <>
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
      ) : user ? (
        children
      ) : (
        <div>You have to login to access this page</div>
      )}
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/auth/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/register',
        element: <div>Register Page</div>,
      },
      {
        path: '/test',
        element: (
          <AuthRoute>
            <TestPage />
          </AuthRoute>
        ),
      },
      {
        path: '/rooms/:roomName',
        element: (
          <AuthRoute>
            <RoomPage />
          </AuthRoute>
        ),
      },
    ],
  },
]);
