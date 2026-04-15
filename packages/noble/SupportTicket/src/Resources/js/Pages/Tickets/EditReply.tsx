import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import MediaPicker from '@/components/MediaPicker';
import {
    Edit,
    Send,
    Download,
    Paperclip,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    Tag,
    AlertCircle,
    MessageSquare,
    StickyNote,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Attachment {
    name: string;
    path: string;
}

interface Conversion {
    id: number;
    description: string;
    sender: string;
    created_at: string;
    attachments: Attachment[];
    replyBy: { name: string };
}

interface Category {
    id: number;
    name: string;
    color: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface TicketData {
    id: number;
    ticket_id: string;
    name: string;
    email: string;
    user_id?: number;
    account_type: string;
    category: number;
    subject: string;
    status: string;
    description: string;
    note?: string;
    attachments: Attachment[];
    fields?: Record<string, any>;
    category_info?: Category;
    conversions: Conversion[];
    created_at: string;
    updated_at: string;
}

interface Field {
    id: number;
    name: string;
    type: string;
    placeholder: string;
    width: string;
    is_required: boolean;
    custom_id: string;
}

interface EditReplyProps {
    [key: string]: any;
    ticket: TicketData;
    categories: Category[];
    staff: User[];
    clients: User[];
    vendors: User[];
    allFields: Field[];
    customFields: Field[];
}

export default function EditReply({
    ticket,
    categories,
    staff,
    clients,
    vendors,
    allFields,
    customFields,
}: EditReplyProps) {
    const { t } = useTranslation();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [conversations, setConversations] = useState<Conversion[]>(ticket.conversions || []);

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        name: ticket.name,
        email: ticket.email,
        user_id: ticket.user_id ? ticket.user_id.toString() : '',
        account_type: ticket.account_type,
        category: ticket.category?.toString() || '',
        subject: ticket.subject,
        status: ticket.status,
        description: ticket.description,
        fields: ticket.fields || ({} as Record<string, any>),
    });

    const {
        data: replyData,
        setData: setReplyData,
        post,
        processing: replyProcessing,
        errors: replyErrors,
        reset,
    } = useForm({
        description: '',
        attachments: [] as string[],
    });

    const {
        data: noteData,
        setData: setNoteData,
        post: postNote,
        processing: noteProcessing,
        errors: noteErrors,
    } = useForm({
        note: ticket.note || '',
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('support-tickets.update', ticket.id), {
            onSuccess: () => {
                setIsEditOpen(false);
            },
        });
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('support-ticket.admin-send-conversion.store', ticket.id), {
            onSuccess: () => {
                // Add new conversation to state immediately
                const newConversation = {
                    id: Date.now(),
                    description: replyData.description,
                    sender: 'admin',
                    created_at: new Date().toISOString(),
                    attachments: replyData.attachments?.map((path) => {
                        const fileName = path.split('/').pop() || 'file';
                        const media = path.includes('media/') ? fileName : fileName;
                        return {
                            name: fileName.replace(/^\d+_/, ''), // Remove timestamp prefix
                            path: media,
                        };
                    }),
                    replyBy: { name: 'Admin' },
                };
                setConversations((prev) => [...prev, newConversation]);
                reset();
            },
        });
    };

    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postNote(route('support-ticket.note.store', ticket.id));
    };

    const handleAccountTypeChange = (value: string) => {
        setEditData('account_type', value);
        setEditData('user_id', '');
    };

    const handleUserChange = (value: string) => {
        setEditData('user_id', value);

        // Find user and update name/email
        let user = null;
        if (editData.account_type === 'staff') {
            user = staff.find((u) => u.id.toString() === value);
        } else if (editData.account_type === 'client') {
            user = clients.find((u) => u.id.toString() === value);
        } else if (editData.account_type === 'vendor') {
            user = vendors.find((u) => u.id.toString() === value);
        }

        if (user) {
            setEditData('name', user.name);
            setEditData('email', user.email);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            open: 'bg-muted text-foreground',
            Open: 'bg-muted text-foreground',
            'In Progress': 'bg-muted text-foreground',
            closed: 'bg-muted text-destructive',
            Closed: 'bg-muted text-destructive',
            'On Hold': 'bg-muted text-foreground',
        };
        return colors[status as keyof typeof colors] || 'bg-muted text-foreground';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Support Tickets'), url: route('support-tickets.index') },
                { label: t('Edit & Reply') },
            ]}
            pageTitle={`${t('Ticket')} - ${ticket.ticket_id}`}
        >
            <Head title={`${t('Edit Ticket')} - ${ticket.ticket_id}`} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Ticket Header */}
                    <Card className="border-s-4 border-s-blue-500">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            #{ticket.ticket_id}
                                        </Badge>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">{ticket.subject}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            {ticket.name}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(ticket.created_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag className="h-4 w-4" />
                                            {ticket.category_info?.name || 'No Category'}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditOpen(!isEditOpen)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    {t('Edit')}
                                    {isEditOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Edit Form */}
                    {isEditOpen && (
                        <Card className="bg-muted/50/30 border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <Edit className="h-5 w-5" />
                                    {t('Edit Ticket Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>{t('Account Type')}</Label>
                                            <div className="mt-2 flex gap-4">
                                                {['custom', 'staff', 'client', 'vendor']?.map((type) => (
                                                    <label key={type} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="account_type"
                                                            value={type}
                                                            checked={editData.account_type === type}
                                                            onChange={(e) => handleAccountTypeChange(e.target.value)}
                                                        />
                                                        {t(type.charAt(0).toUpperCase() + type.slice(1))}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* All Fields ordered by 'order' field */}
                                    <div className="grid grid-cols-12 gap-4">
                                        {allFields && allFields.length > 0
                                            ? allFields
                                                  .sort((a, b) => a.order - b.order)
                                                  ?.map((field) => {
                                                      if (field.custom_id == 1) {
                                                          // Name field
                                                          return editData.account_type === 'custom' ? (
                                                              <div key={field.id} className="col-span-6">
                                                                  <Label htmlFor="name" required={field.is_required}>
                                                                      {t(field.name)}
                                                                  </Label>
                                                                  <Input
                                                                      id="name"
                                                                      value={editData.name}
                                                                      onChange={(e) =>
                                                                          setEditData('name', e.target.value)
                                                                      }
                                                                      error={editErrors.name}
                                                                  />
                                                              </div>
                                                          ) : (
                                                              <div key={field.id} className="col-span-6">
                                                                  <Label required>{t('Select User')}</Label>
                                                                  <Select
                                                                      value={editData.user_id}
                                                                      onValueChange={handleUserChange}
                                                                  >
                                                                      <SelectTrigger>
                                                                          <SelectValue
                                                                              placeholder={`Select ${editData.account_type}`}
                                                                          />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                          {(editData.account_type === 'staff'
                                                                              ? staff
                                                                              : editData.account_type === 'client'
                                                                                ? clients
                                                                                : vendors
                                                                          )?.map((user) => (
                                                                              <SelectItem
                                                                                  key={user.id}
                                                                                  value={user.id.toString()}
                                                                              >
                                                                                  {user.name}
                                                                              </SelectItem>
                                                                          ))}
                                                                      </SelectContent>
                                                                  </Select>
                                                              </div>
                                                          );
                                                      }

                                                      if (field.custom_id == 2) {
                                                          // Email field
                                                          return (
                                                              <div key={field.id} className="col-span-6">
                                                                  <Label htmlFor="email" required={field.is_required}>
                                                                      {t(field.name)}
                                                                  </Label>
                                                                  <Input
                                                                      id="email"
                                                                      type="email"
                                                                      value={editData.email}
                                                                      onChange={(e) =>
                                                                          setEditData('email', e.target.value)
                                                                      }
                                                                      error={editErrors.email}
                                                                  />
                                                              </div>
                                                          );
                                                      }

                                                      if (field.custom_id == 3) {
                                                          // Category field
                                                          return (
                                                              <div key={field.id} className="col-span-6">
                                                                  <Label required={field.is_required}>
                                                                      {t(field.name)}
                                                                  </Label>
                                                                  <Select
                                                                      value={editData.category}
                                                                      onValueChange={(value) =>
                                                                          setEditData('category', value)
                                                                      }
                                                                  >
                                                                      <SelectTrigger>
                                                                          <SelectValue
                                                                              placeholder={t(field.placeholder)}
                                                                          />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                          {categories?.map((category) => (
                                                                              <SelectItem
                                                                                  key={category.id}
                                                                                  value={category.id.toString()}
                                                                              >
                                                                                  {category.name}
                                                                              </SelectItem>
                                                                          ))}
                                                                      </SelectContent>
                                                                  </Select>
                                                              </div>
                                                          );
                                                      }

                                                      if (field.custom_id == 4) {
                                                          // Subject field
                                                          return (
                                                              <>
                                                                  <div key={field.id} className="col-span-6">
                                                                      <Label
                                                                          htmlFor="subject"
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <Input
                                                                          id="subject"
                                                                          value={editData.subject}
                                                                          onChange={(e) =>
                                                                              setEditData('subject', e.target.value)
                                                                          }
                                                                          error={editErrors.subject}
                                                                      />
                                                                  </div>
                                                                  {/* Status field - show after subject */}
                                                                  <div className="col-span-6">
                                                                      <Label required>{t('Status')}</Label>
                                                                      <Select
                                                                          value={editData.status}
                                                                          onValueChange={(value) =>
                                                                              setEditData('status', value)
                                                                          }
                                                                      >
                                                                          <SelectTrigger>
                                                                              <SelectValue />
                                                                          </SelectTrigger>
                                                                          <SelectContent>
                                                                              <SelectItem value="open">
                                                                                  {t('Open')}
                                                                              </SelectItem>
                                                                              <SelectItem value="In Progress">
                                                                                  {t('In Progress')}
                                                                              </SelectItem>
                                                                              <SelectItem value="On Hold">
                                                                                  {t('On Hold')}
                                                                              </SelectItem>
                                                                              <SelectItem value="Closed">
                                                                                  {t('Closed')}
                                                                              </SelectItem>
                                                                          </SelectContent>
                                                                      </Select>
                                                                  </div>
                                                              </>
                                                          );
                                                      }

                                                      if (field.custom_id == 5) {
                                                          // Description field
                                                          return (
                                                              <div key={field.id} className="col-span-12">
                                                                  <Label
                                                                      htmlFor="description"
                                                                      required={field.is_required}
                                                                  >
                                                                      {t(field.name)}
                                                                  </Label>
                                                                  <RichTextEditor
                                                                      content={editData.description}
                                                                      onChange={(value) =>
                                                                          setEditData('description', value)
                                                                      }
                                                                  />
                                                              </div>
                                                          );
                                                      }

                                                      // Handle custom fields (custom_id > 6)
                                                      if (field.custom_id > 6) {
                                                          if (field.type === 'text') {
                                                              return (
                                                                  <div key={field.id} className="col-span-6">
                                                                      <Label
                                                                          htmlFor={`field-${field.id}`}
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <Input
                                                                          id={`field-${field.id}`}
                                                                          value={editData.fields[field.id] || ''}
                                                                          onChange={(e) =>
                                                                              setEditData('fields', {
                                                                                  ...editData.fields,
                                                                                  [field.id]: e.target.value,
                                                                              })
                                                                          }
                                                                          placeholder={t(field.placeholder)}
                                                                          required={field.is_required}
                                                                      />
                                                                  </div>
                                                              );
                                                          }

                                                          if (field.type === 'email') {
                                                              return (
                                                                  <div key={field.id} className="col-span-6">
                                                                      <Label
                                                                          htmlFor={`field-${field.id}`}
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <Input
                                                                          id={`field-${field.id}`}
                                                                          type="email"
                                                                          value={editData.fields[field.id] || ''}
                                                                          onChange={(e) =>
                                                                              setEditData('fields', {
                                                                                  ...editData.fields,
                                                                                  [field.id]: e.target.value,
                                                                              })
                                                                          }
                                                                          placeholder={t(field.placeholder)}
                                                                          required={field.is_required}
                                                                      />
                                                                  </div>
                                                              );
                                                          }

                                                          if (field.type === 'number') {
                                                              return (
                                                                  <div key={field.id} className="col-span-6">
                                                                      <Label
                                                                          htmlFor={`field-${field.id}`}
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <Input
                                                                          id={`field-${field.id}`}
                                                                          type="number"
                                                                          value={editData.fields[field.id] || ''}
                                                                          onChange={(e) =>
                                                                              setEditData('fields', {
                                                                                  ...editData.fields,
                                                                                  [field.id]: e.target.value,
                                                                              })
                                                                          }
                                                                          placeholder={t(field.placeholder)}
                                                                          required={field.is_required}
                                                                      />
                                                                  </div>
                                                              );
                                                          }

                                                          if (field.type === 'date') {
                                                              return (
                                                                  <div key={field.id} className="col-span-6">
                                                                      <Label
                                                                          htmlFor={`field-${field.id}`}
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <Input
                                                                          id={`field-${field.id}`}
                                                                          type="date"
                                                                          value={editData.fields[field.id] || ''}
                                                                          onChange={(e) =>
                                                                              setEditData('fields', {
                                                                                  ...editData.fields,
                                                                                  [field.id]: e.target.value,
                                                                              })
                                                                          }
                                                                          placeholder={t(field.placeholder)}
                                                                          required={field.is_required}
                                                                      />
                                                                  </div>
                                                              );
                                                          }

                                                          if (field.type === 'textarea') {
                                                              return (
                                                                  <div key={field.id} className="col-span-12">
                                                                      <Label
                                                                          htmlFor={`field-${field.id}`}
                                                                          required={field.is_required}
                                                                      >
                                                                          {t(field.name)}
                                                                      </Label>
                                                                      <RichTextEditor
                                                                          content={editData.fields[field.id] || ''}
                                                                          onChange={(value) =>
                                                                              setEditData('fields', {
                                                                                  ...editData.fields,
                                                                                  [field.id]: value,
                                                                              })
                                                                          }
                                                                          placeholder={t(field.placeholder)}
                                                                      />
                                                                  </div>
                                                              );
                                                          }
                                                      }

                                                      return null;
                                                  })
                                            : null}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                            {t('Cancel')}
                                        </Button>
                                        <Button type="submit" disabled={editProcessing}>
                                            {editProcessing ? t('Updating...') : t('Update Ticket')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Original Ticket */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-muted/500 text-background">
                                        {ticket.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{ticket.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            Customer
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {ticket.email} • {formatDate(ticket.created_at)}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: ticket.description }}
                            />

                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-foreground" />
                                        <span className="font-medium text-foreground">{t('Attachments')}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {ticket.attachments?.map((attachment, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded border bg-card p-2"
                                            >
                                                <span className="text-sm">{attachment.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                    onClick={() => {
                                                        fetch(route('support-ticket.attachment.download'), {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-CSRF-TOKEN':
                                                                    document
                                                                        .querySelector('meta[name="csrf-token"]')
                                                                        ?.getAttribute('content') || '',
                                                            },
                                                            body: JSON.stringify({ path: attachment.path }),
                                                        })
                                                            .then((response) => response.json())
                                                            .then((data) => {
                                                                if (data.status && data.file_url) {
                                                                    const link = document.createElement('a');
                                                                    link.href = data.file_url;
                                                                    link.download = attachment.name;
                                                                    link.click();
                                                                }
                                                            });
                                                    }}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Conversations */}
                    {conversations &&
                        conversations?.map((conversion) => (
                            <Card
                                key={conversion.id}
                                className={
                                    conversion.sender === 'admin'
                                        ? 'border-s-4 border-s-green-500'
                                        : 'border-s-4 border-s-gray-300'
                                }
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback
                                                className={
                                                    conversion.sender === 'admin'
                                                        ? 'bg-muted/500 text-background'
                                                        : 'bg-muted-foreground text-background'
                                                }
                                            >
                                                {conversion.sender === 'admin' ? 'A' : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {conversion.replyBy?.name || 'User'}
                                                </span>
                                                <Badge
                                                    variant={conversion.sender === 'admin' ? 'default' : 'outline'}
                                                    className="text-xs"
                                                >
                                                    {conversion.sender === 'admin' ? 'Admin' : 'Customer'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(conversion.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: conversion.description }}
                                    />

                                    {conversion.attachments && conversion.attachments.length > 0 && (
                                        <div
                                            className={`mt-4 rounded-lg border p-4 ${
                                                conversion.sender === 'admin'
                                                    ? 'border-border bg-muted/50'
                                                    : 'border-border bg-muted/50'
                                            }`}
                                        >
                                            <div className="mb-3 flex items-center gap-2">
                                                <Paperclip
                                                    className={`h-4 w-4 ${
                                                        conversion.sender === 'admin'
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                                <span
                                                    className={`font-medium ${
                                                        conversion.sender === 'admin'
                                                            ? 'text-foreground'
                                                            : 'text-foreground'
                                                    }`}
                                                >
                                                    {t('Attachments')}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {conversion.attachments?.map((attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between rounded border bg-card p-2"
                                                    >
                                                        <span className="text-sm">{attachment.name}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                            onClick={() => {
                                                                fetch(route('support-ticket.attachment.download'), {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'X-CSRF-TOKEN':
                                                                            document
                                                                                .querySelector(
                                                                                    'meta[name="csrf-token"]'
                                                                                )
                                                                                ?.getAttribute('content') || '',
                                                                    },
                                                                    body: JSON.stringify({ path: attachment.path }),
                                                                })
                                                                    .then((response) => response.json())
                                                                    .then((data) => {
                                                                        if (data.status && data.file_url) {
                                                                            const link = document.createElement('a');
                                                                            link.href = data.file_url;
                                                                            link.download = attachment.name;
                                                                            link.click();
                                                                        }
                                                                    });
                                                            }}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                    {/* Reply Form */}
                    <Card className="bg-muted/50/30 border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <MessageSquare className="h-5 w-5" />
                                {t('Add Reply')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleReplySubmit} className="space-y-4">
                                <div>
                                    <Label className="text-foreground">{t('Reply Message')}</Label>
                                    <RichTextEditor
                                        content={replyData.description}
                                        onChange={(value) => setReplyData('description', value)}
                                        placeholder={t('Write your reply here...')}
                                        className="bg-card"
                                    />
                                    {replyErrors.description && (
                                        <p className="mt-1 text-sm text-destructive">{replyErrors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-foreground">{t('Attachments')}</Label>
                                    <MediaPicker
                                        value={replyData.attachments}
                                        onChange={(value) =>
                                            setReplyData(
                                                'attachments',
                                                Array.isArray(value) ? value : [value].filter(Boolean)
                                            )
                                        }
                                        multiple={true}
                                        placeholder={t('Select attachments')}
                                        showPreview={true}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={replyProcessing || !replyData.description.trim()}
                                        className="bg-foreground hover:bg-foreground/80"
                                    >
                                        <Send className="me-2 h-4 w-4" />
                                        {replyProcessing ? t('Sending...') : t('Send Reply')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Ticket Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {t('Ticket Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('Status')}:</span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('Priority')}:</span>
                                    <Badge variant="outline">Normal</Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('Category')}:</span>
                                    <span className="text-sm font-medium">{ticket.category_info?.name || 'None'}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('Created')}:</span>
                                    <span className="text-sm">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{t('Updated')}:</span>
                                    <span className="text-sm">{new Date(ticket.updated_at).toLocaleDateString()}</span>
                                </div>
                                {/* Custom Fields Display */}
                                {customFields &&
                                    customFields.length > 0 &&
                                    customFields?.map((field) => (
                                        <div key={field.id}>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{field.name}:</span>
                                                <span className="text-sm font-medium">
                                                    {ticket.fields && ticket.fields[field.id]
                                                        ? ticket.fields[field.id]
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4" />
                                {t('Customer Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium">{ticket.name}</p>
                                    <p className="text-sm text-muted-foreground">{ticket.email}</p>
                                </div>
                                <Separator />
                                <div>
                                    <span className="text-sm text-muted-foreground">{t('Account Type')}:</span>
                                    <Badge variant="outline" className="ms-2 text-xs">
                                        {ticket.account_type}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Note Section */}
                    <Card className="bg-muted/50/30 border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                                <StickyNote className="h-4 w-4" />
                                {t('Internal Note')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleNoteSubmit} className="space-y-4">
                                <div>
                                    <RichTextEditor
                                        content={noteData.note}
                                        onChange={(value) => setNoteData('note', value)}
                                        placeholder={t('Add internal note...')}
                                        className="min-h-[120px] bg-card"
                                    />
                                    {noteErrors.note && (
                                        <p className="mt-1 text-sm text-destructive">{noteErrors.note}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={noteProcessing}
                                    size="sm"
                                    className="w-full bg-foreground hover:bg-foreground"
                                >
                                    <StickyNote className="me-2 h-4 w-4" />
                                    {noteProcessing ? t('Saving...') : t('Save Note')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
