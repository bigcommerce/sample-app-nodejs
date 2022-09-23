import { Box, Flex, H1, H4, Panel } from '@bigcommerce/big-design';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { useSession } from '../context/session';
import { plans } from '../lib/checkout';
import { useAlerts, useProducts, useSubscription } from '../lib/hooks';

const Index = () => {
    const alertsManager = useAlerts();
    const { error, isLoading, summary } = useProducts();
    const encodedContext = useSession()?.context;
    const { subscription } = useSubscription();
    const { pid: planId, showPaidWelcome } = subscription ?? {};

    const handleUpgradeMsg = useCallback(async () => {
        const planName = plans.find(plan => plan.pid === planId)?.name;
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

        // Remove alert once shown
        await fetch(`/api/checkout/removeWelcome?context=${encodedContext}`);
    }, [alertsManager, encodedContext, planId]);

    useEffect(() => {
        if (showPaidWelcome) handleUpgradeMsg();
    }, [showPaidWelcome, handleUpgradeMsg]);

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
