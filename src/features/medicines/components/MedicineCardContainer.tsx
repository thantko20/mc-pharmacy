import { useState } from 'react';
import { Box, Grid, Pagination, Skeleton, Stack } from '@mui/material';
import { MedicineCard } from './MedicineCard';
import { useGetMedicines } from '../api/getMedicines';
import usePagination from '@mui/material/usePagination/usePagination';

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
        {data?.payload.map((item) => (
          <Grid item key={item.id} xs={4} sm={4} md={4}>
            <MedicineCard medicine={item} />
          </Grid>
        ))}
      </Grid>

      {data ? (
        <Pagination
          count={Math.round(data!.total / limit)}
          shape='rounded'
          color='primary'
          variant='outlined'
          size='large'
          onChange={(e, page) => {
            console.log(page);
            setPage(page);
          }}
          page={page}
        />
      ) : null}
    </Stack>
  );
};
