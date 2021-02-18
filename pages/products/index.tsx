import { Button, Dropdown, Panel, Small, StatefulTable, Link as StyledLink } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useProductList } from '../../lib/hooks';

const Products = () => {
    const { list = [] } = useProductList();
    const tableItems = list.map(({ id, inventory_level: stock, name, price }) => ({
        id,
        name,
        price,
        stock,
    }));

    const renderName = (name: string): ReactElement => (
        <Link href="#">
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

    const renderAction = (): ReactElement => (
        <Dropdown
            items={[ { content: 'Edit product', onItemClick: (item) => item, hash: 'edit' } ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    return (
        <Panel>
            <StatefulTable
                columns={[
                    { header: 'Product name', hash: 'name', render: ({ name }) => renderName(name), sortKey: 'name' },
                    { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), sortKey: 'stock' },
                    { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), sortKey: 'price' },
                    { header: 'Action', hideHeader: true, hash: 'id', render: () => renderAction() },
                ]}
                items={tableItems}
                itemName="Products"
                stickyHeader
            />
        </Panel>
    );
};

export default Products;
