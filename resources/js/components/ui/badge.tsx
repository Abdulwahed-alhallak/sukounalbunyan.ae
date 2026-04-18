import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
    {
        variants: {
            variant: {
                default: 'vercel-badge vercel-badge-neutral border-transparent',
                secondary: 'vercel-badge vercel-badge-neutral',
                destructive: 'vercel-badge vercel-badge-error',
                outline: 'vercel-badge vercel-badge-neutral border-border bg-transparent',
                success: 'vercel-badge vercel-badge-success',
                warning: 'vercel-badge vercel-badge-warning',
                info: 'vercel-badge vercel-badge-info',
                purple: 'vercel-badge vercel-badge-purple',
                cyan: 'vercel-badge vercel-badge-cyan',
                pink: 'vercel-badge vercel-badge-pink',
                premium: 'vercel-badge vercel-badge-premium font-bold',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={badgeVariants({ variant, className })} {...props} />;
}

export { Badge, badgeVariants };
