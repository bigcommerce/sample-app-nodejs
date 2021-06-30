import { H3, Panel } from '@bigcommerce/big-design';
import { ErrorMessageProps } from '../types';

const ErrorMessage = ({ error }: ErrorMessageProps) => (
    <Panel>
        <H3>Failed to load</H3>
        {error && error.message}
    </Panel>
);

export default ErrorMessage;
