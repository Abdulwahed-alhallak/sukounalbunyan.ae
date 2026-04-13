import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import languagesData from '@/../lang/language.json';
const getCountryFlag = (countryCode: string): string => {
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
        flag: getCountryFlag(lang.countryCode),
    }));

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

    useEffect(() => {
        const lang = i18n.language || 'en';
        setCurrentLanguage(lang);
        const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lang.substring(0, 2));
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [i18n.language]);

    const handleLanguageChange = (languageCode: string) => {
        setCurrentLanguage(languageCode);
        i18n.changeLanguage(languageCode);
    };

    const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

    return (
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-auto border bg-card shadow-sm hover:bg-muted/50 dark:border-border dark:bg-card [&>svg]:hidden">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{currentLang.name}</span>
                    <span className="text-sm">{currentLang.flag}</span>
                </div>
            </SelectTrigger>
            <SelectContent align="end" className="max-h-48 overflow-y-auto">
                {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center gap-2">
                            <span>{language.flag}</span>
                            <span>{language.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
