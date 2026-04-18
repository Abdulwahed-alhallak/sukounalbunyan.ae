import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import TwilioSettings from '../../settings/components/twilio-settings';

interface TwilioSettingsPageProps {
    globalSettings?: Record<string, string>;
    twilioNotifications?: Record<string, any[]>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, twilioNotifications = {}, auth } = usePage<TwilioSettingsPageProps>().props;

    return (
        <ModuleSettingsPage
            title={t('Twilio Settings')}
            description={t('Manage Twilio SMS credentials and module notification routing for the current account.')}
        >
            <TwilioSettings userSettings={globalSettings} twilioNotifications={twilioNotifications} auth={auth} />
        </ModuleSettingsPage>
    );
}
