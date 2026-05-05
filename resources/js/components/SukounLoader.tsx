import React from 'react';
import { ApplicationLogo } from './application-logo';

export function SukounLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-card transition-colors duration-500 dark:bg-background">
            <div className="relative flex flex-col items-center">
                {/* Ambient Glow */}
                <div className="animate-pulse-soft pointer-events-none absolute inset-0 -m-16 rounded-full bg-foreground/25 blur-[100px]" />

                <div className="relative transform duration-1000 animate-in fade-in zoom-in">
                    <ApplicationLogo className="h-28 w-auto text-primary" />
                </div>
            </div>
        </div>
    );
}
