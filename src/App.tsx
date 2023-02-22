import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { router } from './routes';
import { queryClient } from './lib/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { AuthProvider } from './features/auth/components/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
