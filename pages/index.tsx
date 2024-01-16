import { Button, Dropdown, Panel, Small, Link as StyledLink, Table, TableSortDirection, Modal } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import ErrorMessage from '@components/error';
import Loading from '@components/loading';
import { useOrderList, useProductList } from '@lib/hooks';
import { TableItemOrder } from '@types';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import PackingSlip from '@components/PackingSlip';
import { BlobProvider } from '@react-pdf/renderer';
import PackingSlipPdf from '@components/PackingSlipPdf';

const Orders = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState('id');
    const [direction, setDirection] = useState<TableSortDirection>('DESC');
    const [modalOpen, setModalOpen] = useState(false);
    const [lastIndex, setLastIndex] = useState(0)
    const router = useRouter();
    const { error, isLoading, list = [], meta = {} } = useOrderList({
        status_id: String(11),
        page: String(currentPage),
        limit: String(itemsPerPage),
        include: String('consignments.line_items'),
        ...(columnHash && { sort: columnHash }),
        ...(columnHash && { direction: direction.toLowerCase() }),
    });
    const itemsPerPageOptions = [10, 20, 50, 100];

    console.log('list ::: ', list);

    const tableItems: TableItemOrder[] = list.map((order: any) => ({
        id: order.id,
        status: order.status,
        customerId: order.customer_id,
        order: order,
        customerName: order && order.customer && order.customer.name || "Customer does not exists",
        customerCode: order && order.customer && order.customer.code || "N/A"
    }));

    const onItemsPerPageChange = newRange => {
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    const onSort = (newColumnHash: string, newDirection: TableSortDirection) => {
        setColumnHash(newColumnHash);
        setDirection(newDirection);
    };

    const renderId = (id: number): ReactElement => (
        <Link href={`/orders/${id}`}>
            <StyledLink>{id}</StyledLink>
        </Link>
    );

    const renderStatus = (status: string): ReactElement => (
        <Small>{status}</Small>
    );

    const renderCustomerName = (name: string): ReactElement => (
        <Small>{name}</Small>
    );

    const renderCustomerCode = (code: number|string): ReactElement => (
        <Small>{code}</Small>
    );

    const renderPackingSlip = (order: any): ReactElement => {
        const products = order.order.products
        const physicalProduct = products.filter(product => product.type === 'physical');
        const digitalProduct = products.filter(product => product.type === 'digital');
        return (
            <BlobProvider document={<PackingSlipPdf order={order} products={physicalProduct} services={digitalProduct} />}>
                {(innerProps) => {
                    console.log("innerProps ::: ", innerProps)
                    return (
                        <a href={innerProps.url} target="_blank">Open in new tab</a>
                    )
                }}
            </BlobProvider>
        )
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <Panel id="orders">
                <Table
                    columns={[
                        { header: 'Order ID', hash: 'id', render: ({ id }) => renderId(id), isSortable: true },
                        { header: 'Status', hash: 'status', render: ({ status }) => renderStatus(status), isSortable: false },
                        { header: 'Customer Name', hash: 'customerName', render: ({ customerName }) => renderCustomerName(customerName), isSortable: false },
                        { header: 'Customer Code', hash: 'customerCode', render: ({ customerCode }) => renderCustomerCode(customerCode), isSortable: false },
                        { header: 'Packing Slip', hash: 'psmp', render: (order) => renderPackingSlip(order), isSortable: false },
                    ]}
                    items={tableItems}
                    itemName="Orders"
                    pagination={{
                        currentPage,
                        totalItems: meta?.pagination?.total,
                        onPageChange: setCurrentPage,
                        itemsPerPageOptions,
                        onItemsPerPageChange,
                        itemsPerPage,
                    }}
                    sortable={{
                        columnHash,
                        direction,
                        onSort,
                    }}
                    stickyHeader
                />
            </Panel>
        </>
    );
};

export default Orders;
