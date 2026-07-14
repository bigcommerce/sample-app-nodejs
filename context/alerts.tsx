import { AlertsManager, createAlertsManager } from '@bigcommerce/big-design'
import { createContext, ReactNode, useContext, useMemo } from 'react'

type AlertsManagerInstance = ReturnType<typeof createAlertsManager>

const AlertsContext = createContext<AlertsManagerInstance | null>(null)

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const manager = useMemo(() => createAlertsManager(), [])

  return (
    <AlertsContext.Provider value={manager}>
      <AlertsManager manager={manager} />
      {children}
    </AlertsContext.Provider>
  )
}

export const useAlerts = () => {
  const ctx = useContext(AlertsContext)
  if (!ctx) throw new Error('useAlerts must be used inside AlertsProvider')

  return ctx
}
