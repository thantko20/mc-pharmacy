import { MyPage } from '@/components/MyPage';
import { SectionContainer } from '@/components/SectionContainer';
import { OrderHistory } from '@/features/orders/components/OrderHistroy';
import { Typography } from '@mui/material';

export default function OrdersPage() {
  return (
    <MyPage>
      <SectionContainer>
        <Typography variant='h4' component='h2' gutterBottom>
          Orders
        </Typography>
        <OrderHistory />
      </SectionContainer>
    </MyPage>
  );
}
