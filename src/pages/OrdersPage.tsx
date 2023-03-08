import { MyPage } from '@/components/MyPage';
import { SectionContainer } from '@/components/SectionContainer';
import { useGetAllOrders } from '@/features/orders/api/getAllOrders';

export default function OrdersPage() {
  const { data } = useGetAllOrders();
  return (
    <MyPage>
      <SectionContainer>
        {data?.payload.map((order) => (
          <li key={order._id}>{order._id}</li>
        ))}
      </SectionContainer>
    </MyPage>
  );
}
