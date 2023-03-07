import { SectionContainer } from '@/components/SectionContainer';
import { TUser } from '@/features/auth/types';
import { getTokenAndRoomName } from '@/features/calls/api/getTokenAndRoomName';
import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { PhoneInTalk } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserListItem = ({ user }: { user: TUser }) => {
  const [isCalling, setIsCalling] = useState(false);
  const navigate = useNavigate();

  const call = async (user: TUser) => {
    try {
      setIsCalling(true);
      const { payload } = await getTokenAndRoomName();

      navigate(`/rooms/${payload.roomName}`, {
        state: {
          token: payload.token,
          otherParticipant: user,
          isMeCaller: true,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsCalling(true);
    }
  };

  return (
    <Stack
      direction='row'
      spacing={4}
      justifyContent='space-between'
      bgcolor={grey[800]}
      p={1}
      borderRadius='0.25rem'
      alignItems='center'
    >
      <Typography fontWeight={600}>{user.name}</Typography>
      <LoadingButton
        loading={isCalling}
        onClick={() => call(user)}
        variant='contained'
        aria-label='call'
      >
        <PhoneInTalk />
      </LoadingButton>
    </Stack>
  );
};

export default function TestPage() {
  const [users, setUsers] = useState<TUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await axios.get<never, TSuccessResponse<TUser[]>>('/users');

      setUsers(data.payload);
    };

    fetchUsers();
  }, []);

  return (
    <SectionContainer>
      <Container maxWidth='sm'>
        <Stack direction='column' spacing={2}>
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </Stack>
      </Container>
    </SectionContainer>
  );
}
