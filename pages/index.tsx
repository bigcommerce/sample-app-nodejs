import { Box, Flex, H1, H2, H4, Link, Panel } from '@bigcommerce/big-design';
import styled from 'styled-components';
import { useProducts } from '../lib/hooks';

const Index = () => {
    const { summary } = useProducts();

    return (
        <Panel header="Homepage">
            {summary &&
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
            }
        </Panel>
    );
};

const StyledBox = styled(Box)`
    min-width: 10rem;
`;

export default Index;
