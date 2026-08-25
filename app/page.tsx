'use client';

import { Box, Button, Flex, Grid, GridItem, H1, H4, Panel, Text } from '@bigcommerce/big-design';
import { ArrowForwardIcon, CategorySearchIcon, FolderIcon, ProductsIcon, StorefrontIcon } from '@bigcommerce/big-design-icons';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { useProducts } from '../lib/hooks';

const Index = () => {
    const router = useRouter();
    const { error, isLoading, summary } = useProducts();

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const stats = [
        { color: 'primary' as const, icon: ProductsIcon, label: 'Inventory count', value: summary.inventory_count },
        { color: 'success' as const, icon: FolderIcon, label: 'Variant count', value: summary.variant_count },
        { color: 'warning' as const, icon: CategorySearchIcon, label: 'Primary category', value: summary.primary_category_name },
    ];

    return (
        <>
            <Flex alignItems="center" marginBottom="xLarge">
                <IconCircle backgroundColor="primary10" marginRight="medium">
                    <StorefrontIcon color="primary" size="xLarge" />
                </IconCircle>
                <Box>
                    <H1 marginBottom="none">Welcome back</H1>
                    <Text color="secondary60" margin="none">Here&apos;s a snapshot of your catalog.</Text>
                </Box>
            </Flex>

            <Grid gridColumns="repeat(auto-fit, minmax(14rem, 1fr))" gridGap="1rem" marginBottom="xLarge">
                {stats.map(({ color, icon: StatIcon, label, value }) => (
                    <GridItem key={label}>
                        <StatCard border="box" borderRadius="normal" padding="medium">
                            <IconCircle backgroundColor={`${color}10`} marginBottom="small">
                                <StatIcon color={color} size="large" />
                            </IconCircle>
                            <H4 color="secondary60" marginBottom="xxSmall">{label}</H4>
                            <H1 marginBottom="none">{value}</H1>
                        </StatCard>
                    </GridItem>
                ))}
            </Grid>

            <Panel header="Quick actions">
                <Flex alignItems="center" justifyContent="space-between">
                    <Box>
                        <Text bold margin="none">Manage your catalog</Text>
                        <Text color="secondary60" marginBottom="none">Edit product details, pricing, and visibility.</Text>
                    </Box>
                    <Button iconRight={<ArrowForwardIcon />} onClick={() => router.push('/products')}>
                        View products
                    </Button>
                </Flex>
            </Panel>
        </>
    );
};

const IconCircle = styled(Box)`
    align-items: center;
    display: flex;
    height: 3rem;
    justify-content: center;
    width: 3rem;
`;

const StatCard = styled(Box)`
    height: 100%;
`;

export default Index;
