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
  ButtonBase,
  Icon,
  MenuList,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SectionContainer } from './SectionContainer';
import { Logout } from '@/features/auth/components/Logout';
import { TUser } from '@/features/auth/types';
import { useDisclosure } from '@/hooks/useDisclosure';
import { ReactElement, ReactNode, useRef } from 'react';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  LogoutRounded,
  ReceiptLong,
} from '@mui/icons-material';

const ProfileMenuItem = ({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon?: ReactElement;
  onClick?: () => void;
}) => {
  return (
    <MenuItem onClick={onClick}>
      <Stack width={1} direction='row' spacing={1} alignItems='center'>
        {icon ? (
          <Icon
            sx={{
              width: 32,
              height: 32,
            }}
          >
            {icon}
          </Icon>
        ) : null}
        <Typography>{text}</Typography>
      </Stack>
    </MenuItem>
  );
};

const LogoutMenuItem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logoutFn } = useAuth();

  return (
    <>
      <ProfileMenuItem
        text='Logout'
        icon={<LogoutRounded />}
        onClick={onOpen}
      />
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Log out?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure about that?</DialogContentText>
          <DialogActions>
            <Button color='info' onClick={onClose}>
              Cancel
            </Button>
            <Button
              color='error'
              onClick={() => {
                logoutFn();
                onClose();
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ProfileMenu = ({ user }: { user: TUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <Box>
      <ButtonBase
        onClick={onOpen}
        ref={anchorRef}
        sx={{
          padding: 1,
          border: 1,
          borderColor: grey[200],
          borderRadius: '0.25rem',
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <Avatar
            alt={user.name}
            src={user.pictureUrls[0]}
            sx={{
              width: 42,
              height: 42,
            }}
          />
          <Stack direction='row' alignItems='center'>
            <Stack>
              <Typography
                variant='subtitle1'
                fontSize='0.75rem'
                color={grey[500]}
              >
                Hi, Welcome!
              </Typography>
              <Typography
                variant='subtitle1'
                component='span'
                sx={{
                  display: { xs: 'none', md: 'block' },
                }}
                fontWeight={600}
              >
                {user.name}
              </Typography>
            </Stack>
            {isOpen ? (
              <Icon>
                <KeyboardArrowUp />
              </Icon>
            ) : (
              <Icon>
                <KeyboardArrowDown />
              </Icon>
            )}
          </Stack>
        </Stack>
      </ButtonBase>
      <Menu
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorRef.current}
        PaperProps={{
          sx: {
            width: anchorRef.current?.clientWidth || 200,
          },
        }}
      >
        <MenuList
          sx={{
            width: 1,
          }}
        >
          <ProfileMenuItem text='Orders' icon={<ReceiptLong />} />
          <LogoutMenuItem />
        </MenuList>
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
                {/* <Logout /> */}
                <Cart />
                <ProfileMenu user={user} />
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
