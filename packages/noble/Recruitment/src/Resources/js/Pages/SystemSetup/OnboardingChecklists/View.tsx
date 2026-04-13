import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { CheckSquare } from 'lucide-react';
import { OnboardingChecklist } from './types';

interface ViewProps {
    onboardingchecklist: OnboardingChecklist;
}

export default function View({ onboardingchecklist }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <CheckSquare className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Onboarding Checklist Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 font-semibold text-foreground">{t('Basic Information')}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">{t('Name')}</p>
                            <p className="font-medium text-foreground">{onboardingchecklist.name}</p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">{t('Description')}</p>
                            <p className="leading-relaxed text-foreground">
                                {onboardingchecklist.description || t('No description provided')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 font-semibold text-foreground">{t('Settings')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">{t('Is Default')}</p>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    onboardingchecklist.is_default
                                        ? 'bg-muted text-foreground'
                                        : 'bg-muted text-destructive'
                                }`}
                            >
                                {onboardingchecklist.is_default ? t('Yes') : t('No')}
                            </span>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">{t('Status')}</p>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    onboardingchecklist.status
                                        ? 'bg-muted text-foreground'
                                        : 'bg-muted text-destructive'
                                }`}
                            >
                                {onboardingchecklist.status ? t('Active') : t('Inactive')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
