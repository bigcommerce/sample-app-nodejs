import { Button, Flex, H1, Panel, StatefulTable, Text } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';

import ErrorMessage from '../../../components/error';
import Loading from '../../../components/loading';
import { useShippingAndProductsInfo } from '../../../lib/hooks';
import { BillingAddress, OrderProduct, ShippingAndProductsInfo } from '../../../types';

const InternalOrderPage = (order: ShippingAndProductsInfo) => {
    const { shipping_addresses = [], products = [] } = order
    const items = shipping_addresses.map(address => {
        const addressProducts = products.filter(({ order_address_id }) => order_address_id === address.id);

        return { address, addressProducts }
    });

    const Address = (address: BillingAddress) => (
        <>
            <Text margin='none'>{address.first_name} {address.last_name}</Text>
            <Text margin='none'>{address.street_1} {address.street_2}</Text>
            <Text margin='none'>{address.city}, {address.state} {address.zip}</Text>
        </>
    );

    const renderOrderProducts = (addressProducts: OrderProduct[]) => (
        <>
            {addressProducts.map(product => <Text key={product.id}>{product.name}</Text>)}
        </>
    );

    const renderOrderProductsQuantities = (addressProducts: OrderProduct[]) => (
        <>
            {addressProducts.map(product => <Text key={product.id}>{product.quantity}</Text>)}
        </>
    );

    return (
        <>
            <Flex justifyContent="space-between" marginBottom="medium">
                <H1>Order details</H1>
                <Button>Create shipment</Button>
            </Flex>
            <Panel>
                <StatefulTable
                    columns={[
                        { header: 'Ship to', hash: 'address', render: ({ address }) => <Address {...address} /> },
                        {
                            header: 'Products',
                            hash: 'addressProducts',
                            render: ({ addressProducts }) => renderOrderProducts(addressProducts),
                        },
                        {
                            header: 'Quantity',
                            hash: 'quantity',
                            render: ({ addressProducts }) => renderOrderProductsQuantities(addressProducts),
                        },
                    ]}
                    items={items}
                /> 
            </Panel>
        </>
    );
};

const OrderPage = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const { isLoading, order, error }= useShippingAndProductsInfo(parseInt(`${orderId}`, 10));

    if (isLoading) return <Loading />;

    if (error) return <ErrorMessage error={error} />;

    return <InternalOrderPage {...order} />;
};

export default OrderPage;
