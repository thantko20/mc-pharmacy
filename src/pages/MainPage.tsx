import { useEffect } from 'react';
import { SectionContainer } from '../components/SectionContainer';
import { useGetMedicines } from '@/features/medicines/api/getMedicines';
import { MedicineCardContainer } from '@/features/medicines/components/MedicineCardContainer';

export default function MainPage() {
  return (
    <SectionContainer>
      <MedicineCardContainer />
    </SectionContainer>
  );
}
