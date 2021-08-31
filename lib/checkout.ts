const appId = process.env.APP_ID;

export const trialDays = 7;

export const plans = [
    {
        name: 'Standard',
        price: '29.95',
        description: `Start out with inventory tracking, product variant lists,
            and more. Perfect for businesses with fewer than 1,000 SKUs.`,
        popular: false,
        pid: '1',
    },
    {
        name: 'Plus',
        price: '79.95',
        description: `Take your business to the next level with alerts and smart tracking.
            Best for stores with more than 1,000 SKUs.`,
        popular: true,
        pid: '2'
    },
];

// TODO: place data inside of a DB and create an API call
const planItems = {
    '2': {
        product: {
            id: '2',
            type: 'app',
        },
        pricing_plan: {
            interval: 'monthly',
            price: {
                amount: 79.95,
                currency_code: 'USD',
            },
        },
        trial_days: trialDays,
    },
    '1': {
        product: {
            id: '1',
            type: 'app',
        },
        pricing_plan: {
            interval: 'monthly',
            price: {
                amount: 29.95,
                currency_code: 'USD'
            },
        },
        trial_days: trialDays,
    },
};

export function getCheckoutBody(productId: string, storeHash: string) {
    return {
        account_id: '3d12cf3b-1c2a-4731-8049-730d5dee8ed8', // TODO: replace with actual auth
        line_items: [planItems[productId]],
        notification_url: 'https://8eb69c8ea36a9d3eafe7f05625577609.m.pipedream.net',
        redirect_url: `https://store-${storeHash}.mybigcommerce.com/manage/app/${appId}/upgrade/${productId}`,
    };
}
