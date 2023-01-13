import { useRouter } from "next/router";
import ProductAppExtension from "@pages/productAppExtension/[productId]"; 
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('ProductAppExtension', () => {
    const router = { query: { pid: '1' } };
    useRouter.mockReturnValue(router);

    test('renders correctly', () => {
        const { container } = render(<ProductAppExtension />);
        const panelOneHeader = screen.getByText("Basic Information");

        expect(container.firstChild).toMatchSnapshot();
        expect(panelOneHeader).toBeInTheDocument();
    });
});
