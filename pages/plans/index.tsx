import { Flex, FlexItem, FlexItemProps, H0, Text } from '@bigcommerce/big-design';
import React from 'react';
import styled from 'styled-components';

import { UpgradeCard } from '../../components/upgradeCard';
import { plans } from '../../lib/checkout'

const Plans = () => (
    <Flex flexDirection="column" alignItems="center"  marginHorizontal="xxxLarge">
        <StyledFlexItem marginBottom="xxxLarge">
            <H0>Upgrade to the BigApp plan that fits your needs</H0>
            <Text>
                We’re focused on more than powering your online store. We’re
                here to give you tools that will help you grow a successful,
                sustainable online business. Choose the plan type below that
                works for you.
            </Text>
        </StyledFlexItem>
        <FlexItem>
            <Flex>
                {plans.map(plan => (<UpgradeCard key={plan.pid} {...plan} />))}
            </Flex>
        </FlexItem>
    </Flex>
);

const StyledFlexItem = styled(FlexItem)<FlexItemProps>`
    max-width: 57.5rem;
    text-align: center;
`;

export default Plans;
