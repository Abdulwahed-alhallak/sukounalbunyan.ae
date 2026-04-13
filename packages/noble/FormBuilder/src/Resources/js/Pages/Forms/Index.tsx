import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DataTable } from '@/components/ui/data-table';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { Pagination } from '@/components/ui/pagination';
import NoRecordsFound from '@/components/no-records-found';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus, Edit as EditIcon, Trash2, BarChart3, FileText, Link, Copy, Zap } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';

interface Form {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    responses_count: number;
    fields_count: number;
    created_at: string;
}

interface FormsIndexProps {
    forms: {
        data: Form[];
        links: any;
        meta: any;
    };
    auth: any;
}

export default function FormsIndex({ forms, auth }: FormsIndexProps) {
    const { t } = useTranslation();
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        name: urlParams.get('name') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'formbuilder.forms.destroy',
        defaultMessage: t('Are you sure you want to delete this form?'),
    });

    const handleFilter = () => {
        router.get(
            route('formbuilder.forms.index'),
            {
                ...filters,
                per_page: perPage,
                sort: sortField,
                direction: sortDirection,
                view: viewMode,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route('formbuilder.forms.index'),
            {
                ...filters,
                per_page: perPage,
                sort: field,
                direction,
                view: viewMode,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ name: '' });
        router.get(route('formbuilder.forms.index'), { per_page: perPage, view: viewMode });
    };

    const copyFormLink = async (formCode: string) => {
        const formUrl = route('formbuilder.public.form.show', formCode);
        try {
            await navigator.clipboard.writeText(formUrl);
            setCopiedCode(formCode);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        {
            key: 'fields_count',
            header: t('Fields'),
            sortable: true,
        },
        {
            key: 'responses_count',
            header: t('Responses'),
            sortable: true,
        },
        {
            key: 'is_active',
            header: t('Status'),
            sortable: true,
            render: (value: boolean) => (
                <span
                    className={`rounded-full px-2 py-1 text-sm ${
                        value ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                    }`}
                >
                    {value ? t('Active') : t('Inactive')}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: t('Created At'),
            sortable: true,
            render: (value: string) => formatDateTime(value),
        },
        {
            key: 'actions',
            header: t('Actions'),
            render: (_: any, form: Form) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyFormLink(form.code)}
                                    className={`h-8 w-8 p-0 transition-colors ${
                                        copiedCode === form.code
                                            ? 'text-foreground hover:text-foreground'
                                            : 'text-foreground hover:text-foreground'
                                    }`}
                                >
                                    {copiedCode === form.code ? (
                                        <Copy className="h-4 w-4" />
                                    ) : (
                                        <Link className="h-4 w-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{copiedCode === form.code ? t('Copied!') : t('Copy Link')}</p>
                            </TooltipContent>
                        </Tooltip>
                        {auth.user?.permissions?.includes('view-formbuilder-responses') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.visit(route('formbuilder.forms.responses', form.id))}
                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Responses')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('manage-formbuilder-conversions') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.visit(route('formbuilder.forms.conversion', form.id))}
                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Convert')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('edit-formbuilder-form') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.visit(route('formbuilder.forms.edit', form.id))}
                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Edit')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-formbuilder-form') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(form.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Delete')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Form Builder') }]}
            pageTitle={t('Manage Form Builder')}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-formbuilder-form') && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => router.visit(route('formbuilder.forms.create'))}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Create')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Form List')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({ ...filters, name: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search forms...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <ListGridToggle
                                currentView={viewMode}
                                routeName="formbuilder.forms.index"
                                filters={{ ...filters, per_page: perPage }}
                            />
                            <PerPageSelector
                                routeName="formbuilder.forms.index"
                                filters={{ ...filters, view: viewMode }}
                            />
                        </div>
                    </div>
                </CardContent>

                <CardContent className="p-0">
                    {viewMode === 'list' ? (
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={forms.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={FileText}
                                            title={t('No forms found')}
                                            description={t('Get started by creating your first form.')}
                                            hasFilters={!!filters.name}
                                            onClearFilters={clearFilters}
                                            createPermission="create-formbuilder"
                                            onCreateClick={() => router.visit(route('formbuilder.forms.create'))}
                                            createButtonText={t('Create Form')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto p-6">
                            {forms.data?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {forms.data?.map((form) => (
                                        <Card
                                            key={form.id}
                                            className="relative flex h-full min-w-0 flex-col overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="absolute end-0 top-0 h-0 w-0 border-s-[20px] border-t-[20px] border-s-transparent border-t-primary/20"></div>
                                            <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-transparent p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-foreground/10 p-2">
                                                        <FileText className="h-5 w-5 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold text-foreground">
                                                            {form.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="min-h-0 flex-1 p-4">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Fields')}
                                                        </p>
                                                        <p className="text-xs font-medium">{form.fields_count}</p>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Responses')}
                                                        </p>
                                                        <p className="text-xs font-medium">{form.responses_count}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Status')}
                                                        </p>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs ${
                                                                form.is_active
                                                                    ? 'bg-muted text-foreground'
                                                                    : 'bg-muted text-destructive'
                                                            }`}
                                                        >
                                                            {form.is_active ? t('Active') : t('Inactive')}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 text-xs">
                                                        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                                                            {t('Created')}
                                                        </p>
                                                        <p className="text-xs font-medium">
                                                            {formatDateTime(form.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-muted/50/50 mt-auto flex flex-shrink-0 justify-between gap-1 border-t p-3">
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => copyFormLink(form.code)}
                                                                    className={`h-8 w-8 p-0 transition-colors ${
                                                                        copiedCode === form.code
                                                                            ? 'text-foreground hover:text-foreground'
                                                                            : 'text-foreground hover:text-foreground'
                                                                    }`}
                                                                >
                                                                    {copiedCode === form.code ? (
                                                                        <Copy className="h-4 w-4" />
                                                                    ) : (
                                                                        <Link className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {copiedCode === form.code
                                                                        ? t('Copied!')
                                                                        : t('Copy Link')}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        {auth.user?.permissions?.includes(
                                                            'view-formbuilder-responses'
                                                        ) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route(
                                                                                    'formbuilder.forms.responses',
                                                                                    form.id
                                                                                )
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <BarChart3 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Responses')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {auth.user?.permissions?.includes(
                                                            'manage-formbuilder-conversions'
                                                        ) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route(
                                                                                    'formbuilder.forms.conversion',
                                                                                    form.id
                                                                                )
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <Zap className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Convert')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </TooltipProvider>
                                                </div>
                                                <div className="flex gap-1">
                                                    <TooltipProvider>
                                                        {auth.user?.permissions?.includes('edit-formbuilder-form') && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route('formbuilder.forms.edit', form.id)
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                                    >
                                                                        <EditIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Edit')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {auth.user?.permissions?.includes(
                                                            'delete-formbuilder-form'
                                                        ) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openDeleteDialog(form.id)}
                                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('Delete')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <NoRecordsFound
                                    icon={FileText}
                                    title={t('No forms found')}
                                    description={t('Get started by creating your first form.')}
                                    hasFilters={!!filters.name}
                                    onClearFilters={clearFilters}
                                    createPermission="create-formbuilder"
                                    onCreateClick={() => router.visit(route('formbuilder.forms.create'))}
                                    createButtonText={t('Create Form')}
                                />
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={forms}
                        routeName="formbuilder.forms.index"
                        filters={{ ...filters, per_page: perPage, view: viewMode }}
                    />
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Form')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
