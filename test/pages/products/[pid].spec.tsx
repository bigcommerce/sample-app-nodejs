import { useRouter } from "next/router";
import ProductInfo from '@pages/products/[pid]';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Product Info Form', () => {
    const router = { query: { pid: '1' } };
    useRouter.mockReturnValue(router);

    test('renders correctly', async () => {
        const { container } = render(<ProductInfo />);
        // Wait to render
        await screen.findAllByRole('heading');

        const headings = screen.getAllByRole('heading', { level: 2 });
        const panelOne = headings[0];
        const panelTwo = headings[1];

        expect(container.firstChild).toMatchSnapshot();
        expect(panelOne).toBeInTheDocument();
        expect(panelTwo).toBeInTheDocument();
    });
});
