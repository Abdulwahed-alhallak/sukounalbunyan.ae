import { SVGAttributes } from "react";

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Elegant Stylized 'D' Icon for DionONE */}
            <defs>
                <linearGradient id="dion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                </linearGradient>
            </defs>
            <path 
                d="M40 40C40 34.4772 44.4772 30 50 30H110C143.137 30 170 56.8629 170 90V110C170 143.137 143.137 170 110 170H50C44.4772 170 40 165.523 40 160V40Z" 
                fill="url(#dion-gradient)"
            />
            <path 
                d="M75 65V135" 
                stroke="white" 
                strokeWidth="12" 
                strokeLinecap="round" 
                style={{ opacity: 0.9 }}
            />
            <path 
                d="M75 65H100C119.33 65 135 80.67 135 100C135 119.33 119.33 135 100 135H75" 
                stroke="white" 
                strokeWidth="12" 
                strokeLinecap="round" 
                style={{ opacity: 0.9 }}
            />
        </svg>
    );
}
