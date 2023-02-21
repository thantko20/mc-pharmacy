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
    ],
  },
]);
