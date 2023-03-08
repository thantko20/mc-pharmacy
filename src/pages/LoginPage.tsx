import { MyPage } from '@/components/MyPage';
import { SectionContainer } from '@/components/SectionContainer';
import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <MyPage>
      <SectionContainer>
        <LoginForm />
      </SectionContainer>
    </MyPage>
  );
}
