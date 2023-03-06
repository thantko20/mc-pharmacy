import { useAuth } from '@/features/auth/components/AuthProvider';
import { Cart } from '@/features/orders/components/Cart';
import {
  Stack,
  Box,
  Avatar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SectionContainer } from './SectionContainer';
import { Logout } from '@/features/auth/components/Logout';
import { TUser } from '@/features/auth/types';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useRef } from 'react';

const ProfileMenu = ({ user }: { user: TUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <Box>
      <Button
        onClick={onOpen}
        ref={anchorRef}
        sx={{
          textTransform: 'unset',
          color: grey[700],
          fontWeight: 500,
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar alt={user.name} src={user.pictureUrls[0]} />
          <Typography
            variant='subtitle1'
            component='span'
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            {user.name}
          </Typography>
        </Stack>
      </Button>
      <Menu open={isOpen} onClose={onClose} anchorEl={anchorRef.current}>
        <MenuItem
          sx={{
            minWidth: 200,
          }}
        >
          Orders
        </MenuItem>
        <MenuItem
          sx={{
            minWidth: 200,
          }}
        >
          Profile
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header>
      <SectionContainer>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
        >
          <Box
            color={green[400]}
            sx={{
              textDecoration: 'none',
            }}
            fontSize={{ xs: '1.25rem', md: '2rem' }}
            fontWeight={600}
            component={RouterLink}
            to='/'
          >
            MC Pharmacy
          </Box>
          <Stack direction='row' alignItems='center' spacing={2}>
            {user ? (
              <>
                <ProfileMenu user={user} />
                <Logout />
                <Cart />
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/auth/login')}>Login</Button>
                <Button
                  variant='contained'
                  onClick={() => navigate('/auth/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </SectionContainer>
    </header>
  );
};
