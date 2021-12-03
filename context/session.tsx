import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    const { query } = useRouter();
    const [context, setContext] = useState('');

    useEffect(() => {
        if (query.context) {
            setContext(query.context.toString());
        }
    }, [query.context]);

    return (
        <SessionContext.Provider value={{ context }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
