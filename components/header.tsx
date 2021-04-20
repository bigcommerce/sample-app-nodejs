import { Box, Tabs } from '@bigcommerce/big-design';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InnerHeader from './innerHeader';

export const TabIds = {
    HOME: 'home',
    PRODUCTS: 'products',
};

export const TabRoutes = {
    [TabIds.HOME]: '/',
    [TabIds.PRODUCTS]: '/products',
};

const InnerRoutes = [
    '/products/[pid]',
];

const HeaderTypes = {
    GLOBAL: 'global',
    INNER: 'inner',
};

const Header = () => {
    const [activeTab, setActiveTab] = useState<string>('');
    const [headerType, setHeaderType] = useState<string>(HeaderTypes.GLOBAL);
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
        if (InnerRoutes.includes(pathname)) {
            // Use InnerHeader if route matches inner routes
            setHeaderType(HeaderTypes.INNER);
        } else {
            // Check if new route matches TabRoutes
            const tabKey = Object.keys(TabRoutes).find(key => TabRoutes[key] === pathname);

            // Set the active tab to tabKey or set no active tab if route doesn't match (404)
            setActiveTab(tabKey ?? '');
            setHeaderType(HeaderTypes.GLOBAL);
        }

    }, [pathname]);

    useEffect(() => {
        // Prefetch products page to reduce latency (doesn't prefetch in dev)
        router.prefetch('/products');
    });

    const items = [
        { id: TabIds.HOME, title: 'Home' },
        { id: TabIds.PRODUCTS, title: 'Products' },
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);

        return router.push(TabRoutes[tabId]);
    };

    if (headerType === HeaderTypes.INNER) return <InnerHeader />;

    return (
        <Box marginBottom="xxLarge">
            <Tabs
                activeTab={activeTab}
                items={items}
                onTabClick={handleTabClick}
            />
        </Box>
    );
};

export default Header;
