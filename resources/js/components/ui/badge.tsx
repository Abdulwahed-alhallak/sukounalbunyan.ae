import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-foreground text-background',
                secondary: 'border-transparent bg-muted text-muted-foreground',
                destructive: 'border-transparent bg-destructive text-destructive-foreground',
                outline: 'border-border text-foreground',
                success: 'border-transparent bg-foreground/5 text-foreground',
                warning: 'border-transparent bg-muted text-muted-foreground',
                info: 'border-transparent bg-muted text-foreground',
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
