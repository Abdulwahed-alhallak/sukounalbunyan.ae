import React from 'react';

export function DionLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-card dark:bg-[#020617] z-[9999] transition-colors duration-500">
            <div className="relative flex flex-col items-center">
                {/* Ambient Glow */}
                <div className="absolute inset-0 -m-16 bg-foreground/25 blur-[100px] rounded-full animate-pulse-soft pointer-events-none" />
                
                <div className="relative transform animate-in fade-in zoom-in duration-1000">
                    {/* Light Mode Logo (Dark Image) */}
                    <img 
                        src="/storage/uploads/logo/logo-dark-dion.png" 
                        alt="DionONE" 
                        className="h-28 w-auto dark:hidden premium-shimmer"
                    />
                    
                    {/* Dark Mode Logo (Light Image) */}
                    <img 
                        src="/storage/uploads/logo/logo-light-dion.png" 
                        alt="DionONE" 
                        className="h-28 w-auto hidden dark:block premium-shimmer"
                    />
                    
                    {/* Premium Shimmer Overlay Layer */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-25deg] animate-[glance_2.5s_infinite_ease-in-out_0.5s]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
