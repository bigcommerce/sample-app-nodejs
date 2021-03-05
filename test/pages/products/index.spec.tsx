import { ROW_NUMBERS } from '@mocks/hooks';
import Products from '@pages/products/index';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));

describe('Product List', () => {
    test('renders correctly', async () => {
        const { container } = render(<Products />);
        // Wait for table to be rendered
        await screen.findByRole('table');

        const rowsLength = screen.getAllByRole('row').length - 1; // Rows - 1 (table header)

        expect(container.firstChild).toMatchSnapshot();

        // Confirm table has been rendered with correct number of rows
        expect(screen.findByRole('table')).toBeDefined();
        expect(rowsLength).toEqual(ROW_NUMBERS);
    });
});
