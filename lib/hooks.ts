import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, ListItem, QueryParams } from '../types';

async function fetcher(url: string, query: string) {
    const res = await fetch(`${url}?${query}`);

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
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/products', params] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function useProductList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/products/list', params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function useProductInfo(pid: number, list: ListItem[]) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const product = list.find(item => item.id === pid);
    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product && context ? [`/api/products/${pid}`, params] : null, fetcher);

    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        error,
    };
}
