import { createContext, useContext, useState } from 'react';
import { ContextValues } from '../types';

const SessionContext = createContext<Partial<ContextValues>>({});

const SessionProvider = ({ children }) => {
    const [storeHash, setStoreHash] = useState('');
    const value = { storeHash, setStoreHash };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
