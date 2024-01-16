import { Document, Page, Text, Link, Image, View, StyleSheet, Font } from '@react-pdf/renderer';
import { useEffect } from 'react';

export type PackingSlipPdfProps = {
    order: any;
    firstBatch?: any[];
    batch?: any;
    lastBatch?: any[];
    isFirstBatch?: boolean;
    isLastBatch?: boolean;
    products: any[];
    services: any[];
}

const PackingSlipPdf = ({
    order,
    firstBatch,
    batch,
    lastBatch,
    isFirstBatch,
    isLastBatch,
    products,
    services,
}: PackingSlipPdfProps) => {
    useEffect(() => {
    }, []);
    const currentOrder = order && order.order
    const storeAdress = "177 rue du temple - 75003 - Paris"
    const orderId = currentOrder.id && currentOrder.id
    const billingAdress = currentOrder.billing_address && currentOrder.billing_address
    const shippingAdress = currentOrder.shippingAddresses && currentOrder.shippingAddresses
    const shippingMethod = shippingAdress[0].shipping_method && shippingAdress[0].shipping_method
    const rawDate = currentOrder.date_created && currentOrder.date_created
    const inputDate = new Date(rawDate);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    const formattedDate = inputDate.toLocaleDateString('en-GB', options);
    const orderDate = formattedDate
    const sortedProductsArray = products && products.sort(function (a: { data: { sku_id: number; }; }, b: { data: { sku_id: number; }; }) {
        return a.data.sku_id - b.data.sku_id;
    });
    const totalQty = products && products.map((product: any) => product.qty).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);

    const comments = currentOrder && currentOrder.customer_message;

    const client = currentOrder && currentOrder.customer && currentOrder.customer.name;
    const clientID = currentOrder && currentOrder.customer && currentOrder.customer.code;

    const styles = StyleSheet.create({
        page: {
            paddingTop: '16px',
            paddingBottom: '24px',
            paddingLeft: '24px',
            paddingRight: '24px',
        },
        headerTopCtn: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            padding: '5px',
            marginBottom: '24px',
        },
        flexCol: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
        },
        fJCenter: { justifyContent: 'center' },
        fICenter: { alignItems: 'center' },
        flexRow: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
        },
        headerTopTxt: {
            fontSize: '24px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '5px',
            marginBottom: '10px',
            fontFamily: 'Helvetica-Bold'
        },
        headerLabel: {
            fontSize: '9px',
            fontFamily: 'Helvetica-Bold'
        },
        headerTxt: {
            fontSize: '9px',
            fontFamily: 'Helvetica'
        },
        vs: {
            margin: '6px'
        },
        hvs: {
            marginTop: '6px',
            marginBottom: '6px',
            height: '1px',
            backgroundColor: '#000',
            width: '100%'
        },
        w10: { width: '10%' },
        w15: { width: '15%' },
        w20: { width: '20%' },
        w30: { width: '30%' },
        w35: { width: '35%' },
        bt: { borderTop: '0.5px solid #000' },
        bb: { borderBottom: '0.5px solid #000' },
        bl: { borderLeft: '0.5px solid #000' },
        br: { borderRight: '0.5px solid #000' },
        cell: { padding: '4px' },
        image: {
            width: '60px',
            height: '60px',
        },
        pageNumbers: {
            fontSize: '8px',
            fontFamily: 'Helvetica',
            position: 'absolute',
            bottom: 20,
            right: 20,
            textAlign: 'center'
        },
    });
    const ms = (...cls: any[]) => cls.reduce((acc, cl) => ({ ...acc, ...cl }), {});
    return (
        <Document style={{}}>
            <Page style={styles.page} wrap>
                <View id="header" style={styles.flexCol} wrap={false}>
                    <View style={styles.headerTopCtn}>
                        <Text style={styles.headerTopTxt}>Zag Bijoux Bordereau de préparation {orderId}</Text>
                    </View>
                    <View style={styles.flexCol}>
                        <Text style={styles.headerLabel}>{storeAdress}</Text>
                    </View>
                    <View style={styles.vs}></View>
                    <View style={styles.vs}></View>
                    <View style={styles.flexCol}>
                        <View style={styles.flexRow}>
                            <View style={styles.flexCol}>
                                <Text style={styles.headerLabel}>Billing Details</Text>
                                <View style={styles.vs}></View>
                                <Text style={styles.headerTxt}>{billingAdress.first_name} {billingAdress.last_name}</Text>
                                <Text style={styles.headerTxt}>{billingAdress.company}</Text>
                                <Text style={styles.headerTxt}>{billingAdress.street_1}, {billingAdress.street_2 && billingAdress.street_2}</Text>
                                <Text style={styles.headerTxt}>{billingAdress.city}, {billingAdress.zip}</Text>
                                <Text style={styles.headerTxt}>{billingAdress.country}</Text>
                                <Text style={styles.headerTxt}>Phone: {billingAdress.phone}</Text>
                            </View>
                            <View style={styles.flexCol}>
                                <Text style={styles.headerLabel}>Shipping Details</Text>
                                {
                                    shippingAdress.map((detail: any, index: number) => (
                                        <View style={styles.flexCol}>
                                            <View style={styles.vs}></View>
                                            <Text style={styles.headerTxt}>{detail.first_name} {detail.last_name}</Text>
                                            <Text style={styles.headerTxt}>{detail.company}</Text>
                                            <Text style={styles.headerTxt}>{detail.street_1} {detail.street_2 && detail.street_2}</Text>
                                            <Text style={styles.headerTxt}>{detail.city}, {detail.zip}</Text>
                                            <Text style={styles.headerTxt}>{detail.country}</Text>
                                            <Text style={styles.headerTxt}>Phone: {detail.phone}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.vs}></View>
                    <View style={styles.vs}></View>
                    <View style={styles.flexCol}>
                        <View style={styles.flexRow}>
                            <View style={styles.flexCol}>
                                <Text style={styles.headerLabel}>Order :&nbsp;<Text style={styles.headerTxt}>{orderId}</Text></Text>
                                <Text style={styles.headerLabel}>Order date :&nbsp;<Text style={styles.headerTxt}>{orderDate}</Text></Text>
                                <View style={styles.vs}></View>
                                <Text style={styles.headerLabel}>Client :&nbsp;<Text style={styles.headerTxt}>{client}</Text></Text>
                                <Text style={styles.headerLabel}>Client code :&nbsp;<Text style={styles.headerTxt}>{clientID}</Text></Text>
                            </View>
                            <View style={styles.flexCol}>
                                <Text style={styles.headerLabel}>Shipping method :&nbsp;<Text style={styles.headerTxt}>{shippingMethod}</Text></Text>
                                <Text style={styles.headerLabel}>Total quantity of items :&nbsp;<Text style={styles.headerTxt}>{totalQty}</Text></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.vs}></View>
                    <View style={styles.vs}></View>
                    <View style={styles.flexCol}>
                        <Text style={styles.headerLabel}>Comments :</Text>
                        <View style={styles.vs}></View>
                        <Text style={styles.headerTxt}>{comments}</Text>
                    </View>
                    <View style={styles.vs}></View>
                    <View style={styles.vs}></View>
                    <View style={styles.flexCol}>
                        <Text style={styles.headerLabel}>Services :</Text>
                        <View style={styles.vs}></View>
                        <Text style={styles.headerTxt}>{services.map(product => product.name).join(', ')}</Text>
                    </View>
                    <View style={styles.vs}></View>
                    <View style={styles.hvs}></View>
                    <View style={styles.vs}></View>
                </View>
                <View id="productTable" style={ms(styles.flexCol)}>
                    <Text style={styles.headerLabel}>Shipped Items</Text>
                    <View style={styles.vs}></View>
                    <View style={ms(styles.flexRow, styles.bt, styles.bb)} wrap={false} fixed>
                        <View style={ms(styles.flexCol, styles.w20, styles.fICenter, styles.bl, styles.cell)}>
                            <Text style={styles.headerLabel}></Text>
                        </View>
                        <View style={ms(styles.flexCol, styles.w30, styles.fICenter, styles.bl, styles.cell)}>
                            <Text style={styles.headerLabel}>Code / SKU</Text>
                        </View>
                        <View style={ms(styles.flexCol, styles.w10, styles.fICenter, styles.bl, styles.cell)}>
                            <Text style={styles.headerLabel}>Qty</Text>
                        </View>
                        <View style={ms(styles.flexCol, styles.w30, styles.fICenter, styles.bl, styles.cell)}>
                            <Text style={styles.headerLabel}>Bin Picking No.</Text>
                        </View>
                        <View style={ms(styles.flexCol, styles.w10, styles.fICenter, styles.bl, styles.br, styles.cell)}>
                            <Text style={styles.headerLabel}></Text>
                        </View>
                    </View>
                    {products.map((product, idx) => (
                        <View style={ms(styles.flexRow, styles.bb)} wrap={false}>
                            <View style={ms(styles.flexCol, styles.w20, styles.fICenter, styles.fJCenter, styles.bl, styles.cell)}>
                                <Image
                                    style={styles.image}
                                    src={product.data.image_url}
                                />
                            </View>
                            <View style={ms(styles.flexCol, styles.w30, styles.fICenter, styles.fJCenter, styles.bl, styles.cell)}>
                                <Text style={styles.headerTxt}>{product.data.sku}</Text>
                            </View>
                            <View style={ms(styles.flexCol, styles.w10, styles.fICenter, styles.fJCenter, styles.bl, styles.cell)}>
                                <Text style={styles.headerTxt}>{product.qty}</Text>
                            </View>
                            <View style={ms(styles.flexCol, styles.w30, styles.fICenter, styles.fJCenter, styles.bl, styles.cell)}>
                                <Text style={styles.headerTxt}>{product.bin_picking_number}</Text>
                            </View>
                            <View style={ms(styles.flexCol, styles.w10, styles.fICenter, styles.fJCenter, styles.bl, styles.br, styles.cell)}>
                                <Text style={styles.headerTxt}></Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.vs}></View>
                <View style={styles.vs}></View>
                <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed />
            </Page>
        </Document>
    )
}

export default PackingSlipPdf;
