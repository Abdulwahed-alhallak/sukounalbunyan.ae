import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Users as UsersIcon, Trash2 } from 'lucide-react';
import NoRecordsFound from '@/components/no-records-found';
import { getImagePath } from '@/utils/helpers';
import { Deal } from '../types';

interface UsersProps {
    [key: string]: any;
    deal: Deal;
    availableUsers: any[];
    onRegisterAddHandler: (handler: () => void) => void;
}

export default function Users({ deal, availableUsers, onRegisterAddHandler }: UsersProps) {
    useEffect(() => {
        onRegisterAddHandler(() => openUserModal());
    }, [onRegisterAddHandler]);
    const { t } = useTranslation();
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [availableUsersState, setAvailableUsersState] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userDeleteState, setUserDeleteState] = useState({ isOpen: false, userId: null, message: '' });

    const formatAvailableUsers = () => {
        setAvailableUsersState(
            availableUsers?.map((user: any) => ({
                value: user.id.toString(),
                label: user.name,
            }))
        );
    };

    const handleAssignUsers = () => {
        if (selectedUsers.length === 0) return;

        router.post(
            route('lead.deals.assign-users', deal.id),
            {
                user_ids: selectedUsers?.map((id) => parseInt(id)),
            },
            {
                onSuccess: () => {
                    setUserModalOpen(false);
                    setSelectedUsers([]);
                },
            }
        );
    };

    const openUserModal = () => {
        formatAvailableUsers();
        setUserModalOpen(true);
    };

    const openUserDeleteDialog = (userId: number) => {
        setUserDeleteState({
            isOpen: true,
            userId,
            message: t('Are you sure you want to remove this user?'),
        });
    };

    const closeUserDeleteDialog = () => {
        setUserDeleteState({ isOpen: false, userId: null, message: '' });
    };

    const confirmUserDelete = () => {
        if (userDeleteState.userId) {
            router.delete(route('lead.deals.remove-user', { deal: deal.id, user: userDeleteState.userId }));
            closeUserDeleteDialog();
        }
    };

    return (
        <>
            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[75vh] w-full overflow-y-auto rounded-none">
                <div className="min-w-[600px]">
                    <DataTable
                        data={deal.user_deals || []}
                        columns={[
                            {
                                key: 'user.avatar',
                                header: t('Avatar'),
                                render: (value: string, userDeal: any) => {
                                    const user = userDeal.user;
                                    return (
                                        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                                            {user?.avatar ? (
                                                <img
                                                    src={getImagePath(user.avatar)}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-foreground/10 text-sm font-medium">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    );
                                },
                            },
                            {
                                key: 'user.name',
                                header: t('User Name'),
                                render: (value: string, userDeal: any) => userDeal.user?.name || '-',
                            },
                            {
                                key: 'actions',
                                header: t('Action'),
                                render: (_: any, userDeal: any) => (
                                    <div className="flex gap-1">
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            openUserDeleteDialog(userDeal.user?.id);
                                                        }}
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('Delete User')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ),
                            },
                        ]}
                        className="rounded-none"
                        emptyState={
                            <NoRecordsFound
                                icon={UsersIcon}
                                title={t('No Users added')}
                                description={t('Get started by adding users to this deal.')}
                                onCreateClick={() => openUserModal()}
                                createButtonText={t('Add Users')}
                                className="h-auto"
                            />
                        }
                    />
                </div>
            </div>

            <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Add Users')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>{t('Select Users')}</Label>
                            <MultiSelect
                                options={availableUsersState}
                                value={selectedUsers}
                                onValueChange={setSelectedUsers}
                                placeholder={t('Select users')}
                                searchable={true}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setUserModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button onClick={handleAssignUsers} disabled={selectedUsers.length === 0}>
                                {t('Save')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={userDeleteState.isOpen}
                onOpenChange={closeUserDeleteDialog}
                title={t('Remove User')}
                message={userDeleteState.message}
                confirmText={t('Remove')}
                onConfirm={confirmUserDelete}
                variant="destructive"
            />
        </>
    );
}
