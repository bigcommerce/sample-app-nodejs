import useSWR from 'swr';

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
