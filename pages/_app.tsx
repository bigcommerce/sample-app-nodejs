import { Box, GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Header from '../components/header';
import { bigCommerceSDK } from '../scripts/bcSdk';

const MyApp = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
        bigCommerceSDK();
    }, []); // Run once during mounting

    return (
        <>
            <GlobalStyles />
            <Box marginHorizontal="xxxLarge" marginVertical="xxLarge">
                <Header />
                <Component {...pageProps} />
            </Box>
        </>
    );
};

export default MyApp;
