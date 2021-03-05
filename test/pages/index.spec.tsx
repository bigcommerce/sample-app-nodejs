import Index from '@pages/index';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));

describe('Homepage', () => {
    test('renders correctly', () => {
        const { container } = render(<Index />);
        const heading = screen.getByRole('heading', { level: 2 });

        expect(container.firstChild).toMatchSnapshot();
        expect(heading).toBeInTheDocument();
    });
});
