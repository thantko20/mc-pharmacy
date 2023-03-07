import { SectionContainer } from '@/components/SectionContainer';
import { useGetMedicineDetail } from '@/features/medicines/api/getMedicineDetail';
import { useCart } from '@/features/orders/components/CartProvider';
import { useAddToCartQuantity } from '@/hooks/useAddToCartQuantity';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Image from 'mui-image';
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
          <Paper
            elevation={3}
            sx={{
              width: 1,
              height: 1,
              maxWidth: 500,
              maxHeight: 500,
              alignSelf: 'center',
              borderRadius: '0.25rem',
            }}
          >
            <Image
              src={data.payload.pictureUrls[0]}
              alt={data.payload.name}
              duration={300}
            />
          </Paper>
          <Box>
            <Typography variant='h3' fontWeight={600}>
              {data?.payload.name}
            </Typography>
            <Typography gutterBottom fontSize='1.5rem'>
              {data?.payload.price.toLocaleString()} MMK
            </Typography>
            <Typography variant='body1' mt={2} color={grey[600]}>
              {data?.payload.details}
            </Typography>
            <Button
              variant='contained'
              onClick={() => addToCart(data.payload)}
              sx={{
                marginTop: '1rem',
              }}
            >
              Add To Cart
            </Button>
          </Box>
        </Stack>
      ) : null}
    </SectionContainer>
  );
}
