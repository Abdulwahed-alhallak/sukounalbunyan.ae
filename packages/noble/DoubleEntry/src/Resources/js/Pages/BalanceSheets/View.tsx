import React, { useState } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, FileText, Printer, Plus, GitCompare, LayoutGrid, Columns, Trash2, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { BalanceSheetViewProps } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';
import Note from './Note';
import Compare from './Compare';
import Generate from './Generate';
import YearEndClose from './YearEndClose';

export default function View() {
    const { t } = useTranslation();
    const { balanceSheet, groupedItems, allBalanceSheets, otherBalanceSheets, auth } =
        usePage<BalanceSheetViewProps>().props;
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showYearEndModal, setShowYearEndModal] = useState(false);
    const [viewType, setViewType] = useState<'vertical' | 'horizontal'>('horizontal');

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'double-entry.balance-sheets.delete-note',
        defaultMessage: t('Are you sure you want to delete this note?'),
    });

    const handleFinalize = () => {
        router.post(
            route('double-entry.balance-sheets.finalize', balanceSheet.id),
            {},
            {
                preserveState: true,
            }
        );
    };

    const handleDeleteNote = (noteId: number) => {
        openDeleteDialog([balanceSheet.id, noteId]);
    };

    const renderSection = (sectionType: string, sectionTitle: string) => {
        const sectionItems = groupedItems[sectionType];
        if (!sectionItems) return null;

        let sectionTotal = 0;
        const sectionColors = {
            assets: 'bg-muted/50 border-border text-foreground',
            liabilities: 'bg-muted/50 border-border text-destructive',
            equity: 'bg-muted/50 border-border text-foreground',
        };

        return (
            <div className="mb-8">
                <h3 className="mb-6 text-xl font-bold text-foreground">{sectionTitle}</h3>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60%]">{t('Account')}</TableHead>
                            <TableHead className="w-[20%] text-center">{t('Code')}</TableHead>
                            <TableHead className="w-[20%] text-end">{t('Amount')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(sectionItems)?.map(([subSection, items]) => {
                            const subSectionTotal = items.reduce(
                                (sum, item) => sum + parseFloat(item.amount.toString()),
                                0
                            );
                            sectionTotal += subSectionTotal;

                            return (
                                <React.Fragment key={subSection}>
                                    <TableRow key={`${subSection}-header`}>
                                        <TableCell colSpan={3} className="font-semibold capitalize text-foreground">
                                            {subSection.replace('_', ' ')}
                                        </TableCell>
                                    </TableRow>
                                    {items?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-foreground">
                                                {item.account?.account_name}
                                            </TableCell>
                                            <TableCell className="text-center text-foreground">
                                                {item.account?.account_code}
                                            </TableCell>
                                            <TableCell className="text-end font-semibold tabular-nums text-foreground">
                                                {formatCurrency(item.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow key={`${subSection}-total`} className="border-b-2">
                                        <TableCell className="font-semibold">
                                            {t('Total')} {subSection.replace('_', ' ')}
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-end font-bold tabular-nums">
                                            {formatCurrency(subSectionTotal)}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                        <TableRow className="border-t-2 border-border">
                            <TableCell className="text-lg font-bold">
                                {t('TOTAL')} {sectionTitle.toUpperCase()}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-end text-lg font-bold tabular-nums">
                                {formatCurrency(sectionTotal)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Double Entry') },
                { label: t('Balance Sheets'), url: route('double-entry.balance-sheets.list') },
                { label: `${t('Balance Sheet')} - ${formatDate(balanceSheet.balance_sheet_date)}` },
            ]}
            pageTitle={`${t('Balance Sheet')} - ${formatDate(balanceSheet.balance_sheet_date)}`}
            pageActions={
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('manage-balance-sheets') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(route('double-entry.balance-sheets.list'))}
                                    >
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('All Balance Sheets')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('view-balance-sheet-comparisons') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(route('double-entry.balance-sheets.comparisons'))}
                                    >
                                        <GitCompare className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('View Comparisons')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('year-end-close') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setShowYearEndModal(true)}>
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Year-End Close')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <div className="flex items-center rounded-lg border">
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={viewType === 'vertical' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewType('vertical')}
                                        className="rounded-e-none"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Vertical View')}</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={viewType === 'horizontal' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewType('horizontal')}
                                        className="rounded-s-none"
                                    >
                                        <Columns className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Horizontal View')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {auth.user?.permissions?.includes('create-balance-sheets') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => setShowGenerateModal(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Generate Balance Sheet')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={`${t('Balance Sheet')} - ${formatDate(balanceSheet.balance_sheet_date)}`} />

            <div className="mx-auto max-w-7xl space-y-6">
                <Note open={showNoteModal} onOpenChange={setShowNoteModal} balanceSheetId={balanceSheet.id} />

                <Compare
                    open={showCompareModal}
                    onOpenChange={setShowCompareModal}
                    balanceSheetId={balanceSheet.id}
                    otherBalanceSheets={otherBalanceSheets}
                />

                <Generate open={showGenerateModal} onOpenChange={setShowGenerateModal} />

                <YearEndClose open={showYearEndModal} onOpenChange={setShowYearEndModal} />
                {/* Header Card */}
                <Card className="border-0 bg-gradient-to-r from-white to-muted/50 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                                    <FileText className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{t('Balance Sheet')}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {t('As of')} {formatDate(balanceSheet.balance_sheet_date)} |{' '}
                                        {t('Financial Year')}: {balanceSheet.financial_year}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {allBalanceSheets && allBalanceSheets.length > 0 && (
                                    <Select
                                        value={balanceSheet.id.toString()}
                                        onValueChange={(value) =>
                                            router.visit(route('double-entry.balance-sheets.show', value))
                                        }
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allBalanceSheets?.map((sheet) => (
                                                <SelectItem key={sheet.id} value={sheet.id.toString()}>
                                                    {formatDate(sheet.balance_sheet_date)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {auth.user?.permissions?.includes('create-balance-sheet-notes') && (
                                    <Button variant="outline" size="sm" onClick={() => setShowNoteModal(true)}>
                                        <Plus className="me-2 h-4 w-4" />
                                        {t('Add Note')}
                                    </Button>
                                )}
                                {auth.user?.permissions?.includes('create-balance-sheet-comparisons') && (
                                    <Button variant="outline" size="sm" onClick={() => setShowCompareModal(true)}>
                                        <GitCompare className="me-2 h-4 w-4" />
                                        {t('Compare')}
                                    </Button>
                                )}
                                {auth.user?.permissions?.includes('print-balance-sheets') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const printUrl =
                                                route('double-entry.balance-sheets.print', balanceSheet.id) +
                                                '?download=pdf';
                                            window.open(printUrl, '_blank');
                                        }}
                                    >
                                        <Printer className="me-2 h-4 w-4" />
                                        {t('Download PDF')}
                                    </Button>
                                )}
                                {auth.user?.permissions?.includes('finalize-balance-sheets') &&
                                    balanceSheet.status === 'draft' &&
                                    balanceSheet.is_balanced && (
                                        <Button size="sm" onClick={handleFinalize}>
                                            <CheckCircle className="me-2 h-4 w-4" />
                                            {t('Finalize')}
                                        </Button>
                                    )}
                                <div className="ms-2 flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${
                                            balanceSheet.is_balanced
                                                ? 'bg-muted text-foreground'
                                                : 'bg-muted text-destructive'
                                        }`}
                                    >
                                        {t(balanceSheet.is_balanced ? 'Balanced' : 'Unbalanced')}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${
                                            balanceSheet.status === 'finalized'
                                                ? 'bg-muted text-foreground'
                                                : 'bg-muted text-foreground'
                                        }`}
                                    >
                                        {t(balanceSheet.status === 'finalized' ? 'Finalized' : 'Draft')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-foreground">{t('Total Assets')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-foreground">
                                    {formatCurrency(balanceSheet.total_assets)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-destructive">{t('Total Liabilities')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-destructive">
                                    {formatCurrency(balanceSheet.total_liabilities)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-foreground">{t('Total Equity')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-foreground">
                                    {formatCurrency(balanceSheet.total_equity)}
                                </p>
                            </div>
                        </div>

                        {!balanceSheet.is_balanced && (
                            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                                <p className="font-medium text-destructive">
                                    ⚠️ {t('Warning: This balance sheet is not balanced!')}
                                </p>
                                <p className="mt-1 text-sm text-destructive">
                                    {t(
                                        'Assets should equal Liabilities + Equity. Please review the accounts and transactions.'
                                    )}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Balance Sheet Content */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                        <div className="mb-8">
                            <h2 className="mb-2 text-2xl font-bold text-foreground">
                                {t('Balance Sheet of')} {formatDate(balanceSheet.balance_sheet_date)}
                            </h2>
                        </div>

                        {viewType === 'vertical' ? (
                            <>
                                {renderSection('assets', t('ASSETS'))}
                                {renderSection('liabilities', t('LIABILITIES'))}
                                {renderSection('equity', t('EQUITY'))}
                            </>
                        ) : (
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                {/* Left Side - Liabilities & Equity */}
                                <div>
                                    <h3 className="mb-6 text-xl font-bold text-foreground">
                                        {t('Liabilities & Equity')}
                                    </h3>

                                    {/* Equity */}
                                    {groupedItems.equity && (
                                        <div className="mb-6">
                                            <h4 className="mb-3 font-semibold text-foreground">{t('Equity')}</h4>
                                            {Object.entries(groupedItems.equity)?.map(([subSection, items]) => (
                                                <div key={subSection} className="mb-4">
                                                    {items?.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex justify-between py-1 text-sm"
                                                        >
                                                            <span className="text-foreground">
                                                                {item.account?.account_name}
                                                            </span>
                                                            <span className="tabular-nums text-foreground">
                                                                {formatCurrency(item.amount)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            <div className="flex justify-between border-b py-2 font-semibold">
                                                <span>{t('Total for Equity')}</span>
                                                <span className="tabular-nums">
                                                    {formatCurrency(balanceSheet.total_equity)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Liabilities */}
                                    {groupedItems.liabilities && (
                                        <div className="mb-6">
                                            <h4 className="mb-3 font-semibold text-foreground">{t('Liabilities')}</h4>
                                            {Object.entries(groupedItems.liabilities)?.map(([subSection, items]) => {
                                                const subTotal = items.reduce(
                                                    (sum, item) => sum + parseFloat(item.amount.toString()),
                                                    0
                                                );
                                                return (
                                                    <div key={subSection} className="mb-4">
                                                        <h5 className="mb-2 font-medium capitalize text-muted-foreground">
                                                            {subSection.replace('_', ' ')}
                                                        </h5>
                                                        {items?.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="ms-4 flex items-center justify-between py-1 text-sm"
                                                            >
                                                                <div className="flex w-full justify-between">
                                                                    <span className="text-foreground">
                                                                        {item.account?.account_name}
                                                                    </span>
                                                                    <div className="flex gap-8">
                                                                        <span className="text-muted-foreground">
                                                                            {item.account?.account_code}
                                                                        </span>
                                                                        <span className="tabular-nums text-foreground">
                                                                            {formatCurrency(item.amount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="ms-4 flex justify-between border-b py-2 font-medium">
                                                            <span>Total {subSection.replace('_', ' ')}</span>
                                                            <span className="tabular-nums">
                                                                {formatCurrency(subTotal)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex justify-between border-b py-2 font-semibold">
                                                <span>{t('Total for Liabilities')}</span>
                                                <span className="tabular-nums">
                                                    {formatCurrency(balanceSheet.total_liabilities)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side - Assets */}
                                <div>
                                    <h3 className="mb-6 text-xl font-bold text-foreground">{t('Assets')}</h3>

                                    {groupedItems.assets && (
                                        <div>
                                            <h4 className="mb-3 font-semibold text-foreground">{t('Assets')}</h4>
                                            {Object.entries(groupedItems.assets)?.map(([subSection, items]) => {
                                                const subTotal = items.reduce(
                                                    (sum, item) => sum + parseFloat(item.amount.toString()),
                                                    0
                                                );
                                                return (
                                                    <div key={subSection} className="mb-6">
                                                        <h5 className="mb-2 font-medium capitalize text-muted-foreground">
                                                            {subSection.replace('_', ' ')}
                                                        </h5>
                                                        {items?.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="ms-4 flex items-center justify-between py-1 text-sm"
                                                            >
                                                                <div className="flex w-full justify-between">
                                                                    <span className="text-foreground">
                                                                        {item.account?.account_name}
                                                                    </span>
                                                                    <div className="flex gap-8">
                                                                        <span className="text-muted-foreground">
                                                                            {item.account?.account_code}
                                                                        </span>
                                                                        <span className="tabular-nums text-foreground">
                                                                            {formatCurrency(item.amount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="ms-4 flex justify-between border-b py-2 font-medium">
                                                            <span>Total {subSection.replace('_', ' ')}</span>
                                                            <span className="tabular-nums">
                                                                {formatCurrency(subTotal)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Balance Totals - Always Show */}
                        <div className="mt-8 border-t-2 border-border pt-6">
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                <div className="flex justify-between py-3 text-lg font-bold">
                                    <span>{t('Total for Liabilities & Equity')}</span>
                                    <span className="tabular-nums">
                                        {formatCurrency(
                                            (groupedItems.liabilities
                                                ? Object.values(groupedItems.liabilities)
                                                      .flat()
                                                      .reduce(
                                                          (sum, item) => sum + parseFloat(item.amount.toString()),
                                                          0
                                                      )
                                                : 0) +
                                                (groupedItems.equity
                                                    ? Object.values(groupedItems.equity)
                                                          .flat()
                                                          .reduce(
                                                              (sum, item) => sum + parseFloat(item.amount.toString()),
                                                              0
                                                          )
                                                    : 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 text-lg font-bold">
                                    <span>{t('Total for Assets')}</span>
                                    <span className="tabular-nums">
                                        {formatCurrency(
                                            groupedItems.assets
                                                ? Object.values(groupedItems.assets)
                                                      .flat()
                                                      .reduce(
                                                          (sum, item) => sum + parseFloat(item.amount.toString()),
                                                          0
                                                      )
                                                : 0
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {balanceSheet.notes && balanceSheet.notes.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                                <h3 className="mb-4 text-lg font-semibold">{t('Notes to Balance Sheet')}</h3>
                                <div className="space-y-4">
                                    {balanceSheet.notes?.map((note: any) => (
                                        <div key={note.id} className="rounded-lg bg-muted/50 p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">
                                                        {t('Note')} {note.note_number}: {note.note_title}
                                                    </h4>
                                                    <p className="mt-2 text-foreground">{note.note_content}</p>
                                                </div>
                                                {auth.user?.permissions?.includes('delete-balance-sheet-notes') && (
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteNote(note.id)}
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t('Delete Note')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <ConfirmationDialog
                    open={deleteState.isOpen}
                    onOpenChange={closeDeleteDialog}
                    title={t('Delete Note')}
                    message={deleteState.message}
                    confirmText={t('Delete')}
                    onConfirm={confirmDelete}
                    variant="destructive"
                />
            </div>
        </AuthenticatedLayout>
    );
}
