'use client';

import { Box, GlobalStyles } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import Header from '../components/header';
import SessionProvider from '../context/session';

const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />
        <Box
            marginHorizontal={{ mobile: 'none', tablet: 'xxxLarge' }}
            marginVertical={{ mobile: 'none', tablet: "xxLarge" }}
        >
            <Header />
            <Suspense fallback={null}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </Suspense>
        </Box>
    </ThemeProvider>
);

export default Providers;
