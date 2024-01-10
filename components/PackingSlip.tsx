import { Flex, H3, Panel } from '@bigcommerce/big-design';
import { useEffect } from 'react';
import Logo from '../assets/img/logo-zag-bijoux.png'
import Image from 'next/image';

type PackingSlipProps = {
    order: any;
    firstBatch?: any;
    batch?: any;
    lastBatch?: any;
    isFirstBatch?: boolean;
    isLastBatch?: boolean;
};

const PackingSlip = ({ order, batch, isFirstBatch, firstBatch, lastBatch, isLastBatch }: PackingSlipProps) => {
    useEffect(() => {
        console.log('order ::: ', order);
    }, [])

    const currentOrder = order && order.order
    const storeAdress = "177 rue du temple - 75003 - Paris"
    const orderId = currentOrder.id && currentOrder.id
    const billingAdress = currentOrder.billing_address && currentOrder.billing_address
    const shippingAdress = currentOrder.shippingAddresses && currentOrder.shippingAddresses
    const shippingMethod = shippingAdress[0].shipping_method && shippingAdress[0].shipping_method
    const products = currentOrder.products && currentOrder.products
    const rawDate = currentOrder.date_modified && currentOrder.date_modified
    const orderDay = rawDate && new Date(rawDate).getDay()
    const formattedorderDay = orderDay < 10 ? "0" + orderDay : orderDay
    const orderMonth = rawDate && new Date(rawDate).getMonth() + 1
    const formattedOrderMonth = orderMonth < 10 ? "0" + orderMonth : orderMonth
    const orderYear = rawDate && new Date(rawDate).getFullYear()
    const orderDate = `${formattedorderDay}.${formattedOrderMonth}.${orderYear}`
    const sortedProductsArray = products && products.sort(function(a: { data: { sku_id: number; }; }, b: { data: { sku_id: number; }; }) {
        return a.data.sku_id - b.data.sku_id;
    });
    const totalQty = products && products.map((product: any) => product.qty).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      },0);

    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@', totalQty)

    return (
        <Panel>
            <link href="https://cdn11.bigcommerce.com/r-4b20dad619e29ebf3490f7f35369a8220637ce48/themes/ClassicNext/Styles/printinvoice.css" rel="stylesheet" type="text/css" />
            <div id="Logo">
                {/* <Image src={Logo} alt="Logo" width={200} height={200} /> */}
            </div>
 
            <div style={{marginBottom: "20px", border: "none"}} className="PackingSlip">
                {isFirstBatch && <> <div style={{fontSize: "2.7rem"}} className="PackingSlipTitle">

                Zag Bijoux Bordereau de préparation {orderId}
                </div><br/><br/>

                
                    <div style={{fontSize: "1.2rem"}} className="StoreAddress">
                        {storeAdress}
                    </div><br />

                    <div style={{fontSize: "1.2rem"}} className="AddressRow">
                        <div className="BillingAddress">
                            <div style={{fontSize: "1.2rem"}} className="PackingSlipHeading">Billing Details</div>
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
                            <div style={{fontSize: "1.2rem"}} className="PackingSlipHeading">Shipping Details</div>
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
                    </div><br />


                    <div style={{fontSize: "1.2rem"}} className="PackingSlipDetails">
                        <div className="PackingSlipDetailsLeft">
                            <div className="DetailRow">
                                <div className="Label">Order:</div>
                                <div style={{marginLeft: "4%"}}>{orderId}</div>
                            </div>
                            <div style={{display: "flex"}}>

                                <div style={{fontWeight: 'bold'}}>Order date:</div>
                                <div style={{marginLeft: "5%"}}>{orderDate}</div>

                            </div>
                        </div>
                        <div className="PackingSlipDetailsRight">
                            <div style={{display: "flex"}}>
                                <div style={{fontWeight: 'bold'}}>Shipping method: </div>
                                <div style={{marginLeft: "15%"}}>{shippingMethod}</div>
                            </div>
                            <div style={{display: "flex"}}>
                                <div style={{fontWeight: 'bold'}}>Total quantity of items: </div>
                                <div style={{marginLeft: "5%"}}>{totalQty}</div>
                            </div>
                        </div>

                    </div><br />

                    <div className="PackingSlipComments" style={{/**"%%GLOBAL_HideComments%%" */}}>
                        <div style={{fontSize: "1.2rem"}} className="PackingSlipHeading">Comments:</div>
                        <blockquote style={{fontSize: "1.2rem"}}>
                            
                        </blockquote><br />
                    </div>
                </>}

                <div>
                    {isFirstBatch && <div style={{fontSize: "1.2rem", paddingTop: "4%", borderTop: "1px solid black"}} className="PackingSlipHeading">Shipped Items</div>}
                    {lastBatch && <div style={{fontSize: "1.2rem"}} className="PackingSlipHeading">Services</div>}
                    <br/><br/>
                    <table style={{
                        width: '100%',
                        height: 'fit-content'
                    }}>
                        <thead style={{border: '1px solid black', borderBottom: "none"}}>
                            <tr style={{paddingTop: "30px", paddingBottom: "30px"}}>
                                {!lastBatch && <th style={{width: "20%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center"}}></th>}

                                <th style={{width: "30%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.2rem"}}>Code / SKU</th>
                                <th style={{width: "10%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.2rem"}}>Qty</th>
                                <th style={{width: "30%", borderRight: '1px solid black', paddingTop: "1%", paddingBottom: "1%", textAlign: "center", fontSize: "1.2rem"}}>Bin Picking No.</th>

                                <th style={{width: "10%"}}></th>
                            </tr>
                        </thead>
                        {isFirstBatch && <tbody style={{border: '1px solid black'}}>
                            {firstBatch && firstBatch.map((product: any, index: number) => (

                                <tr key={index} style={{borderBottom: "1px solid black", borderTop: index === (products - 1) && "1px solid black"}}>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", borderLeft: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}><img src={product.data.image_url} style={{width: "84px", height: "80px"}} /></td>

                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.data.sku}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.qty}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.bin_picking_number}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>}

                        <tbody style={{border: '1px solid black', marginTop: "20px"}}>
                            {batch && batch.map((product: any, index: number) => (

                                <tr key={index} style={{borderBottom: "1px solid black", borderTop: index === (products - 1) && "1px solid black"}}>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", borderLeft: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}><img src={product.data.image_url} style={{width: "84px", height: "80px"}} /></td>

                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.data.sku}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.qty}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.bin_picking_number}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                        {isLastBatch && <tbody style={{border: '1px solid black'}}>
                            {lastBatch && lastBatch.map((product: any, index: number) => (
                                <>
                                <tr key={index} style={{borderBottom: "1px solid black", borderTop: index === (products - 1) && "1px solid black"}}>
                                    {/* <td style={{textAlign: "center", borderRight: "1px solid black", borderLeft: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}><img src={product.data.image_url} style={{width: "84px", height: "80px"}} /></td> */}

                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.data.sku}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.qty}</td>
                                    <td style={{textAlign: "center", borderRight: "1px solid black", paddingTop: "1%", paddingBottom: "1%", fontSize: "1.2rem"}}>{product.bin_picking_number}</td>
                                    <td></td>
                                </tr>
                                </>
                            ))}
                        </tbody>}
                    </table>
                </div>
                
            </div>
        </Panel>
    );
}

export default PackingSlip;
