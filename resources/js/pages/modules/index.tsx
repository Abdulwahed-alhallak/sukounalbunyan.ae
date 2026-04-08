import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package, Plus, Power, PowerOff, Eye, MoreVertical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchInput } from "@/components/ui/search-input";
import NoRecordsFound from '@/components/no-records-found';
import { ModulesIndexProps, Module } from './types';
import { getPackageFavicon, getPackageAlias } from '@/utils/helpers';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Index() {
    const { modules, auth } = usePage<ModulesIndexProps>().props;
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);


    const filteredModules = modules.filter(module =>
        module.display !== false &&
        (module.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggleModule = (moduleName: string, isEnabled: boolean) => {
        router.post(route('add-on.enable', moduleName), {}, {
            preserveState: true,
        });
    };

    const handleViewDetails = (module: Module) => {
        setSelectedModule(module);
        setIsDetailsOpen(true);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{label: t('Add-ons')}]}
            pageTitle={t('Add-ons Manager')}
            pageActions={
                <TooltipProvider>
                    {auth.user?.permissions?.includes('manage-add-on') && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button size="sm" onClick={() => router.visit(route('add-on.upload'))}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('Upload Add-ons')}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            }
        >
            <Head title={t('Add-ons')} />

            <Card>
                <CardHeader className="pb-3">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={() => {}}
                        placeholder={t('Search add-ons...')}
                        className="w-full"
                    />
                </CardHeader>

                <CardContent>
                    {filteredModules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                            {filteredModules.map((module) => (
                                <Card key={module.name} className="relative hover:shadow-lg transition-all duration-200 border border-border flex flex-col">
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        src={getPackageFavicon(module.name)}
                                                        alt={getPackageAlias(module.name)}
                                                        className="h-10 w-10 object-contain rounded-lg"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                    <Package className="h-10 w-10 text-foreground hidden" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <span className="text-xs text-foreground font-medium whitespace-nowrap">v{parseFloat(module.version).toFixed(1)}</span>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                                                    module.is_enabled
                                                        ? 'bg-foreground text-background'
                                                        : 'bg-muted/500 text-background'
                                                }`}>
                                                    {module.is_enabled ? t('Active') : t('Inactive')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{module.alias}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{module.description}</p>
                                        </div>

                                        <div className="mt-auto flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(module)}
                                                className="flex-1 h-8 text-xs"
                                            >
                                                <Eye className="mr-1 h-3 w-3" />
                                                {t('Details')}
                                            </Button>
                                            {auth.user?.permissions?.includes('manage-actions') && (
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleToggleModule(module.name, module.is_enabled)}
                                                                className={`h-8 px-2 ${module.is_enabled ? 'bg-muted hover:bg-muted border-border' : 'bg-muted hover:bg-muted border-border'}`}
                                                            >
                                                                {module.is_enabled ? (
                                                                    <PowerOff className="h-3 w-3 text-destructive" />
                                                                ) : (
                                                                    <Power className="h-3 w-3 text-foreground" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{module.is_enabled ? t('Disable Module') : t('Enable Module')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <NoRecordsFound
                            icon={Package}
                            title={t('No add-ons found')}
                            description={searchTerm ? t('No add-ons match your search criteria.') : t('No add-ons are available.')}
                            hasFilters={!!searchTerm}
                            onClearFilters={() => setSearchTerm('')}
                        />
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <img
                                src={selectedModule?.image}
                                alt={selectedModule?.alias}
                                className="h-8 w-8 object-contain rounded"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <Package className="h-8 w-8 text-foreground hidden" />
                            {selectedModule?.alias}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedModule?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground">{t('Version')}:</span>
                                <p className="text-foreground font-medium">v{selectedModule?.version}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">{t('Status')}:</span>
                                <p className={`font-medium ${
                                    selectedModule?.is_enabled ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                    {selectedModule?.is_enabled ? t('Active') : t('Inactive')}
                                </p>
                            </div>
                        </div>
                        {selectedModule?.package_name && (
                            <div>
                                <span className="font-medium text-muted-foreground">{t('Package')}:</span>
                                <p className="text-sm text-foreground">{selectedModule.package_name}</p>
                            </div>
                        )}
                        {auth.user?.permissions?.includes('manage-actions') && (
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (selectedModule) {
                                            handleToggleModule(selectedModule.name, selectedModule.is_enabled);
                                            setIsDetailsOpen(false);
                                        }
                                    }}
                                    className={`flex-1 ${selectedModule?.is_enabled ? 'bg-muted hover:bg-muted border-border text-destructive' : 'bg-muted hover:bg-muted border-border text-foreground'}`}
                                >
                                    {selectedModule?.is_enabled ? (
                                        <>
                                            <PowerOff className="mr-2 h-4 w-4" />
                                            {t('Disable')}
                                        </>
                                    ) : (
                                        <>
                                            <Power className="mr-2 h-4 w-4" />
                                            {t('Enable')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
