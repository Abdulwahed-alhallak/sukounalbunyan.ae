import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('vercel-skeleton h-full w-full', className)} {...props} />;
}

export { Skeleton };
