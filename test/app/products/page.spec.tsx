import { useRouter } from "next/navigation";
import Products from '@app/products/page';
import { ROW_NUMBERS } from '@mocks/hooks';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Product List', () => {
    test('renders correctly', async () => {
        jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as any);

        const { container } = render(<Products />);
        // Wait for table to be rendered
        await screen.findByRole('table');

        expect(container.firstChild).toMatchSnapshot();
    });

    test('renders a table with correct number of rows', async () => {
        jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as any);

        render(<Products />);
        // Wait for table to be rendered
        const productsTable = await screen.findByRole('table');
        const rowsLength = screen.getAllByRole('row').length - 1; // Rows - 1 (table header)

        expect(productsTable).toBeDefined();
        expect(rowsLength).toEqual(ROW_NUMBERS);
    });
});
