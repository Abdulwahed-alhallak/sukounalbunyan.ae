import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';

interface ModuleSettingsPageProps extends PropsWithChildren {
    title: string;
    description: string;
    scopeLabel?: string;
}

export default function ModuleSettingsPage({ title, description, scopeLabel, children }: ModuleSettingsPageProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Settings'), url: route('settings.index') },
                { label: title },
            ]}
            pageTitle={title}
        >
            <Head title={title} />

            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                        {scopeLabel && (
                            <div className="inline-flex w-fit rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                {scopeLabel}
                            </div>
                        )}
                        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={route('settings.index')}>
                            <ArrowLeft className="me-2 h-4 w-4" />
                            {t('All Settings')}
                        </Link>
                    </Button>
                </div>

                {children}
            </div>
        </AuthenticatedLayout>
    );
}
