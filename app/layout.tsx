import Providers from './providers';
import StyledComponentsRegistry from './registry';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body>
            <StyledComponentsRegistry>
                <Providers>{children}</Providers>
            </StyledComponentsRegistry>
        </body>
    </html>
);

export default RootLayout;
