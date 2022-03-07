// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().

import { createContext } from 'react';
import useProviderAuth from './useProviderAuth';

interface IAuthProvider {
  children: JSX.Element | JSX.Element[];
}

export const UserContext = createContext<ReturnType<typeof useProviderAuth> | null>(null);

export default function AuthProvider({ children }: IAuthProvider) {
  const auth = useProviderAuth();

  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
}
