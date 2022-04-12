import { Flex, H3, Panel, ProgressCircle } from '@bigcommerce/big-design';

const Loading = () => (
    <Panel>
        <H3>Hamari Loads....</H3>
        <Flex justifyContent="center" alignItems="center">
            <ProgressCircle size="large" />
        </Flex>
    </Panel>
);

export default Loading;
