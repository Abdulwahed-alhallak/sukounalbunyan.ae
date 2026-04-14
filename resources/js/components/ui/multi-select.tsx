'use client';

import * as React from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Badge } from './badge';

export interface MultiSelectOption {
    value: string;
    label: string;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
    className?: string;
    disabled?: boolean;
    maxCount?: number;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
    (
        {
            options = [],
            value = [],
            onValueChange,
            placeholder,
            searchable = true,
            className,
            disabled = false,
            maxCount = 2,
        },
        ref
    ) => {
        const { t } = useTranslation();
        const [open, setOpen] = React.useState(false);
        const [search, setSearch] = React.useState('');

        const filteredOptions = React.useMemo(() => {
            if (!searchable || !search) return options;
            return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
        }, [options, search, searchable]);

        const selectedOptions = options.filter((option) => value.includes(option.value));

        const handleSelect = (optionValue: string) => {
            const newValue = value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue];
            onValueChange(newValue);
        };

        const handleRemove = (optionValue: string) => {
            onValueChange(value.filter((v) => v !== optionValue));
        };

        const handleClear = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onValueChange([]);
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'vercel-input flex h-auto min-h-10 w-full items-center justify-between px-3 py-2 text-label-14',
                            className
                        )}
                        onClick={() => !disabled && setOpen(!open)}
                    >
                        <div className="flex flex-wrap gap-1">
                            {selectedOptions.length > 0 ? (
                                <>
                                    {selectedOptions.slice(0, maxCount).map((option) => (
                                        <Badge
                                            key={option.value}
                                            variant="secondary"
                                            className="bg-accent/50 text-accent-foreground border-transparent px-2 py-0"
                                        >
                                            <span className="text-xs">{option.label}</span>
                                            <button
                                                className="ms-1 h-3 w-3 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleRemove(option.value);
                                                    }
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemove(option.value);
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {selectedOptions.length > maxCount && (
                                        <Badge variant="secondary" className="px-2 py-0 text-xs">
                                            +{selectedOptions.length - maxCount} {t('more')}
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <span className="text-muted-foreground">{placeholder || t('Select...')}</span>
                            )}
                        </div>
                        <div className="flex items-center self-stretch ps-2">
                            {selectedOptions.length > 0 && (
                                <X
                                    className="me-2 h-4 w-4 cursor-pointer text-muted-foreground opacity-50 hover:opacity-100"
                                    onClick={handleClear}
                                />
                            )}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 geist-menu-material" align="start">
                    <div className="flex flex-col">
                        {searchable && (
                            <div className="flex items-center border-b px-3 py-2">
                                <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                    placeholder={t('Search...')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    autoFocus
                                />
                            </div>
                        )}
                        <div className="max-h-[300px] overflow-y-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t('No options found.')}
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                                                isSelected && 'bg-accent/50 font-medium text-accent-foreground'
                                            )}
                                            onClick={() => handleSelect(option.value)}
                                        >
                                            <div
                                                className={cn(
                                                    'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                                                )}
                                            >
                                                {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                                            </div>
                                            <span>{option.label}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
