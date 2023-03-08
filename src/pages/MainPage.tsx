import { SectionContainer } from '../components/SectionContainer';
import { MedicineCardContainer } from '@/features/medicines/components/MedicineCardContainer';
import { MyPage } from '@/components/MyPage';

export default function MainPage() {
  return (
    <MyPage>
      <SectionContainer>
        <MedicineCardContainer />
      </SectionContainer>
    </MyPage>
  );
}
