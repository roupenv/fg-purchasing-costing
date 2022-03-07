import { createContext } from 'react';
import useResourceDetails from '../Hooks/useResourceDetails';

export const ResourceDetailsContext = createContext<ReturnType<typeof useResourceDetails> | null>(null);
