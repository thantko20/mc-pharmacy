import { useDisclosure } from '@/hooks/useDisclosure';
import { ShoppingCart } from '@mui/icons-material';
import {
  Badge,
  IconButton,
  Drawer,
  Stack,
  Box,
  ListItem,
  List,
  Typography,
} from '@mui/material';
import { useCart } from './CartProvider';

export const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalItems, items } = useCart();

  return (
    <>
      <IconButton onClick={onOpen}>
        <Badge badgeContent={totalItems()} color='primary'>
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Drawer
        onClose={onClose}
        open={isOpen}
        anchor='right'
        sx={{
          padding: '0.75rem',
        }}
      >
        <Box sx={{ width: '100vw', maxWidth: 400 }}>
          {items.length > 0 ? (
            <List>
              {items.map((item) => (
                <ListItem key={item._id}>
                  <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    spacing={2}
                    width={1}
                  >
                    <Typography>{item.name}</Typography>
                    <Typography>{item.quantity}</Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Empty Cart</Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};
