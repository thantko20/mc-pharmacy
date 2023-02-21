import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { SectionContainer } from './SectionContainer';

export const Header = () => {
  return (
    <header>
      <SectionContainer>
        <Stack direction='row' justifyContent='space-between'>
          <Box fontSize='2rem' fontWeight={600}>
            MC Pharmacy
          </Box>
        </Stack>
      </SectionContainer>
    </header>
  );
};

export const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
