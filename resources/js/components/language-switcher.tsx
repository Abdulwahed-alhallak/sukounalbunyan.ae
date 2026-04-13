import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Settings, Plus } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { CreateLanguageModal } from './create-language-modal';
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
    const { auth } = usePage().props as any;
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Check if user is superadmin
    const isSuperAdmin = auth?.user?.roles?.some((role: any) => role.name === 'superadmin' || role === 'superadmin');

    useEffect(() => {
        const lang = i18n.language || 'en';
        setCurrentLanguage(lang);
        const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lang.substring(0, 2));
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [i18n.language]);

    const handleLanguageChange = (languageCode: string) => {
        if (languageCode === 'manage_languages') {
            router.get(route('languages.manage'), { lang: currentLanguage });
            return;
        }

        if (languageCode === 'create_language') {
            setShowCreateModal(true);
            return;
        }

        setCurrentLanguage(languageCode);
        i18n.changeLanguage(languageCode);
    };

    const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

    return (
        <>
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
                    {isSuperAdmin && (
                        <>
                            <div className="my-1 border-t" />
                            <SelectItem value="create_language">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    <span>{t('Create Language')}</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="manage_languages">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span>{t('Manage Languages')}</span>
                                </div>
                            </SelectItem>
                        </>
                    )}
                </SelectContent>
            </Select>

            <CreateLanguageModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onSuccess={() => setShowCreateModal(false)}
            />
        </>
    );
}
