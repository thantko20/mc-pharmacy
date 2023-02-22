import { ReactNode, createContext, useEffect, useState } from 'react';
import { TUser } from '../types';
import { TSuccessResponse } from '@/types';
import { MyStorage } from '@/utils/MyStorage';

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
        const res = await fetch(
          'https://pharmacy-delivery.onrender.com/api/users/me/info',
        );

        if (!res.ok && res.status === 401) {
          setUser(null);
          return;
        }

        const data = (await res.json()) as TSuccessResponse<TUser>;

        setUser(data.payload);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUser();
  }, []);

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
