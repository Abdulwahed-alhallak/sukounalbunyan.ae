import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import SlackSettings from '../../settings/components/slack-settings';

interface SlackSettingsPageProps {
    globalSettings?: Record<string, string>;
    slackNotifications?: Record<string, any[]>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, slackNotifications = {}, auth } = usePage<SlackSettingsPageProps>().props;

    return (
        <ModuleSettingsPage
            title={t('Slack Settings')}
            description={t('Manage Slack webhook credentials and module notification routing for the current account.')}
        >
            <SlackSettings userSettings={globalSettings} slackNotifications={slackNotifications} auth={auth} />
        </ModuleSettingsPage>
    );
}
