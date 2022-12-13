import { Panel, Text } from "@bigcommerce/big-design";
import { useRouter } from "next/router";
import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import { useProductInfo, useProductList } from "@lib/hooks";

const SidePanel = () => {
  const router = useRouter();
  const productId = Number(router.query?.productId);
  const { error, isLoading, list = [] } = useProductList();
  const { isLoading: isInfoLoading, product } = useProductInfo(productId, list);
  const {
    description,
    is_visible: isVisible,
    name,
    price,
    type,
  } = product ?? {};
  const panelData = { description, isVisible, name, price, type };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isLoading || isInfoLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <Panel header="Basic Information">
        <Text bold>Product name</Text>
        <p>{panelData.name}</p>
        <Text bold>Product type</Text>
        <p>{capitalizeFirst(panelData.type)}</p>
        <Text bold>Default price (excluding tax)</Text>
        <p>$ {panelData.price}</p>
        <p>{panelData.isVisible}</p>
      </Panel>
      <Panel header="Description">
        <Text bold>Description</Text>
        <p>{panelData.description}</p>
      </Panel>
    </>
  );
};

export default SidePanel;
