import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-800 mb-4">Something went wrong.</h1>
                    <p className="mb-4 text-red-600">The application crashed with the following error:</p>
                    <pre className="bg-white p-4 rounded border border-red-100 overflow-auto text-sm text-red-900 mb-4">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <details className="text-xs text-red-500">
                        <summary>Component Stack</summary>
                        <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
