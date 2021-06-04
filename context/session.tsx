import { createContext, useContext, useState } from 'react';

const SessionContext = createContext({});

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
