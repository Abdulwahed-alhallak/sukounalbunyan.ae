import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Module {
    name: string;
    alias: string;
    description: string;
    priority: number;
}

interface Props {
    modules: Module[];
}

export default function Addons({ modules }: Props) {
    const { t } = useTranslation();
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [installing, setInstalling] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');
    const [installedModules, setInstalledModules] = useState<string[]>([]);

    const installNextModule = async () => {
        if (currentModuleIndex >= modules.length) {
            setCompleted(true);
            return;
        }

        const currentModule = modules[currentModuleIndex];
        setInstalling(true);
        setError('');

        try {
            const response = await axios.post(route('installer.addons.store'), {
                module: currentModule.name,
            });

            if (response.data.success) {
                setInstalledModules((prev) => [...prev, currentModule.name]);
                setCurrentModuleIndex((prev) => prev + 1);

                if (response.data.completed) {
                    setCompleted(true);
                }
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Installation failed');
        } finally {
            setInstalling(false);
        }
    };

    const startInstallation = () => {
        setCurrentModuleIndex(0);
        setInstalledModules([]);
        setCompleted(false);
        setError('');
        installNextModule();
    };

    useEffect(() => {
        if (currentModuleIndex > 0 && currentModuleIndex < modules.length && !error) {
            const timer = setTimeout(() => {
                installNextModule();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentModuleIndex]);

    return (
        <>
            <Head title={t('Installation - Add-ons')} />
            <div className="flex min-h-screen flex-col justify-center bg-muted/50 py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('Add-on Installation')}</h2>

                        {error && (
                            <div className="mb-4 rounded-md border border-border bg-muted p-4">
                                <p className="text-destructive">{error}</p>
                            </div>
                        )}

                        <p className="mb-4 text-muted-foreground">
                            {t('This step will install and enable all available add-on modules one by one.')}
                        </p>

                        <div className="mb-6 rounded-md border border-border bg-muted p-4">
                            <h3 className="mb-2 font-semibold text-foreground">
                                {t('Add-ons Progress')} ({installedModules.length}/{modules.length}):
                            </h3>

                            <div className="mb-4 h-2 w-full rounded-full bg-muted">
                                <div
                                    className="h-2 rounded-full bg-foreground transition-all duration-300"
                                    style={{ width: `${(installedModules.length / modules.length) * 100}%` }}
                                ></div>
                            </div>

                            <div className="max-h-60 space-y-2 overflow-y-auto">
                                {modules.map((module, index) => (
                                    <div
                                        key={module.name}
                                        className={`rounded border p-2 ${
                                            installedModules.includes(module.name)
                                                ? 'border-border bg-muted'
                                                : index === currentModuleIndex && installing
                                                  ? 'border-border bg-muted'
                                                  : 'border-border bg-card'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{module.alias}</h4>
                                                <p className="text-sm text-muted-foreground">{module.description}</p>
                                            </div>
                                            <div>
                                                {installedModules.includes(module.name) && (
                                                    <span className="text-foreground">✓ {t('Installed')}</span>
                                                )}
                                                {index === currentModuleIndex && installing && (
                                                    <span className="text-foreground">⏳ {t('Installing...')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Link
                                href={route('installer.database')}
                                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>

                            {completed ? (
                                <Link
                                    href={route('installer.final')}
                                    className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent"
                                >
                                    {t('Continue')}
                                </Link>
                            ) : (
                                <button
                                    onClick={startInstallation}
                                    disabled={installing}
                                    className="rounded-md border border-transparent bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm hover:bg-accent disabled:opacity-50"
                                >
                                    {installing ? t('Installing...') : t('Start Installation')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
