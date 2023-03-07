import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TUser } from '../types';
import { TSuccessResponse } from '@/types';
import { MyStorage } from '@/utils/MyStorage';
import { socket } from '@/lib/socket-io';
import { axios } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type TAuthContext = {
  user: TUser | null;
  isCheckingAuth: boolean;
  loginFn: ({
    accessToken,
    user,
  }: {
    accessToken: string;
    user: TUser;
  }) => void;
  logoutFn: () => void;
};

type TCheckUserResponse = TSuccessResponse<TUser>;

const AuthContext = createContext<TAuthContext>({
  user: null,
  isCheckingAuth: true,
  loginFn: () => {},
  logoutFn: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsCheckingAuth(true);

        const data = await axios.get<never, TCheckUserResponse>(
          '/users/me/info',
        );

        setUser(data.payload);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.status === 401 && user) {
          toast.success('Please log in again.');
          setUser(null);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const loginFn = ({
    accessToken,
    user,
  }: {
    accessToken: string;
    user: TUser;
  }) => {
    setUser(user);
    MyStorage.setAccessToken(accessToken);
  };

  const logoutFn = () => {
    setUser(null);
    MyStorage.removeAccessToken();
  };

  return (
    <AuthContext.Provider value={{ user, isCheckingAuth, loginFn, logoutFn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
