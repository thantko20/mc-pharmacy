import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import MainPage from './pages/MainPage';
import { LoginPage } from './pages/LoginPage';
import TestPage from './pages/TestPage';
import RoomPage from './pages/RoomPage';

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
        element: <TestPage />,
      },
      {
        path: '/rooms/:roomName',
        element: <RoomPage />,
      },
    ],
  },
]);
