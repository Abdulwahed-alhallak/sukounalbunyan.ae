import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing } = useForm({
        name: '',
        color: '#1890ff',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/ticket-categories');
    };

    return (
        <>
            <Head title="Create Category" />
            <div className="p-6">
                <div className="rounded-lg bg-card p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">Create Ticket Category</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter category name"
                                className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-foreground"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Color</label>
                            <input
                                type="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="h-10 w-20 rounded-md border border-border"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-muted/500 rounded-md px-4 py-2 text-background hover:bg-foreground disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : t('Create Category')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
