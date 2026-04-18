import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import AIAssistantSettings from '../../settings/components/ai-assistant-settings';

interface AIAssistantSettingsPageProps {
    globalSettings?: Record<string, string>;
    providers?: Record<string, { name: string; models: string[] }>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, providers = {}, auth } = usePage<AIAssistantSettingsPageProps>().props;

    return (
        <ModuleSettingsPage
            title={t('AI Assistant Settings')}
            description={t('Manage AI provider credentials and model selection for the current account.')}
        >
            <AIAssistantSettings userSettings={globalSettings} providers={providers} auth={auth} />
        </ModuleSettingsPage>
    );
}
