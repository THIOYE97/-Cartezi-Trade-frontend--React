
import React from 'react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
                    <h1 className="text-4xl font-bold mb-4">Oops!</h1>
                    <p className="text-xl mb-8 text-center text-muted-foreground">
                        Something went wrong. We're sorry for the inconvenience.
                    </p>
                    {this.state.error && (
                        <pre className="bg-muted p-4 rounded-md text-sm mb-8 max-w-lg overflow-auto text-left">
                            {this.state.error.toString()}
                        </pre>
                    )}
                    <Button onClick={this.handleReload} variant="default" size="lg">
                        Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
