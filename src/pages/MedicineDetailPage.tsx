import { SectionContainer } from '@/components/SectionContainer';
import { useGetMedicineDetail } from '@/features/medicines/api/getMedicineDetail';
import { useCart } from '@/features/orders/components/CartProvider';
import { useAddToCartQuantity } from '@/hooks/useAddToCartQuantity';
import { Add, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export default function MedicineDetailPage() {
  const { medicineId } = useParams();

  if (!medicineId) {
    return <p>Need medicine id</p>;
  }

  const { data, isLoading } = useGetMedicineDetail({ id: medicineId });
  const { addToCart } = useCart();
  const { quantity, increaseQuantity, decreaseQuantity } = useAddToCartQuantity(
    { upperBound: data?.payload.stocks },
  );

  return (
    <SectionContainer>
      {isLoading ? (
        <>
          <Skeleton width='100%' height={400} variant='rectangular' />
          <Skeleton
            width='80%'
            height={20}
            variant='rectangular'
            sx={{
              marginTop: '1em',
            }}
          />
          <Skeleton
            width='100%'
            height={20}
            variant='rectangular'
            sx={{
              marginTop: '1em',
            }}
          />
        </>
      ) : data ? (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Paper elevation={3}>
            <img
              src={data?.payload.pictureUrls[0]}
              alt={data?.payload.name}
              style={{
                aspectRatio: 1,
                width: '100%',
                maxWidth: '400px',
              }}
            />
          </Paper>
          <Box>
            <Typography variant='h3'>{data?.payload.name}</Typography>
            <Typography fontSize='1.75rem' gutterBottom>
              {data?.payload.price.toLocaleString()} MMK
            </Typography>
            <Typography variant='body1'>{data?.payload.details}</Typography>
            <Stack mt={4} spacing={2} alignItems='flex-start'>
              <Stack direction='row' spacing={2} alignItems='center'>
                <IconButton onClick={decreaseQuantity}>
                  <Remove />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton onClick={increaseQuantity}>
                  <Add />
                </IconButton>
              </Stack>
              <Button
                variant='contained'
                onClick={() => addToCart({ ...data.payload, quantity })}
              >
                Add To Cart
              </Button>
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </SectionContainer>
  );
}
