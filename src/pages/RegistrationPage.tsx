import { MyPage } from '@/components/MyPage';
import { SectionContainer } from '@/components/SectionContainer';
import { RegistrationForm } from '@/features/auth/components/RegistrationForm';

export default function RegistrationPage() {
  return (
    <MyPage>
      <SectionContainer>
        <RegistrationForm />
      </SectionContainer>
    </MyPage>
  );
}
