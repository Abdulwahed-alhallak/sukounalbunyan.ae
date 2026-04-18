import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import StripeSettings from '../../settings/components/stripe-settings';

interface StripeSettingsPageProps {
    globalSettings?: Record<string, string>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, auth } = usePage<StripeSettingsPageProps>().props;
    const isSuperAdmin = auth?.user?.roles?.includes('superadmin') || auth?.user?.type === 'superadmin';

    return (
        <ModuleSettingsPage
            title={t('Stripe Settings')}
            scopeLabel={isSuperAdmin ? t('Platform Scope') : t('Company Scope')}
            description={
                isSuperAdmin
                    ? t('Manage platform-level Stripe keys used by the current superadmin account.')
                    : t('Manage Stripe API keys and activation state for the current company account.')
            }
        >
            <StripeSettings userSettings={globalSettings} auth={auth} />
        </ModuleSettingsPage>
    );
}
