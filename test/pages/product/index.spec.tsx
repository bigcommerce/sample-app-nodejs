import { useRouter } from "next/router";
import SidePanel from "@pages/product/[productId]"; 
import { render, screen} from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('SidePanel', () => {
    const router = { query: { pid: '1' } };
    useRouter.mockReturnValue(router);

    test('renders correctly', async () => {
        const { container } = render(<SidePanel />);
        // Wait for table to be rendered
        screen.getByText('Basic Information');

        expect(container.firstChild).toMatchSnapshot();
    });
});

