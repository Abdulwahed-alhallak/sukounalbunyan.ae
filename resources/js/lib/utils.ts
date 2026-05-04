import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Add global fail-safe for Sukoun Albunyan Production stability
if (typeof window !== 'undefined') {
    (window as any).cn = cn;
}
