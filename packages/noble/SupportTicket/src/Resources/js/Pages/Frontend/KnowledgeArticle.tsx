import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import {
    Database,
    Calendar,
    Clock,
    Eye,
    List,
    FileCode,
    Server,
    Shield,
    Info,
    Lightbulb,
    AlertTriangle,
    CheckCircle,
    Copy,
    Check,
    ThumbsUp,
    ThumbsDown,
    Ticket,
    Link as LinkIcon,
    Tags,
    ChevronRight,
    ArrowLeft,
} from 'lucide-react';

interface Article {
    id: number;
    title: string;
    description: string;
    category?: {
        id: number;
        title: string;
    };
    created_at: string;
    updated_at: string;
}

interface RelatedArticle {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

interface KnowledgeArticleProps {
    article: Article;
    relatedArticles: RelatedArticle[];
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
        customPages?: Array<{
            slug: string;
            name: string;
        }>;
    };
    slug: string;
}

export default function KnowledgeArticle({
    article,
    relatedArticles,
    settings,
    brandSettings,
    slug,
}: KnowledgeArticleProps) {
    const { t } = useTranslation();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(null), 2000);
        });
    };

    // Generate table of contents from article description HTML
    const generateTocItems = (description: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        return Array.from(headings)?.map((heading, index) => ({
            id: `heading-${index}`,
            title: heading.textContent || `Section ${index + 1}`,
        }));
    };

    const tocItems = generateTocItems(article.description);

    return (
        <SupportTicketLayout title={article.title} settings={settings} brandSettings={brandSettings}>
            {/* Breadcrumbs */}
            <div className="mb-4 text-sm text-muted-foreground">
                <Link href={route('support-ticket.index', [slug])} className="hover:text-foreground">
                    {t('Home')}
                </Link>
                <span className="mx-2">/</span>
                <Link href={route('support-ticket.knowledge', [slug])} className="hover:text-foreground">
                    {t('Knowledge Base')}
                </Link>
                {article.category && (
                    <>
                        <span className="mx-2">/</span>
                        <span className="hover:text-foreground">{article.category.title}</span>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-foreground">{article.title}</span>
            </div>

            {/* Article Header */}
            <Card className="mb-8 overflow-hidden bg-foreground shadow-lg">
                <CardContent className="flex flex-col items-center px-4 py-6 md:flex-row md:p-8">
                    <div className="mb-8 w-full text-background md:mb-0 md:w-3/5 md:pe-8">
                        <div className="mb-4">
                            <span className="mb-3 inline-block rounded-full bg-card/20 px-4 py-1 text-sm text-background backdrop-blur-sm md:mb-4">
                                <Database className="me-1 inline h-4 w-4" />
                                {article.category?.title || t('Knowledge Base')}
                            </span>
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-background md:mb-4 md:text-3xl lg:text-4xl">
                            {article.title}
                        </h2>
                        <p className="mb-4 text-background md:mb-6">
                            {t('Comprehensive guide to help you understand and implement the solution')}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm lg:gap-6">
                            <div className="flex items-center">
                                <Calendar className="me-2 h-4 w-4" />
                                <span>
                                    {t('Last updated')}: {new Date(article.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="me-2 h-4 w-4" />
                                <span>{t('5 min read')}</span>
                            </div>
                            <div className="flex items-center">
                                <Eye className="me-2 h-4 w-4" />
                                <span>{t('1,245 views')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-center md:w-2/5">
                        <img
                            src={getImagePath(
                                'packages/noble/SupportTicket/src/Resources/assets/images/svg/database-illustration.svg'
                            )}
                            alt="Knowledge Base Illustration"
                            className="w-full max-w-sm"
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left Sidebar (Table of Contents) */}
                {tocItems.length > 0 && (
                    <div className="w-full lg:w-1/4">
                        <Card className="sticky top-4 shadow-md">
                            <CardContent className="p-4 md:p-5">
                                <h3 className="mb-4 flex items-center text-lg font-semibold">
                                    <List className="me-2 h-5 w-5 text-foreground" />
                                    {t('Table of Contents')}
                                </h3>
                                <div className="space-y-1">
                                    {tocItems?.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="block rounded p-2 text-sm text-foreground transition-all duration-300 hover:border-s-2 hover:border-foreground hover:bg-muted/50 hover:ps-3 hover:text-foreground"
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </div>

                                {/* Quick Resources Box */}
                                <div className="mt-8 border-t border-border pt-6">
                                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                                        <LinkIcon className="me-2 h-5 w-5 text-foreground" />
                                        {t('Quick Resources')}
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('support-ticket.knowledge', [slug])}
                                            className="flex items-center text-sm text-foreground hover:text-foreground"
                                        >
                                            <FileCode className="me-2 h-4 w-4 text-foreground" />
                                            <span>{t('Browse All Articles')}</span>
                                        </Link>
                                        <Link
                                            href={route('support-ticket.create', [slug])}
                                            className="flex items-center text-sm text-foreground hover:text-foreground"
                                        >
                                            <Server className="me-2 h-4 w-4 text-foreground" />
                                            <span>{t('Create Support Ticket')}</span>
                                        </Link>
                                        {settings.faq_is_on === 'on' && (
                                            <Link
                                                href={route('support-ticket.faq', [slug])}
                                                className="flex items-center text-sm text-foreground hover:text-foreground"
                                            >
                                                <Shield className="me-2 h-4 w-4 text-foreground" />
                                                <span>{t('FAQ Section')}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Article Content */}
                <div className={`w-full ${tocItems.length > 0 ? 'lg:w-2/4' : 'lg:w-2/3'}`}>
                    <Card className="shadow-md">
                        <CardContent className="max-h-[80vh] overflow-y-auto p-4 md:p-6 lg:p-8">
                            {/* Introduction Section */}
                            <div className="mb-8">
                                <div className="rounded-xl bg-muted/50 p-4">
                                    <h4 className="mb-2 flex items-center font-medium text-foreground">
                                        <Info className="me-2 h-5 w-5 text-foreground" />
                                        {t('Article Information')}
                                    </h4>
                                    <p className="text-sm text-foreground">
                                        {t(
                                            'This article provides detailed information to help you understand the topic. Please read through the content carefully.'
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="mb-10">
                                <div
                                    className="prose prose-gray prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.description }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                {tocItems.length > 0 && (
                    <div className="w-full lg:w-1/4">
                        {/* Related Articles */}
                        <Card className="mb-6 shadow-md">
                            <CardContent className="p-5">
                                <h3 className="mb-4 flex items-center text-lg font-semibold">
                                    <LinkIcon className="me-2 h-5 w-5 text-foreground" />
                                    {t('Related Articles')}
                                </h3>
                                <div className="space-y-4">
                                    {relatedArticles && relatedArticles.length > 0 ? (
                                        relatedArticles?.map((relatedArticle) => (
                                            <Link
                                                key={relatedArticle.id}
                                                href={route('support-ticket.knowledge.article', [
                                                    slug,
                                                    relatedArticle.id,
                                                ])}
                                                className="block rounded-lg border border-border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-md"
                                            >
                                                <h4 className="mb-1 font-medium text-foreground transition-colors duration-300 hover:text-foreground">
                                                    {relatedArticle.title}
                                                </h4>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {relatedArticle.description
                                                        .replace(/<[^>]*>/g, '')
                                                        .substring(0, 100)}
                                                    ...
                                                </p>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {new Date(relatedArticle.created_at).toLocaleDateString()}
                                                </p>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {t('No related articles found.')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <Card className="shadow-md">
                            <CardContent className="p-5">
                                <h3 className="mb-4 flex items-center text-lg font-semibold">
                                    <LinkIcon className="me-2 h-5 w-5 text-foreground" />
                                    {t('Navigation')}
                                </h3>
                                <div className="space-y-4">
                                    <Link
                                        href={route('support-ticket.knowledge', [slug])}
                                        className="block rounded-lg border border-border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-md"
                                    >
                                        <h4 className="mb-1 font-medium text-foreground transition-colors duration-300 hover:text-foreground">
                                            ← {t('Back to Knowledge Base')}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {t('Browse all available articles')}
                                        </p>
                                    </Link>
                                    {article.category && (
                                        <div className="rounded-lg border border-border p-4">
                                            <h4 className="mb-1 font-medium text-foreground">{t('Category')}</h4>
                                            <p className="text-sm text-foreground">{article.category.title}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {/* Right Sidebar - Show when no TOC */}
                {tocItems.length === 0 && (
                    <div className="w-full lg:w-1/3">
                        {/* Related Articles */}
                        <Card className="mb-6 shadow-md">
                            <CardContent className="p-5">
                                <h3 className="mb-4 flex items-center text-lg font-semibold">
                                    <LinkIcon className="me-2 h-5 w-5 text-foreground" />
                                    {t('Related Articles')}
                                </h3>
                                <div className="space-y-4">
                                    {relatedArticles && relatedArticles.length > 0 ? (
                                        relatedArticles?.map((relatedArticle) => (
                                            <Link
                                                key={relatedArticle.id}
                                                href={route('support-ticket.knowledge.article', [
                                                    slug,
                                                    relatedArticle.id,
                                                ])}
                                                className="block rounded-lg border border-border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-md"
                                            >
                                                <h4 className="mb-1 font-medium text-foreground transition-colors duration-300 hover:text-foreground">
                                                    {relatedArticle.title}
                                                </h4>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {relatedArticle.description
                                                        .replace(/<[^>]*>/g, '')
                                                        .substring(0, 100)}
                                                    ...
                                                </p>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {new Date(relatedArticle.created_at).toLocaleDateString()}
                                                </p>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {t('No related articles found.')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Section */}
                        <Card className="shadow-md">
                            <CardContent className="p-5">
                                <h3 className="mb-4 text-lg font-semibold">{t('Need Help?')}</h3>
                                <div className="rounded-xl bg-muted/50 p-4">
                                    <h4 className="mb-3 font-bold text-foreground">{t('Still have questions?')}</h4>
                                    <p className="mb-4 text-sm text-foreground">
                                        {t(
                                            "If you couldn't find the information you were looking for, our support team is here to help."
                                        )}
                                    </p>
                                    <Button className="w-full bg-foreground hover:bg-foreground" asChild>
                                        <Link href={route('support-ticket.index', [slug])}>
                                            <Ticket className="me-2 h-4 w-4" />
                                            {t('Create a Support Ticket')}
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </SupportTicketLayout>
    );
}
