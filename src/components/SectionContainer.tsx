import { Container } from '@mui/material';
import { ReactNode } from 'react';

export const SectionContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Container
      sx={{
        paddingX: '1rem',
        paddingY: '1.25rem',
      }}
    >
      {children}
    </Container>
  );
};
