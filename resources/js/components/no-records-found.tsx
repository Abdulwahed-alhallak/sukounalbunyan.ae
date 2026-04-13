import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface NoRecordsFoundProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    filteredDescription?: string;
    hasFilters?: boolean;
    onClearFilters?: () => void;
    createPermission?: string;
    onCreateClick?: () => void;
    createButtonText?: string;
    className?: string;
}

export default function NoRecordsFound({
    icon: Icon,
    title,
    description,
    filteredDescription,
    hasFilters = false,
    onClearFilters,
    createPermission,
    onCreateClick,
    createButtonText,
    className = 'h-64',
}: NoRecordsFoundProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;

    const hasCreatePermission = createPermission ? auth.user?.permissions?.includes(createPermission) : true;

    const displayDescription = hasFilters
        ? filteredDescription || t('No records match your current filters or search criteria.')
        : description;

    return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
            <Icon className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            {displayDescription && <p className="mb-4 text-muted-foreground">{displayDescription}</p>}
            {hasFilters
                ? onClearFilters && (
                      <Button variant="outline" onClick={onClearFilters}>
                          {t('Clear filters')}
                      </Button>
                  )
                : hasCreatePermission &&
                  onCreateClick && (
                      <Button onClick={onCreateClick}>
                          <Plus className="me-2 h-4 w-4" />
                          {createButtonText || t('Create')}
                      </Button>
                  )}
        </div>
    );
}
