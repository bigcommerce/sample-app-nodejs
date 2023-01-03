import { H4, Panel, Text } from "@bigcommerce/big-design";
import { useRouter } from "next/router";
import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import { useProductInfo } from "@lib/hooks";

const ProductAppExtension = () => {
    const router = useRouter();
    const productId = Number(router.query?.productId);
    const { error, isLoading, product } = useProductInfo(productId);
    const { description, is_visible: isVisible, name, price, type } = product ?? {};   
    const typeCapitalized = type?.replace(/^\w/, (c: string) => c.toUpperCase());
    const isVisibleString = isVisible ? 'True' : 'False';

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
  
    return (
        <>
            <Panel header="Basic Information" marginBottom="small">
                <H4>Product name</H4>
                <Text>{name}</Text>
                <H4>Product type</H4>
                <Text>{typeCapitalized}</Text>
                <H4>Default price (excluding tax)</H4>
                <Text>${price}</Text>
                <H4>Visible on storefront</H4>
                <Text>{isVisibleString}</Text>
            </Panel>
            <Panel header="Description" margin="none">
                <H4>Description</H4>
                <Text>{description}</Text>
            </Panel>
        </>
    );
};

export default ProductAppExtension;
