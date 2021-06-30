import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, ListItem } from '../types';

async function fetcher(url: string, encodedContext: string) {
    const res = await fetch(`${url}?context=${encodedContext}`);

    // If the status code is not in the range 200-299, throw an error
    if (!res.ok) {
        const { message } = await res.json();
        const error: ErrorProps = new Error(message || 'An error occurred while fetching the data.');
        error.status = res.status; // e.g. 500
        throw error;
    }

    return res.json();
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    const encodedContext = useSession()?.context;
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(encodedContext ? ['/api/products', encodedContext] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function useProductList() {
    const encodedContext = useSession()?.context;
    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(encodedContext ? ['/api/products/list', encodedContext] : null, fetcher);

    return {
        list: data,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function useProductInfo(pid: number, list: ListItem[]) {
    const encodedContext = useSession()?.context;
    const product = list.find(item => item.id === pid);
    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product && encodedContext ? [`/api/products/${pid}`, encodedContext] : null, fetcher);

    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        error,
    };
}
