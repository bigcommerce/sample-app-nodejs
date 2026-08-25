import { useParams, useRouter } from "next/navigation";
import ProductInfo from '@app/products/[pid]/page';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

describe('Product Info Form', () => {
    jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as any);
    jest.mocked(useParams).mockReturnValue({ pid: '1' });

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
