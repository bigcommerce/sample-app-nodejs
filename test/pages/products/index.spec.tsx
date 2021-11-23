import { ROW_NUMBERS } from '@mocks/hooks';
import Products from '@pages/products/index';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));

describe('Product List', () => {
    test('renders correctly', async () => {
        const { container } = render(<Products />);
        // Wait for table to be rendered
        await screen.findByRole('table');

        expect(container.firstChild).toMatchSnapshot();
    });

    test('renders a table with correct number of rows', async () => {
        render(<Products />);
        // Wait for table to be rendered
        const productsTable = await screen.findByRole('table');
        const rowsLength = screen.getAllByRole('row').length - 1; // Rows - 1 (table header)

        expect(productsTable).toBeDefined();
        expect(rowsLength).toEqual(ROW_NUMBERS);
    });
});
