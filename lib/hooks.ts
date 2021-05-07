import useSWR from 'swr';
import { ListItem } from '../types';

function fetcher(url: string) {
    return fetch(url).then(res => res.json());
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR('/api/products', fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        isError: error,
    };
}

export function useProductList() {
    const { data, error, mutate: mutateList } = useSWR('/api/products/list', fetcher);

    return {
        list: data,
        isLoading: !data && !error,
        isError: error,
        mutateList,
    };
}

export function useProductInfo(pid: number, list: ListItem[]) {
    const product = list.find(item => item.id === pid);
    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product ? `/api/products/${pid}` : null, fetcher);

    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        isError: error,
    };
}
