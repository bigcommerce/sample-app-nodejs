import { TableItem } from '@types';

// useProducts Mock
const summaryMock = {
    inventory_count: 3,
    variant_count: 2,
    primary_category_name: 'widgets',
};

export const useProducts = jest.fn().mockImplementation(() => ({
    summary: summaryMock,
}));

// useProductList Mock
export const ROW_NUMBERS = 5;

// Generate mock tableItems
const generateList = (): TableItem[] => (
    [...Array(ROW_NUMBERS)].map((_, index) => ({
        id: index,
        name: `Product ${index}`,
        price: (index + 1) * 10,
        stock: 7,
    }))
);

export const useProductList = jest.fn().mockImplementation(() => ({
    list: generateList(),
    meta: { pagination: { total: ROW_NUMBERS } }
}));

// useProductInfo Mock
const productMock = {
    description: '<h1>some sample product</h1>',
    isVisible: true,
    name: 'Product 1',
    price: 20,
    type: 'physical',
};

export const useProductInfo = jest.fn().mockImplementation(() => ({
    product: productMock,
}));

// useContext Mock
export const useContext = jest.fn().mockImplementation(() => ({
    appPID: '1234',
    context: 'eysdfkj.2345qwfeup2fht2u34hg9hsafgp2tiuh',
    setContext: jest.fn(),
    setAppPID: jest.fn(),
}));

// useAlerts Mock
export const useAlerts = jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
}));

// useSubscription Mock
export const useSubscription = jest.fn().mockImplementation(() => ({
    subscription: {
        pid: '2',
        showPaidWelcome: false,
        isPaidApp: true,
        trialEndDate: Date.now(),
    },
}));
