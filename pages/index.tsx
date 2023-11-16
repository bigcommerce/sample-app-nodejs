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

const Orders = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState('');
    const [direction, setDirection] = useState<TableSortDirection>('ASC');
    const [modalOpen, setModalOpen] = useState(false);
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

    const renderCustomerId = (id: number): ReactElement => (
        <Small>{id}</Small>
    );

    const renderAction = (order: any): ReactElement => (
        <>
            <Dropdown
                items={[
                    { content: 'View order', onItemClick: () => router.push(`/orders/${order.id}`), hash: 'view' },
                    {
                        content: 'Packing slip', onItemClick: () => {
                            const options = {
                                // default is `save`
                                method: 'open',
                                // default is Resolution.MEDIUM = 3, which should be enough, higher values
                                // increases the image quality but also the size of the PDF, so be careful
                                // using values higher than 10 when having multiple pages generated, it
                                // might cause the page to crash or hang.
                                resolution: Resolution.MEDIUM,
                                page: {
                                    // margin is in MM, default is Margin.NONE = 0
                                    margin: Margin.SMALL,
                                    // default is 'A4'
                                    format: 'A4',
                                    // default is 'portrait'
                                    orientation: 'portrait',
                                },
                                canvas: {
                                    // default is 'image/jpeg' for better size performance
                                    mimeType: 'image/jpeg',
                                    qualityRatio: 1
                                },
                                // Customize any value passed to the jsPDF instance and html2canvas
                                // function. You probably will not need this and things can break, 
                                // so use with caution.
                                overrides: {
                                    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
                                    pdf: {
                                        compress: true
                                    },
                                    // see https://html2canvas.hertzen.com/configuration for more options
                                    canvas: {
                                        useCORS: true
                                    }
                                },
                            } as const;
                            const getTargetElement = () => document.getElementById(`pdf-content-${order.id}`);
                            generatePDF(getTargetElement, options);
                        }
                    },
                ]}
                toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
            />
            <RenderPDF order={order} />
        </>

    );

    const RenderPDF = ({ order }: { order: any }) => {
        return (
            <div id={`pdf-content-${order.id}`} style={{
                position: 'absolute',
                left: '-10000px',
            }}>
                <PackingSlip order={order} />
            </div>
        );
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <Panel id="orders">
                <Table
                    columns={[
                        { header: 'Order ID', hash: 'name', render: ({ id }) => renderId(id), isSortable: true },
                        { header: 'Status', hash: 'status', render: ({ status }) => renderStatus(status), isSortable: true },
                        { header: 'Customer ID', hash: 'customerId', render: ({ customerId }) => renderCustomerId(customerId), isSortable: true },
                        { header: 'Action', hideHeader: true, hash: 'id', render: (order) => renderAction(order) },
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
