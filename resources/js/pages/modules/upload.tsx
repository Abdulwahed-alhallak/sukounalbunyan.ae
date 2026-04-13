import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileArchive } from 'lucide-react';

export default function UploadPackages() {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        files: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newFiles = [...files, ...selectedFiles];
            setFiles(newFiles);
            setData('files', newFiles);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        setData('files', newFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('add-ons.install'), {
            onSuccess: () => {
                setFiles([]);
                setData('files', []);
            },
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Add-ons'), url: route('add-ons.index') }, { label: t('Upload') }]}
            pageTitle={t('Upload Add-ons')}
        >
            <Head title={t('Upload Add-ons')} />

            <Card>
                <CardHeader>
                    <CardTitle>{t('Upload Add-ons Zip Files')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-2 text-lg font-medium">{t('Select ZIP files to upload')}</p>
                            <p className="mb-4 text-sm text-muted-foreground">{t('Support for multiple ZIP files')}</p>
                            <input
                                type="file"
                                multiple
                                accept=".zip"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                {t('Choose Files')}
                            </Button>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-medium">
                                    {t('Selected Files')} ({files.length})
                                </h3>
                                <div className="max-h-60 space-y-2 overflow-y-auto">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileArchive className="h-5 w-5 text-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(index)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('add-ons.index'))}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={processing || files.length === 0}>
                                {processing ? t('Installing...') : t('Install Add-ons')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
