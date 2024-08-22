import { Component, ErrorInfo, createContext, useContext } from 'react';

import Dialog from './dialog/Dialog';
import ErrorScreen from './ErrorScreen';

export const ErrorHandlerContext = createContext<((error: Error) => void) | null>(null);

export const useErrorHandler = () => {
  const context = useContext(ErrorHandlerContext);

  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }

  return context;
};

export default class ErrorBoundary extends Component<
  {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  },
  {
    hasError: boolean;
    error: Error | null;
  }
> {
  constructor(props: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    super(props);

    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    const { children, open, onClose } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
          <ErrorScreen error={error?.message} />
        </Dialog>
      );
    }

    return children;
  }
}
