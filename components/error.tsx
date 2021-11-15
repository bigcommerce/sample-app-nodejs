import { H3, Panel } from '@bigcommerce/big-design';
import { ErrorMessageProps, ErrorProps } from '../types';

const ErrorContent = ({ message }: Pick<ErrorProps, 'message'>) => (
    <>
        <H3>Failed to load</H3>
        {message}
    </>
)

const ErrorMessage = ({ error, renderPanel = true }: ErrorMessageProps) => {
    if (renderPanel) {
        return (
            <Panel>
                <ErrorContent message={error.message} />
            </Panel>
        )
    }

    return <ErrorContent message={error.message} />
};

export default ErrorMessage;
