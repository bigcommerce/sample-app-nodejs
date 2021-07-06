import { Box, GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../components/header';
import SessionProvider from '../context/session';
import { bigCommerceSDK } from '../scripts/bcSdk';

const MyApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const { query: { context } } = router;

    useEffect(() => {
        // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
        if (context) bigCommerceSDK(context);
    }, [context]);

    return (
        <>
            <GlobalStyles />
            <Box marginHorizontal="xxxLarge" marginVertical="xxLarge">
                <Header />
                <SessionProvider>
                    <Component {...pageProps} />
                </SessionProvider>
            </Box>
        </>
    );
};

export default MyApp;
