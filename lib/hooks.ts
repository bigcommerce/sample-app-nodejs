import useSWR from 'swr';
import { useSession } from '../context/session';

function fetcher(url: string, storeHash: string) {
    return fetch(`${url}?context=${storeHash}`).then(res => res.json());
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    const storeHash = useSession()?.storeHash;
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(storeHash ? ['/api/products', storeHash] : null, fetcher);

    return {
        summary: data,
        isError: error,
    };
}
