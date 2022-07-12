import { Button, Dropdown, Panel, Small, StatefulTable, Link as StyledLink } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useProductList } from '../../lib/hooks';

const Products = () => {
    const router = useRouter();
    const { isError, isLoading, list = [] } = useProductList();
    const tableItems = list.map(({ id, inventory_level: stock, name, price }) => ({
        id,
        name,
        price,
        stock,
    }));

    const renderName = (id: number, name: string): ReactElement => (
        <Link href={`/products/${id}`}>
            <StyledLink>{name}</StyledLink>
        </Link>
    );

    const renderPrice = (price: number): string => (
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    );

    const renderStock = (stock: number): ReactElement => (stock > 0
        ? <Small>{stock}</Small>
        : <Small bold marginBottom="none" color="danger">0</Small>
    );

    const renderAction = (id: number): ReactElement => (
        <Dropdown
            items={[ { content: 'Edit product', onItemClick: () => router.push(`/products/${id}`), hash: 'edit' } ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    if (isLoading) return <Loading />;
    if (isError) return <ErrorMessage />;

    return (
        <Panel id="products">
            <StatefulTable
                columns={[
                    { header: 'Product name', hash: 'name', render: ({ id, name }) => renderName(id, name), sortKey: 'name' },
                    { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), sortKey: 'stock' },
                    { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), sortKey: 'price' },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id), sortKey: 'id' },
                ]}
                items={tableItems}
                itemName="Products"
                stickyHeader
            />
        </Panel>
    );
};

export default Products;
