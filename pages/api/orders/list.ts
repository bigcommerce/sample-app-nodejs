import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'url';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');
        const bigcommerceV3 = bigcommerceClient(accessToken, storeHash);
        const { page, limit, sort, direction, include, status_id } = req.query;
        const params = new URLSearchParams({ page, limit, include, status_id, ...(sort && {sort, direction}) }).toString();

        console.log('***********************');
        console.log('1');
        console.log('***********************');

        let rawResponse = undefined;
        try {
            rawResponse = await bigcommerce.get(`/orders?${params}`);
        } catch (error) {
            console.log(`list on /orders?${params} : TROW ERROR`);
            throw error;
        }
        
        console.log('***********************');
        console.log('2');
        console.log('***********************');

        const response = await Promise.all(rawResponse.map(async (order: any) => {
            const { id } = order;
            if (id == 121) {
                console.log('***********************');
                console.log(`HERE .${id}`);
                console.log('***********************');
            }
            console.log('***********************');
            console.log(`2.1.${id} -- ${order.products.resource}`);
            console.log('***********************');
            let rawProducts = [];
            try {
                rawProducts = await bigcommerce.get(order.products.resource);
            } catch (error) {
                console.log(`list on /orders/${id}/products : error`, order.products.resource, error);
            }
            console.log('***********************');
            console.log(`2.2.${id}`);
            console.log('***********************');
            let products = [];
            try {
                products = await Promise.all(rawProducts.map(async (product: any) => {
                
                    if (product.variant_id == 121) {
                        console.log('***********************');
                        console.log(`HERE .${id} variant ${product.variant_id}`);
                        console.log('***********************');
                    }
                    
                    if (product.product_id == 121) {
                        console.log('***********************');
                        console.log(`HERE .${id} product ${product.product_id}`);
                        console.log('***********************');
                    }
                    if (!product.variant_id) {
                        try {
                            console.log(`list item on /catalog/products/${product.product_id} : START`);
                            const p = await bigcommerceV3.get(`/catalog/products/${product.product_id}`, { include: 'primary_image' });
                            console.log(`list item on /catalog/products/${product.product_id} : END`);
                            return {...product, ...p, qty: product.quantity};
                        } catch (error) {
                            console.log(`list item on /catalog/products/${product.product_id} : TROW ERROR`, error);
                            return undefined;
                        }
                    } else {
                        try{
                            console.log(`list item on /catalog/products/${product.product_id}/variants/${product.variant_id} : START`);
                            const p = await bigcommerceV3.get(`/catalog/products/${product.product_id}/variants/${product.variant_id}`, { include: 'primary_image' });
                            console.log(`list item on /catalog/products/${product.product_id}/variants/${product.variant_id} : END`);
                            return {...product, ...p, qty: product.quantity};
                        } catch (error) {
                            console.log(`list item on /catalog/products/${product.product_id}/variants/${product.variant_id} : TROW ERROR`, error);
                            return undefined;
                        }
                    }
                }))
            } catch (error) {
                console.log(`list on /orders/${id}/products : error`, error);
            }
            console.log('***********************');
            console.log(`2.3.${id} -- ${order.shipping_addresses.resource} -- ${order.coupons.resource}`);
            console.log('***********************');
            let shippingAddresses = [];
            try {
                shippingAddresses = await bigcommerce.get(order.shipping_addresses.resource);
            } catch (error) {
                console.log(`list on /orders/${id}/shipping_addresses : error`);
            }
            let coupons = [];
            try {
                coupons = await bigcommerce.get(order.coupons.resource);
            } catch (error) {
                console.log(`list on /orders/${id}/coupons : error`);
            }
            return { ...order, products: products.filter(p => !!p), shippingAddresses, coupons };
        }));

        console.log('***********************');
        console.log('3');
        console.log('***********************');

        res.status(200).json(response/*.filter(order => order.status_id === 11)*/);
    } catch (error) {
        const { message, response } = error;
        console.log('list***: error', error);
        res.status(response?.status || 500).json({ message });
    }
}
