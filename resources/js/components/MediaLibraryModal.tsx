import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Search, Plus, Check } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

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

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string | string[]) => void;
    multiple?: boolean;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect, multiple = false }: MediaLibraryModalProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const permissions = auth?.permissions || [];
    const canCreateMedia = permissions.includes('create-media') || permissions.includes('manage-media');
    const canManageMedia = permissions.includes('manage-media');

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [directories, setDirectories] = useState<any[]>([]);
    const [currentDirectory, setCurrentDirectory] = useState<number | null>(null);
    const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateDirectory, setShowCreateDirectory] = useState(false);
    const [newDirectoryName, setNewDirectoryName] = useState('');
    const itemsPerPage = 18;

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (currentDirectory) {
                params.append('directory_id', currentDirectory.toString());
            }

            const response = await fetch(`${route('media.index')}?${params}`, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
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
            toast.error(t('Loading media...'));
        } finally {
            setLoading(false);
        }
    }, [currentDirectory]);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSearchTerm('');
        }
    }, [isOpen, fetchMedia]);

    // Filter media based on search term
    useEffect(() => {
        const mediaArray = Array.isArray(media) ? media : [];
        if (!searchTerm.trim()) {
            setFilteredMedia(mediaArray);
        } else {
            const filtered = mediaArray.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMedia(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, media]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (response.ok) {
                fetchMedia(); // Refresh to show files in current directory

                // Show appropriate success/warning messages
                if (result.errors && result.errors.length > 0) {
                    toast.warning(
                        result.message || `${result.data?.length || 0} uploaded, ${result.errors.length} failed`
                    );
                    result.errors.forEach((error: string) => {
                        toast.error(error, { duration: 5000 });
                    });
                } else {
                    toast.success(
                        result.message || t(' file(s) uploaded successfully', { count: result.data?.length || 0 })
                    );
                }
            } else {
                toast.error(result.message || t('Upload failed'));
                if (result.errors) {
                    result.errors.forEach((error: string) => {
                        toast.error(error, { duration: 5000 });
                    });
                }
            }
        } catch (error) {
            toast.error(t('Upload failed'));
        }

        setUploading(false);
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

    const handleSelect = (url: string) => {
        if (multiple) {
            setSelectedItems((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
        } else {
            onSelect(url);
            onClose();
        }
    };

    const handleConfirmSelection = () => {
        if (multiple && selectedItems.length > 0) {
            onSelect(selectedItems);
            onClose();
        }
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
        if (mimeType.includes('pdf'))
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                    PDF
                </div>
            );
        if (mimeType.includes('word') || mimeType.includes('document'))
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                    DOC
                </div>
            );
        if (mimeType.includes('csv') || mimeType.includes('spreadsheet'))
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                    CSV
                </div>
            );
        if (mimeType.startsWith('video/'))
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                    VID
                </div>
            );
        if (mimeType.startsWith('audio/'))
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                    AUD
                </div>
            );
        return (
            <div className="bg-muted/500 flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-background">
                FILE
            </div>
        );
    };

    const createDirectory = async () => {
        if (!newDirectoryName.trim()) return;

        try {
            const response = await fetch(route('media.directories.create'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ name: newDirectoryName }),
            });

            if (response.ok) {
                toast.success(t('Directory created successfully'));
                setNewDirectoryName('');
                setShowCreateDirectory(false);
                fetchMedia();
            }
        } catch (error) {
            toast.error('Failed to create directory');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-[90vh] max-w-6xl flex-col">
                <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        {t('Media Library')}
                        {filteredMedia.length > 0 && (
                            <Badge variant="secondary" className="ms-2">
                                {filteredMedia.length}
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>{t('Upload new files to your media library')}</DialogDescription>
                </DialogHeader>

                <div className="flex min-h-0 flex-1 flex-col space-y-4">
                    {/* Directory Navigation */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={currentDirectory === null ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentDirectory(null)}
                        >
                            {t('Files')}
                        </Button>
                        {directories.map((dir: any) => (
                            <Button
                                key={dir.id}
                                variant={currentDirectory === dir.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentDirectory(dir.id)}
                            >
                                {dir.name}
                            </Button>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => setShowCreateDirectory(true)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Create Directory Modal */}
                    {showCreateDirectory && (
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('Enter directory name...')}
                                    value={newDirectoryName}
                                    onChange={(e) => setNewDirectoryName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && createDirectory()}
                                />
                                <Button onClick={createDirectory} size="sm">
                                    {t('Create')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setShowCreateDirectory(false);
                                        setNewDirectoryName('');
                                    }}
                                >
                                    {t('Cancel')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Header with Search and Upload */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder={t('Search media files...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="ps-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                className="hidden"
                                id="file-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={uploading}
                                size="sm"
                            >
                                <Plus className="me-2 h-4 w-4" />
                                {uploading ? t('Uploading...') : t('Upload Files')}
                            </Button>
                        </div>
                    </div>

                    {/* Stats and Selection Info */}
                    <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                        <span>
                            {t('files', { count: filteredMedia.length })} • {t('Page')} {currentPage} {t('of')}{' '}
                            {totalPages || 1}
                        </span>
                        {multiple && selectedItems.length > 0 && (
                            <Badge variant="default" className="text-xs">
                                {t('selected', { count: selectedItems.length })}
                            </Badge>
                        )}
                    </div>

                    {/* Media Grid */}
                    <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-muted/10">
                        {loading ? (
                            <div className="flex flex-1 items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
                                    <p className="text-muted-foreground">{t('Loading media...')}</p>
                                </div>
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center py-16">
                                <div className="max-w-sm text-center">
                                    <div
                                        className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                                            dragActive
                                                ? 'border-foreground bg-foreground/5'
                                                : 'border-muted-foreground/25'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="h-10 w-10 text-muted-foreground" />
                                    </div>

                                    <div className="mb-6 space-y-3">
                                        <h3 className="text-lg font-semibold">{t('No media files found')}</h3>
                                        {searchTerm && (
                                            <p className="text-sm text-muted-foreground">
                                                {t('No results found for ')}{' '}
                                                <span className="font-medium text-foreground">"{searchTerm}"</span>
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {searchTerm
                                                ? t('Try a different search term or upload new files')
                                                : t('Get started by uploading your first file')}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        disabled={uploading}
                                    >
                                        <Plus className="me-2 h-4 w-4" />
                                        {t('Upload Files')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="grid grid-cols-5 gap-3">
                                        {currentMedia.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`group relative cursor-pointer overflow-hidden rounded-lg transition-all hover:scale-105 ${
                                                    selectedItems.includes(item.url)
                                                        ? 'shadow-lg ring-2 ring-foreground'
                                                        : 'border border-border hover:border-foreground/50 hover:shadow-md'
                                                }`}
                                                onClick={() => handleSelect(item.url)}
                                            >
                                                <div className="relative aspect-square bg-muted">
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
                                                        <div className="flex h-full w-full flex-col items-center justify-center p-4">
                                                            <div className="mb-2">{getFileIcon(item.mime_type)}</div>
                                                            <div className="w-full truncate text-center text-xs font-medium text-muted-foreground">
                                                                {item.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Selection Indicator */}
                                                    {selectedItems.includes(item.url) && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                                                            <div className="rounded-full bg-foreground p-1.5 text-background">
                                                                <Check className="h-4 w-4" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* File Name Tooltip */}
                                                    <div className="absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <p
                                                            className="truncate text-xs text-background"
                                                            title={item.name}
                                                        >
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {totalPages > 1 && (
                        <div className="flex flex-shrink-0 items-center justify-between border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                {t('Showing')} {startIndex + 1} {t('to')}{' '}
                                {Math.min(startIndex + itemsPerPage, filteredMedia.length)} {t('of')}{' '}
                                {filteredMedia.length} {t('files')}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                >
                                    {t('Previous')}
                                </Button>
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
                                            className="h-8 w-8 p-0"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
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

                    {/* Multiple Selection Footer */}
                    {multiple && selectedItems.length > 0 && (
                        <div className="flex flex-shrink-0 items-center justify-between border-t pt-4">
                            <span className="text-sm text-muted-foreground">
                                {selectedItems.length} {t('files selected')}
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setSelectedItems([])}>
                                    {t('Clear Selection')}
                                </Button>
                                <Button onClick={handleConfirmSelection}>{t('Select Files')}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
