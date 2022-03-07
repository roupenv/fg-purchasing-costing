// https://usehooks-ts.com/react-hook/use-fetch
import { useEffect, useReducer, useRef } from 'react';
import useAuth from './useAuth';

const authorizationToken = 'Bearer ' + localStorage.getItem('token');
interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> = { type: 'loading' } | { type: 'fetched'; payload: T } | { type: 'error'; payload: Error };

export default function useFetchApi<T = unknown>(
  url?: string,
  useAuthorization: string | boolean = false,
  options?: RequestInit,
  initialData?: T
): State<T> {
  const auth = useAuth();
  const accessToken = auth?.accessToken;

  const cache = useRef<Cache<T>>({});

  const initialState: State<T> = {
    error: undefined,
    data: initialData,
    loading: true,
  };

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState, loading: true };
      case 'fetched':
        return { ...initialState, loading: false, data: action.payload };
      case 'error':
        return { ...initialState, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;

    const fetchData = async () => {
      dispatch({ type: 'loading' });

      // If a cache exists for this url, return it
      if (cache.current[url]) {
        console.log('using cached data');
        dispatch({ type: 'fetched', payload: cache.current[url] });
        return;
      }

      try {
        const headers = new Headers();

        //If authorization is boolean value use localStorage else use the provided string token
        // finally if neither is provided then don't add token to header

        if (useAuthorization === true) {
          if (accessToken) {
            console.log('using memory');
            headers.append('Authorization', 'Bearer ' + accessToken);
          } else {
            console.log('using localStorage');
            headers.append('Authorization', authorizationToken);
          }
        }

        const amendedOptions = { ...options, headers };

        const response = await fetch(url, amendedOptions);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as T;
        cache.current[url] = data;

        dispatch({ type: 'fetched', payload: data });
      } catch (error) {
        dispatch({ type: 'error', payload: error as Error });
      }
    };

    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return state;
}
