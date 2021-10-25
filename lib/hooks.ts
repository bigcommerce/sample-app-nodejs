import useSWR from 'swr';
import { useSession } from '../context/session';

function fetcher(url: string, context: string) {
    return fetch(`${url}?context=${context}`).then(res => res.json());
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    const { context } = useSession();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/products', context] : null, fetcher);

    return {
        summary: data,
        isError: error,
    };
}
