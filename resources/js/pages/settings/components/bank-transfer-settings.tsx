import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

interface BankTransferSettingsProps {
    userSettings?: Record<string, string>;
    auth?: any;
}

export default function BankTransferSettings({ userSettings = {}, auth }: BankTransferSettingsProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const canEdit = auth?.user?.permissions?.includes('edit-bank-transfer-settings');

    const [bankSettings, setBankSettings] = useState({
        bankTransferEnabled: userSettings?.bankTransferEnabled === 'on',
        instructions: userSettings?.instructions || '',
    });

    useEffect(() => {
        setBankSettings({
            bankTransferEnabled: userSettings?.bankTransferEnabled === 'on',
            instructions: userSettings?.instructions || '',
        });
    }, [userSettings]);

    const handleSettingsChange = (field: string, value: string | boolean) => {
        setBankSettings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveBankSettings = () => {
        setIsLoading(true);

        router.post(
            route('settings.bank-transfer.update'),
            {
                settings: {
                    ...bankSettings,
                    bankTransferEnabled: bankSettings.bankTransferEnabled ? 'on' : 'off',
                },
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="order-1 rtl:order-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="h-5 w-5" />
                        {t('Bank Transfer Settings')}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('Configure bank transfer payment method for your customers')}
                    </p>
                </div>
                {canEdit && (
                    <Button className="order-2 rtl:order-1" onClick={saveBankSettings} disabled={isLoading} size="sm">
                        <Save className="me-2 h-4 w-4" />
                        {isLoading ? t('Saving...') : t('Save Changes')}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Enable/Disable Bank Transfer */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="bankTransferEnabled" className="text-base font-medium">
                                {t('Enable Bank Transfer')}
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('Allow customers to pay via bank transfer')}
                            </p>
                        </div>
                        <Switch
                            id="bankTransferEnabled"
                            checked={bankSettings.bankTransferEnabled}
                            onCheckedChange={(checked) => handleSettingsChange('bankTransferEnabled', checked)}
                            disabled={!canEdit}
                        />
                    </div>

                    {bankSettings.bankTransferEnabled && (
                        <>
                            {/* Bank Transfer Instructions */}
                            <div className="space-y-3">
                                <Label htmlFor="instructions">{t('Bank Transfer Instructions')}</Label>
                                <Textarea
                                    id="instructions"
                                    value={bankSettings.instructions}
                                    onChange={(e) => handleSettingsChange('instructions', e.target.value)}
                                    placeholder={t('Enter bank transfer instructions. Use <br/> for line breaks.')}
                                    rows={8}
                                    disabled={!canEdit}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        'These instructions will be shown to customers. You can use <br/> tags for line breaks.'
                                    )}
                                </p>
                            </div>

                            {/* Preview Section */}
                            <div className="mt-6 rounded-lg border bg-muted/30 p-4">
                                <h4 className="mb-3 font-medium">{t('Customer Preview')}</h4>
                                <div className="text-sm">
                                    {bankSettings.instructions ? (
                                        <div
                                            className="whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{
                                                __html: bankSettings.instructions.replace(/<br\/>/g, '<br/>'),
                                            }}
                                        />
                                    ) : (
                                        <p className="italic text-muted-foreground">{t('No instructions provided')}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
