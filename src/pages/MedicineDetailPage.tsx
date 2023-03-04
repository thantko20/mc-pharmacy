import { SectionContainer } from '@/components/SectionContainer';
import { useGetMedicineDetail } from '@/features/medicines/api/getMedicineDetail';
import { useCart } from '@/features/orders/components/CartProvider';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function MedicineDetailPage() {
  const { medicineId } = useParams();

  if (!medicineId) {
    return <p>Need medicine id</p>;
  }

  const { data, isLoading } = useGetMedicineDetail({ id: medicineId });
  const { addToCart } = useCart();

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
            <Typography variant='h4' gutterBottom>
              {data?.payload.name}
            </Typography>
            <Typography variant='body1'>{data?.payload.details}</Typography>
            <Stack mt={4} direction='row' alignItems='center' spacing={2}>
              <Typography fontWeight={600}>
                {data?.payload.price.toLocaleString()} MMK
              </Typography>
              <Button
                variant='contained'
                onClick={() => addToCart({ ...data.payload, quantity: 1 })}
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
