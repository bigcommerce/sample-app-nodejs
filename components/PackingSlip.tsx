import { Flex, H3, Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';

type PackingSlipProps = {
    order: any;
};

const PackingSlip = ({ order }: PackingSlipProps) => {
    useEffect(() => {
        console.log('order ::: ', order);
    }, [])
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

                <div className="PackingSlipItems">
                    <div className="PackingSlipHeading">%%LNG_ShippedItems%%</div>
                    <table className="PackingSlipTable">
                        <thead>
                            <tr>
                                <th className="ProductQuantity">%%LNG_Quantity%%</th>
                                <th className="ProductSku">%%LNG_Code%%</th>
                                <th className="ProductDetails">%%LNG_ProdName%%</th>
                                <th className="ProductDetails">%%LNG_ProdBin%%</th>
                            </tr>
                        </thead>
                        <tbody className="PackingSlipItemList">
                            %%GLOBAL_ProductsTable%%
                        </tbody>
                    </table>
                </div>

                <div className="PackingSlipComments" style={{/**"%%GLOBAL_HideComments%%" */}}>
                    <div className="PackingSlipHeading">%%LNG_Comments%%</div>
                    <blockquote>
                        %%GLOBAL_Comments%%
                    </blockquote>
                </div>
            </div>
        </Panel>
    );
}

export default PackingSlip;
