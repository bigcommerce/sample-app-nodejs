import { H3, HR, Panel, Text } from '@bigcommerce/big-design';
// import styled from 'styled-components';
// import ErrorMessage from '../components/error';
// import Loading from '../components/loading';
// import { useProducts } from '../lib/hooks';

const Index = () => {
    // const { error, isLoading, summary } = useProducts();

    // if (isLoading) return <Loading />;
    // if (error) return <ErrorMessage error={error} />;

    return (
        <Panel header="What is this app?" id="home">
            <Text>
                Welcome to our Translations App, we&apos;ve developed this during the BigCommerce Hackathon 2022.
                On review of the app marketplace for translations we discovered there isn&apos;t a lot of offerings
                which allow users to select any number of languages rather they are set at set increments.
                We&apos;ve had clients in the past getting by with &apos;Google Translate&apos; widget, however as that is
                coming to end of life this year, we believe we could offer an alternative.
            </Text>
            <HR />
            <H3>Who are we?</H3>
            <Text>
                We are two developers and a project manager from Space48.
            </Text>
        </Panel>
    );
};

// const StyledBox = styled(Box)`
//     min-width: 10rem;
// `;

export default Index;
