import useSWR from 'swr';

function fetcher(url: string) {
    return fetch(url).then(res => res.json());
}

export function useStore() {
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
