import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
            <DialogHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                        <CheckSquare className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Onboarding Checklist Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{t('Basic Information')}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Name')}</p>
                            <p className="text-foreground font-medium">{onboardingchecklist.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Description')}</p>
                            <p className="text-foreground leading-relaxed">{onboardingchecklist.description || t('No description provided')}</p>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{t('Settings')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Is Default')}</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                onboardingchecklist.is_default ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                            }`}>
                                {onboardingchecklist.is_default ? t('Yes') : t('No')}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Status')}</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                onboardingchecklist.status ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                            }`}>
                                {onboardingchecklist.status ? t('Active') : t('Inactive')}
                            </span>
                        </div>
                    </div>
                </div>


            </div>
        </DialogContent>
    );
}