import { useParams } from "next/navigation";
import ProductAppExtension from "@app/productAppExtension/[productId]/page";
import { render, screen } from '@test/utils';

jest.mock('@lib/hooks', () => require('@mocks/hooks'));
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}));

describe('ProductAppExtension', () => {
    jest.mocked(useParams).mockReturnValue({ productId: '1' });

    test('renders correctly', () => {
        const { container } = render(<ProductAppExtension />);
        const panelOneHeader = screen.getByText("Basic Information");

        expect(container.firstChild).toMatchSnapshot();
        expect(panelOneHeader).toBeInTheDocument();
    });
});
