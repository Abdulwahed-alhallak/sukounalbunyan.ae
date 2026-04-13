import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

interface YearEndCloseProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function YearEndClose({ open, onOpenChange }: YearEndCloseProps) {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const yearEndDate = `${currentYear}-12-31`;

    const { data, setData, post, processing, errors, reset } = useForm({
        financial_year: currentYear.toString(),
        closing_date: yearEndDate,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('double-entry.balance-sheets.year-end-close'), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('Year-End Close')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="financial_year">{t('Financial Year to Close')}</Label>
                        <Input
                            id="financial_year"
                            type="text"
                            value={data.financial_year}
                            onChange={(e) => setData('financial_year', e.target.value)}
                            className={errors.financial_year ? 'border-destructive' : ''}
                            placeholder={t('e.g., 2024')}
                            maxLength={4}
                            required
                        />
                        {errors.financial_year && <p className="text-sm text-destructive">{errors.financial_year}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="closing_date">{t('Closing Date')}</Label>
                        <DatePicker
                            id="closing_date"
                            value={data.closing_date}
                            onChange={(value) => setData('closing_date', value)}
                            className={errors.closing_date ? 'border-destructive' : ''}
                            required
                        />
                        {errors.closing_date && <p className="text-sm text-destructive">{errors.closing_date}</p>}
                    </div>

                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <h4 className="mb-2 font-medium text-foreground">{t('Warning')}</h4>
                        <ul className="space-y-1 text-sm text-foreground">
                            <li>• {t('This will close all revenue and expense accounts')}</li>
                            <li>• {t('Net income will be transferred to retained earnings')}</li>
                            <li>• {t('Opening balances will be created for next year')}</li>
                            <li>• {t('This action cannot be undone')}</li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            {t('Cancel')}
                        </Button>
                        <Button type="submit" disabled={processing} variant="destructive">
                            {processing ? t('Closing...') : t('Close Year')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
