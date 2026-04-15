import { useState, ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { useFormFields } from '@/hooks/useFormFields';

import { Menu, X, Ticket, Search, Book, HelpCircle, UserCircle, Headphones } from 'lucide-react';

interface SupportTicketLayoutProps {
    [key: string]: any;
    children: ReactNode;
    title?: string;
    settings?: {
        faq_is_on?: string;
        knowledge_base_is_on?: string;
        privacy_policy_enabled?: boolean;
        terms_conditions_enabled?: boolean;
    };
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
        title_text?: string;
        footer_text?: string;
        privacyEnabled?: boolean;
        termsEnabled?: boolean;
        customPages?: Array<{
            slug: string;
            name: string;
        }>;
    };
}

interface PageProps {
    [key: string]: any;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    settings?: {
        faq_is_on?: string;
        knowledge_base_is_on?: string;
    };
    privacyPolicy?: {
        enabled: boolean;
    };
    termsConditions?: {
        enabled: boolean;
    };
    slug: string;
}

export default function SupportTicketLayout({
    children,
    title = 'Support Ticket',
    settings: layoutSettings,
    brandSettings,
}: SupportTicketLayoutProps) {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth, settings, privacyPolicy, termsConditions, slug } = usePage<PageProps>().props;

    const currentSettings = layoutSettings || settings;

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'SupportTicket');
    const currentYear = new Date().getFullYear();
    const logoUrl =
        brandSettings?.logo_dark && brandSettings.logo_dark.trim() !== ''
            ? brandSettings.logo_dark.startsWith('http')
                ? brandSettings.logo_dark
                : getImagePath(brandSettings.logo_dark)
            : getImagePath('packages/noble/SupportTicket/src/Resources/assets/images/logo.png');
    const faviconUrl =
        brandSettings?.favicon && brandSettings.favicon.trim() !== ''
            ? brandSettings.favicon.startsWith('http')
                ? brandSettings.favicon
                : getImagePath(brandSettings.favicon)
            : getImagePath('packages/noble/SupportTicket/src/Resources/assets/images/favicon.png');
    const siteTitle = brandSettings?.titleText || 'Support Ticket System';
    const footerText =
        brandSettings?.footerText ||
        `© ${new Date().getFullYear()} Noble Architecture Support System. All rights reserved.`;

    const navigationItems = [
        { name: t('Create Ticket'), href: route('support-ticket.index', [slug]), icon: Ticket },
        { name: t('Search Tickets'), href: route('support-ticket.search', [slug]), icon: Search },
    ];

    if (currentSettings?.knowledge_base_is_on === 'on') {
        navigationItems.push({
            name: t('Knowledge Base'),
            href: route('support-ticket.knowledge', [slug]),
            icon: Book,
        });
    }

    if (currentSettings?.faq_is_on === 'on') {
        navigationItems.push({ name: t('FAQ'), href: route('support-ticket.faq', [slug]), icon: HelpCircle });
    }

    return (
        <>
            <Head title={title}>
                <link rel="icon" type="image/x-icon" href={`${faviconUrl}?v=${Date.now()}`} />
            </Head>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            <div
                className="relative min-h-screen overflow-x-hidden font-sans"
                style={{
                    backgroundColor: '#14b8a614',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230284c7' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            >
                <div className="container relative z-10 mx-auto max-w-7xl px-4 py-4">
                    {/* Header */}
                    <header className="mb-10 md:mb-16">
                        <div className="mb-4 rounded-xl bg-foreground px-4 py-3 text-background shadow-lg">
                            <div className="flex items-center justify-between">
                                {/* Logo */}
                                <h1>
                                    <Link
                                        href={route('support-ticket.index', [slug])}
                                        className="flex max-w-[120px] items-center space-x-3 lg:max-w-none"
                                    >
                                        <img src={logoUrl} alt={siteTitle} className="h-8" />
                                    </Link>
                                </h1>

                                {/* Desktop Navigation */}
                                <div className="main-nav hidden flex-1 justify-center md:flex">
                                    <nav className="flex items-center gap-6">
                                        {navigationItems?.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="font-medium text-background transition duration-300 hover:text-muted-foreground/40"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contact Button */}
                                <div className="hidden md:block">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-card text-foreground hover:bg-muted"
                                        asChild
                                    >
                                        <Link href={route('support-ticket.contact', [slug])}>
                                            <Headphones className="me-2 h-4 w-4" />
                                            {t('Contact')}
                                        </Link>
                                    </Button>
                                </div>

                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-background md:hidden"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="mb-4 rounded-xl bg-card p-4 shadow-lg md:hidden">
                                <nav className="flex flex-col space-y-2">
                                    {navigationItems?.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center rounded-lg p-2 text-foreground transition duration-300 hover:text-foreground"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <item.icon className="me-2 h-4 w-4" /> {item.name}
                                        </Link>
                                    ))}
                                    <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-3">
                                        <Button size="sm" asChild>
                                            <Link href={route('support-ticket.contact', [slug])}>
                                                <Headphones className="me-2 h-4 w-4" /> {t('Contact')}
                                            </Link>
                                        </Button>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </header>

                    {/* Main Content */}
                    {children}

                    {/* Help Chat Button */}
                    <div className="fixed bottom-4 end-4 z-10 md:bottom-8 md:end-8">
                        <Button
                            className="h-14 w-14 rounded-full bg-foreground p-0 text-background shadow-lg transition-all duration-300 hover:scale-110 hover:bg-foreground"
                            aria-label="Get Help"
                            asChild
                        >
                            <Link href={route('support-ticket.contact', [slug])}>
                                <Headphones className="h-6 w-6" />
                            </Link>
                        </Button>
                    </div>

                    {/* Integration Widgets (Tawk.to, WhatsApp, etc.) */}
                    {integrationFields?.map((field) => (
                        <div key={field.id}>{field.component}</div>
                    ))}

                    {/* Footer */}
                    <footer className="mt-8 text-center text-sm text-muted-foreground md:mt-12">
                        <p>
                            {footerText
                                ? footerText.includes('©')
                                    ? footerText.replace(/©(\s*\d{4})?/, `© ${currentYear}`)
                                    : `© ${currentYear} ${footerText}`
                                : `© ${currentYear}`}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center space-x-4">
                            <Link
                                href={route('support-ticket.contact', [slug])}
                                className="transition-colors duration-200 hover:text-foreground"
                            >
                                {t('Contact Us')}
                            </Link>
                            {brandSettings?.customPages?.map((page: any) => (
                                <Link
                                    key={page.slug}
                                    href={route('support-ticket.custom-page', [slug, page.slug])}
                                    className="transition-colors duration-200 hover:text-foreground"
                                >
                                    {page.name}
                                </Link>
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
