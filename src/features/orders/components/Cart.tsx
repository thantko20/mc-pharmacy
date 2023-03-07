import { useDisclosure } from '@/hooks/useDisclosure';
import { Close, ShoppingCart } from '@mui/icons-material';
import Image from 'mui-image';
import {
  Badge,
  IconButton,
  Drawer,
  Stack,
  Box,
  ListItem,
  List,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { useCart } from './CartProvider';
import { useCreateOrder } from '../api/createOrder';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

export const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalItems, items, clearCart } = useCart();
  const mutation = useCreateOrder();

  const checkOut = ({ address }: { address: string }) => {
    if (items.length === 0) return;

    const orderItems = items.map((item) => ({
      medicineId: item._id,
      quantity: item.quantity,
    }));

    mutation.mutate(
      { medicines: orderItems, address },
      {
        onSuccess: (data) => {
          console.log(data);
          clearCart();
          toast.success('Thanks for ordering :)');
        },
      },
    );
  };

  return (
    <>
      <IconButton onClick={onOpen} size='large'>
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
        <Box
          display='grid'
          gridTemplateRows='min-content 1fr max-content'
          gap={2}
          width='100vw'
          height='100%'
          maxWidth={500}
          position='relative'
          sx={{
            paddingBlock: '1rem',
            paddingInline: '0.5rem',
          }}
        >
          <IconButton
            aria-label='close cart'
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
            }}
          >
            <Close />
          </IconButton>
          <Box>
            <Typography variant='h5' textAlign='center' fontWeight={600}>
              Catalogue
            </Typography>
          </Box>
          <List
            sx={{
              overflow: 'auto',
            }}
          >
            {items.map((item) => {
              return (
                <ListItem key={item._id} divider>
                  <Grid container spacing={2} direction='row'>
                    <Grid item xs='auto'>
                      <Box boxShadow={2}>
                        <Image
                          src={item.pictureUrls[0]}
                          width={100}
                          height={100}
                          showLoading
                          duration={200}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Box>
                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          spacing={1}
                        >
                          <Typography
                            textOverflow='ellipsis'
                            noWrap
                            flexShrink={1}
                          >
                            {item.name}
                          </Typography>
                          <Typography fontWeight={600} flexShrink={0}>
                            {item.price.toLocaleString()} MMK
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
          <Box>
            <LoadingButton
              variant='contained'
              onClick={() => checkOut({ address: 'Paris' })}
              loading={mutation.isLoading}
            >
              Checkout
            </LoadingButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
