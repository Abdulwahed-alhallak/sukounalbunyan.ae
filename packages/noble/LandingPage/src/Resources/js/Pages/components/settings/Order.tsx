import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowUpDown, GripVertical } from 'lucide-react';

interface OrderProps {
    [key: string]: any;
    data: any;
    setData: (key: string, value: any) => void;
    updateSectionVisibility: (sectionKey: string, visible: boolean) => void;
}

export default function Order({ data, setData, updateSectionVisibility }: OrderProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                            <ArrowUpDown className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <CardTitle>{t('Section Order')}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t('Drag and drop to reorder sections on your landing page')}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(data.config_sections?.section_order || [])?.map((sectionKey, index) => {
                            const sectionNames = {
                                header: t('Header'),
                                hero: t('Hero'),
                                stats: t('Stats'),
                                features: t('Features'),
                                modules: t('Modules'),
                                benefits: t('Benefits'),
                                gallery: t('Gallery'),
                                cta: t('CTA'),
                                footer: t('Footer'),
                            };

                            const isEnabled = data.config_sections?.section_visibility?.[sectionKey] !== false;

                            return (
                                <div
                                    key={sectionKey}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', index.toString());
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                        const currentOrder = [...(data.config_sections?.section_order || [])];
                                        const draggedItem = currentOrder[dragIndex];
                                        currentOrder.splice(dragIndex, 1);
                                        currentOrder.splice(index, 0, draggedItem);
                                        setData('config_sections', {
                                            ...data.config_sections,
                                            section_order: currentOrder,
                                        });
                                    }}
                                    className={`flex cursor-move items-center gap-3 rounded-lg border p-4 transition-all ${
                                        isEnabled
                                            ? 'border-border bg-card hover:shadow-md'
                                            : 'border-border bg-muted/50 opacity-60'
                                    }`}
                                >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-foreground">
                                                    {sectionNames[sectionKey] || sectionKey}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {isEnabled ? t('Enabled') : t('Disabled')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm">{t('Enable')}</Label>
                                            <Switch
                                                checked={isEnabled}
                                                onCheckedChange={(checked) =>
                                                    updateSectionVisibility(sectionKey, checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
