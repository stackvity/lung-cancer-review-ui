// app/components/shared/ErrorBoundary/ErrorBoundary.tsx
"use client";

import React, { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  fallbackContent: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo }); // Save error info for display or logging
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallbackContent;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
