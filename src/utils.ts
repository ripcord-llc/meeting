import { createContext, useContext } from 'react';

export const ErrorHandlerContext = createContext<((error: Error) => void) | null>(null);

export const useErrorHandler = () => {
  const context = useContext(ErrorHandlerContext);

  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }

  return context;
};
