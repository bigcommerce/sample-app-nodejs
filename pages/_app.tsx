import { GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <>
        <GlobalStyles />
        <Component {...pageProps} />
    </>
);

export default MyApp;
