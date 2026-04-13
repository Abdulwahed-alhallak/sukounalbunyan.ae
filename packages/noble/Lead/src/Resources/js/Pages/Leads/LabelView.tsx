import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { usePage, useForm } from '@inertiajs/react';
import { Tag } from 'lucide-react';
import { Lead } from './types';

interface Label {
    id: number;
    name: string;
    color: string;
    pipeline_id?: number;
    pipeline?: {
        id: number;
        name: string;
    };
}

interface LabelViewProps {
    lead: Lead;
    onClose: () => void;
}

export default function LabelView({ lead, onClose }: LabelViewProps) {
    const { t } = useTranslation();
    const { labels } = usePage().props as { labels: Label[] };

    // Filter labels for current lead's pipeline only
    const pipelineLabels = labels?.filter((label) => label.pipeline_id === lead.pipeline_id) || [];
    const [selectedLabels, setSelectedLabels] = useState<{ [key: number]: boolean }>(() => {
        const selected: { [key: number]: boolean } = {};
        if (lead.labels) {
            const labelIds = lead.labels.split(',')?.map(Number).filter(Boolean);
            labelIds.forEach((id) => {
                selected[id] = true;
            });
        }
        return selected;
    });

    const { data, setData, patch, processing } = useForm({
        labels: lead.labels || '',
    });

    const handleLabelChange = (labelId: number, checked: boolean) => {
        const newSelected = { ...selectedLabels };
        if (checked) {
            newSelected[labelId] = true;
        } else {
            delete newSelected[labelId];
        }
        setSelectedLabels(newSelected);
        const labelIds = Object.keys(newSelected).filter((key) => newSelected[parseInt(key)]);

        setData('labels', labelIds.join(','));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('lead.leads.update-labels', lead.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <DialogContent className="max-w-md overflow-hidden border-border bg-card p-0 shadow-xl dark:border-border dark:bg-foreground">
            <DialogHeader className="bg-muted/50/50 border-b border-border p-6 dark:border-border dark:bg-foreground/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground dark:bg-muted">
                        <Tag className="h-5 w-5 text-foreground dark:text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold tracking-tight">{t('Manage Labels')}</DialogTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {t('Categorize lead: {{name}}', { name: lead.name })}
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6">
                {pipelineLabels.length > 0 ? (
                    <div className="space-y-4">
                        {pipelineLabels?.map((label) => (
                            <div
                                key={label.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 dark:border-border dark:hover:bg-foreground/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                                    <span className="text-sm font-medium text-foreground dark:text-muted-foreground/60">
                                        {label.name}
                                    </span>
                                </div>
                                <Checkbox
                                    id={`label-${label.id}`}
                                    checked={selectedLabels[label.id] || false}
                                    onCheckedChange={(checked) => handleLabelChange(label.id, !!checked)}
                                    className="border-border dark:border-border"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border-2 border-dashed border-border py-12 text-center dark:border-border">
                        <Tag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60 dark:text-foreground" />
                        <p className="text-sm text-muted-foreground">{t('No labels available for this pipeline.')}</p>
                    </div>
                )}
            </div>

            <div className="bg-muted/50/50 flex justify-end gap-3 border-t border-border p-6 dark:border-border dark:bg-foreground/50">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="font-medium text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                >
                    {t('Cancel')}
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={processing}
                    className="bg-foreground px-8 font-medium text-foreground hover:opacity-90 dark:bg-muted dark:text-foreground"
                >
                    {processing ? t('Saving...') : t('Save Changes')}
                </Button>
            </div>
        </DialogContent>
    );
}
