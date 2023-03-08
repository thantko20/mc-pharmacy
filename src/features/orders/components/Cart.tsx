import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Add, Close, Remove, ShoppingCart } from '@mui/icons-material';
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
  TextField,
  Button,
} from '@mui/material';
import { useCart } from './CartProvider';
import { useCreateOrder } from '../api/createOrder';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type EditQuantityProps = {
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  quantity: number;
};

const EditQuantity = ({
  increaseQuantity,
  decreaseQuantity,
  quantity,
}: EditQuantityProps) => {
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <IconButton onClick={decreaseQuantity} aria-label='decrease quantity'>
        <Remove />
      </IconButton>
      <Box>
        <Typography
          sx={{
            letterSpacing: 2,
            fontWeight: 'bold',
          }}
        >
          {quantity.toString(10).padStart(2, '0')}
        </Typography>
      </Box>
      <IconButton onClick={increaseQuantity} aria-label='increase quantity'>
        <Add />
      </IconButton>
    </Stack>
  );
};

export const Cart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    totalItems,
    items,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    calculateTotalAmount,
  } = useCart();

  const mutation = useCreateOrder();

  const [parent] = useAutoAnimate();

  const [checkOutStatus, setCheckoutStatus] = useState<'preview' | 'address'>(
    'preview',
  );

  const [address, setAddress] = useState('');

  const reset = () => {
    clearCart();
    setAddress('');
    setCheckoutStatus('preview');
  };

  const checkOut = ({ address }: { address: string }) => {
    if (items.length === 0) return;

    if (!address) {
      toast.error('Please fill in the address.');
      return;
    }

    const orderItems = items.map((item) => ({
      medicine: item._id,
      quantity: item.quantity,
    }));

    mutation.mutate(
      { orderDetails: orderItems, address },
      {
        onSuccess: () => {
          toast.success('Thanks for ordering :)');
        },
        onSettled: () => {
          reset();
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
          overflow='hidden'
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
              {checkOutStatus === 'preview' ? 'Catalogue' : 'Fill in Address'}
            </Typography>
          </Box>
          <Box>
            <AnimatePresence initial={false} mode='popLayout'>
              {checkOutStatus === 'preview' ? (
                <Box
                  component={motion.div}
                  key='preview'
                  initial={{ x: '-100%', opacity: 0.5 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      type: 'keyframes',
                    },
                  }}
                  exit={{
                    x: '-100%',
                    opacity: 0,
                  }}
                >
                  <List
                    sx={{
                      overflow: 'auto',
                    }}
                    ref={parent}
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
                              <Stack height={1} justifyContent='space-between'>
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
                                <Box>
                                  <EditQuantity
                                    increaseQuantity={() =>
                                      increaseQuantity(item._id)
                                    }
                                    decreaseQuantity={() =>
                                      decreaseQuantity(item._id)
                                    }
                                    quantity={item.quantity}
                                  />
                                </Box>
                              </Stack>
                            </Grid>
                          </Grid>
                        </ListItem>
                      );
                    })}
                  </List>
                  {items.length < 1 ? (
                    <Typography textAlign='center' color={grey[500]}>
                      No items in the cart
                    </Typography>
                  ) : null}
                </Box>
              ) : (
                <Stack
                  key='address'
                  height={1}
                  width={1}
                  justifyContent='center'
                  alignItems='center'
                  component={motion.div}
                  initial={{
                    x: '100%',
                    opacity: 0.5,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      type: 'keyframes',
                    },
                  }}
                  exit={{
                    x: '100%',
                    opacity: 0,
                  }}
                >
                  <TextField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    label='Address'
                  />
                </Stack>
              )}
            </AnimatePresence>
          </Box>

          {items.length > 0 ? (
            <Stack width={1}>
              <Stack p={2} justifyContent='space-between' direction='row'>
                <Typography>Total: </Typography>
                <Typography fontWeight={600}>
                  {calculateTotalAmount().toLocaleString()} MMK
                </Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between' p={2}>
                {checkOutStatus === 'preview' ? (
                  <>
                    <Button disabled>Back</Button>
                    <Button
                      onClick={() => {
                        if (items.length > 0) {
                          setCheckoutStatus('address');
                        }
                      }}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setCheckoutStatus('preview')}>
                      Back
                    </Button>
                    <LoadingButton
                      onClick={() => checkOut({ address })}
                      loading={mutation.isLoading}
                      disabled={!!!address}
                    >
                      Checkout
                    </LoadingButton>
                  </>
                )}
              </Stack>
            </Stack>
          ) : null}
        </Box>
      </Drawer>
    </>
  );
};
