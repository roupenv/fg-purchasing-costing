// Provider hook that creates auth object and handles state
import { useState, useEffect } from 'react';
import useLocationHistory from './useLocationHistory';
import jwtDecode from 'jwt-decode';

interface IUserContext {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
}

interface ILogin {
  email: string;
  password: string;
}

const token = localStorage.getItem('token');
const authorization = 'Bearer ' + token;

let userDecoded: IUserContext | null;
if (token) {
  userDecoded = jwtDecode<IUserContext>(token); // Returns with the JwtPayload type
}

export default function useProviderAuth() {
  const [user, setUser] = useState<IUserContext | null>(userDecoded);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const { history } = useLocationHistory();

  useEffect(() => {
    const authorize = async () => {
      //If token does not exist, redirect to login page
      if (!token) {
        console.log('No Token')
        setUser(null);
        history.push('/login');
        return;
      }
      //If token does exist, check if still valid
      else {
        console.log('Token Present, checking if valid');
        try {
          const authRequest = await fetch('/api/login/check-token', {
            method: 'POST',
            headers: {
              Authorization: authorization,
            },
          });
          const response = await authRequest.json();
          if (response.status === 'authorized') {
            console.log('User Authorized');
            const userDecoded = jwtDecode<IUserContext>(token); // Returns with the JwtPayload type
            setUser(userDecoded);
          } else {
            console.log('User Unauthorized');
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error: any) {
          console.log(error);
        }
      }
    };

    // On App Reload, display backdrop while validating token in server, H
    //If token is valid display App, else redirect to Login Page
    (async () => {
      setIsAuthenticating(true);
      await authorize();
      setIsAuthenticating(false);      
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (payload: ILogin) => {
    const sendCredentials = async (payload: ILogin) => {
      const sendData = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const response = await sendData.json();
      if (sendData.status === 401) {
      } else if (!sendData.ok) {
        throw new Error(response.message);
      }
      return response;
    };

    const loginResponse = await sendCredentials(payload);
    if (loginResponse.message === 'User Authenticated') {
      setAccessToken(loginResponse.token);
      localStorage.setItem('token', loginResponse.token);
      setUser(loginResponse.userInfo);
      return 'success';
    } else if (loginResponse.message === 'Unauthorized') {
      console.log('yee');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    accessToken,
    isAuthenticating,
    login,
    logout,
  };
}
