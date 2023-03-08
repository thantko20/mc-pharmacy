import { MyPage } from '@/components/MyPage';
import { SectionContainer } from '@/components/SectionContainer';
import { useGetAllOrders } from '@/features/orders/api/getAllOrders';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
} from '@mui/material';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';

export default function OrdersPage() {
  const { data } = useGetAllOrders();
  return (
    <MyPage>
      <SectionContainer>
        <Typography variant='h4' component='h2'>
          Orders
        </Typography>
        {data ? (
          <TableContainer component={Paper}>
            <Table
              aria-label='Orders table'
              sx={{
                minWidth: 'max-content',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ordered At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.payload.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.totalPrice}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'PPpp')}
                    </TableCell>
                    <TableCell>
                      <Link component={RouterLink} to={`/orders/${order._id}`}>
                        See details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </SectionContainer>
    </MyPage>
  );
}
