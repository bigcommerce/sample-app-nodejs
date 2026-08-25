'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';

const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    const searchParams = useSearchParams();
    const context = searchParams.get('context') ?? '';

    useEffect(() => {
        if (context) {
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(context);
        }
    }, [context]);

    return (
        <SessionContext.Provider value={{ context }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
