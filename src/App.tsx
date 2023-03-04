import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { router } from './routes';
import { queryClient } from './lib/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { AuthProvider } from './features/auth/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Toaster position='top-center' />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
