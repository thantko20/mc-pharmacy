import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAuth } from './AuthProvider';
import { useDisclosure } from '@/hooks/useDisclosure';

export const Logout = () => {
  const { logoutFn } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} color='error' variant='contained' size='small'>
        Logout
      </Button>
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
