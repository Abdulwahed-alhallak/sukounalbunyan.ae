import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/contexts/brand-context";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export function ThemeToggle() {
    const { settings } = useBrand();
    const [theme, setTheme] = useState(settings.themeMode || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Update document class immediately for instant feedback
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Send to backend to persist
        try {
            router.post(route('settings.theme.update'), {
                theme: newTheme
            }, {
                preserveScroll: true,
                onSuccess: () => {}
            });
        } catch (e) {
            console.log("Theme update route not found, applying locally");
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
            className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
