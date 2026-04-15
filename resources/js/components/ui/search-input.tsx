import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (clearSearch?: boolean) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    onSearch,
    placeholder,
    className = 'w-full max-w-[320px]',
}: SearchInputProps) {
    const { t } = useTranslation();
    const initialRender = useRef(true);

    // Auto-search debounce
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            onSearch();
        }, 400);
        return () => clearTimeout(timer);
    }, [value, onSearch]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                    placeholder={placeholder || t('Search...')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`ps-10 ${value ? 'pe-10' : ''} ${className}`}
                />
                {value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onChange('');
                            onSearch(true);
                        }}
                        className="absolute end-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button variant="secondary" onClick={() => onSearch()}>
                {t('Search')}
            </Button>
        </div>
    );
}
