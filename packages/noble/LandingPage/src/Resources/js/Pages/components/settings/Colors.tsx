import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

interface ColorsProps {
    data: any;
    getSectionData: (key: string) => any;
    updateSectionData: (key: string, updates: any) => void;
    updateSectionVisibility: (key: string, visible: boolean) => void;
    setData: (key: string, value: any) => void;
}

export default function Colors({
    data,
    getSectionData,
    updateSectionData,
    updateSectionVisibility,
    setData,
}: ColorsProps) {
    const { t } = useTranslation();

    const colors = data.config_sections?.colors || {
        primary: '#10b77f',
        secondary: '#059669',
        accent: '#065f46',
    };

    const updateColors = (colorKey: string, value: string) => {
        const updatedColors = { ...colors, [colorKey]: value };
        setData('config_sections', {
            ...data.config_sections,
            colors: updatedColors,
        });
    };

    const presetColors = [
        { name: 'Green', primary: '#10b77f', secondary: '#059669', accent: '#065f46' },
        { name: 'Blue', primary: '#3b82f6', secondary: '#1d4ed8', accent: '#1e3a8a' },
        { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#581c87' },
        { name: 'Orange', primary: '#f97316', secondary: '#ea580c', accent: '#9a3412' },
        { name: 'Red', primary: '#ef4444', secondary: '#dc2626', accent: '#991b1b' },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t('Color Settings')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="primary-color">{t('Primary Color')}</Label>
                        <div className="mt-1 flex gap-2">
                            <Input
                                id="primary-color"
                                type="color"
                                value={colors.primary}
                                onChange={(e) => updateColors('primary', e.target.value)}
                                className="h-10 w-16 rounded border p-1"
                            />
                            <Input
                                type="text"
                                value={colors.primary}
                                onChange={(e) => updateColors('primary', e.target.value)}
                                className="flex-1"
                                placeholder="#3b82f6"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="secondary-color">{t('Secondary Color')}</Label>
                        <div className="mt-1 flex gap-2">
                            <Input
                                id="secondary-color"
                                type="color"
                                value={colors.secondary}
                                onChange={(e) => updateColors('secondary', e.target.value)}
                                className="h-10 w-16 rounded border p-1"
                            />
                            <Input
                                type="text"
                                value={colors.secondary}
                                onChange={(e) => updateColors('secondary', e.target.value)}
                                className="flex-1"
                                placeholder="#8b5cf6"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="accent-color">{t('Accent Color')}</Label>
                        <div className="mt-1 flex gap-2">
                            <Input
                                id="accent-color"
                                type="color"
                                value={colors.accent}
                                onChange={(e) => updateColors('accent', e.target.value)}
                                className="h-10 w-16 rounded border p-1"
                            />
                            <Input
                                type="text"
                                value={colors.accent}
                                onChange={(e) => updateColors('accent', e.target.value)}
                                className="flex-1"
                                placeholder="#10b77f"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label>{t('Color Presets')}</Label>
                    <div className="mt-3 grid grid-cols-5 gap-3">
                        {presetColors?.map((preset) => {
                            const isActive =
                                colors.primary === preset.primary &&
                                colors.secondary === preset.secondary &&
                                colors.accent === preset.accent;
                            return (
                                <button
                                    key={preset.name}
                                    onClick={() => {
                                        setData('config_sections', {
                                            ...data.config_sections,
                                            colors: {
                                                primary: preset.primary,
                                                secondary: preset.secondary,
                                                accent: preset.accent,
                                            },
                                        });
                                    }}
                                    className={`transform rounded-xl border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                                        isActive
                                            ? 'border-foreground shadow-lg ring-2 ring-border'
                                            : 'border-border hover:border-border'
                                    }`}
                                    title={preset.name}
                                >
                                    <div className="mb-2 flex justify-center gap-1">
                                        <div
                                            className="h-6 w-6 rounded-full shadow-sm"
                                            style={{ backgroundColor: preset.primary }}
                                        ></div>
                                        <div
                                            className="h-6 w-6 rounded-full shadow-sm"
                                            style={{ backgroundColor: preset.secondary }}
                                        ></div>
                                        <div
                                            className="h-6 w-6 rounded-full shadow-sm"
                                            style={{ backgroundColor: preset.accent }}
                                        ></div>
                                    </div>
                                    <div
                                        className={`text-xs font-medium ${
                                            isActive ? 'text-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {preset.name}
                                    </div>
                                    {isActive && <div className="bg-muted/500 mx-auto mt-1 h-2 w-2 rounded-full"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
