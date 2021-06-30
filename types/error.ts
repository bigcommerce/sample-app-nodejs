export interface ErrorProps extends Error {
    status?: number;
}

export interface ErrorMessageProps {
    error?: ErrorProps;
}
