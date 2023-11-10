import { Flex, H3, Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';

type PackingSlipProps = {
    order: any;
};

const PackingSlip = ({ order }: PackingSlipProps) => {
    useEffect(() => {
        console.log('order ::: ', order);
    }, [])

    const currentOrder = order.order
    const storeAdress = "177 rue du temple - 75003 - Paris"
    const orderId = currentOrder.id
    const billingAdress = currentOrder.billing_address
    const shippingAdress = currentOrder.shippingAddresses
    const orderDate = currentOrder.date_modified
    const shippingMethod = shippingAdress[0].shipping_method
    const products = currentOrder.products

    return (
        <Panel>
            <link href="https://cdn11.bigcommerce.com/r-4b20dad619e29ebf3490f7f35369a8220637ce48/themes/ClassicNext/Styles/printinvoice.css" rel="stylesheet" type="text/css" />
            <div id="Logo">
                %%GLOBAL_HeaderLogo%%
            </div>

            <div className="PackingSlip">
                <div className="PackingSlipTitle">
                    %%GLOBAL_StoreName%% %%GLOBAL_PackingSlipTitle%%
                </div>

                <div className="StoreAddress">
                    %%GLOBAL_StoreAddressFormatted%%
                </div>

                <div className="AddressRow">
                    <div className="BillingAddress">
                        <div className="PackingSlipHeading">%%LNG_BillTo%%</div>
                        %%GLOBAL_BillingAddress%%
                        <div style={{/**"%%GLOBAL_HideBillingPhone%%" */}}>
                            %%LNG_Phone%%: %%GLOBAL_BillingPhone%%
                        </div>
                    </div>
                    <div className="ShippingAddress">
                        <div className="PackingSlipHeading">%%LNG_ShipTo%%</div>
                        %%GLOBAL_ShippingAddress%%
                        <div style={{/**"%%GLOBAL_HideShippingPhone%%" */}}>
                            %%LNG_Phone%%: %%GLOBAL_ShippingPhone%%
                        </div>
                    </div>
                </div>

                <div className="PackingSlipDetails">
                    <div className="PackingSlipDetailsLeft">
                        <div className="DetailRow">
                            <div className="Label">%%LNG_Order%%:</div>
                            <div className="Value">#%%GLOBAL_OrderId%%</div>
                        </div>
                        <div className="DetailRow">
                            <div className="Label">%%LNG_ShipmentOrderDate%%:</div>
                            <div className="Value">%%GLOBAL_OrderDate%%</div>
                        </div>
                    </div>
                    <div className="PackingSlipDetailsRight">
                        <div className="DetailRow" style={{/**"%%GLOBAL_HideShippingMethod%%" */}}>
                            <div className="Label">%%LNG_ShippingMethod%%:</div>
                            <div className="Value">%%GLOBAL_ShippingMethod%%</div>
                        </div>
                        <div className="DetailRow" style={{/**"%%GLOBAL_HideShippingDate%%" */}}>
                            <div className="Label">%%LNG_DateShipped%%:</div>
                            <div className="Value">%%GLOBAL_DateShipped%%</div>
                        </div>
                        <div className="DetailRow" style={{/**"%%GLOBAL_HideTrackingNo%%" */}}>
                            <div className="Label">%%LNG_TrackingNumber%%:</div>
                            <div className="Value">%%GLOBAL_TrackingNo%%</div>
                        </div>
                    </div>
                </div>

                <div className="PackingSlipComments" style={{/**"%%GLOBAL_HideComments%%" */}}>
                    <div className="PackingSlipHeading">%%LNG_Comments%%</div>
                    <blockquote>
                        %%GLOBAL_Comments%%
                    </blockquote>
                </div>

                <div className="PackingSlipItems">
                    <div className="PackingSlipHeading">%%LNG_ShippedItems%%</div>
                    <table style={{
                        width: '100%',
                        height: 'fit-content'
                    }}>
                        <thead style={{border: '1px solid black', borderBottom: "none"}}>
                            <tr style={{paddingTop: "30px", paddingBottom: "30px"}}>
                                <th style={{borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}></th>
                                <th style={{width: "40%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}>%%LNG_Code%%</th>
                                <th style={{width: "5%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}>%%LNG_Quantity%%</th>
                                <th style={{width: "40%", paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}>%%LNG_ProdBin%%</th>
                            </tr>
                        </thead>
                        <tbody style={{border: '1px solid black'}}>
                            {products && products.map((product: any, index: number) => (
                                <tr style={{borderBottom: "1px solid black", borderTop: index === (products - 1) && "1px solid black"}}>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", borderLeft: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}><img src={product.data.image_url} style={{width: "90px", height: "105px"}} /></td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}>{product.data.sku}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}>12</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}>hfxfgx5641654569415</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </Panel>
    );
}

export default PackingSlip;
