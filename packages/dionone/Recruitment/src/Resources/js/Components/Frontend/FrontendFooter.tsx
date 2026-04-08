import React from 'react';

interface FrontendFooterProps {
    userSlug?: string;
    brandSettings: {
        footerText?: string;
    };
}

export default function FrontendFooter({ userSlug, brandSettings }: FrontendFooterProps) {
    return (
        <footer className="bg-foreground text-background py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        {brandSettings?.footerText || `© ${new Date().getFullYear()} DionONE. All rights reserved.`}
                    </p>
                </div>
            </div>
        </footer>
    );
}