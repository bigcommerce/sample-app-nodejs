import { H3, Panel } from '@bigcommerce/big-design';

interface ErrorMessageProps {
    error?: Error;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => (
    <Panel>
        <H3>Failed to load</H3>
        {error && error.message}
    </Panel>
);

export default ErrorMessage;
