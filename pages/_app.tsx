import { Box, GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import { SessionContext } from '../context/session';
import { bigCommerceSDK } from '../scripts/bcSdk';

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [context, setContext] = useState('');
    const router = useRouter();
    const { query: { context: routeContext } } = router;
    const value = { context, setContext };

    useEffect(() => {
        if (routeContext) {
            setContext(String(routeContext));
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(routeContext);
        }
    }, [routeContext, setContext]);

    return (
        <>
            <GlobalStyles />
            <Box marginHorizontal="xxxLarge" marginVertical="xxLarge">
                <Header />
                <SessionContext.Provider value={value}>
                    <Component {...pageProps} />
                </SessionContext.Provider>
            </Box>
        </>
    );
};

export default MyApp;
