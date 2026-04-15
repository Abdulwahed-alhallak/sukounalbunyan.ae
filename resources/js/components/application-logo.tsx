import { SVGAttributes } from 'react';

export function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="geist-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
                </linearGradient>
            </defs>
            {/* Abstract Premium 'N' — Geometric Precision */}
            <path 
                d="M20 80L50 20L80 80" 
                stroke="url(#geist-logo-gradient)" 
                strokeWidth="12" 
                strokeLinecap="square" 
            />
            <path 
                d="M35 50H65" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeOpacity="0.3"
                className="animate-pulse"
            />
        </svg>
    );
}

export default ApplicationLogo;
