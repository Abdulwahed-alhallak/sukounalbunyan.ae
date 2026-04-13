import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

import { Lightbulb, Search, Laptop, Download, Users, FileText, ChevronRight, Ticket, HelpCircle } from 'lucide-react';

interface KnowledgeItem {
    id: number;
    title: string;
    description: string;
    category?: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Category {
    id: number;
    title: string;
}

interface KnowledgeProps {
    knowledgeItems: KnowledgeItem[];
    categories: Category[];
    settings: {
        faq_is_on: string;
        knowledge_base_is_on: string;
    };
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
        privacyEnabled?: boolean;
        termsEnabled?: boolean;
    };
    titleSections?: {
        knowledge_base?: {
            title: string;
            description: string;
        };
    };
    ctaSections?: {
        knowledge_base?: {
            title: string;
            description: string;
        };
    };
    slug: string;
}

export default function Knowledge({
    knowledgeItems,
    categories,
    settings,
    brandSettings,
    titleSections,
    ctaSections,
    slug,
}: KnowledgeProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const pageTitle = titleSections?.knowledge_base?.title || 'Knowledge Base';
    const pageDescription = titleSections?.knowledge_base?.description || 'Find answers to common questions and issues';
    const bottomTitle = ctaSections?.knowledge_base?.title || "Can't find what you're looking for?";
    const bottomDescription = ctaSections?.knowledge_base?.description || 'Our support team is here to help';

    const filteredItems = knowledgeItems.filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedItems = categories
        ?.map((category) => ({
            ...category,
            icon: FileText,
            articles: filteredItems.filter((item) => item.category?.id === category.id),
        }))
        .filter((category) => category.articles.length > 0);

    // Add uncategorized items
    const uncategorizedItems = filteredItems.filter((item) => !item.category);
    if (uncategorizedItems.length > 0) {
        groupedItems.push({
            id: 0,
            title: 'General',
            icon: FileText,
            articles: uncategorizedItems,
        });
    }

    return (
        <SupportTicketLayout title={pageTitle} settings={settings} brandSettings={brandSettings}>
            <div className="relative mb-12 overflow-hidden rounded-2xl bg-foreground shadow-xl">
                <div className="relative px-8 py-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-block rounded-full bg-card/20 p-2 px-4 text-sm text-background">
                            <Lightbulb className="me-2 inline h-4 w-4" />
                            {t('Knowledge Center')}
                        </div>
                        <h2 className="mb-4 text-4xl font-bold text-background">{pageTitle}</h2>
                        <p className="mb-6 text-background">{pageDescription}</p>

                        <div className="relative mx-auto max-w-2xl">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-4">
                                <Search className="h-5 w-5 text-foreground" />
                            </div>
                            <Input
                                type="text"
                                className="border-0 bg-card/90 py-3 ps-12 pe-24 text-foreground"
                                placeholder={t('What are you looking for?')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="mb-6 text-3xl font-bold text-foreground">{t('Knowledge Articles')}</h2>

                {groupedItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {groupedItems?.map((category) => (
                            <Card key={category.id} className="flex h-96 flex-col overflow-hidden shadow-lg">
                                <div className="bg-foreground px-5 py-4">
                                    <h3 className="flex items-center text-lg font-medium text-background">
                                        <category.icon className="me-2 h-5 w-5" />
                                        {category.title}
                                    </h3>
                                </div>
                                <CardContent className="flex-1 space-y-1 overflow-y-auto p-5">
                                    {category.articles?.map((article) => (
                                        <div
                                            key={article.id}
                                            className="group transition-all duration-300 hover:translate-x-1"
                                        >
                                            <Link
                                                href={route('support-ticket.knowledge.article', [slug, article.id])}
                                                className="flex items-center gap-2 rounded-lg p-3 hover:bg-muted/50"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 group-hover:bg-foreground">
                                                    <FileText className="h-4 w-4 text-foreground group-hover:text-background" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-foreground group-hover:text-foreground">
                                                        {article.title}
                                                    </h4>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(article.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-foreground opacity-0 transition-all group-hover:opacity-100" />
                                            </Link>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-xl font-semibold text-muted-foreground">
                            {t('No Knowledge Articles Found')}
                        </h3>
                        <p className="text-muted-foreground">
                            {t('There are no knowledge articles available at the moment.')}
                        </p>
                    </Card>
                )}
            </div>

            <div className="mb-12 mt-12">
                <Card className="relative overflow-hidden bg-foreground text-background">
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                            <defs>
                                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#smallGrid)" />
                        </svg>
                    </div>

                    <CardContent className="relative flex flex-col items-center px-4 py-6 md:flex-row md:p-8 lg:p-12">
                        <div className="mb-6 w-full text-center text-background md:mb-0 md:w-2/3 md:pe-12 md:text-start">
                            <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl lg:text-3xl">{bottomTitle}</h2>
                            <p className="mb-4 text-background md:mb-6">
                                {bottomDescription ||
                                    "Can't find the answer you're looking for? Our support team is ready to help you with any issues or concerns you might have."}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 md:justify-start md:gap-4">
                                <Button variant="secondary" className="bg-card text-foreground hover:bg-muted" asChild>
                                    <Link href={route('support-ticket.index', [slug])}>
                                        <Ticket className="me-2 h-4 w-4" />
                                        {t('Create Support Ticket')}
                                    </Link>
                                </Button>
                                {settings.faq_is_on === 'on' && (
                                    <Button
                                        variant="outline"
                                        className="border-2 border-white/20 bg-card/20 text-background hover:bg-card/30"
                                        asChild
                                    >
                                        <Link href={route('support-ticket.faq', [slug])}>
                                            <HelpCircle className="me-2 h-4 w-4" />
                                            {t('Browse FAQ')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full justify-center md:w-1/3">
                            <div className="relative h-48 w-48 md:h-56 md:w-56">
                                <img
                                    src={getImagePath(
                                        'packages/noble/SupportTicket/src/Resources/assets/images/svg/support-illustration.svg'
                                    )}
                                    alt="FAQ"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SupportTicketLayout>
    );
}
