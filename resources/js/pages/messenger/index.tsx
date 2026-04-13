import { useState, useEffect, useRef, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
    MessageCircle,
    Send,
    Search,
    User as UserIcon,
    Smile,
    Paperclip,
    X,
    Download,
    Edit,
    Trash2,
    Check,
    CheckCheck,
    MoreVertical,
    Pin,
    PinOff,
    Star,
} from 'lucide-react';
import { getImagePath, getAdminSetting } from '@/utils/helpers';

interface Message {
    id: number | string;
    sender_id: number;
    receiver_id: number;
    message: string;
    body?: string;
    attachment?: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    receiver: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    _tempFile?: File | null;
}

interface ChatUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    last_message?: Message;
    unread_count: number;
    is_online: boolean;
}

export default function MessengerPage() {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'favorites'>('users');
    const [favoriteUsers, setFavoriteUsers] = useState<number[]>([]);
    const [pinnedUsers, setPinnedUsers] = useState<number[]>([]);
    const [usersState, setUsersState] = useState<ChatUser[]>([]);
    const [editingMessage, setEditingMessage] = useState<number | string | null>(null);
    const [editText, setEditText] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPinLimitDialog, setShowPinLimitDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openDropdown, setOpenDropdown] = useState<number | string | null>(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const users = pageProps.users || [];
    const messages = pageProps.messages || [];
    const selectedUserId = pageProps.selectedUserId;
    const auth = pageProps.auth;

    const filteredUsers = useMemo(() => {
        const userList = usersState.length > 0 ? usersState : users;
        const searchLower = searchQuery.toLowerCase();

        let filtered = userList.filter(
            (user: ChatUser) =>
                user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower)
        );

        if (activeTab === 'favorites') {
            filtered = filtered.filter((user: ChatUser) => favoriteUsers.includes(user.id));
        }

        return filtered.sort((a: ChatUser, b: ChatUser) => {
            // Pinned users first
            const aPinned = pinnedUsers.includes(a.id);
            const bPinned = pinnedUsers.includes(b.id);
            if (aPinned !== bPinned) return aPinned ? -1 : 1;

            // Then by last message time
            const aTime = new Date(a.last_message?.created_at || 0).getTime();
            const bTime = new Date(b.last_message?.created_at || 0).getTime();
            return bTime - aTime;
        });
    }, [users, usersState, searchQuery, activeTab, favoriteUsers, pinnedUsers]);

    useEffect(() => {
        setChatMessages(messages);
        if (users.length > 0) {
            setUsersState(users);
        }
    }, [messages, users]);

    useEffect(() => {
        // Load favorites on mount
        Promise.all([
            fetch(route('messenger.favorites'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
            }),
            fetch(route('messenger.pinned'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
            }),
        ])
            .then(([favResponse, pinnedResponse]) => Promise.all([favResponse.json(), pinnedResponse.json()]))
            .then(([favorites, pinned]) => {
                setFavoriteUsers(favorites);
                setPinnedUsers(pinned);
            })
            .catch((error) => console.error('Failed to load user preferences:', error));
    }, []);

    useEffect(() => {
        if (selectedUserId && users.length > 0) {
            const user = users.find((u: ChatUser) => u.id === selectedUserId);
            if (user) setSelectedUser(user);
        }
    }, [selectedUserId, users]);

    useEffect(() => {
        if (messagesContainerRef.current && currentPage === 1 && chatMessages.length > 0) {
            // Set scroll to bottom immediately without animation (like WhatsApp)
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages, currentPage]);

    // Handle scroll to load more messages
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;

        if (scrollTop <= 10 && hasMoreMessages && !isLoadingMessages && selectedUser) {
            const prevScrollHeight = e.currentTarget.scrollHeight;
            loadMessages(selectedUser.id, currentPage + 1, false).then(() => {
                // Maintain scroll position after loading older messages
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight;
                        messagesContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
                    }
                }, 50);
            });
        }
    };

    // Heartbeat to update user presence
    useEffect(() => {
        const updatePresence = async () => {
            try {
                await fetch(route('messenger.update-presence'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                    },
                });
            } catch (error) {
                console.error('Failed to update presence:', error);
            }
        };

        // Update presence immediately
        updatePresence();

        // Update presence every 2 minutes
        const presenceInterval = setInterval(updatePresence, 120000);

        return () => clearInterval(presenceInterval);
    }, []);

    // Pusher real-time messaging
    useEffect(() => {
        if (!auth.user?.id) return;

        const pusherKey = getAdminSetting('pusher_app_key', pageProps) || import.meta.env.VITE_PUSHER_APP_KEY;
        const pusherCluster =
            getAdminSetting('pusher_app_cluster', pageProps) || import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1';

        if (!pusherKey) return;

        try {
            const pusher = new Pusher(pusherKey, { cluster: pusherCluster, forceTLS: true });
            const echo = new Echo({ broadcaster: 'pusher', client: pusher });
            const messageChannel = echo.channel(`messenger.${auth.user.id}`);
            const presenceChannel = echo.channel('messenger');

            messageChannel.listen('MessageSent', (e: any) => {
                const newMessage = {
                    id: e.message.id,
                    sender_id: e.message.from_id,
                    receiver_id: e.message.to_id,
                    message: e.message.body,
                    body: e.message.body,
                    attachment: e.message.attachment,
                    is_read: e.message.seen,
                    created_at: e.message.created_at,
                    updated_at: e.message.updated_at,
                    sender: e.sender,
                    receiver: {
                        id: auth.user.id,
                        name: auth.user.name,
                        email: auth.user.email,
                        avatar: auth.user.avatar,
                    },
                };

                if (selectedUser?.id === e.message.from_id) {
                    setChatMessages((prev) => [...prev, newMessage]);
                }

                setUsersState((prev) =>
                    prev.map((user) =>
                        user.id === e.message.from_id
                            ? {
                                  ...user,
                                  last_message: { ...newMessage, body: e.message.body },
                                  unread_count: selectedUser?.id === e.message.from_id ? 0 : user.unread_count + 1,
                              }
                            : user
                    )
                );
            });

            // Listen for user presence updates on global channel
            presenceChannel.listen('UserOnline', (e: any) => {
                setUsersState((prev) =>
                    prev.map((user) => (user.id === e.userId ? { ...user, is_online: true } : user))
                );
            });

            presenceChannel.listen('UserOffline', (e: any) => {
                setUsersState((prev) =>
                    prev.map((user) => (user.id === e.userId ? { ...user, is_online: false } : user))
                );
            });

            return () => {
                echo.leaveChannel(`messenger.${auth.user.id}`);
                echo.leaveChannel('messenger');
            };
        } catch (error) {
            // Silently fail - polling will handle message updates
        }
    }, [auth.user?.id, selectedUser?.id]);

    // Online status polling
    useEffect(() => {
        const updateOnlineStatus = async () => {
            try {
                const response = await fetch(route('messenger.online-users'), {
                    headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
                });
                const onlineUsers = await response.json();

                setUsersState((prev) =>
                    prev.map((user) => {
                        const onlineUser = onlineUsers.find((ou: any) => ou.id === user.id);
                        return onlineUser ? { ...user, is_online: onlineUser.is_online } : user;
                    })
                );
            } catch (error) {
                // Silently handle error
            }
        };

        const interval = setInterval(updateOnlineStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleUserSelect = async (user: ChatUser) => {
        setSelectedUser(user);
        setCurrentPage(1);
        setHasMoreMessages(true);

        // Reset unread count for this user in the users list
        setUsersState((prev) => prev.map((u) => (u.id === user.id ? { ...u, unread_count: 0 } : u)));

        await loadMessages(user.id, 1, true);
    };

    const loadMessages = async (userId: number, page: number = 1, isNewChat: boolean = false) => {
        if (isLoadingMessages) return;

        setIsLoadingMessages(true);

        try {
            const response = await fetch(`${route('messenger.messages', userId)}?page=${page}&per_page=20`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
            });
            const data = await response.json();
            const newMessages = data.data || data;
            const hasMore = data.next_page_url !== null;

            const formattedMessages = newMessages.map((message: any) => ({
                id: message.id,
                sender_id: message.from_id,
                receiver_id: message.to_id,
                message: message.body,
                body: message.body,
                attachment: message.attachment,
                is_read: message.seen,
                created_at: message.created_at,
                updated_at: message.updated_at,
                sender: {
                    id: message.from_user.id,
                    name: message.from_user.name,
                    email: message.from_user.email,
                    avatar: message.from_user.avatar,
                },
                receiver: {
                    id: message.to_user.id,
                    name: message.to_user.name,
                    email: message.to_user.email,
                    avatar: message.to_user.avatar,
                },
            }));

            if (isNewChat) {
                // For new chat, show latest messages (already in chronological order from backend)
                setChatMessages(formattedMessages);
            } else {
                // For loading older messages, prepend them to the beginning
                setChatMessages((prev) => [...formattedMessages, ...prev]);
            }

            setHasMoreMessages(hasMore);
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            sender_id: auth.user.id,
            receiver_id: selectedUser.id,
            message: newMessage.trim(),
            body: newMessage.trim(),
            attachment: selectedFile ? `blob:${selectedFile.name}` : undefined,
            _tempFile: selectedFile, // Store file for preview
            is_read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sender: {
                id: auth.user.id,
                name: auth.user.name,
                email: auth.user.email,
                avatar: auth.user.avatar,
            },
            receiver: {
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email,
                avatar: selectedUser.avatar,
            },
        };

        setChatMessages((prev) => [...prev, tempMessage]);
        const messageText = newMessage.trim();
        const fileToSend = selectedFile;
        setNewMessage('');
        setSelectedFile(null);

        const formData = new FormData();
        formData.append('receiver_id', selectedUser.id.toString());
        if (messageText) formData.append('message', messageText);
        if (fileToSend) formData.append('attachment', fileToSend);

        fetch(route('messenger.send'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    setChatMessages((prev) => prev.filter((msg) => msg.id.toString() !== tempMessage.id.toString()));
                } else {
                    // Update users list with latest message
                    setUsersState((prev) =>
                        prev.map((user) =>
                            user.id === selectedUser.id
                                ? { ...user, last_message: { ...tempMessage, body: messageText || '📎 Attachment' } }
                                : user
                        )
                    );
                }
            })
            .catch(() => {
                setChatMessages((prev) => prev.filter((msg) => msg.id.toString() !== tempMessage.id.toString()));
            });
    };

    const handleEditMessage = (message: Message) => {
        setEditingMessage(message.id);
        setEditText(message.message);
    };

    const handleSaveEdit = async (messageId: number | string) => {
        try {
            await fetch(route('messenger.edit-message', messageId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ message: editText }),
            });

            setChatMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, message: editText } : msg)));
            setEditingMessage(null);
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    };

    const handleDeleteMessage = (messageId: number | string) => {
        setDeleteConfirm(messageId);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            await fetch(route('messenger.delete-message', deleteConfirm), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            setChatMessages((prev) => prev.filter((msg) => msg.id !== deleteConfirm));
            setDeleteConfirm(null);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const toggleFavorite = async (userId: number) => {
        try {
            const response = await fetch(route('messenger.toggle-favorite'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ user_id: userId }),
            });

            if (response.ok) {
                setFavoriteUsers((prev) =>
                    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
                );
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const togglePin = async (userId: number) => {
        try {
            if (!pinnedUsers.includes(userId) && pinnedUsers.length >= 3) {
                setShowPinLimitDialog(true);
                return;
            }

            const response = await fetch(route('messenger.toggle-pin'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ user_id: userId }),
            });

            if (response.ok) {
                setPinnedUsers((prev) =>
                    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
                );
            }
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown && !(event.target as Element).closest('.relative')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    // User presence management
    useEffect(() => {
        const updatePresence = () => {
            fetch(route('messenger.update-presence'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({}),
            }).catch(() => {});
        };

        const setOffline = () => {
            const formData = new FormData();
            formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');
            navigator.sendBeacon(route('messenger.set-offline'), formData);
        };

        let timer: NodeJS.Timeout;
        const throttledUpdate = () => {
            clearTimeout(timer);
            timer = setTimeout(updatePresence, 3000);
        };

        ['mousedown', 'keypress', 'scroll'].forEach((event) => document.addEventListener(event, throttledUpdate, true));

        window.addEventListener('beforeunload', setOffline);
        updatePresence(); // Initial update

        return () => {
            ['mousedown', 'keypress', 'scroll'].forEach((event) =>
                document.removeEventListener(event, throttledUpdate, true)
            );
            window.removeEventListener('beforeunload', setOffline);
            clearTimeout(timer);
            setOffline();
        };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            e.target.value = ''; // Reset input
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return '🖼️';
        if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return '🎥';
        if (['pdf'].includes(ext || '')) return '📄';
        if (['doc', 'docx'].includes(ext || '')) return '📝';
        return '📎';
    };

    const renderAttachment = (message: Message & { _tempFile?: File | null }) => {
        if (!message.attachment) return null;

        // Handle temporary files
        if (message._tempFile) {
            const file = message._tempFile;
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);

            if (isImage) {
                return (
                    <div className="mt-2">
                        <img src={URL.createObjectURL(file)} alt="Attachment" className="max-w-xs rounded-lg" />
                    </div>
                );
            }

            return (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-card/10 p-2">
                    <span className="text-lg">{getFileIcon(file.name)}</span>
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                </div>
            );
        }

        // Handle regular attachments
        const fileName = message.attachment.split('/').pop() || '';
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);

        if (isImage) {
            return (
                <div className="mt-2">
                    <img
                        src={getImagePath(message.attachment, pageProps)}
                        alt="Attachment"
                        className="max-w-xs cursor-pointer rounded-lg"
                        onClick={() =>
                            message.attachment && window.open(getImagePath(message.attachment, pageProps), '_blank')
                        }
                    />
                </div>
            );
        }

        return (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-card/10 p-2">
                <span className="text-lg">{getFileIcon(fileName)}</span>
                <span className="flex-1 truncate text-sm">{fileName}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        message.attachment && window.open(getImagePath(message.attachment, pageProps), '_blank')
                    }
                    className="h-6 w-6 p-0 text-current"
                >
                    <Download className="h-3 w-3" />
                </Button>
            </div>
        );
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Messenger') }]} pageTitle={t('Messenger')}>
            <Head title={t('Messenger')} />

            <div className="flex h-[calc(100vh-100px)] gap-6">
                <Card className="flex h-full w-80 flex-col">
                    <CardHeader className="flex-shrink-0 pb-3">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-foreground/10 p-2">
                                <MessageCircle className="h-5 w-5 text-foreground" />
                            </div>
                            <h2 className="font-semibold text-foreground">{t('Conversations')}</h2>
                        </div>

                        <div className="mb-4 flex gap-1 rounded-lg bg-muted p-1">
                            <Button
                                variant={activeTab === 'users' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('users')}
                                className="h-8 flex-1"
                            >
                                {t('All Users')}
                            </Button>
                            <Button
                                variant={activeTab === 'favorites' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('favorites')}
                                className="h-8 flex-1"
                            >
                                {t('Favorites')}
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder={t('Search users...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <div
                            className="h-full overflow-y-auto"
                            style={
                                {
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                } as React.CSSProperties
                            }
                        >
                            <div>
                                {filteredUsers.map((user: ChatUser) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className={`group flex cursor-pointer items-center gap-3 border-b border-border p-3 transition-all duration-150 ${
                                            selectedUser?.id === user.id
                                                ? 'border-r-4 border-foreground bg-muted'
                                                : 'hover:bg-muted/50'
                                        } ${pinnedUsers.includes(user.id) ? 'border-l-2 border-border bg-muted' : ''}`}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={getImagePath(user.avatar || '', pageProps)}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                                                    <UserIcon className="h-6 w-6 text-foreground" />
                                                </AvatarFallback>
                                            </Avatar>
                                            {pinnedUsers.includes(user.id) && (
                                                <div className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background">
                                                    📌
                                                </div>
                                            )}
                                            <div
                                                className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                                                    user.is_online ? 'bg-foreground' : 'bg-muted-foreground'
                                                }`}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <p className="truncate text-sm font-semibold text-foreground">
                                                        {user.name}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        {user.last_message && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(
                                                                    user.last_message.created_at
                                                                ).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                        )}
                                                        {user.unread_count > 0 && (
                                                            <div className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                                                                {user.unread_count > 9 ? '9+' : user.unread_count}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="flex-1 truncate text-xs text-muted-foreground">
                                                        {user.last_message
                                                            ? user.last_message.body || user.last_message.message
                                                                ? (user.last_message.body || user.last_message.message)
                                                                      .length > 20
                                                                    ? (
                                                                          user.last_message.body ||
                                                                          user.last_message.message
                                                                      ).substring(0, 20) + '...'
                                                                    : user.last_message.body ||
                                                                      user.last_message.message
                                                                : user.last_message.attachment
                                                                  ? t('📎 Attachment')
                                                                  : t('No messages yet')
                                                            : t('No messages yet')}
                                                    </p>
                                                    <div className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                togglePin(user.id);
                                                            }}
                                                            className="h-6 w-6 p-0"
                                                            title={
                                                                pinnedUsers.includes(user.id)
                                                                    ? t('Unpin chat')
                                                                    : t('Pin chat')
                                                            }
                                                        >
                                                            <span
                                                                className={`text-xs ${pinnedUsers.includes(user.id) ? 'text-foreground' : 'text-muted-foreground'}`}
                                                            >
                                                                {pinnedUsers.includes(user.id) ? (
                                                                    <PinOff className="h-3 w-3" />
                                                                ) : (
                                                                    <Pin className="h-3 w-3" />
                                                                )}
                                                            </span>
                                                        </Button>
                                                        {auth.user?.permissions?.includes(
                                                            'toggle-favorite-messages'
                                                        ) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavorite(user.id);
                                                                }}
                                                                className="h-6 w-6 p-0"
                                                                title={
                                                                    favoriteUsers.includes(user.id)
                                                                        ? t('Remove from favorites')
                                                                        : t('Add to favorites')
                                                                }
                                                            >
                                                                <span
                                                                    className={`text-base transition-colors ${
                                                                        favoriteUsers.includes(user.id)
                                                                            ? 'text-foreground hover:text-foreground'
                                                                            : 'text-muted-foreground hover:text-foreground'
                                                                    }`}
                                                                >
                                                                    <Star
                                                                        className={`h-4 w-4 ${favoriteUsers.includes(user.id) ? 'fill-current' : ''}`}
                                                                    />
                                                                </span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    className={`py-12 text-center text-muted-foreground ${filteredUsers.length === 0 ? '' : 'hidden'}`}
                                >
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 p-4">
                                        <UserIcon className="h-8 w-8 text-muted-foreground/60" />
                                    </div>
                                    <p className="text-sm font-medium">{t('No users found')}</p>
                                    <p className="mt-1 text-xs">{t('Try adjusting your search')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-1 flex-col">
                    <CardHeader className={`pb-3 ${selectedUser ? 'border-b' : 'hidden'}`}>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={getImagePath(selectedUser?.avatar || '', pageProps)}
                                    alt={selectedUser?.name || ''}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                                    <UserIcon className="h-5 w-5 text-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-foreground">{selectedUser?.name || ''}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedUser?.is_online ? t('Online') : t('Offline')}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-0">
                        <div className={selectedUser ? '' : 'hidden'}>
                            <div
                                className="h-[calc(100vh-300px)] flex-1 overflow-y-auto p-6"
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                                style={
                                    {
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                    } as React.CSSProperties
                                }
                            >
                                {isLoadingMessages && currentPage > 1 && (
                                    <div className="mb-2 flex justify-center py-3">
                                        <div className="animate-pulse rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                            {t('Loading messages...')}
                                        </div>
                                    </div>
                                )}
                                <div className="min-h-full space-y-4">
                                    {chatMessages.length > 0 ? (
                                        chatMessages.map((message: Message) => {
                                            const isOwnMessage = message.sender_id === auth.user.id;
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`group mb-2 flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {!isOwnMessage &&
                                                        auth.user?.permissions?.includes('delete-messages') && (
                                                            <div className="relative opacity-0 transition-opacity group-hover:opacity-100">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setOpenDropdown(
                                                                            openDropdown === message.id
                                                                                ? null
                                                                                : message.id
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                                {openDropdown === message.id && (
                                                                    <div className="absolute left-0 top-7 z-20 min-w-[140px] rounded-lg border bg-card py-2 shadow-xl">
                                                                        {auth.user?.permissions?.includes(
                                                                            'delete-messages'
                                                                        ) && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleDeleteMessage(message.id);
                                                                                    setOpenDropdown(null);
                                                                                }}
                                                                                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-destructive transition-colors hover:bg-muted"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 text-destructive" />{' '}
                                                                                {t('Delete')}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    <div className="max-w-[70%]">
                                                        <div
                                                            className={`relative rounded-lg px-3 py-2 shadow-sm ${
                                                                isOwnMessage
                                                                    ? 'rounded-br-sm bg-foreground text-background'
                                                                    : 'rounded-bl-sm border bg-card text-foreground'
                                                            }`}
                                                            onDoubleClick={() =>
                                                                isOwnMessage && handleEditMessage(message)
                                                            }
                                                        >
                                                            {editingMessage === message.id ? (
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        value={editText}
                                                                        onChange={(e) => setEditText(e.target.value)}
                                                                        className="flex-1 border-b border-white/50 bg-transparent text-sm outline-none"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter')
                                                                                handleSaveEdit(message.id);
                                                                            if (e.key === 'Escape')
                                                                                setEditingMessage(null);
                                                                        }}
                                                                        autoFocus
                                                                    />
                                                                    {auth.user?.permissions?.includes(
                                                                        'edit-messages'
                                                                    ) && (
                                                                        <>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleSaveEdit(message.id)
                                                                                }
                                                                                className="text-xs opacity-70"
                                                                            >
                                                                                ✓
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setEditingMessage(null)}
                                                                                className="text-xs opacity-70"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {message.message && (
                                                                        <p className="text-sm leading-relaxed">
                                                                            {message.message}
                                                                        </p>
                                                                    )}
                                                                    {renderAttachment(message)}
                                                                </>
                                                            )}
                                                            <div className="mt-1 flex items-center justify-end gap-1">
                                                                <span
                                                                    className={`text-xs ${
                                                                        isOwnMessage
                                                                            ? 'text-foreground-100'
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {new Date(message.created_at).toLocaleTimeString(
                                                                        [],
                                                                        { hour: '2-digit', minute: '2-digit' }
                                                                    )}
                                                                </span>
                                                                {isOwnMessage && (
                                                                    <span
                                                                        className={`text-xs ${
                                                                            message.is_read
                                                                                ? 'text-muted-foreground'
                                                                                : 'text-foreground-200'
                                                                        }`}
                                                                    >
                                                                        {message.is_read ? (
                                                                            <CheckCheck className="h-3 w-3" />
                                                                        ) : (
                                                                            <Check className="h-3 w-3" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isOwnMessage &&
                                                        (auth.user?.permissions?.includes('edit-messages') ||
                                                            auth.user?.permissions?.includes('delete-messages')) && (
                                                            <div className="relative opacity-0 transition-opacity group-hover:opacity-100">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setOpenDropdown(
                                                                            openDropdown === message.id
                                                                                ? null
                                                                                : message.id
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                                {openDropdown === message.id && (
                                                                    <div className="absolute right-0 top-7 z-20 min-w-[140px] rounded-lg border bg-card py-2 shadow-xl">
                                                                        {isOwnMessage &&
                                                                            auth.user?.permissions?.includes(
                                                                                'edit-messages'
                                                                            ) && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleEditMessage(message);
                                                                                        setOpenDropdown(null);
                                                                                    }}
                                                                                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted/50"
                                                                                >
                                                                                    <Edit className="h-4 w-4 text-foreground" />{' '}
                                                                                    {t('Edit')}
                                                                                </button>
                                                                            )}
                                                                        {auth.user?.permissions?.includes(
                                                                            'delete-messages'
                                                                        ) && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleDeleteMessage(message.id);
                                                                                    setOpenDropdown(null);
                                                                                }}
                                                                                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-destructive transition-colors hover:bg-muted"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 text-destructive" />{' '}
                                                                                {t('Delete')}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            <p>{t('No messages yet. Start the conversation!')}</p>
                                        </div>
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            <Separator />

                            <div className="p-6">
                                <div className="relative">
                                    <EmojiPicker
                                        onEmojiSelect={handleEmojiSelect}
                                        className={`absolute bottom-full right-0 mb-2 ${showEmojiPicker ? '' : 'hidden'}`}
                                    />
                                    <form onSubmit={handleSendMessage} className="relative">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-1">
                                                <div className="relative">
                                                    {selectedFile && (
                                                        <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 rounded bg-muted px-2 py-1">
                                                            <span className="text-xs">
                                                                {getFileIcon(selectedFile.name)}
                                                            </span>
                                                            <span className="max-w-20 truncate text-xs font-medium">
                                                                {selectedFile.name}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={removeSelectedFile}
                                                                className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                                            >
                                                                <X className="h-2 w-2" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <Input
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder={
                                                            selectedFile
                                                                ? t('Add a caption...')
                                                                : t('Type a message...')
                                                        }
                                                        className={`py-3 pr-20 ${selectedFile ? 'pl-32' : ''}`}
                                                        disabled={!auth.user?.permissions?.includes('send-messages')}
                                                    />
                                                </div>
                                                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-muted-foreground"
                                                    >
                                                        <Smile className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-muted-foreground"
                                                    >
                                                        <Paperclip className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {auth.user?.permissions?.includes('send-messages') && (
                                                <Button
                                                    type="submit"
                                                    disabled={!newMessage.trim() && !selectedFile}
                                                    className="h-10 w-10 p-0"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                        disabled={!auth.user?.permissions?.includes('send-messages')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-1 items-center justify-center ${selectedUser ? 'hidden' : ''}`}>
                            <div className="text-center text-muted-foreground">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-foreground/5 p-6">
                                    <MessageCircle className="h-12 w-12 text-foreground/60" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-foreground">
                                    {t('Select a conversation')}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t('Choose a user from the list to start messaging')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={(open) => {
                    setShowDeleteDialog(open);
                    if (!open) setDeleteConfirm(null);
                }}
                onConfirm={confirmDelete}
                title={t('Delete Message')}
                message={t('Are you sure you want to delete this message? This action cannot be undone.')}
                confirmText={t('Delete')}
                variant="destructive"
            />

            <ConfirmationDialog
                open={showPinLimitDialog}
                onOpenChange={setShowPinLimitDialog}
                onConfirm={() => setShowPinLimitDialog(false)}
                title={t('Pin Limit Reached')}
                message={t('You can only pin up to 3 chats. Please unpin a chat first to pin this one.')}
                confirmText={t('OK')}
            />
        </AuthenticatedLayout>
    );
}
