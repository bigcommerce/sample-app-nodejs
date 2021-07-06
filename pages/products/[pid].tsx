import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Form from '../../components/form';
import Loading from '../../components/loading';
import { useSession } from '../../context/session';
import { useProductInfo, useProductList } from '../../lib/hooks';
import { FormData } from '../../types';

const ProductInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const pid = Number(router.query?.pid);
    const { error, isLoading, list = [], mutateList } = useProductList();
    const { isLoading: isInfoLoading, product } = useProductInfo(pid, list);
    const { description, is_visible: isVisible, name, price, type } = product ?? {};
    const formData = { description, isVisible, name, price, type };

    const handleCancel = () => router.push('/products');

    const handleSubmit = async (data: FormData) => {
        try {
            const filteredList = list.filter(item => item.id !== pid);
            const { description, isVisible, name, price, type } = data;
            const apiFormattedData = { description, is_visible: isVisible, name, price, type };

            // Update local data immediately (reduce latency to user)
            mutateList([...filteredList, { ...product, ...data }], false);

            // Update product details
            await fetch(`/api/products/${pid}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiFormattedData),
            });

            // Refetch to validate local data
            mutateList();

            router.push('/products');
        } catch (error) {
            console.error('Error updating the product: ', error);
        }
    };

    if (isLoading || isInfoLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} />
    );
};

export default ProductInfo;
