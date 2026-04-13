import React from 'react';

interface FrontendFooterProps {
    userSlug?: string;
    brandSettings: {
        footerText?: string;
    };
}

export default function FrontendFooter({ userSlug, brandSettings }: FrontendFooterProps) {
    return (
        <footer className="bg-foreground py-4 text-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        {brandSettings?.footerText ||
                            `© ${new Date().getFullYear()} Noble Architecture. All rights reserved.`}
                    </p>
                </div>
            </div>
        </footer>
    );
}
