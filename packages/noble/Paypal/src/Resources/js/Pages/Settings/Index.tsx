import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import PaypalSettings from '../../settings/components/paypal-settings';

interface PaypalSettingsPageProps {
    globalSettings?: Record<string, string>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, auth } = usePage<PaypalSettingsPageProps>().props;
    const isSuperAdmin = auth?.user?.roles?.includes('superadmin') || auth?.user?.type === 'superadmin';

    return (
        <ModuleSettingsPage
            title={t('PayPal Settings')}
            scopeLabel={isSuperAdmin ? t('Platform Scope') : t('Company Scope')}
            description={
                isSuperAdmin
                    ? t('Manage platform-level PayPal credentials used by the current superadmin account.')
                    : t('Manage PayPal credentials and activation state for the current company account.')
            }
        >
            <PaypalSettings userSettings={globalSettings} auth={auth} />
        </ModuleSettingsPage>
    );
}
