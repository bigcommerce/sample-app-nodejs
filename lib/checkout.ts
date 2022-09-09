const checkoutAppId = process.env.CHECKOUT_APP_ID;
const appId = process.env.CURRENT_APP_ID ?? checkoutAppId;
const merchantUuid = process.env.CHECKOUT_MERCHANT;
const environment = process.env.ENVIRONMENT;
const isProd = environment === 'bigcommerce.com';
const hostName = isProd ? environment : `-${environment}`;

export const trialDays = 7;

export const plans = [
    {
        name: 'Standard',
        price: '40.00',
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
    '1': {
        product: {
            id: '1',
            type: 'app',
        },
        pricingPlan: {
            interval: "MONTH",
            price: {
                value: 40.00,
                currencyCode: 'USD'
            },
        },
        trial_days: trialDays,
    },
    '2': {
        product: {
            id: '2',
            type: 'app',
        },
        pricingPlan: {
            interval: 'MONTH',
            price: {
                value: 79.95,
                currencyCode: 'USD',
            },
        },
        trial_days: trialDays,
    },
};

const checkoutGraphQuery = `
  mutation ($checkout: CreateCheckoutInput!) {
    checkout {
      createCheckout(input: $checkout) {
        checkout {
          id
          accountId
          status
          checkoutUrl
          items(first: 2) {
            edges {
              node {
                subscriptionId
                status
                product {
                  entityId
                  type
                }
                scope {
                  entityId
                  type
                }
                pricingPlan {
                  interval
                  price {
                    value
                    currencyCode
                  }
                  trialDays
                }
                redirectUrl
                description
              }
            }
          }
        }
      }
    }
  }
`;

export function getCheckoutBody(productId: string, storeHash: string) {
    return {
        query: checkoutGraphQuery,
        variables: {
            checkout: {
                accountId: `bc/account/account/${merchantUuid}`,
                items: [
                    {
                    product: {
                        entityId: `${checkoutAppId}`,
                        type: 'APPLICATION'
                    },
                    scope: {
                        entityId: `${storeHash}`,
                        type: 'STORE'
                    },
                    pricingPlan: planItems[productId].pricingPlan,
                    redirectUrl: `https://store-${storeHash}.my${hostName}/manage/app/${appId}/${productId}`,
                    description: 'application'
                    }
                ]
            }
        },
    };
}

const subscriptionQuery = `
  query q1($id: ID!) {
    account {
      checkout(id: $id) {
        id
        accountId
        status
        checkoutUrl
        items(first: 2) {
            edges {
                node {
                  subscriptionId
                  status
                  product {
                      entityId
                      type
                  }
                  scope {
                      entityId
                      type
                  }
                  pricingPlan {
                  interval
                  price {
                      value
                      currencyCode
                  }
                  trialDays
                  }
                  redirectUrl
                  description
                }
              }
          }
      }
    }
  }
`;

export function getSubscriptionBody(subscriptionId: string) {
    return {
        query: subscriptionQuery,
        variables: {
            "id": `bc/account/checkout/${subscriptionId}`
        }
    };
}
