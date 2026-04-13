import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';
import languagesData from '@/../lang/language.json';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

const getCountryFlag = (countryCode: string): string => {
    if (!countryCode) return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

const languages = languagesData
    .filter((lang) => lang.enabled !== false)
    .map((lang) => ({
        ...lang,
        flag: getCountryFlag(lang.countryCode || ''),
    }));

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || localStorage.getItem('i18nextLng') || 'en');

    useEffect(() => {
        const lang = i18n.language || 'en';
        setCurrentLanguage(lang);
        
        // Dynamic Direction Application
        const isRtl = ['ar', 'he', 'fa', 'ur', 'ku'].includes(lang.split('-')[0]);
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.body.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // Sync with CSS logical properties
        if (isRtl) {
            document.documentElement.classList.add('rtl');
        } else {
            document.documentElement.classList.remove('rtl');
        }
    }, [i18n.language]);

    const handleLanguageChange = (languageCode: string) => {
        setCurrentLanguage(languageCode);
        i18n.changeLanguage(languageCode);
        localStorage.setItem('i18nextLng', languageCode);
        
        // Hard refresh or re-sync if needed, but i18next usually handles it
        // We trigger a small delay to ensure all modules pick up the change
        setTimeout(() => {
             router.reload({ preserveScroll: true });
        }, 100);
    };

    const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

    return (
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-auto gap-2 border-border/50 bg-background px-3 py-1 shadow-sm transition-all hover:bg-muted/50 focus:ring-1 focus:ring-primary/20 dark:bg-black/20 [&>svg]:hidden">
                <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[13px] font-medium tracking-tight">{currentLang.name}</span>
                    <span className="text-xs opacity-80">{currentLang.flag}</span>
                </div>
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[160px] p-1 shadow-menu-material">
                <div className="mb-1 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {t('Select Language')}
                </div>
                {languages.map((language) => (
                    <SelectItem 
                        key={language.code} 
                        value={language.code}
                        className={cn(
                            "rounded-md py-2 transition-colors focus:bg-accent",
                            currentLanguage === language.code && "bg-accent/50"
                        )}
                    >
                        <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span>{language.flag}</span>
                                <span className="text-[14px]">{language.name}</span>
                            </div>
                            {currentLanguage === language.code && <Check className="h-3 w-3 text-primary" />}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
