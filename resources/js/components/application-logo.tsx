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
            {/* Geometric Sukoun 'S' — Stability & Flow */}
            <path
                d="M75 25H35C26.7157 25 20 31.7157 20 40C20 48.2843 26.7157 55 35 55H65C73.2843 55 80 61.7157 80 70C80 78.2843 73.2843 85 65 85H25"
                stroke="url(#geist-logo-gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="50" cy="55" r="4" fill="currentColor" className="animate-pulse" />
        </svg>
    );
}

export default ApplicationLogo;
