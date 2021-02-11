import { Box, Flex, H2, Link, Panel, Text } from '@bigcommerce/big-design';
import Header from '../components/header';
import { useProducts } from '../lib/hooks';

const Index = () => {
    const { summary } = useProducts();

    return (
        <>
            <Header />
            <Panel marginHorizontal="xxLarge">
                <H2>Homepage</H2>
                {summary &&
                    <Flex>
                        <Box marginRight="xLarge">
                            <Text>Inventory Count</Text>
                            <Text>{summary.inventory_count}</Text>
                        </Box>
                        <Box marginRight="xLarge">
                            <Text>Variant Count</Text>
                            <Text>{summary.variant_count}</Text>
                        </Box>
                        <Box>
                            <Text>Primary Category</Text>
                            <Text>{summary.primary_category_name}</Text>
                        </Box>
                    </Flex>
                }
            </Panel>
        </>
    );
};

export default Index;
