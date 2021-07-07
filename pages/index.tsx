import { Box, Flex, Panel, Text } from '@bigcommerce/big-design';
import { useEffect } from 'react';
import { useSession } from '../context/session';
import { useProducts } from '../lib/hooks';

const Index = ({ context }: { context: string }) => {
    const { summary } = useProducts();
    const { setContext } = useSession();

    useEffect(() => {
        if (context) setContext(context);
    }, [context, setContext]);

    return (
        <Panel header="Homepage">
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

export const getServerSideProps = async ({ query }) => ({
    props: { context: query?.context ?? '' }
});

export default Index;
