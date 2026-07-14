import { Box, GlobalStyles } from '@bigcommerce/big-design'
import { theme as defaultTheme } from '@bigcommerce/big-design-theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import Header from '../components/header'
import { AlertsProvider } from '../context/alerts'
import SessionProvider from '../context/session'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <AlertsProvider>
        <Box
          marginHorizontal={{ mobile: 'none', tablet: 'xxxLarge' }}
          marginVertical={{ mobile: 'none', tablet: 'xxLarge' }}
        >
          <Header />
          <SessionProvider>
            <Component {...pageProps} />
          </SessionProvider>
        </Box>
      </AlertsProvider>
    </ThemeProvider>
  )
}

export default MyApp
