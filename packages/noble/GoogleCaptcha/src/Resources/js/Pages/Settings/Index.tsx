import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ModuleSettingsPage from '@/components/settings/module-settings-page';
import GoogleCaptchaSettings from '../../settings/components/google-captcha-settings';

interface GoogleCaptchaSettingsPageProps {
    globalSettings?: Record<string, string>;
    auth?: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { globalSettings = {}, auth } = usePage<GoogleCaptchaSettingsPageProps>().props;

    return (
        <ModuleSettingsPage
            title={t('Google reCAPTCHA Settings')}
            scopeLabel={t('Platform Scope')}
            description={t('Manage Google reCAPTCHA configuration for forms protected by the platform.')}
        >
            <GoogleCaptchaSettings userSettings={globalSettings} auth={auth} />
        </ModuleSettingsPage>
    );
}
