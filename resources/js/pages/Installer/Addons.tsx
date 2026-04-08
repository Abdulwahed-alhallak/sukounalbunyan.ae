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
                module: currentModule.name
            });

            if (response.data.success) {
                setInstalledModules(prev => [...prev, currentModule.name]);
                setCurrentModuleIndex(prev => prev + 1);
                
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
            <div className="min-h-screen bg-muted/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6">{t('Add-on Installation')}</h2>
                        


                        {error && (
                            <div className="mb-4 p-4 bg-muted border border-border rounded-md">
                                <p className="text-destructive">{error}</p>
                            </div>
                        )}

                        <p className="text-muted-foreground mb-4">
                            {t('This step will install and enable all available add-on modules one by one.')}
                        </p>

                        <div className="bg-muted border border-border rounded-md p-4 mb-6">
                            <h3 className="font-semibold text-foreground mb-2">{t('Add-ons Progress')} ({installedModules.length}/{modules.length}):</h3>
                            
                            <div className="w-full bg-muted rounded-full h-2 mb-4">
                                <div 
                                    className="bg-foreground h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${(installedModules.length / modules.length) * 100}%` }}
                                ></div>
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {modules.map((module, index) => (
                                    <div key={module.name} className={`p-2 rounded border ${
                                        installedModules.includes(module.name) ? 'bg-muted border-border' :
                                        index === currentModuleIndex && installing ? 'bg-muted border-border' :
                                        'bg-card border-border'
                                    }`}>
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
                                className="py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted/50"
                            >
                                {t('Back')}
                            </Link>
                            
                            {completed ? (
                                <Link
                                    href={route('installer.final')}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-accent"
                                >
                                    {t('Continue')}
                                </Link>
                            ) : (
                                <button
                                    onClick={startInstallation}
                                    disabled={installing}
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-accent disabled:opacity-50"
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