import { useState, createContext, useContext } from 'react';

export type TimezoneStateContextType = [string, (value: string) => void];

export const TimezoneStateContext = createContext<TimezoneStateContextType | null>(null);

export const TimezoneStateProvider = ({ children }: { children: React.ReactNode }) => {
  const state = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return <TimezoneStateContext.Provider value={state}>{children}</TimezoneStateContext.Provider>;
};

export const useTimezoneStateContext = (): TimezoneStateContextType => {
  const context = useContext(TimezoneStateContext);

  if (!context)
    throw new Error("'useTimezoneState' must be called within a 'TimezoneStateContext' provider");

  return context;
};
