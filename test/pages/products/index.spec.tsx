import { useRouter } from "next/router";
import { ROW_NUMBERS } from '@mocks/hooks';
import Products from '@pages/products/index';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Product List', () => {
    test('renders correctly', async () => {
        const router = { };
        useRouter.mockReturnValue(router);

        const { container } = render(<Products />);
        // Wait for table to be rendered
        await screen.findByRole('table');

        expect(container.firstChild).toMatchSnapshot();
    });

    test('renders a table with correct number of rows', async () => {
        const router = { };
        useRouter.mockReturnValue(router);

        render(<Products />);
        // Wait for table to be rendered
        const productsTable = await screen.findByRole('table');
        const rowsLength = screen.getAllByRole('row').length - 1; // Rows - 1 (table header)

        expect(productsTable).toBeDefined();
        expect(rowsLength).toEqual(ROW_NUMBERS);
    });
});
