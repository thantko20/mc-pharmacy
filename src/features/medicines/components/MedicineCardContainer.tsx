import { useState } from 'react';
import { Grid, Pagination, Skeleton, Stack } from '@mui/material';
import { MedicineCard } from './MedicineCard';
import { useGetMedicines } from '../api/getMedicines';

export const MedicineCardContainer = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading } = useGetMedicines({ limit, page });

  return (
    <Stack alignItems='center' spacing={4}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {isLoading ? (
          <>
            <Grid item xs={4} sm={4} md={4}>
              <Skeleton variant='rounded' width='100%' height={200} />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Skeleton variant='rounded' width='100%' height={200} />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <Skeleton variant='rounded' width='100%' height={200} />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
              <Skeleton variant='rounded' width='100%' height={200} />
            </Grid>
          </>
        ) : (
          data?.payload.map((item) => (
            <Grid item key={item.id} xs={4} sm={4} md={4}>
              <MedicineCard medicine={item} />
            </Grid>
          ))
        )}
      </Grid>

      {data ? (
        <Pagination
          count={Math.ceil(data!.total / limit)}
          shape='rounded'
          color='standard'
          variant='text'
          size='large'
          onChange={(_, page) => {
            setPage(page);
          }}
          page={page}
        />
      ) : null}
    </Stack>
  );
};
