import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import MainPage from './pages/MainPage';

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
        element: <div>Login Page</div>,
      },
      {
        path: '/auth/register',
        element: <div>Register Page</div>,
      },
    ],
  },
]);
