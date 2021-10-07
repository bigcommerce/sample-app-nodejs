import { Button, Flex, H3, Panel, Text } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useOrderInfo } from '../../lib/hooks';

const OrderInfo = () => {
    const router = useRouter();
    const oid = Number(router.query?.oid);
    const { isLoading, order, error } = useOrderInfo(oid);

    const {
        billing_address: {
            city,
            first_name: firstName,
            last_name: lastName,
            state,
            street_1: street1,
            street_2: street2,
            zip,
            country,
        },
        id,
        items_total: itemsTotal,
        order_source: orderSource,
        payment_status: paymentStatus,
        status: orderStatus,
        total_inc_tax: totalIncTax,
     } = order ?? {
        billing_address: {
            city: '',
            firstName: '',
            lastName: '',
            state: '',
            street1: '',
            street2: '',
            zip: '',
            country: '',
        },
        id: 0,
        itemsTotal: 0,
        orderSource: '',
        paymentStatus: '',
        status: '',
        totalIncTax: '',
     };

    const formatCurrency = (amount: string) => {
        return amount.replace(amount.substring(amount.length - 3, amount.length -1), '');
    }

    const handleClick = () => {
      router.back();
    }

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
      <>
          <Panel header={`Order - #${id}`}>
              <Flex justifyContent="flex-start" marginTop="large">
                  <Flex flexDirection="column" alignItems="start" marginRight="xxxLarge">
                    <H3>Customer</H3>
                    <Text>{`${firstName} ${lastName}`}</Text>
                    <Text>{street1}</Text>
                      {street2 && <Text>{street2}</Text>}
                      <Text>{`${city}, ${state} ${zip}`}</Text>
                      <Text>{country}</Text>
                  </Flex>
                  <Flex flexDirection="column" alignItems="start" marginHorizontal="xxxLarge">
                      <H3>Payment details</H3>
                      <Text>Total: $:{formatCurrency(totalIncTax)}</Text>
                      <Text>Status: {paymentStatus.toUpperCase()}</Text>
                  </Flex>
                  <Flex flexDirection="column" alignItems="start" marginHorizontal="xxxLarge">
                      <H3>Order information</H3>
                      <Text>Items: {itemsTotal}</Text>
                      <Text>Source: {orderSource}</Text>
                      <Text>Status: {orderStatus}</Text>
                  </Flex>
              </Flex>
          </Panel>
          <Flex justifyContent="flex-end">
              <Button onClick={handleClick} variant="subtle">Back</Button>
          </Flex>
      </>
    );
};

export default OrderInfo;
