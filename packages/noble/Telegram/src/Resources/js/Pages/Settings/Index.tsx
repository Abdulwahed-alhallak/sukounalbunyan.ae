import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import TelegramSettings from '../../settings/components/telegram-settings';

interface TelegramSettingsPageProps {
    globalSettings?: Record<string, string>;
    telegramNotifications?: Record<string, any[]>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, telegramNotifications = {}, auth } =
        usePage<TelegramSettingsPageProps>().props;

    return (
        <ModuleSettingsPage
            title={t('Telegram Settings')}
            description={t('Manage Telegram bot credentials and module notification routing for the current account.')}
        >
            <TelegramSettings
                userSettings={globalSettings}
                telegramNotifications={telegramNotifications}
                auth={auth}
            />
        </ModuleSettingsPage>
    );
}
