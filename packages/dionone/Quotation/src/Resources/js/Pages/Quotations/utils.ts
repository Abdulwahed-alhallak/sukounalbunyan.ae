export const getStatusBadgeClasses = (status: string) => {
    const colors = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-muted text-foreground',
        accepted: 'bg-foreground/10 text-foreground',
        rejected: 'bg-destructive/10 text-destructive',
        expired: 'bg-muted text-muted-foreground'
    };
    return `px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors]}`;
};