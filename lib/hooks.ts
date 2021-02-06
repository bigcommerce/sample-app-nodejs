import useSWR from 'swr';

function fetcher(url: string) {
    return fetch(url).then(res => res.json());
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useStore() {
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR('/api/store', fetcher);

    return {
        storeId: data?.storeId,
        isError: error,
    };
}

export function useProducts() {
    const { data, error } = useSWR('/api/products', fetcher);

    return {
        summary: data,
        isError: error,
    };
}
