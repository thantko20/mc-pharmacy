import { TUser } from '@/features/auth/types';
import { getTokenAndRoomName } from '@/features/calls/api/getTokenAndRoomName';
import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
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
    <Stack direction='row' spacing={4}>
      <Typography>{user.name}</Typography>
      <LoadingButton
        loading={isCalling}
        onClick={() => call(user)}
        variant='outlined'
      >
        Call
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
    <div>
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
