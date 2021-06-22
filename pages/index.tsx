import { Box, Flex, H1, H4, Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';
import styled from 'styled-components';
import Loading from '../components/loading';
import { useSession } from '../context/session';
import { useProducts } from '../lib/hooks';

const Index = ({ context }: { context: string }) => {
    const { isLoading, summary } = useProducts();
    const { setStoreHash } = useSession();

    useEffect(() => {
        if (context) setStoreHash(context);
    }, [context, setStoreHash]);

    if (isLoading) return <Loading />;

    return (
        <Panel header="Homepage">
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

export const getServerSideProps = async ({ query }) => ({
    props: { context: query?.context ?? '' }
});

export default Index;
