import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    Zap,
    Plus,
    Play,
    Pause,
    Trash2,
    Edit2,
    Activity,
    Clock,
    ChevronDown,
    X,
    CheckCircle,
    AlertCircle,
    FileText,
} from 'lucide-react';

interface WorkflowRule {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    trigger_module: string;
    trigger_event: string;
    trigger_conditions: any[];
    actions: any[];
    schedule_type: string;
    execution_count: number;
    last_executed_at: string | null;
    creator?: { id: number; name: string };
    logs_count: number;
}

interface Props {
    rules: { data: WorkflowRule[]; current_page: number; last_page: number; total: number; links: any[] };
    modules: Record<string, string>;
    events: Record<string, string>;
    actionTypes: Record<string, string>;
    operators: Record<string, string>;
}

export default function WorkflowIndex({ rules, modules, events, actionTypes, operators }: Props) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        description: '',
        trigger_module: 'invoice',
        trigger_event: 'created',
        trigger_conditions: [] as any[],
        actions: [{ type: 'notification', title: '', message: '', recipient: 'company_owner', category: 'info' }],
        is_active: true,
        schedule_type: 'immediate',
        priority: 0,
    });

    const resetForm = () => {
        form.reset();
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (rule: WorkflowRule) => {
        form.setData({
            name: rule.name,
            description: rule.description || '',
            trigger_module: rule.trigger_module,
            trigger_event: rule.trigger_event,
            trigger_conditions: rule.trigger_conditions || [],
            actions: rule.actions || [
                { type: 'notification', title: '', message: '', recipient: 'company_owner', category: 'info' },
            ],
            is_active: rule.is_active,
            schedule_type: rule.schedule_type,
            priority: 0,
        });
        setEditingId(rule.id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.put(route('workflows.update', editingId), { onSuccess: resetForm });
        } else {
            form.post(route('workflows.store'), { onSuccess: resetForm });
        }
    };

    const addAction = () => {
        form.setData('actions', [
            ...form.data.actions,
            { type: 'notification', title: '', message: '', recipient: 'company_owner', category: 'info' },
        ]);
    };

    const removeAction = (idx: number) => {
        const actions = [...form.data.actions];
        actions.splice(idx, 1);
        form.setData('actions', actions);
    };

    const updateAction = (idx: number, key: string, value: string) => {
        const actions = [...form.data.actions];
        actions[idx] = { ...actions[idx], [key]: value };
        form.setData('actions', actions);
    };

    const addCondition = () => {
        form.setData('trigger_conditions', [...form.data.trigger_conditions, { field: '', operator: '=', value: '' }]);
    };

    const removeCondition = (idx: number) => {
        const conds = [...form.data.trigger_conditions];
        conds.splice(idx, 1);
        form.setData('trigger_conditions', conds);
    };

    const moduleColor: Record<string, string> = {
        invoice: 'text-foreground bg-foreground/5',
        purchase: 'text-foreground bg-foreground/5',
        hrm: 'text-foreground bg-foreground/5',
        crm: 'text-foreground bg-foreground/5',
        general: 'text-foreground bg-foreground/5',
        pos: 'text-foreground bg-foreground/5',
        contract: 'text-foreground bg-foreground/5',
        support: 'text-muted-foreground bg-muted',
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Workflow Automation') }]} pageTitle={t('Workflow Automation')}>
            <Head title={t('Workflow Automation')} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-foreground/5">
                            <Zap className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{t('Workflow Automation')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {rules.total} {t('rules')} •{' '}
                                <a href={route('workflows.logs')} className="text-foreground hover:underline">
                                    {t('View Logs')}
                                </a>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow hover:bg-foreground/90"
                    >
                        <Plus className="h-4 w-4" /> {t('New Rule')}
                    </button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 rounded-xl border border-foreground/20 bg-card p-5"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">
                                {editingId ? t('Edit Rule') : t('New Automation Rule')}
                            </h3>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Name + Description */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    {t('Rule Name')}
                                </label>
                                <input
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    {t('Description')}
                                </label>
                                <input
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>
                        </div>

                        {/* Trigger */}
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('⚡ When (Trigger)')}
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">{t('Module')}</label>
                                    <select
                                        value={form.data.trigger_module}
                                        onChange={(e) => form.setData('trigger_module', e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                    >
                                        {Object.entries(modules).map(([k, v]) => (
                                            <option key={k} value={k}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-muted-foreground">{t('Event')}</label>
                                    <select
                                        value={form.data.trigger_event}
                                        onChange={(e) => form.setData('trigger_event', e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                    >
                                        {Object.entries(events).map(([k, v]) => (
                                            <option key={k} value={k}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Conditions */}
                            {form.data.trigger_conditions.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {form.data.trigger_conditions.map((cond: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                placeholder="field"
                                                value={cond.field}
                                                onChange={(e) => {
                                                    const c = [...form.data.trigger_conditions];
                                                    c[i].field = e.target.value;
                                                    form.setData('trigger_conditions', c);
                                                }}
                                                className="w-1/3 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                                            />
                                            <select
                                                value={cond.operator}
                                                onChange={(e) => {
                                                    const c = [...form.data.trigger_conditions];
                                                    c[i].operator = e.target.value;
                                                    form.setData('trigger_conditions', c);
                                                }}
                                                className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                                            >
                                                {Object.entries(operators).map(([k, v]) => (
                                                    <option key={k} value={k}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                placeholder="value"
                                                value={cond.value}
                                                onChange={(e) => {
                                                    const c = [...form.data.trigger_conditions];
                                                    c[i].value = e.target.value;
                                                    form.setData('trigger_conditions', c);
                                                }}
                                                className="w-1/3 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCondition(i)}
                                                className="text-muted-foreground hover:text-muted-foreground"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={addCondition}
                                className="mt-2 text-xs text-foreground hover:underline"
                            >
                                + {t('Add Condition')}
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                                {t('🎯 Then (Actions)')}
                            </h4>
                            {form.data.actions.map((action: any, i: number) => (
                                <div key={i} className="mb-3 rounded-lg border border-border bg-background p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <select
                                            value={action.type}
                                            onChange={(e) => updateAction(i, 'type', e.target.value)}
                                            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium text-foreground"
                                        >
                                            {Object.entries(actionTypes).map(([k, v]) => (
                                                <option key={k} value={k}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                        {form.data.actions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAction(i)}
                                                className="text-muted-foreground hover:text-muted-foreground"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {(action.type === 'notification' || action.type === 'email') && (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <input
                                                placeholder={t('Title / Subject')}
                                                value={action.title || ''}
                                                onChange={(e) => updateAction(i, 'title', e.target.value)}
                                                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                            />
                                            <input
                                                placeholder={t('Message / Body')}
                                                value={action.message || action.body || ''}
                                                onChange={(e) =>
                                                    updateAction(
                                                        i,
                                                        action.type === 'email' ? 'body' : 'message',
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                            />
                                            <select
                                                value={action.recipient || 'company_owner'}
                                                onChange={(e) => updateAction(i, 'recipient', e.target.value)}
                                                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                            >
                                                <option value="company_owner">{t('Company Owner')}</option>
                                                <option value="all_staff">{t('All Staff')}</option>
                                                <option value="superadmins">{t('Super Admins')}</option>
                                            </select>
                                        </div>
                                    )}
                                    {action.type === 'webhook' && (
                                        <input
                                            placeholder="https://noble.dion.sy/webhook"
                                            value={action.url || ''}
                                            onChange={(e) => updateAction(i, 'url', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                        />
                                    )}
                                    {action.type === 'whatsapp' && (
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            <input
                                                placeholder={t('Phone Number (Optional - defaults to customer phone)')}
                                                value={action.to || ''}
                                                onChange={(e) => updateAction(i, 'to', e.target.value)}
                                                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                            />
                                            <input
                                                placeholder={t('WhatsApp Message Body')}
                                                value={action.message || ''}
                                                onChange={(e) => updateAction(i, 'message', e.target.value)}
                                                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                            />
                                        </div>
                                    )}
                                    {action.type === 'change_status' && (
                                        <input
                                            placeholder={t('New status value')}
                                            value={action.new_status || ''}
                                            onChange={(e) => updateAction(i, 'new_status', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAction}
                                className="text-xs text-foreground hover:underline"
                            >
                                + {t('Add Action')}
                            </button>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background shadow hover:bg-foreground/90 disabled:opacity-50"
                            >
                                {form.processing ? '...' : editingId ? t('Update Rule') : t('Create Rule')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Rules List */}
                <div className="space-y-3">
                    {rules.data.length === 0 ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
                            <Zap className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold text-foreground">{t('No automation rules yet')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('Create your first rule to automate repetitive tasks')}
                            </p>
                        </div>
                    ) : (
                        rules.data.map((rule) => (
                            <div
                                key={rule.id}
                                className={`group rounded-xl border transition ${rule.is_active ? 'border-border bg-card' : 'border-border/50 bg-card/50 opacity-60'}`}
                            >
                                <div className="flex items-center gap-4 p-4">
                                    {/* Status indicator */}
                                    <button
                                        onClick={() =>
                                            router.post(
                                                route('workflows.toggle', rule.id),
                                                {},
                                                { preserveScroll: true }
                                            )
                                        }
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${rule.is_active ? 'bg-foreground/5 text-foreground hover:bg-foreground/10' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                                        title={
                                            rule.is_active
                                                ? t('Active - Click to pause')
                                                : t('Paused - Click to activate')
                                        }
                                    >
                                        {rule.is_active ? (
                                            <Play className="h-3.5 w-3.5" />
                                        ) : (
                                            <Pause className="h-3.5 w-3.5" />
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-foreground">{rule.name}</h3>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${moduleColor[rule.trigger_module] || 'bg-muted text-muted-foreground'}`}
                                            >
                                                {modules[rule.trigger_module] || rule.trigger_module}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                → {events[rule.trigger_event] || rule.trigger_event}
                                            </span>
                                        </div>
                                        {rule.description && (
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {rule.description}
                                            </p>
                                        )}
                                        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Activity className="h-3 w-3" /> {rule.execution_count}{' '}
                                                {t('executions')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" /> {rule.actions.length} {t('actions')}
                                            </span>
                                            {rule.last_executed_at && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />{' '}
                                                    {new Date(rule.last_executed_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                        <button
                                            onClick={() => handleEdit(rule)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                            title={t('Edit')}
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(t('Delete this rule?')))
                                                    router.delete(route('workflows.destroy', rule.id), {
                                                        preserveScroll: true,
                                                    });
                                            }}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                                            title={t('Delete')}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {rules.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {rules.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-sm transition ${link.active ? 'bg-foreground text-background' : link.url ? 'text-muted-foreground hover:bg-accent' : 'cursor-not-allowed text-muted-foreground/50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
