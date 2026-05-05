import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Save, Palette } from 'lucide-react';

// Preset color palette
const COLOR_PRESETS = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
    '#F97316', '#EAB308', '#22C55E', '#10B981',
    '#06B6D4', '#3B82F6', '#64748B', '#1E293B',
];

export default function CreateProject() {
    const { t }       = useTranslation();
    const { customers } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        name:                '',
        code:                '',
        description:         '',
        customer_id:         '',
        color:               '#6366F1',
        site_name:           '',
        site_address:        '',
        site_contact_person: '',
        site_contact_phone:  '',
        status:              'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rental-projects.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Projects'), url: route('rental-projects.index') },
                { label: t('New Project') },
            ]}
            pageTitle={t('Create Rental Project')}
        >
            <Head title={t('Create Rental Project')} />

            <form onSubmit={submit} className="max-w-3xl mx-auto space-y-6">
                {/* ── Basic Info ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Project Information')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">{t('Project Name')} *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder={t('e.g. Sobha Realty — Tower A')}
                                />
                                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="code">{t('Project Code')}</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    placeholder="SBH-2026-001"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="customer_id">{t('Client')} *</Label>
                            <Select
                                value={data.customer_id}
                                onValueChange={v => setData('customer_id', v)}
                            >
                                <SelectTrigger id="customer_id">
                                    <SelectValue placeholder={t('Select client...')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="h-3 w-3 rounded-full inline-block shrink-0"
                                                    style={{ backgroundColor: c.color ?? '#94a3b8' }}
                                                />
                                                {c.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <p className="text-destructive text-xs">{errors.customer_id}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description">{t('Description')}</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder={t('Project scope, notes...')}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Project Color ── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            {t('Project Color')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {COLOR_PRESETS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setData('color', color)}
                                    className={`h-9 w-9 rounded-xl transition-all ${
                                        data.color === color
                                            ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                                            : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <Label>{t('Custom')}</Label>
                            <input
                                type="color"
                                value={data.color}
                                onChange={e => setData('color', e.target.value)}
                                className="h-9 w-16 rounded-lg border border-border cursor-pointer"
                            />
                            <div
                                className="h-9 px-4 rounded-lg flex items-center text-sm font-medium"
                                style={{ backgroundColor: data.color, color: '#fff' }}
                            >
                                {t('Preview')}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Site Info ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Site & Location')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="site_name">{t('Site Name')}</Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    placeholder={t('Tower A — Floor 1')}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="site_contact_person">{t('Site Contact')}</Label>
                                <Input
                                    id="site_contact_person"
                                    value={data.site_contact_person}
                                    onChange={e => setData('site_contact_person', e.target.value)}
                                    placeholder={t('Engineer name')}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="site_address">{t('Site Address')}</Label>
                                <Textarea
                                    id="site_address"
                                    value={data.site_address}
                                    onChange={e => setData('site_address', e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="site_contact_phone">{t('Contact Phone')}</Label>
                                <Input
                                    id="site_contact_phone"
                                    value={data.site_contact_phone}
                                    onChange={e => setData('site_contact_phone', e.target.value)}
                                    placeholder="+971 50 000 0000"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Actions ── */}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => history.back()}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={processing} className="gap-2">
                        <Save className="h-4 w-4" />
                        {processing ? t('Saving...') : t('Create Project')}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
