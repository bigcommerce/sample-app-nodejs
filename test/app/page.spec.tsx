import { useRouter } from "next/navigation";
import Index from '@app/page';
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Homepage', () => {
    jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as any);

    test('renders correctly', () => {
        const { container } = render(<Index />);
        const heading = screen.getByRole('heading', { level: 2 });

        expect(container.firstChild).toMatchSnapshot();
        expect(heading).toBeInTheDocument();
    });
});
