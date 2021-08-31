import { AlertsManager, createAlertsManager } from '@bigcommerce/big-design';
import { default as Router } from 'next/router';
import React, { createContext, useEffect, useMemo } from 'react';

type AlertsContextType = ReturnType<typeof createAlertsManager>;

export const AlertsContext = createContext<AlertsContextType | null>(null);

export const AlertsProvider: React.FC = ({ children }) => {
    const alertsManager = useMemo(() => createAlertsManager(), []);

    useEffect(() => {
        Router.events.on('routeChangeStart', alertsManager.clear);

        return () => Router.events.off('routeChangeStart', alertsManager.clear);
    }, [alertsManager]);

    return (
        <AlertsContext.Provider value={alertsManager}>
            <AlertsManager manager={alertsManager} />
            {children}
        </AlertsContext.Provider>
  );
};
