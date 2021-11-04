import { Box, GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import SessionProvider from '../context/session';

const MyApp = ({ Component, pageProps }: AppProps) => {
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
