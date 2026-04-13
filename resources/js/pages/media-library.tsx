import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import {
    Upload,
    Search,
    X,
    Plus,
    Info,
    Copy,
    Download,
    MoreHorizontal,
    Image as ImageIcon,
    Calendar,
    HardDrive,
    BarChart3,
    Edit,
    Trash2,
    Folder,
    FolderOpen,
    Home,
    ArrowLeft,
} from 'lucide-react';

interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    url: string;
    thumb_url: string;
    size: number;
    mime_type: string;
    created_at: string;
}

export default function MediaLibraryDemo() {
    const { t } = useTranslation();
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [directories, setDirectories] = useState<any[]>([]);
    const [currentDirectory, setCurrentDirectory] = useState<number | null>(null);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showCreateDirectory, setShowCreateDirectory] = useState(false);
    const [newDirectoryName, setNewDirectoryName] = useState('');
    const [editingDirectory, setEditingDirectory] = useState<number | null>(null);
    const [editDirectoryName, setEditDirectoryName] = useState('');

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedMediaInfo, setSelectedMediaInfo] = useState<MediaItem | null>(null);
    const itemsPerPage = 12;

    const fetchMedia = useCallback(
        async (showLoader = true) => {
            if (showLoader) setLoading(true);
            try {
                const params = new URLSearchParams();
                if (currentDirectory) {
                    params.append('directory_id', currentDirectory.toString());
                }

                const response = await fetch(`${route('media.index')}?${params}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const mediaArray = Array.isArray(data.media) ? data.media : Array.isArray(data) ? data : [];
                setMedia(mediaArray);
                setDirectories(data.directories || []);
                setFilteredMedia(mediaArray);
            } catch (error) {
                console.error('Failed to load media:', error);
                toast.error('Failed to load media');
            } finally {
                if (showLoader) setLoading(false);
            }
        },
        [currentDirectory]
    );

    useEffect(() => {
        const shouldShowLoader = media.length === 0;
        fetchMedia(shouldShowLoader);
    }, [fetchMedia]);

    const createDirectory = async () => {
        if (!newDirectoryName.trim()) return;

        try {
            const response = await fetch(route('media.directories.create'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ name: newDirectoryName }),
            });

            if (response.ok) {
                toast.success('Directory created successfully');
                setNewDirectoryName('');
                setShowCreateDirectory(false);
                fetchMedia(false);
            }
        } catch (error) {
            toast.error('Failed to create directory');
        }
    };

    const updateDirectory = async () => {
        if (!editDirectoryName.trim() || !editingDirectory) return;

        try {
            const response = await fetch(route('media.directories.update', editingDirectory), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ name: editDirectoryName }),
            });

            if (response.ok) {
                toast.success('Directory updated successfully');
                setEditDirectoryName('');
                setEditingDirectory(null);
                fetchMedia(false);
            }
        } catch (error) {
            toast.error('Failed to update directory');
        }
    };

    const deleteDirectory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this directory?')) return;

        try {
            const response = await fetch(route('media.directories.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                toast.success('Directory deleted successfully');
                if (currentDirectory === id) {
                    setCurrentDirectory(null);
                }
                fetchMedia(false);
            }
        } catch (error) {
            toast.error('Failed to delete directory');
        }
    };

    useEffect(() => {
        const mediaArray = Array.isArray(media) ? media : [];
        const filtered = mediaArray.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMedia(filtered);
        setCurrentPage(1);
    }, [searchTerm, media]);

    const handleFileUpload = async (files: FileList) => {
        setUploading(true);

        const validFiles = Array.from(files);

        if (validFiles.length === 0) {
            setUploading(false);
            return;
        }

        const formData = new FormData();
        validFiles.forEach((file) => {
            formData.append('files[]', file);
        });
        if (currentDirectory) {
            formData.append('directory_id', currentDirectory.toString());
        }

        try {
            const response = await fetch(route('media.batch'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (response.ok) {
                fetchMedia(false); // Refresh without loader
                toast.success(result.message);

                // Show individual errors if any
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((error: string) => {
                        toast.error(error);
                    });
                }
            } else {
                // Show individual errors if available, otherwise show main message
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((error: string) => {
                        toast.error(error);
                    });
                } else {
                    toast.error(result.message || 'Failed to upload files');
                }
            }
        } catch (error) {
            toast.error('Error uploading files');
        }

        setUploading(false);
        setIsUploadModalOpen(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const deleteMedia = async (id: number) => {
        try {
            const response = await fetch(route('media.destroy', id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                setMedia((prev) => prev.filter((item) => item.id !== id));
                toast.success('Media deleted successfully');
            } else {
                toast.error('Failed to delete media');
            }
        } catch (error) {
            toast.error('Error deleting media');
        }
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('File URL copied to clipboard');
    };

    const handleDownload = (id: number, filename: string) => {
        const link = document.createElement('a');
        link.href = route('media.download', id);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
    };

    const handleShowInfo = (item: MediaItem) => {
        setSelectedMediaInfo(item);
        setInfoModalOpen(true);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
        if (mimeType.includes('pdf'))
            return (
                <div className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-xs font-bold text-background">
                    PDF
                </div>
            );
        if (mimeType.includes('word') || mimeType.includes('document'))
            return (
                <div className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-xs font-bold text-background">
                    DOC
                </div>
            );
        if (mimeType.includes('csv') || mimeType.includes('spreadsheet'))
            return (
                <div className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-xs font-bold text-background">
                    CSV
                </div>
            );
        if (mimeType.startsWith('video/'))
            return (
                <div className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-xs font-bold text-background">
                    VID
                </div>
            );
        if (mimeType.startsWith('audio/'))
            return (
                <div className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-xs font-bold text-background">
                    AUD
                </div>
            );
        return (
            <div className="bg-muted/500 flex h-4 w-4 items-center justify-center rounded text-xs font-bold text-background">
                FILE
            </div>
        );
    };

    const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

    const allFilesFolder = useMemo(
        () => (
            <div
                key="all-files-folder"
                className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                onClick={() => {
                    setCurrentDirectory(null);
                    setShowAllFiles(true);
                }}
            >
                {/* Directory Preview Container */}
                <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 text-foreground">
                            <Folder className="h-12 w-12" />
                        </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-foreground/0 transition-all duration-200 group-hover:bg-foreground/5" />

                    {/* Directory Type Badge */}
                    <div className="absolute start-2 top-2">
                        <Badge variant="secondary" className="bg-foreground/10 text-xs text-foreground">
                            FOLDER
                        </Badge>
                    </div>
                </div>

                {/* Directory Content */}
                <div className="space-y-2 p-3">
                    <div>
                        <h3 className="flex items-center gap-2 truncate text-sm font-medium" title="All Files">
                            <FolderOpen className="h-4 w-4 text-foreground" />
                            All Files
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">View all files</p>
                    </div>
                </div>
            </div>
        ),
        []
    );

    const breadcrumbs = [{ label: t('Media Library') }];

    return (
        <AuthenticatedLayout
            breadcrumbs={breadcrumbs}
            pageTitle={t('Manage Media Library')}
            pageActions={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDirectory(true)}>
                        <Plus className="me-2 h-4 w-4" />
                        {t('New Folder')}
                    </Button>
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                        <Plus className="me-2 h-4 w-4" />
                        {t('Upload Files')}
                    </Button>
                </div>
            }
        >
            <Head title={t('Media Library')} />
            <div className="space-y-6">
                {/* Breadcrumb Navigation */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setCurrentDirectory(null);
                                        setShowAllFiles(false);
                                    }}
                                    className="flex h-8 items-center gap-2 px-2 hover:bg-muted hover:text-foreground"
                                >
                                    <Home className="h-4 w-4" />
                                    {t('Media Library')}
                                </Button>
                                {currentDirectory && (
                                    <>
                                        <span className="mx-2">/</span>
                                        <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1">
                                            <Folder className="h-4 w-4 text-foreground" />
                                            <span className="font-medium text-foreground">
                                                {directories.find((d) => d.id === currentDirectory)?.name ||
                                                    'Directory'}
                                            </span>
                                        </div>
                                    </>
                                )}
                                {showAllFiles && (
                                    <>
                                        <span className="mx-2">/</span>
                                        <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1">
                                            <Folder className="h-4 w-4 text-foreground" />
                                            <span className="font-medium text-foreground">All Files</span>
                                        </div>
                                    </>
                                )}
                            </nav>

                            {(currentDirectory !== null || showAllFiles) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setCurrentDirectory(null);
                                        setShowAllFiles(false);
                                    }}
                                    className="flex h-8 items-center gap-2 px-3"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {t('Back')}
                                </Button>
                            )}
                        </div>

                        {showCreateDirectory && (
                            <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Directory name..."
                                        value={newDirectoryName}
                                        onChange={(e) => setNewDirectoryName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && createDirectory()}
                                    />
                                    <Button onClick={createDirectory} size="sm">
                                        Create
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setShowCreateDirectory(false);
                                            setNewDirectoryName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {editingDirectory && (
                            <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Directory name..."
                                        value={editDirectoryName}
                                        onChange={(e) => setEditDirectoryName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && updateDirectory()}
                                    />
                                    <Button onClick={updateDirectory} size="sm">
                                        Update
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingDirectory(null);
                                            setEditDirectoryName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Search and Stats Bar */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row">
                            {/* Search Section */}
                            <div className="flex-1">
                                <div className="relative max-w-sm">
                                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder={t('Search media files...')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="ps-10"
                                    />
                                </div>
                                {searchTerm && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {t('Showing results for "{{term}}"', { term: searchTerm })}
                                    </p>
                                )}
                            </div>

                            {/* Stats Section */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-md bg-foreground/10 p-1.5">
                                        <ImageIcon className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {filteredMedia.length} {t('Files')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="rounded-md bg-muted p-1.5">
                                        <HardDrive className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {formatFileSize(
                                            useMemo(
                                                () => filteredMedia.reduce((acc, item) => acc + item.size, 0),
                                                [filteredMedia]
                                            )
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="rounded-md bg-foreground/10 p-1.5">
                                        <ImageIcon className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {filteredMedia.filter((item) => item.mime_type.startsWith('image/')).length}{' '}
                                        {t('Images')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Grid */}
                <Card>
                    <CardContent className="p-6">
                        {loading ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
                                <p className="text-muted-foreground">{t('Loading media...')}</p>
                            </div>
                        ) : (currentMedia.length === 0 && directories.length === 0) ||
                          (currentDirectory === null && !showAllFiles && currentMedia.length === 0) ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">{t('No media files found')}</h3>
                                <p className="mb-6 text-muted-foreground">
                                    {searchTerm
                                        ? t('No results found for "{{term}}"', { term: searchTerm })
                                        : t('Get started by uploading your first file')}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => setIsUploadModalOpen(true)} size="lg">
                                        <Plus className="me-2 h-4 w-4" />
                                        {t('Upload Files')}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                                    {/* All Files Folder - Only show when not in a specific directory and not showing all files */}
                                    {currentDirectory === null && !showAllFiles && allFilesFolder}

                                    {/* Directory Cards - Only show when not in a specific directory and not showing all files */}
                                    {currentDirectory === null &&
                                        !showAllFiles &&
                                        directories.map((directory: any) => (
                                            <div
                                                key={`dir-${directory.id}`}
                                                className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                                                onClick={() => {
                                                    setMedia([]);
                                                    setFilteredMedia([]);
                                                    setCurrentDirectory(directory.id);
                                                    setShowAllFiles(false);
                                                }}
                                            >
                                                {/* Directory Preview Container */}
                                                <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                                                    <div className="flex flex-col items-center justify-center p-4">
                                                        <div className="mb-2 text-foreground">
                                                            <Folder className="h-12 w-12" />
                                                        </div>
                                                    </div>

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-foreground/0 transition-all duration-200 group-hover:bg-foreground/5" />

                                                    {/* Directory Actions */}
                                                    <div className="absolute end-2 top-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="h-8 w-8 bg-background/95 p-0 opacity-0 shadow-md transition-opacity hover:bg-background group-hover:opacity-100"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingDirectory(directory.id);
                                                                        setEditDirectoryName(directory.name);
                                                                    }}
                                                                >
                                                                    <Edit className="me-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteDirectory(directory.id);
                                                                    }}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="me-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    {/* Directory Type Badge */}
                                                    <div className="absolute start-2 top-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-foreground/10 text-xs text-foreground"
                                                        >
                                                            FOLDER
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Directory Content */}
                                                <div className="space-y-2 p-3">
                                                    <div>
                                                        <h3
                                                            className="flex items-center gap-2 truncate text-sm font-medium"
                                                            title={directory.name}
                                                        >
                                                            <FolderOpen className="h-4 w-4 text-foreground" />
                                                            {directory.name}
                                                        </h3>
                                                        <p className="mt-1 text-xs text-muted-foreground">Directory</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Media Files - Only show when in a directory or showing all files */}
                                    {(currentDirectory !== null || showAllFiles) &&
                                        currentMedia.map((item) => (
                                            <div
                                                key={item.id}
                                                className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                                            >
                                                {/* File Preview Container */}
                                                <div className="relative flex aspect-square items-center justify-center bg-muted">
                                                    {item.mime_type.startsWith('image/') ? (
                                                        <img
                                                            src={item.thumb_url}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = item.url;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center p-4">
                                                            <div className="mb-2 text-2xl">
                                                                {getFileIcon(item.mime_type)}
                                                            </div>
                                                            <div className="w-full truncate text-center text-xs font-medium text-muted-foreground">
                                                                {item.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Overlay with Actions */}
                                                    <div className="absolute inset-0 bg-foreground/0 transition-all duration-200 group-hover:bg-foreground/10" />

                                                    {/* Action Dropdown */}
                                                    {!infoModalOpen && !isUploadModalOpen && (
                                                        <div className="absolute end-2 top-2">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        className="h-8 w-8 bg-background/95 p-0 opacity-0 shadow-md transition-opacity hover:bg-background group-hover:opacity-100"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-40">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleShowInfo(item)}
                                                                    >
                                                                        <Info className="me-2 h-4 w-4" />
                                                                        {t('View Info')}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleCopyLink(item.url)}
                                                                    >
                                                                        <Copy className="me-2 h-4 w-4" />
                                                                        {t('Copy Link')}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDownload(item.id, item.file_name)
                                                                        }
                                                                    >
                                                                        <Download className="me-2 h-4 w-4" />
                                                                        {t('Download')}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => deleteMedia(item.id)}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <X className="me-2 h-4 w-4" />
                                                                        {t('Delete')}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    )}

                                                    {/* File Type Badge */}
                                                    <div className="absolute start-2 top-2">
                                                        <Badge variant="secondary" className="bg-background/95 text-xs">
                                                            {item.mime_type.split('/')[1].toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="space-y-2 p-3">
                                                    <div>
                                                        <h3 className="truncate text-sm font-medium" title={item.name}>
                                                            {item.name}
                                                        </h3>
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                            <HardDrive className="h-3 w-3" />
                                                            {formatFileSize(item.size)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                                        <div className="text-sm text-muted-foreground">
                                            {t('Showing')} <span className="font-semibold">{startIndex + 1}</span>{' '}
                                            {t('to')}{' '}
                                            <span className="font-semibold">
                                                {Math.min(startIndex + itemsPerPage, filteredMedia.length)}
                                            </span>{' '}
                                            {t('of')} <span className="font-semibold">{filteredMedia.length}</span>{' '}
                                            {t('files')}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            >
                                                {t('Previous')}
                                            </Button>

                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                    let page;
                                                    if (totalPages <= 5) {
                                                        page = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        page = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        page = totalPages - 4 + i;
                                                    } else {
                                                        page = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <Button
                                                            key={page}
                                                            variant={currentPage === page ? 'default' : 'outline'}
                                                            size="sm"
                                                            className="h-8 w-10"
                                                            onClick={() => setCurrentPage(page)}
                                                        >
                                                            {page}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            >
                                                {t('Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Upload Modal */}
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogContent className="max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                {t('Upload Files')}
                            </DialogTitle>
                            <DialogDescription>{t('Upload new files to your media library')}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div
                                className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                                    dragActive
                                        ? 'scale-[1.02] border-foreground bg-foreground/10'
                                        : 'border-border hover:border-border hover:bg-muted/50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className={`transition-all duration-200 ${dragActive ? 'scale-110' : ''}`}>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                        <Upload
                                            className={`h-8 w-8 transition-colors ${
                                                dragActive ? 'text-foreground' : 'text-muted-foreground'
                                            }`}
                                        />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium">
                                        {dragActive ? t('Drop files here') : t('Upload your files')}
                                    </h3>
                                    <p className="mb-6 text-sm text-muted-foreground">
                                        {t('Drag and drop your files here, or click to browse')}
                                    </p>

                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                        className="hidden"
                                        id="file-upload-modal"
                                    />

                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload-modal')?.click()}
                                        disabled={uploading}
                                        size="lg"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="me-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                {t('Uploading...')}
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="me-2 h-4 w-4" />
                                                {t('Choose Files')}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {dragActive && <div className="absolute inset-0 rounded-xl bg-foreground/10" />}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Info Modal */}
                <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
                    <DialogContent className="max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                {t('File Information')}
                            </DialogTitle>
                            <DialogDescription>{t('View detailed information about this file')}</DialogDescription>
                        </DialogHeader>

                        {selectedMediaInfo && (
                            <div className="space-y-6">
                                {/* File Preview */}
                                <div className="flex justify-center rounded-lg bg-muted/50 p-4">
                                    {selectedMediaInfo.mime_type.startsWith('image/') ? (
                                        <img
                                            src={selectedMediaInfo.thumb_url}
                                            alt={selectedMediaInfo.name}
                                            className="h-48 max-w-full rounded-md object-contain shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.src = selectedMediaInfo.url;
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-48 w-full flex-col items-center justify-center">
                                            <div className="mb-4 text-6xl">
                                                {getFileIcon(selectedMediaInfo.mime_type)}
                                            </div>
                                            <div className="text-sm font-medium text-muted-foreground">
                                                {selectedMediaInfo.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* File Details */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {t('File Name')}
                                            </span>
                                            <span
                                                className="max-w-xs truncate text-end text-sm"
                                                title={selectedMediaInfo.file_name}
                                            >
                                                {selectedMediaInfo.file_name}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {t('File Type')}
                                            </span>
                                            <Badge variant="secondary">{selectedMediaInfo.mime_type}</Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {t('File Size')}
                                            </span>
                                            <span className="text-sm">{formatFileSize(selectedMediaInfo.size)}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {t('Uploaded')}
                                            </span>
                                            <span className="text-sm">{formatDate(selectedMediaInfo.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-2">
                                        <span className="mb-2 block text-sm font-medium text-muted-foreground">
                                            {t('URL')}
                                        </span>
                                        <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                                            <code className="flex-1 truncate text-xs text-muted-foreground">
                                                {selectedMediaInfo.url}
                                            </code>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleCopyLink(selectedMediaInfo.url)}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleCopyLink(selectedMediaInfo.url)}
                                        className="flex-1"
                                    >
                                        <Copy className="me-2 h-4 w-4" />
                                        {t('Copy Link')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleDownload(selectedMediaInfo.id, selectedMediaInfo.file_name)
                                        }
                                        className="flex-1"
                                    >
                                        <Download className="me-2 h-4 w-4" />
                                        {t('Download')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
