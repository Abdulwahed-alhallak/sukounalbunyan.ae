import { SVGAttributes } from 'react';

export function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant Stylized 'N' Icon for Noble Architecture */}
            <defs>
                <linearGradient id="noble-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                </linearGradient>
            </defs>
            {/* Background shape */}
            <rect x="30" y="30" width="140" height="140" rx="40" fill="url(#noble-gradient)" />
            {/* Stylized 'N' */}
            <path
                d="M70 65V135M130 65V135M70 65L130 135"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.95 }}
            />
        </svg>
    );
}

export default ApplicationLogo;
