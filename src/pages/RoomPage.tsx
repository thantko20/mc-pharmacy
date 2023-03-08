import { SectionContainer } from '@/components/SectionContainer';
import { useLocation, useParams } from 'react-router-dom';
import { TUser } from '@/features/auth/types';
import { Room } from '@/features/calls/components/Room';
import { MyPage } from '@/components/MyPage';

const RoomPage = () => {
  const location = useLocation();
  const { roomName } = useParams();

  const { token, otherParticipant, isMeCaller } = location.state as {
    token: string;
    otherParticipant: TUser;
    isMeCaller?: boolean;
  };

  if (!roomName || !token || !otherParticipant) {
    return <div>Invalid Blah blah</div>;
  }

  return (
    <MyPage>
      <SectionContainer>
        <Room
          roomName={roomName}
          token={token}
          otherParticipant={otherParticipant}
          isMeCaller={isMeCaller}
        />
      </SectionContainer>
    </MyPage>
  );
};

export default RoomPage;
