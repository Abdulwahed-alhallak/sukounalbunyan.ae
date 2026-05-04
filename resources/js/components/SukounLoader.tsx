import React from 'react';
import { ApplicationLogo } from './application-logo';

export function SukounLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-card transition-colors duration-500 dark:bg-[#020617]">
            <div className="relative flex flex-col items-center">
                {/* Ambient Glow */}
                <div className="animate-pulse-soft pointer-events-none absolute inset-0 -m-16 rounded-full bg-foreground/25 blur-[100px]" />

                <div className="relative transform duration-1000 animate-in fade-in zoom-in">
                    <ApplicationLogo className="premium-shimmer h-28 w-auto text-primary" />

                    {/* Premium Shimmer Overlay Layer */}
                    <div className="pointer-events-none absolute inset-0 mix-blend-overlay">
                        <div className="absolute -left-full top-0 h-full w-full skew-x-[-25deg] animate-[glance_2.5s_infinite_ease-in-out_0.5s] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
