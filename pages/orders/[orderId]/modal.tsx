import { Badge, Flex, Grid, GridItem, H3, Text } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import ErrorMessage from '../../../components/error';
import { useOrder } from '../../../lib/hooks';
import { Order } from '../../../types';

const StyledAddress = styled.address`
    color: ${({ theme }) => theme.colors.secondary70};
    font-style: normal;
    line-height: ${({ theme }) => theme.lineHeight.medium};
`;

const StyledDl = styled.dl`
    color: ${({ theme }) => theme.colors.secondary70};
    display: grid;
    grid-template: 'dt dd' auto / 1fr auto;
    grid-auto-rows: auto;
    line-height: ${({ theme }) => theme.lineHeight.medium};
    margin: 0;

    dt {
        grid-area: 'dt';
    }

    dd {
        grid-area: 'dd';
        text-align: right;
    }
`;

const InternalOrderModalPage = (order: Order) => {
    const { billing_address } = order;

    const formatCurrency = (amount: string) =>
        new Intl.NumberFormat(order.customer_locale, { style: 'currency', currency: order.currency_code }).format(parseFloat(amount));

    return (
        <Grid gridColumns="repeat(auto-fill, minmax(16rem, 1fr))" gridGap="3rem">
            <GridItem>
                <H3>Billing information</H3>
                <StyledAddress>
                    <div>
                        {billing_address.first_name} {billing_address.last_name}
                    </div>
                    <div>{billing_address.street_1}</div>
                    {billing_address.street_2 && <div>{billing_address.street_2}</div>}
                    <div>
                        {billing_address.city}, {billing_address.state}, {billing_address.zip}
                    </div>
                    <div>{billing_address.country}</div>
                </StyledAddress>
            </GridItem>
            <GridItem>
                <Flex
                    alignItems="center"
                    flexDirection="row"
                    flexWrap="nowrap"
                    justifyContent="space-between"
                    marginBottom="small"
                >
                    <H3 marginBottom="none">Payment details</H3>
                    <Badge label={order.payment_status} variant="success" />
                </Flex>
                <StyledDl>
                    <dt>Subtotal</dt>
                    <dd>{formatCurrency(order.subtotal_ex_tax)}</dd>
                    <dt>Discount</dt>
                    <dd>-{formatCurrency(order.discount_amount)}</dd>
                    <dt>Shipping</dt>
                    <dd>{formatCurrency(order.shipping_cost_ex_tax)}</dd>
                    <dt>Tax</dt>
                    <dd>{formatCurrency(order.total_tax)}</dd>
                    <dt>
                        <Text as="span" bold marginBottom="none">Grand total</Text>
                    </dt>
                    <dd>
                        <Text as="span" bold  marginBottom="none">{formatCurrency(order.total_inc_tax)}</Text>
                    </dd>
                </StyledDl>
            </GridItem>
            <GridItem>
                <H3>Order information</H3>
                <StyledDl>
                    <dt>ID</dt>
                    <dd>{order.id}</dd>
                    <dt>Type</dt>
                    <dd>
                        <span style={{ textTransform: 'capitalize' }}>{order.order_source}</span>
                    </dd>
                    <dt>Status</dt>
                    <dd>{order.status}</dd>
                    <dt>Total items</dt>
                    <dd>
                        {order.items_total > 1 ? `${order.items_total} items` : `${order.items_total} item`}
                    </dd>
                </StyledDl>
            </GridItem>
        </Grid>
    );
};

const OrderModalPage = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const { isLoading, order, error } = useOrder(parseInt(`${orderId}`, 10));

    if (isLoading) {
        return null;
    }

    if (error) {
        return <ErrorMessage error={error} renderPanel={false} />
    }

    return <InternalOrderModalPage {...order} />;
};

export default OrderModalPage;
