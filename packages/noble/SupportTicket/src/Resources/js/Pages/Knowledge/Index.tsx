import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Upload, Download, Headphones } from 'lucide-react';
import Create from './Create';
import EditKnowledge from './Edit';
import ImportDialog from './ImportDialog';
import { formatDateTime } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';

interface Knowledge {
    id: number;
    title: string;
    description: string;
    category?: string;
    created_at: string;
}

interface Category {
    id: number;
    title: string;
}

interface Props {
    knowledge: {
        data: Knowledge[];
        links: any;
        meta: any;
    };
    categories: Category[];
}

export default function Index({ knowledge, categories }: Props) {
    const { t } = useTranslation();
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        search: urlParams.get('search') || '',
        category: urlParams.get('category') || '',
    });

    const [perPage, setPerPage] = useState(urlParams.get('per_page') || '15');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [showFilters, setShowFilters] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null);

    const zendeskButtons = usePageButtons('zendeskSyncBtn', { module: 'knowledgebase', settingKey: 'zendesk_is_on' });

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'support-ticket-knowledge.destroy',
        defaultMessage: t('Are you sure you want to delete this knowledge base item?'),
    });

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        router.reload();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setEditingKnowledge(null);
        router.reload();
    };

    const handleFilter = () => {
        router.get(
            route('support-ticket-knowledge.index'),
            { ...filters, per_page: perPage, sort: sortField, direction: sortDirection },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(newPerPage);
        router.get(
            route('support-ticket-knowledge.index'),
            { ...filters, per_page: newPerPage, sort: sortField, direction: sortDirection },
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
            route('support-ticket-knowledge.index'),
            { ...filters, per_page: perPage, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '' });
        router.get(route('support-ticket-knowledge.index'), { per_page: perPage });
    };

    const openEditModal = (knowledge: Knowledge) => {
        setEditingKnowledge(knowledge);
        setShowEditModal(true);
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Title'),
            sortable: true,
        },

        {
            key: 'category',
            header: t('Category'),
            render: (value: any, row: Knowledge) => <span className="text-sm">{row.category || 'No Category'}</span>,
        },
        {
            key: 'description',
            header: t('Description'),
            render: (value: string) => {
                const text = value?.replace(/<[^>]*>/g, '') || '';
                return text.length > 100 ? text.substring(0, 100) + '...' : text;
            },
        },
        {
            key: 'created_at',
            header: t('Created'),
            sortable: true,
            render: (value: string) => formatDateTime(value),
        },

        {
            key: 'actions',
            header: t('Actions'),
            render: (_: any, knowledge: Knowledge) => (
                <div className="flex gap-1">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(knowledge)}
                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Edit')}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => openDeleteDialog(knowledge.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Delete')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Support Tickets'), url: route('dashboard.support-tickets') },
                { label: t('Knowledge Base') },
            ]}
            pageTitle={t('Manage Knowledge Base')}
            pageActions={
                <div className="flex gap-2">
                    {zendeskButtons?.map((button) => (
                        <div key={button.id}>{button.component}</div>
                    ))}
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Import')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button size="sm" onClick={() => setShowCreateModal(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Create')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Knowledge Base')} />

            <Card className="shadow-sm">
                <CardContent className="bg-muted/50/50 border-b p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-md flex-1">
                            <SearchInput
                                value={filters.search}
                                onChange={(value) => setFilters({ ...filters, search: value })}
                                onSearch={handleFilter}
                                placeholder={t('Search knowledge base...')}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <PerPageSelector
                                routeName="support-ticket-knowledge.index"
                                filters={filters}
                                currentPerPage={perPage}
                                onPerPageChange={handlePerPageChange}
                            />
                            <div className="relative">
                                <FilterButton showFilters={showFilters} onToggle={() => setShowFilters(!showFilters)} />
                                {(() => {
                                    const activeFilters = [filters.category].filter(
                                        (f) => f !== '' && f !== null && f !== undefined
                                    ).length;
                                    return (
                                        activeFilters > 0 && (
                                            <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                                                {activeFilters}
                                            </span>
                                        )
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </CardContent>

                {showFilters && (
                    <CardContent className="bg-muted/50/30 border-b p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Category')}
                                </label>
                                <Select
                                    value={filters.category}
                                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Filter by Category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.title}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} size="sm">
                                    {t('Apply')}
                                </Button>
                                <Button variant="outline" onClick={clearFilters} size="sm">
                                    {t('Clear')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}

                <CardContent className="p-0">
                    <div className="min-w-[800px]">
                        <DataTable
                            data={knowledge.data}
                            columns={tableColumns}
                            onSort={handleSort}
                            sortKey={sortField}
                            sortDirection={sortDirection as 'asc' | 'desc'}
                            className="rounded-none"
                            emptyState={
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="text-center">
                                        <Headphones className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-medium text-foreground">
                                            {t('No Knowledge Base found')}
                                        </h3>
                                        <p className="mb-4 text-muted-foreground">
                                            {t('Get started by creating your first Knowledge Base article.')}
                                        </p>
                                        <Button onClick={() => setShowCreateModal(true)}>
                                            <Plus className="me-2 h-4 w-4" />
                                            {t('Create Knowledge Base')}
                                        </Button>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </CardContent>

                <CardContent className="bg-muted/50/30 border-t px-4 py-2">
                    <Pagination
                        data={knowledge || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                        routeName="support-ticket-knowledge.index"
                        filters={{ ...filters, per_page: perPage }}
                    />
                </CardContent>
            </Card>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <Create categories={categories} onSuccess={handleCreateSuccess} />
            </Dialog>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                {editingKnowledge && (
                    <EditKnowledge knowledge={editingKnowledge} categories={categories} onSuccess={handleEditSuccess} />
                )}
            </Dialog>

            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <ImportDialog
                    onSuccess={() => {
                        setShowImportModal(false);
                        router.reload();
                    }}
                />
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Knowledge Base')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
