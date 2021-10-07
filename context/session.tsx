import { createContext, useContext } from 'react';
import { ContextValues } from '../types';

export const SessionContext = createContext<Partial<ContextValues>>({});

export const useSession = () => useContext(SessionContext);
