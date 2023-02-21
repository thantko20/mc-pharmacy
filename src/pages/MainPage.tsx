import { useEffect } from 'react';
import { SectionContainer } from '../components/SectionContainer';
import { useGetMedicines } from '@/features/medicines/api/getMedicines';

export default function MainPage() {
  const { data } = useGetMedicines();

  useEffect(() => {
    if (data) console.log(data.payload);
  }, [data]);
  return (
    <SectionContainer>
      {data?.payload.map((medicine) => (
        <div>
          {medicine.name} <button>Add to Cart</button>
        </div>
      ))}
    </SectionContainer>
  );
}
