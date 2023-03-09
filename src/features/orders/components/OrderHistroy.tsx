import {
  Chip,
  CircularProgress,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { useGetAllOrders } from '../api/getAllOrders';
import { useState } from 'react';
import { TOrderStatus } from '../types';
export const OrderHistory = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetAllOrders({ page: page + 1 });
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 800,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ width: 100, fontWeight: 'bold' }}
                  align='center'
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ width: 100, fontWeight: 'bold' }}
                  align='center'
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ width: 180, fontWeight: 'bold' }}
                  align='center'
                >
                  Total Amount (MMK)
                </TableCell>
                <TableCell
                  sx={{ width: 300, fontWeight: 'bold' }}
                  align='center'
                >
                  Ordered At
                </TableCell>
                <TableCell sx={{ width: 200, fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.payload.length > 0
                ? data.payload.map((order) => {
                    const statusColorsMap: Record<
                      TOrderStatus,
                      'default' | 'info' | 'primary' | 'error'
                    > = {
                      pending: 'default',
                      deliver: 'info',
                      complete: 'primary',
                      cancel: 'error',
                    } as const;

                    return (
                      <TableRow key={order._id}>
                        <TableCell align='center'>{order.id}</TableCell>
                        <TableCell align='center'>
                          <Chip
                            label={order.status}
                            color={statusColorsMap[order.status]}
                            variant='outlined'
                          />
                        </TableCell>
                        <TableCell align='right'>{order.totalPrice}</TableCell>
                        <TableCell align='center'>
                          {format(new Date(order.createdAt), 'PPpp')}
                        </TableCell>
                        <TableCell>
                          <Link
                            component={RouterLink}
                            to={`/orders/${order._id}`}
                          >
                            See the details
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[12]}
                  rowsPerPage={12}
                  onPageChange={(_, changedPage) => setPage(changedPage)}
                  count={data?.total || 0}
                  ActionsComponent={TablePaginationActions}
                  page={page}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
