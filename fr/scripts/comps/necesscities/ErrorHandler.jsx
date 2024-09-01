import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }
  
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with an error message
      this.setState({
        hasError: true,
        error: error,
        errorInfo: errorInfo
      });
      // Log error details to an error reporting service here if needed
    }
  
    render() {
      if (this.state.hasError) {
        if (process.env.NODE_ENV === 'development') {
          // Display detailed error information in development mode
          return (
            <div>
              <h2>Something went wrong.</h2>
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            </div>
          );
        } else {
          // Display a generic message in production mode
          return (
            <div>
              <h2>Something went pretty wrong</h2>
              <p>Please report this issue on our GitHub repository.</p>
              <p>{this.state.error && this.state.error.toString()}</p>
            </div>
          );
        }
      }
  
      // Render children components in the normal case
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;