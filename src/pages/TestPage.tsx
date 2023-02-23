import { TUser } from '@/features/auth/types';
import { axios } from '@/lib/axios';
import { TSuccessResponse } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const navigate = useNavigate();

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
        <div key={user._id}>
          {user.name}{' '}
          <button onClick={() => navigate(`/room/${user._id}`)}>Call</button>
        </div>
      ))}
    </div>
  );
}
