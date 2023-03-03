import { SectionContainer } from '@/components/SectionContainer';
import { useGetMedicineDetail } from '@/features/medicines/api/getMedicineDetail';
import { AspectRatio } from '@mui/joy';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function MedicineDetailPage() {
  const { medicineId } = useParams();

  if (!medicineId) {
    return <p>Need medicine id</p>;
  }

  const { data } = useGetMedicineDetail({ id: medicineId });

  return (
    <SectionContainer>
      {data ? (
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
            <Typography fontWeight={600}>
              {data?.payload.price.toLocaleString()}
            </Typography>
            <Button variant='contained'>Add To Cart</Button>
          </Box>
        </Stack>
      ) : null}
    </SectionContainer>
  );
}
