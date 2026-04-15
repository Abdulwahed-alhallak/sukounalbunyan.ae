import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { Payroll } from './types';

interface ViewProps {
    [key: string]: any;
    payroll: Payroll;
}

export default function View({ payroll }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Calculator className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Payroll Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{payroll.name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="py-8 text-center">
                    <h3 className="mb-2 text-lg font-medium text-foreground">Hello World</h3>
                    <p className="text-muted-foreground">View functionality is ready for customization</p>
                </div>
            </div>
        </DialogContent>
    );
}
