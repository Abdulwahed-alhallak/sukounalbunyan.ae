import { useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Menu, X, Ticket, Search, Book, HelpCircle, UserCircle, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SupportTicketLayoutProps {
    [key: string]: any;
    children: ReactNode;
    title?: string;
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
}

export default function Layout({ children, title = 'Support Ticket', brandSettings }: SupportTicketLayoutProps) {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title={title}>
                <link
                    rel="icon"
                    type="image/png"
                    href={
                        brandSettings?.favicon ||
                        '/packages/noble/SupportTicket/src/Resources/assets/images/favicon.png'
                    }
                />
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
                            <div className="flex flex-wrap items-center justify-between">
                                {/* Logo */}
                                <h1>
                                    <a href="#" className="flex max-w-[120px] items-center space-x-3 lg:max-w-none">
                                        <img
                                            src={
                                                brandSettings?.logo_dark ||
                                                '/packages/noble/SupportTicket/src/Resources/assets/images/logo.png'
                                            }
                                            alt="Sukoun Albunyan Support"
                                            className="h-8"
                                        />
                                    </a>
                                </h1>

                                {/* Desktop Navigation */}
                                <div className="main-nav hidden md:block">
                                    <nav className="flex flex-wrap justify-center md:gap-3 lg:gap-4">
                                        <a
                                            href="#"
                                            className="flex items-center font-medium text-background transition duration-300 hover:text-muted-foreground/40 lg:text-lg"
                                        >
                                            {t('Create Ticket')}
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center font-medium text-background transition duration-300 hover:text-muted-foreground/40 lg:text-lg"
                                        >
                                            {t('Search Tickets')}
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center font-medium text-background transition duration-300 hover:text-muted-foreground/40 lg:text-lg"
                                        >
                                            {t('Knowledge Base')}
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center font-medium text-background transition duration-300 hover:text-muted-foreground/40 lg:text-lg"
                                        >
                                            {t('FAQ')}
                                        </a>
                                    </nav>
                                </div>

                                {/* Action Buttons */}
                                <div className="hidden items-center space-x-3 md:flex">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-card text-foreground hover:bg-muted"
                                    >
                                        <UserCircle className="me-2 h-4 w-4" />
                                        {t('Sign In')}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-card text-foreground hover:bg-muted"
                                    >
                                        <Headphones className="me-2 h-4 w-4" />
                                        {t('Contact')}
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
                                    <a
                                        href="#"
                                        className="flex items-center rounded-lg p-2 text-foreground transition duration-300"
                                    >
                                        <Ticket className="me-2 h-4 w-4" /> {t('Create Ticket')}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center rounded-lg p-2 text-foreground transition duration-300 hover:text-foreground"
                                    >
                                        <Search className="me-2 h-4 w-4" /> {t('Search Tickets')}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center rounded-lg p-2 text-foreground transition duration-300 hover:text-foreground"
                                    >
                                        <Book className="me-2 h-4 w-4" /> {t('Knowledge Base')}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center rounded-lg p-2 text-foreground transition duration-300 hover:text-foreground"
                                    >
                                        <HelpCircle className="me-2 h-4 w-4" /> {t('FAQ')}
                                    </a>
                                    <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-3">
                                        <Button size="sm">
                                            <UserCircle className="me-2 h-4 w-4" /> {t('Sign In')}
                                        </Button>
                                        <Button size="sm">
                                            <Headphones className="me-2 h-4 w-4" /> {t('Contact')}
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
                        >
                            <Headphones className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-center text-sm text-muted-foreground md:mt-12">
                        <p>
                            {t(`© ${new Date().getFullYear()} Sukoun Albunyan Support System. All rights reserved.`)}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center space-x-4">
                            <a href="#" className="transition-colors duration-200 hover:text-foreground">
                                {t('Privacy Policy')}
                            </a>
                            <a href="#" className="transition-colors duration-200 hover:text-foreground">
                                {t('Terms of Service')}
                            </a>
                            <a href="#" className="transition-colors duration-200 hover:text-foreground">
                                {t('Contact Us')}
                            </a>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
