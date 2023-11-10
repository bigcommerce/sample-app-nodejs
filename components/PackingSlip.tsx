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
                Zag Bijoux Bordereau d'expédition {orderId}
                </div>

                <div className="StoreAddress">
                    {storeAdress}
                </div>

                <div className="AddressRow">
                    <div className="BillingAddress">
                        <div className="PackingSlipHeading">Billing Details</div>
                            <div>
                                <div>{billingAdress.first_name} {billingAdress.last_name}</div>
                                <div>{billingAdress.company}</div>
                                <div>{billingAdress.street_1}, {billingAdress.street_2 && billingAdress.street_2}</div>
                                <div>{billingAdress.city}, {billingAdress.zip}</div>
                                <div>{billingAdress.country}</div>
                                <div>Phone: {billingAdress.phone}</div>
                            </div>
                    </div>
                    <div className="ShippingAddress">
                        <div className="PackingSlipHeading">Shipping Details</div>
                        {shippingAdress.map((detail: any) => {
                            return <div>
                                <div>{detail.first_name} {detail.last_name}</div>
                                <div>{detail.company}</div>
                                <div>{detail.street_1} {detail.street_2 && detail.street_2}</div>
                                <div>{detail.city}, {detail.zip}</div>
                                <div>{detail.country}</div>
                                <div>Phone: {detail.phone}</div>
                            </div>
                        })}
                    </div>
                </div>

                <div className="PackingSlipDetails">
                    <div className="PackingSlipDetailsLeft">
                        <div className="DetailRow">
                            <div className="Label">Order:</div>
                            <div className="Value"> {orderId}</div>
                        </div>
                        <div className="DetailRow">
                            <div className="Label">Order date:</div>
                            <div className="Value">{orderDate}</div>
                        </div>
                    </div>
                    <div className="PackingSlipDetailsRight">
                        <div className="DetailRow" style={{/**"%%GLOBAL_HideShippingMethod%%" */}}>
                            <div className="Label">Shipping method:</div>
                            <div className="Value">{shippingMethod}</div>
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
                    <div className="PackingSlipHeading">ShippedItems</div>
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
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}>{product.data.qty}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%"}}>{product.data.bin_picking_number}</td>
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
