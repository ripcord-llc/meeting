import { Component, ErrorInfo } from 'react';

import Dialog from './dialog/Dialog';
import ErrorScreen from './ErrorScreen';

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
