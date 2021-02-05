import { Box, Flex, Panel, Text } from '@bigcommerce/big-design';
import Header from '../components/header';
import { useProducts } from '../lib/hooks';

const Index = () => {
    const { summary } = useProducts();

    return (
        <Panel margin="xxLarge">
            <Header title="Homepage" />
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
    );
};

export default Index;
