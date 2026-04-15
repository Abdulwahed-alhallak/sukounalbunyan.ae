import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent } from '@/components/ui/card';

import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { getImagePath, formatTime } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

import {
    Info,
    Send,
    CheckCircle,
    AlertCircle,
    Clock,
    MessageSquare,
    FileText,
    Users,
    X,
    Phone,
    BookOpen,
    Video,
    Lightbulb,
    Code,
    MessageCircle,
    HelpCircle,
    Upload,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
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

interface CreateTicketProps {
    [key: string]: any;
    categories: Category[];
    allFields?: Field[];
    customFields?: Field[];
    settings: {
        faq_is_on: string;
        knowledge_base_is_on: string;
    };
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
    titleSections?: {
        create_ticket?: {
            title: string;
            description: string;
        };
    };
    quickLinks?: Array<{
        title: string;
        icon: string;
        link: string;
    }>;
    supportInformation?: {
        response_time: string;
        opening_hours: string;
        closing_hours: string;
        phone_support: string;
        business_hours: Array<{
            day: string;
            is_open: boolean;
        }>;
    };
    slug: string;
}

export default function CreateTicket({
    categories,
    allFields,
    customFields,
    settings,
    brandSettings,
    titleSections,
    quickLinks,
    supportInformation,
    slug,
}: CreateTicketProps) {
    const { t } = useTranslation();
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        category: '',
        subject: '',
        status: 'In Progress',
        description: '',
        account_type: 'custom',
        fields: {} as Record<string, any>,
    });

    useEffect(() => {
        if (flash?.success) {
            // Extract link from HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = flash.success;
            const linkElement = tempDiv.querySelector('a');
            const ticketLink = linkElement?.getAttribute('href');
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            if (ticketLink) {
                toast.success(textContent, {
                    action: {
                        label: 'View Ticket',
                        onClick: () => window.open(ticketLink, '_blank'),
                    },
                    duration: 10000,
                });
            } else {
                toast.success(textContent);
            }
            reset();
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            setData('attachments', files);
        } else {
            setSelectedFiles([]);
            // Remove attachments from form data if no files
            const newData = { ...data };
            delete newData.attachments;
            setData(newData as any);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('support-ticket.create.store', [slug]), {
            onSuccess: (response) => {
                reset();
                setSelectedFiles([]);
            },
            onError: (errors) => {
                toast.error('Failed to create ticket. Please try again.');
            },
        });
    };

    const pageTitle = titleSections?.create_ticket?.title || 'Create Support Ticket';
    const pageDescription =
        titleSections?.create_ticket?.description || 'Submit your support request and get help from our team';

    return (
        <SupportTicketLayout title={pageTitle} settings={settings} brandSettings={brandSettings}>
            <div className="flex flex-col gap-8 lg:flex-row">
                <div
                    className="lg:w-1/4"
                    style={{
                        animation: 'fadeIn 0.5s ease-out',
                    }}
                >
                    <Card className="mb-6 shadow-lg">
                        <div className="rounded-t-xl bg-foreground px-4 py-3">
                            <h3 className="text-lg font-medium text-background md:text-xl">
                                {t('Support Information')}
                            </h3>
                        </div>
                        <CardContent className="p-4">
                            <div className="mb-4 overflow-hidden rounded-lg text-center">
                                <img
                                    src={getImagePath(
                                        'packages/noble/SupportTicket/src/Resources/assets/images/svg/support-illustration.svg'
                                    )}
                                    alt="Support"
                                    className="mx-auto h-full w-full"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start rounded-lg bg-muted/50 p-3">
                                    <Info className="me-3 mt-1 h-5 w-5 text-foreground" />
                                    <div>
                                        <h4 className="font-medium text-foreground">{t('Response Time')}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {supportInformation?.response_time ||
                                                'We typically respond within 24 hours on business days.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start rounded-lg bg-muted/50 p-3">
                                    <Clock className="me-3 mt-1 h-5 w-5 text-foreground" />
                                    <div>
                                        <h4 className="font-medium text-foreground">{t('Support Hours')}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {supportInformation?.business_hours
                                                ? supportInformation.business_hours
                                                      .filter((h) => h.is_open)
                                                      ?.map((h) => h.day)
                                                      .join(', ') || 'Closed'
                                                : 'Monday - Friday'}
                                            :{' '}
                                            {supportInformation?.opening_hours
                                                ? formatTime(supportInformation.opening_hours)
                                                : '9AM'}{' '}
                                            -{' '}
                                            {supportInformation?.closing_hours
                                                ? formatTime(supportInformation.closing_hours)
                                                : '6PM'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start rounded-lg bg-muted/50 p-3">
                                    <Phone className="me-3 mt-1 h-5 w-5 text-foreground" />
                                    <div>
                                        <h4 className="font-medium text-foreground">{t('Phone Support')}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {supportInformation?.phone_support || '+1 (555) 123-4567'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="shadow-lg"
                        style={{
                            animation: 'fadeIn 0.5s ease-out',
                            animationDelay: '0.2s',
                            animationFillMode: 'both',
                        }}
                    >
                        <div className="rounded-t-xl bg-foreground px-4 py-3">
                            <h3 className="text-lg font-medium text-background md:text-xl">{t('Quick Links')}</h3>
                        </div>
                        <div>
                            {quickLinks && quickLinks.length > 0 ? (
                                quickLinks?.map((link, index) => {
                                    const iconMap: Record<string, any> = {
                                        BookOpen,
                                        Video,
                                        Lightbulb,
                                        Code,
                                        MessageCircle,
                                        FileText,
                                        HelpCircle,
                                        Users,
                                        Info,
                                        Clock,
                                        Phone,
                                    };
                                    const IconComponent = iconMap[link.icon] || BookOpen;

                                    return (
                                        <a
                                            key={index}
                                            href={link.link}
                                            className={`block p-4 text-foreground transition duration-200 hover:bg-muted/50 ${
                                                index < quickLinks.length - 1 ? 'border-b border-border' : ''
                                            }`}
                                            target={link.link.startsWith('http') ? '_blank' : '_self'}
                                            rel={link.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        >
                                            <IconComponent className="me-2 inline h-4 w-4 text-foreground" />{' '}
                                            {link.title}
                                        </a>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    {t(' No quick links available')}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div
                    className="lg:w-3/4"
                    style={{
                        animation: 'fadeIn 0.5s ease-out',
                        animationDelay: '0.3s',
                        animationFillMode: 'both',
                    }}
                >
                    <Card
                        className="shadow-xl"
                        style={{
                            animation: 'fadeInUp 0.6s ease-out',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid rgba(220, 220, 220, 0.5)',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <div className="rounded-t-xl bg-foreground p-4 md:px-6 md:py-5">
                            <h2 className="text-center text-xl font-semibold text-background md:text-2xl lg:text-3xl">
                                {pageTitle}
                            </h2>
                            {pageDescription && (
                                <p className="mt-2 text-center text-sm text-foreground md:text-base">
                                    {pageDescription}
                                </p>
                            )}
                        </div>
                        <CardContent className="p-4 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Dynamic Fields ordered by 'order' field */}
                                <div className="grid grid-cols-12 gap-4">
                                    {allFields && allFields.length > 0 ? (
                                        allFields
                                            .sort((a, b) => a.order - b.order)
                                            ?.map((field) => {
                                                const colSpan =
                                                    field.width === '12'
                                                        ? 'col-span-12'
                                                        : field.width === '6'
                                                          ? 'col-span-6'
                                                          : field.width === '4'
                                                            ? 'col-span-4'
                                                            : field.width === '3'
                                                              ? 'col-span-3'
                                                              : 'col-span-12';

                                                // Handle default fields by custom_id
                                                if (field.custom_id == 1) {
                                                    // Name field
                                                    return (
                                                        <div key={field.id} className={colSpan}>
                                                            <Label
                                                                htmlFor="name"
                                                                className="mb-2 block font-medium text-foreground"
                                                                required={field.is_required}
                                                            >
                                                                {t(field.name)}
                                                            </Label>
                                                            <Input
                                                                id="name"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                placeholder={t(field.placeholder)}
                                                                className="w-full"
                                                                required={field.is_required}
                                                            />
                                                            {errors.name && (
                                                                <p className="mt-1 text-sm text-destructive">
                                                                    {errors.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                if (field.custom_id == 2) {
                                                    // Email field
                                                    return (
                                                        <div key={field.id} className={colSpan}>
                                                            <Label
                                                                htmlFor="email"
                                                                className="mb-2 block font-medium text-foreground"
                                                                required={field.is_required}
                                                            >
                                                                {t(field.name)}
                                                            </Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                placeholder={t(field.placeholder)}
                                                                className="w-full"
                                                                required={field.is_required}
                                                            />
                                                            {errors.email && (
                                                                <p className="mt-1 text-sm text-destructive">
                                                                    {errors.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                if (field.custom_id == 3) {
                                                    // Category field
                                                    return (
                                                        <div key={field.id} className={colSpan}>
                                                            <Label
                                                                htmlFor="category"
                                                                className="mb-2 block font-medium text-foreground"
                                                                required={field.is_required}
                                                            >
                                                                {t(field.name)}
                                                            </Label>
                                                            <Select
                                                                value={data.category}
                                                                onValueChange={(value) => setData('category', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={t(field.placeholder)} />
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
                                                            {errors.category && (
                                                                <p className="mt-1 text-sm text-destructive">
                                                                    {errors.category}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                if (field.custom_id == 4) {
                                                    // Subject field
                                                    return (
                                                        <>
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor="subject"
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <Input
                                                                    id="subject"
                                                                    value={data.subject}
                                                                    onChange={(e) => setData('subject', e.target.value)}
                                                                    placeholder={t(field.placeholder)}
                                                                    className="w-full"
                                                                    required={field.is_required}
                                                                />
                                                                {errors.subject && (
                                                                    <p className="mt-1 text-sm text-destructive">
                                                                        {errors.subject}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {/* Status field - show after subject */}
                                                            <div className="col-span-6">
                                                                <Label
                                                                    htmlFor="status"
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required
                                                                >
                                                                    {t('Status')}
                                                                </Label>
                                                                <Select
                                                                    value={data.status}
                                                                    onValueChange={(value) => setData('status', value)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
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
                                                        <div key={field.id} className={colSpan}>
                                                            <Label
                                                                htmlFor="description"
                                                                className="mb-2 block font-medium text-foreground"
                                                                required={field.is_required}
                                                            >
                                                                {t(field.name)}
                                                            </Label>
                                                            <RichTextEditor
                                                                value={data.description}
                                                                onChange={(value) => setData('description', value)}
                                                                placeholder={t(field.placeholder)}
                                                            />
                                                            {errors.description && (
                                                                <p className="mt-1 text-sm text-destructive">
                                                                    {errors.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                if (field.custom_id == 6) {
                                                    // Attachments field
                                                    return (
                                                        <div key={field.id} className={colSpan}>
                                                            <Label className="mb-2 block font-medium text-foreground">
                                                                {t(field.name)}{' '}
                                                                <span className="text-sm text-muted-foreground">
                                                                    ({t(field.placeholder)})
                                                                </span>
                                                            </Label>
                                                            <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-border px-6 pb-6 pt-5 transition-all duration-300 hover:border-foreground">
                                                                <div className="space-y-1 text-center">
                                                                    <img
                                                                        src={getImagePath(
                                                                            'packages/noble/SupportTicket/src/Resources/assets/images/svg/file-upload-illustration.svg'
                                                                        )}
                                                                        alt="File Upload"
                                                                        className="mx-auto h-28"
                                                                        style={{
                                                                            animation: 'float 6s ease-in-out infinite',
                                                                        }}
                                                                    />
                                                                    <div className="flex text-sm text-muted-foreground">
                                                                        <label
                                                                            htmlFor="file-upload"
                                                                            className="relative cursor-pointer rounded-md font-medium text-foreground hover:text-foreground"
                                                                        >
                                                                            <span>Choose Files</span>
                                                                            <input
                                                                                id="file-upload"
                                                                                name="file-upload"
                                                                                type="file"
                                                                                className="sr-only"
                                                                                multiple
                                                                                accept="image/png,image/jpeg,image/gif,application/pdf"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                        </label>
                                                                        <p className="ps-1">{t('or drag and drop')}</p>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        PNG, JPG, GIF, PDF up to 10MB
                                                                    </p>
                                                                    {selectedFiles.length > 0 && (
                                                                        <div className="mt-2 text-sm text-muted-foreground">
                                                                            {selectedFiles.length} file(s) selected
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {errors.attachments && (
                                                                <p className="mt-1 text-sm text-destructive">
                                                                    {errors.attachments}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                // Handle custom fields (custom_id > 6)
                                                if (field.custom_id > 6) {
                                                    if (field.type === 'text') {
                                                        return (
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor={`field-${field.id}`}
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <Input
                                                                    id={`field-${field.id}`}
                                                                    value={data.fields[field.id] || ''}
                                                                    onChange={(e) =>
                                                                        setData('fields', {
                                                                            ...data.fields,
                                                                            [field.id]: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder={t(field.placeholder)}
                                                                    required={field.is_required}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    if (field.type === 'email') {
                                                        return (
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor={`field-${field.id}`}
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <Input
                                                                    id={`field-${field.id}`}
                                                                    type="email"
                                                                    value={data.fields[field.id] || ''}
                                                                    onChange={(e) =>
                                                                        setData('fields', {
                                                                            ...data.fields,
                                                                            [field.id]: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder={t(field.placeholder)}
                                                                    required={field.is_required}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    if (field.type === 'number') {
                                                        return (
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor={`field-${field.id}`}
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <Input
                                                                    id={`field-${field.id}`}
                                                                    type="number"
                                                                    value={data.fields[field.id] || ''}
                                                                    onChange={(e) =>
                                                                        setData('fields', {
                                                                            ...data.fields,
                                                                            [field.id]: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder={t(field.placeholder)}
                                                                    required={field.is_required}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    if (field.type === 'date') {
                                                        return (
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor={`field-${field.id}`}
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <Input
                                                                    id={`field-${field.id}`}
                                                                    type="date"
                                                                    value={data.fields[field.id] || ''}
                                                                    onChange={(e) =>
                                                                        setData('fields', {
                                                                            ...data.fields,
                                                                            [field.id]: e.target.value,
                                                                        })
                                                                    }
                                                                    placeholder={t(field.placeholder)}
                                                                    required={field.is_required}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    if (field.type === 'textarea') {
                                                        return (
                                                            <div key={field.id} className={colSpan}>
                                                                <Label
                                                                    htmlFor={`field-${field.id}`}
                                                                    className="mb-2 block font-medium text-foreground"
                                                                    required={field.is_required}
                                                                >
                                                                    {t(field.name)}
                                                                </Label>
                                                                <RichTextEditor
                                                                    value={data.fields[field.id] || ''}
                                                                    onChange={(value) =>
                                                                        setData('fields', {
                                                                            ...data.fields,
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
                                    ) : (
                                        // Fallback fields if no allFields
                                        <>
                                            <div className="col-span-6">
                                                <Label
                                                    htmlFor="name"
                                                    className="mb-2 block font-medium text-foreground"
                                                >
                                                    {t('Name')}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Enter Your Name"
                                                    className="w-full"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                                                )}
                                            </div>
                                            <div className="col-span-6">
                                                <Label
                                                    htmlFor="email"
                                                    className="mb-2 block font-medium text-foreground"
                                                >
                                                    {t('Email')}
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Enter Your Email"
                                                    className="w-full"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                                                )}
                                            </div>
                                            <div className="col-span-6">
                                                <Label
                                                    htmlFor="category"
                                                    className="mb-2 block font-medium text-foreground"
                                                >
                                                    {t('Category')}
                                                </Label>
                                                <Select
                                                    value={data.category}
                                                    onValueChange={(value) => setData('category', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
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
                                                {errors.category && (
                                                    <p className="mt-1 text-sm text-destructive">{errors.category}</p>
                                                )}
                                            </div>
                                            <div className="col-span-6">
                                                <Label
                                                    htmlFor="subject"
                                                    className="mb-2 block font-medium text-foreground"
                                                >
                                                    {t('Subject')}
                                                </Label>
                                                <Input
                                                    id="subject"
                                                    value={data.subject}
                                                    onChange={(e) => setData('subject', e.target.value)}
                                                    placeholder="Enter Subject"
                                                    className="w-full"
                                                    required
                                                />
                                                {errors.subject && (
                                                    <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
                                                )}
                                            </div>
                                            <div className="col-span-12">
                                                <Label
                                                    htmlFor="description"
                                                    className="mb-2 block font-medium text-foreground"
                                                >
                                                    {t('Description')}
                                                </Label>
                                                <RichTextEditor
                                                    value={data.description}
                                                    onChange={(value) => setData('description', value)}
                                                    placeholder="Please describe your issue in detail..."
                                                />
                                                {errors.description && (
                                                    <p className="mt-1 text-sm text-destructive">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-foreground px-8 py-3 font-medium text-background shadow-md transition-all duration-300 hover:bg-foreground hover:shadow-lg"
                                    >
                                        <Send className="me-2 h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Ticket'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SupportTicketLayout>
    );
}
