import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface ErrorProps {
    status: number;
}

export default function Error({ status }: ErrorProps) {
    const title = {
        503: 'Service Unavailable',
        500: 'Server Error',
        404: 'Page Not Found',
        403: 'Forbidden',
    }[status] || 'Error';

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status] || 'An unexpected error occurred.';

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center px-4">
            <Head title={title} />
            <div className="max-w-md w-full rounded-lg border border-border bg-card overflow-hidden">
                <div className="p-8">
                    <div className="mb-8">
                        <div className="text-9xl font-black text-foreground/10">
                            {status}
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-foreground tracking-tight mb-3">
                        {title}
                    </h1>
                    
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                        {description}
                    </p>
                    
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md text-background bg-foreground hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <svg className="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Return to Dashboard
                    </Link>
                </div>
                
                <div className="px-8 py-4 bg-muted/50 border-t border-border flex justify-between items-center">
                   <div className="text-xs text-muted-foreground font-medium tracking-wide">Noble Architecture ECOSYSTEM</div>
                   <div className="flex space-x-2">
                       <div className="w-2 h-2 rounded-full bg-foreground/20"></div>
                       <div className="w-2 h-2 rounded-full bg-foreground/15"></div>
                       <div className="w-2 h-2 rounded-full bg-foreground/10"></div>
                   </div>
                </div>
            </div>
        </div>
    );
}

