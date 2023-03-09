import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
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
import { useGetAllOrders } from '../api/getAllOrders';
import { useRef, useState } from 'react';
import { TOrderStatus } from '../types';
import { useDisclosure } from '@/hooks/useDisclosure';
import { MoreVert } from '@mui/icons-material';
import { useCancelOrder } from '../api/cancelOrder';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';

const OrderCancel = ({ orderId }: { orderId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelOrderMutation = useCancelOrder();

  const queryClient = useQueryClient();

  const cancelOrder = (id: string) => {
    cancelOrderMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Order cancelled.');
        queryClient.invalidateQueries({
          queryKey: 'orders',
        });
        onClose();
      },
    });
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Cancel this order</MenuItem>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>Are you sure about that?</DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={cancelOrderMutation.isLoading}>
            Cancel
          </Button>
          <LoadingButton
            loading={cancelOrderMutation.isLoading}
            onClick={() => cancelOrder(orderId)}
            color='error'
          >
            Proceed
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

const OrderActionMenu = ({
  orderId,
  canCancel,
}: {
  orderId: string;
  canCancel: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorEl = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton aria-label='actions button' ref={anchorEl} onClick={onOpen}>
        <MoreVert />
      </IconButton>
      <Menu open={isOpen} onClose={onClose} anchorEl={anchorEl.current}>
        <MenuList>
          <MenuItem>See Details</MenuItem>
          {canCancel ? <OrderCancel orderId={orderId} /> : null}
        </MenuList>
      </Menu>
    </>
  );
};

export const OrderHistory = () => {
  const [page, setPage] = useState(0);
  const filter = {
    page: page + 1,
  };
  const { data, isLoading } = useGetAllOrders(filter);
  const cancelOrderMutation = useCancelOrder();
  const queryClient = useQueryClient();

  const cancelOrder = (id: string) => {
    cancelOrderMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Order cancelled.');
        queryClient.invalidateQueries({
          queryKey: 'orders',
        });
      },
    });
  };

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
                          <OrderActionMenu
                            canCancel={order.status === 'pending'}
                            orderId={order._id}
                          />
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
