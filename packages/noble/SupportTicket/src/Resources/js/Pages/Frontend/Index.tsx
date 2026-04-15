import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent } from '@/components/ui/card';
import MediaPicker from '@/components/MediaPicker';
import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { useTranslation } from 'react-i18next';

import { Info, Clock, Phone, BookOpen, Video, Lightbulb, Code, MessageCircle, Send } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface IndexProps {
    [key: string]: any;
    categories: Category[];
    settings: {
        faq_is_on: string;
        knowledge_base_is_on: string;
    };
}

export default function Index() {
    const { t } = useTranslation();
    const { categories, settings } = usePage<IndexProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        category: '',
        subject: '',
        status: 'open',
        description: '',
        attachments: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('support-ticket.store'));
    };

    return (
        <SupportTicketLayout title="Create Support Ticket" settings={settings}>
            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Left Sidebar */}
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
                                    src={`${window.location.origin}/packages/noble/SupportTicket/src/Resources/assets/images/svg/support-illustration.svg`}
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
                                            {t('We typically respond within 24 hours on business days.')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start rounded-lg bg-muted/50 p-3">
                                    <Clock className="me-3 mt-1 h-5 w-5 text-foreground" />
                                    <div>
                                        <h4 className="font-medium text-foreground">{t('Support Hours')}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {t('Monday - Friday: 9AM - 6PM ET')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start rounded-lg bg-muted/50 p-3">
                                    <Phone className="me-3 mt-1 h-5 w-5 text-foreground" />
                                    <div>
                                        <h4 className="font-medium text-foreground">{t('Phone Support')}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {t('Premium customers:')} <br />
                                            +1 (555) 123-4567
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
                            <a
                                href="#"
                                className="block border-b border-border p-4 text-foreground transition duration-200 hover:bg-muted/50"
                            >
                                <BookOpen className="me-2 inline h-4 w-4 text-foreground" /> {t('User Guides')}
                            </a>
                            <a
                                href="#"
                                className="block border-b border-border p-4 text-foreground transition duration-200 hover:bg-muted/50"
                            >
                                <Video className="me-2 inline h-4 w-4 text-foreground" /> {t('Video Tutorials')}
                            </a>
                            <a
                                href="#"
                                className="block border-b border-border p-4 text-foreground transition duration-200 hover:bg-muted/50"
                            >
                                <Lightbulb className="me-2 inline h-4 w-4 text-foreground" /> {t('Tips & Tricks')}
                            </a>
                            <a
                                href="#"
                                className="block border-b border-border p-4 text-foreground transition duration-200 hover:bg-muted/50"
                            >
                                <Code className="me-2 inline h-4 w-4 text-foreground" /> {t('API Documentation')}
                            </a>
                            <a href="#" className="block p-4 text-foreground transition duration-200 hover:bg-muted/50">
                                <MessageCircle className="me-2 inline h-4 w-4 text-foreground" />{' '}
                                {t('Community Forums')}
                            </a>
                        </div>
                    </Card>
                </div>

                {/* Main Form Card */}
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
                                {t('Create Support Ticket')}
                            </h2>
                        </div>

                        <CardContent className="p-4 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="name" className="mb-2 block font-medium text-foreground">
                                            {t('Name')}
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('Enter Your Name')}
                                            className="w-full"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="mb-2 block font-medium text-foreground">
                                            {t('Email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('Enter Your Email')}
                                            className="w-full"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Category and Subject */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="category" className="mb-2 block font-medium text-foreground">
                                            {t('Category')}
                                        </Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) => setData('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select Category')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-destructive">{errors.category}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="subject" className="mb-2 block font-medium text-foreground">
                                            {t('Subject')}
                                        </Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder={t('Enter Subject')}
                                            className="w-full"
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Status and Attachments */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="status" className="mb-2 block font-medium text-foreground">
                                            {t('Status')}
                                        </Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select Status')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">{t('Open')}</SelectItem>
                                                <SelectItem value="In Progress">{t('In Progress')}</SelectItem>
                                                <SelectItem value="On Hold">{t('On Hold')}</SelectItem>
                                                <SelectItem value="Closed">{t('Closed')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="mb-2 block font-medium text-foreground">
                                            {t('Attachments')}{' '}
                                            <span className="text-sm text-muted-foreground">
                                                ({t('Multiple files')})
                                            </span>
                                        </Label>
                                        <MediaPicker
                                            value={data.attachments}
                                            onChange={(files) => setData('attachments', files)}
                                            placeholder={t('Select files to attach')}
                                            multiple
                                            className={errors.attachments ? 'border-destructive' : ''}
                                        />
                                        {errors.attachments && (
                                            <p className="mt-1 text-sm text-destructive">{errors.attachments}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="mb-2 block font-medium text-foreground">
                                        {t('Description')}
                                    </Label>
                                    <RichTextEditor
                                        value={data.description}
                                        onChange={(value) => setData('description', value)}
                                        placeholder={t('Please describe your issue in detail...')}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-foreground px-8 py-3 font-medium text-background shadow-md transition-all duration-300 hover:bg-foreground hover:shadow-lg"
                                    >
                                        <Send className="me-2 h-4 w-4" />
                                        {processing ? t('Creating...') : t('Create Ticket')}
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
