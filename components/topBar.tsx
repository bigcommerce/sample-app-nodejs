import { Box, Button, Flex, FlexItem, FlexProps, H2, H3, Text } from '@bigcommerce/big-design';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import { plans } from '../lib/checkout';
import { useSubscription } from '../lib/hooks';

export const TopBar = () => {
    const router = useRouter();
    const { subscription, isLoading } = useSubscription();
    const appPID = subscription?.pid;

    const { pathname } = router;
    const isPlansPage = pathname === '/plans';
    const planName = plans.find(plan => plan.pid === appPID)?.name;

    const handleUpgradeLink = () => router.push('/plans');
    const handleLogoClick = () => router.push('/');

    return (
        <Box
            shadow="floating"
            borderRadius="none"
            paddingVertical="xSmall"
            paddingHorizontal="xxxLarge"
            marginBottom="xxxLarge"
        >
            <Flex alignItems="center" justifyContent="space-between">
                <StyledFlex alignItems="center" onClick={handleLogoClick}>
                    <FlexItem marginRight="small">
                        <Image src="/BigCommerce-logomark-whitebg.png" width="22" height="22" />
                    </FlexItem>
                    <H2 marginVertical="none">BigApp</H2>
                </StyledFlex>
                {!isPlansPage && !isLoading &&
                    <FlexItem>
                        {planName ? (
                            <H3 color="primary" marginBottom="none">
                                {`${planName} Plan`}
                            </H3>
                        ) : (
                            <Flex alignItems="center">
                                <Text marginBottom="none" color="danger">
                                    You have 3 days left in your free trial
                                </Text>
                                <Button marginLeft="medium" onClick={handleUpgradeLink}>
                                    Upgrade
                                </Button>
                            </Flex>
                        )}
                    </FlexItem>
                }
            </Flex>
        </Box>
    );
};

const StyledFlex = styled(Flex)<FlexProps>`
    cursor: pointer;
`;
