import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrand } from '@/contexts/brand-context';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const { settings } = useBrand();
    const [theme, setTheme] = useState(settings.themeMode || 'light');
    const [isAnimating, setIsAnimating] = useState(false);

    const applyTheme = (newTheme: string) => {
        const root = document.documentElement;

        if (newTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
    };

    const toggleTheme = () => {
        if (isAnimating) return;

        const newTheme = theme === 'light' ? 'dark' : 'light';
        setIsAnimating(true);
        setTheme(newTheme);

        // Apply immediately for instant visual feedback
        applyTheme(newTheme);

        setTimeout(() => setIsAnimating(false), 300);

        // Persist to backend
        try {
            router.post(
                route('settings.theme.update'),
                { theme: newTheme },
                {
                    preserveScroll: true,
                    onSuccess: () => {},
                }
            );
        } catch (e) {
            console.log('Theme update route not found, applying locally');
        }
    };

    useEffect(() => {
        setTheme(settings.themeMode || 'light');
    }, [settings.themeMode]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                'relative h-8 w-8 rounded-md text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground',
                isAnimating && 'scale-95'
            )}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <Sun
                className={cn(
                    'h-[18px] w-[18px] transition-all duration-300',
                    theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                )}
                strokeWidth={1.5}
            />
            <Moon
                className={cn(
                    'absolute h-[18px] w-[18px] transition-all duration-300',
                    theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                )}
                strokeWidth={1.5}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
