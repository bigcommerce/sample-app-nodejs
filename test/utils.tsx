import { theme } from '@bigcommerce/big-design-theme';
import { render as defaultRender, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

const Provider = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

const customRender = (ui: ReactElement, options: RenderOptions = {}) => (
  defaultRender(ui, { wrapper: Provider, ...options })
);

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
