import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { router } from './routes';
import { queryClient } from './lib/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
