import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { CustomQuestion } from './types';

interface ViewProps {
    customquestion: CustomQuestion;
}

export default function View({ customquestion }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <HelpCircle className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Custom Question Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{customquestion.name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Question')}</label>
                        <p className="mt-1 text-sm text-foreground">{customquestion.question || '-'}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Type')}</label>
                        <div className="mt-1">
                            <span className="rounded-full bg-muted px-2 py-1 text-sm text-foreground">
                                {(() => {
                                    const options: any = {
                                        '0': 'Text',
                                        '1': 'Textarea',
                                        '2': 'Select',
                                        '3': 'Radio',
                                        '4': 'Checkbox',
                                        '5': 'File',
                                    };
                                    const displayValue = options[customquestion.type] || customquestion.type || '-';
                                    const capitalizedValue =
                                        displayValue === '-'
                                            ? displayValue
                                            : displayValue.charAt(0).toUpperCase() +
                                              displayValue.slice(1).toLowerCase();
                                    return t(capitalizedValue);
                                })()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Sort Order')}</label>
                        <p className="mt-1 text-sm text-foreground">{customquestion.sort_order || '-'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Required')}</label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    customquestion.is_required
                                        ? 'bg-muted text-destructive'
                                        : 'bg-muted text-foreground'
                                }`}
                            >
                                {customquestion.is_required ? t('Required') : t('Optional')}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Status')}</label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    customquestion.is_active ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                }`}
                            >
                                {customquestion.is_active ? t('Active') : t('Inactive')}
                            </span>
                        </div>
                    </div>
                </div>

                {(() => {
                    let options = [];
                    if (customquestion.options) {
                        try {
                            options =
                                typeof customquestion.options === 'string'
                                    ? JSON.parse(customquestion.options)
                                    : customquestion.options;
                        } catch (e) {
                            options = [];
                        }
                    }
                    return (
                        options.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-foreground">{t('Options')}</label>
                                <div className="mt-2 space-y-2">
                                    {options?.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                            <span className="rounded bg-muted px-2 py-1 text-xs text-foreground">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-foreground">{option}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    );
                })()}
            </div>
        </DialogContent>
    );
}
