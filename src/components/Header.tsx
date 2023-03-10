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
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SectionContainer } from './SectionContainer';
import { TUser } from '@/features/auth/types';
import { useDisclosure } from '@/hooks/useDisclosure';
import { ReactElement, useRef } from 'react';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  LogoutRounded,
  ReceiptLong,
} from '@mui/icons-material';
import Image from 'mui-image';
import { useQueryClient } from 'react-query';

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
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};

const LogoutMenuItem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logoutFn } = useAuth();
  const queryClient = useQueryClient();

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
                queryClient.clear();
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
  const navigate = useNavigate();

  return (
    <Box>
      <ButtonBase
        onClick={onOpen}
        ref={anchorRef}
        sx={{
          padding: 1,
          border: 1,
          borderColor: grey[700],
          borderRadius: '0.25rem',
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar
            alt={user.name}
            src={user.pictureUrls[0]}
            sx={{
              width: 42,
              height: 42,
            }}
          />
          <Stack direction='row' alignItems='center' spacing={2}>
            <Stack
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Typography
                textAlign='start'
                variant='subtitle1'
                fontSize='0.75rem'
                color={grey[500]}
              >
                Hi, Welcome!
              </Typography>
              <Typography variant='subtitle1' component='span' fontWeight={600}>
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
            minWidth: 200,
          },
        }}
      >
        <MenuList
          sx={{
            width: 1,
          }}
        >
          <ProfileMenuItem
            text='Orders'
            icon={<ReceiptLong />}
            onClick={() => navigate('/orders')}
          />
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
            borderRadius='100%'
            overflow='hidden'
            component={RouterLink}
            to='/'
          >
            <Image
              src='/images/myancare_logo.png'
              width={64}
              height={64}
              duration={200}
            />
          </Box>
          <Stack direction='row' alignItems='center' spacing={2}>
            {user ? (
              <>
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
