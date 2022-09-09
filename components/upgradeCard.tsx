import { Box, BoxProps, Button, Flex, FlexItem, FlexItemProps, H2, ProgressCircle, Small, Text } from '@bigcommerce/big-design';
import { ExpandMoreIcon } from '@bigcommerce/big-design-icons';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSession } from '../context/session';

interface UpgradeCardProps {
    description: string;
    name: string;
    pid: string;
    popular: boolean;
    price: string;
}

export const UpgradeCard = ({ description, name, pid, popular, price }: UpgradeCardProps) => {
    const encodedContext = useSession()?.context;
    const [isLoading, setIsLoading] = useState(false);

    const barColor = name === 'Plus' ? 'primary70' : 'primary30';

    const handleChoosePlan = async () => {
        setIsLoading(true);

        // TODO: Add error handling
        const response = await fetch(`/api/checkout/${pid}?context=${encodedContext}`);
        const { checkoutUrl: url = '' } = await response.json();

        if (url && window) window.location.assign(url);
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
            marginRight="xLarge"
            marginBottom="large"
        >
            {popular && (
                <Box border="box" paddingHorizontal="small">
                    <Small color="secondary70">MOST POPULAR</Small>
                </Box>
            )}
            <StyledCard shadow="floating" paddingBottom="large" paddingTop="none">
                <Box backgroundColor={barColor} padding="xSmall"></Box>
                <Flex flexDirection="column" marginHorizontal="large" marginTop="xxLarge">
                    <Flex alignItems="center">
                        <H2>{name}</H2>
                        <Box
                            backgroundColor="success50"
                            borderRadius="normal"
                            paddingHorizontal="xxSmall"
                            marginLeft="medium"
                            marginBottom="medium"
                        >
                            <Small color="white">FIRST MONTH FREE</Small>
                        </Box>
                    </Flex>
                    <H2>
                        {`$${price}`}
                        <Small as="span">/month</Small>
                    </H2>
                    <Text>{description}</Text>
                    <Text color="primary" marginBottom="xxLarge">
                        Plan features <ExpandMoreIcon color="primary" />
                    </Text>
                    <StyledFlexItem alignSelf="center">
                        {isLoading ? (
                            <ProgressCircle size="small" />
                        ) : (
                            <Button onClick={handleChoosePlan}>Choose plan</Button>
                        )}
                    </StyledFlexItem>
                </Flex>
            </StyledCard>
        </Flex>
    );
};

const StyledCard = styled(Box)<BoxProps>`
    width: 18.5rem;
`;

const StyledFlexItem = styled(FlexItem)<FlexItemProps>`
    height: 2.25rem;
`;

