export const getStatusBadgeClasses = (status: string) => {
    const colors = {
        draft: 'bg-gray-100 text-gray-800',
        approved: 'bg-foreground/10 text-foreground',
        completed: 'bg-muted text-foreground',
        cancelled: 'bg-destructive/10 text-destructive',
    };
    return `px-2 py-1 rounded-full text-sm ${colors[status as keyof typeof colors]}`;
};
