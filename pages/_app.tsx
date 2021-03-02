import { Box, GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';
import Header from '../components/header';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <>
        <GlobalStyles />
        <Box marginHorizontal="xxxLarge" marginVertical="xxLarge">
            <Header />
            <Component {...pageProps} />
        </Box>
    </>
);

export default MyApp;
