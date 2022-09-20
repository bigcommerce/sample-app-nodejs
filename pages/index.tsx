import { Box, Flex, H1, H4, Panel } from '@bigcommerce/big-design';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { plans } from '../lib/checkout';
import { useAlerts, useProducts, useSubscription } from '../lib/hooks';

const Index = () => {
    const alertsManager = useAlerts();
    const { error, isLoading, summary } = useProducts();
    const { subscription } = useSubscription();
    const { pid: appPID, showPaidWelcome } = subscription ?? {};

    const getUpgradeAlert = useCallback(() => {
        const planName = plans.find(plan => plan.pid === appPID)?.name;
        if (!planName) return;

        alertsManager.add({
            header: `${planName} Plan Active`,
            messages: [
                {
                    text: 'You can now enjoy unlimited access to BigApp. Take app tour',
                    link: {
                        text: 'Take app tour',
                        href: '#',
                    }
                },
            ],
            type: 'success',
            autoDismiss: true,
        });
    }, [alertsManager, appPID]);

    useEffect(() => {
        if (showPaidWelcome) getUpgradeAlert();
    }, [showPaidWelcome, getUpgradeAlert]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Panel header="Homepage" id="home">
            <Flex>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Inventory count</H4>
                    <H1 marginBottom="none">{summary.inventory_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Variant count</H4>
                    <H1 marginBottom="none">{summary.variant_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" padding="medium">
                    <H4>Primary category</H4>
                    <H1 marginBottom="none">{summary.primary_category_name}</H1>
                </StyledBox>
            </Flex>
        </Panel>
    );
};

const StyledBox = styled(Box)`
    min-width: 10rem;
`;

export default Index;
