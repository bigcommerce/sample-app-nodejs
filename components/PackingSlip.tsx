import { Flex, H3, Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';
import Logo from '../assets/img/logo-zag-bijoux.png'
import Image from 'next/image';

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
                {/* <Image src={Logo} alt="Logo" width={200} height={200} /> */}
            </div>
 
            <div className="PackingSlip">
                <div style={{fontSize: "2.5rem"}} className="PackingSlipTitle">
                Zag Bijoux Bordereau de préparation {orderId}
                </div><br/><br/>

                <div style={{fontSize: "1.5rem"}} className="StoreAddress">
                    {storeAdress}
                </div><br /><br/>

                <div style={{fontSize: "1.5rem"}} className="AddressRow">
                    <div className="BillingAddress">
                        <div style={{fontSize: "1.5rem"}} className="PackingSlipHeading">Billing Details</div>
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
                        <div style={{fontSize: "1.5rem"}} className="PackingSlipHeading">Shipping Details</div>
                        {shippingAdress.map((detail: any, index: number) => {
                            return <div key={index}>
                                <div>{detail.first_name} {detail.last_name}</div>
                                <div>{detail.company}</div>
                                <div>{detail.street_1} {detail.street_2 && detail.street_2}</div>
                                <div>{detail.city}, {detail.zip}</div>
                                <div>{detail.country}</div>
                                <div>Phone: {detail.phone}</div>
                            </div>
                        })}
                    </div>
                </div><br /><br/>

                <div style={{fontSize: "1.5rem"}} className="PackingSlipDetails">
                    <div className="PackingSlipDetailsLeft">
                        <div className="DetailRow">
                            <div className="Label">Order:</div>
                            <div className="Value"> {orderId}</div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{fontWeight: 'bold'}}>Order date:</div>
                            <div style={{marginLeft: "5%"}}>09.11.23</div>
                        </div>
                    </div>
                    <div className="PackingSlipDetailsRight">
                        <div style={{display: "flex"}}>
                            <div style={{fontWeight: 'bold'}}>Shipping method: </div>
                            <div style={{marginLeft: "5%"}}>{shippingMethod}</div>
                        </div>
                        
                    </div>
                </div><br /><br/>

                <div className="PackingSlipComments" style={{/**"%%GLOBAL_HideComments%%" */}}>
                    <div style={{fontSize: "1.5rem"}} className="PackingSlipHeading">Comments:</div>
                    <blockquote style={{fontSize: "1.5rem"}}>
                        Ajouter présentoir + commande vrac
                    </blockquote>
                </div><br/><br/>

                <div className="PackingSlipItems">
                    <div style={{fontSize: "1.5rem", marginTop: "3%"}} className="PackingSlipHeading">Shipped Items</div><br /><br/>
                    <table style={{
                        width: '100vw',
                        height: 'fit-content'
                    }}>
                        <thead style={{border: '1px solid black', borderBottom: "none"}}>
                            <tr style={{paddingTop: "30px", paddingBottom: "30px"}}>
                                <th style={{width: "20%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}></th>
                                <th style={{width: "30%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.5rem"}}>Code / SKU</th>
                                <th style={{width: "10%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.5rem"}}>Qty</th>
                                <th style={{width: "30%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.5rem"}}>Bin Picking No.</th>
                                <th style={{width: "10%"}}></th>
                            </tr>
                        </thead>
                        <tbody style={{border: '1px solid black'}}>
                            {products && products.map((product: any, index: number) => (
                                <tr key={index} style={{borderBottom: "1px solid black", borderTop: index === (products - 1) && "1px solid black"}}>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", borderLeft: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.5rem"}}><img src={product.data.image_url} style={{width: "168px", height: "196px"}} /></td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.5rem"}}>{product.data.sku}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.5rem"}}>{product.qty}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.5rem"}}>{product.bin_picking_number}</td>
                                    <td></td>
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
