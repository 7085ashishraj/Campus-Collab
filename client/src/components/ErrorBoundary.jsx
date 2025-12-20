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
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 overflow-auto">
                            <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-4 overflow-auto max-h-64">
                            <p className="font-mono text-xs text-gray-600 whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
