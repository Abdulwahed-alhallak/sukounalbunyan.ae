import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Plus, Search, Ticket, Book } from 'lucide-react';

interface FaqItem {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

interface FaqProps {
    faqs: FaqItem[];
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
        faq?: {
            title: string;
            description: string;
        };
    };
    ctaSections?: {
        faq?: {
            title: string;
            description: string;
        };
    };
    slug: string;
}

export default function Faq({ faqs, settings, brandSettings, titleSections, ctaSections, slug }: FaqProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [openFaq, setOpenFaq] = useState<number>(-1);

    const pageTitle = titleSections?.faq?.title || 'Frequently Asked Questions';
    const pageDescription = titleSections?.faq?.description || 'Quick answers to the most common questions';
    const bottomTitle = ctaSections?.faq?.title || 'Still Have Questions?';
    const bottomDescription = ctaSections?.faq?.description || 'Our support team is ready to help';

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    return (
        <SupportTicketLayout title={pageTitle} settings={settings} brandSettings={brandSettings}>
            <Card className="mb-8 bg-foreground text-background">
                <CardContent className="p-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold">{pageTitle}</h2>
                    <p className="mb-6">{pageDescription}</p>

                    <div className="relative mx-auto max-w-2xl">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            placeholder={t('Search for questions...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-card py-3 ps-10 text-foreground"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="mx-auto max-w-4xl space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs?.map((faq, index) => (
                        <Card key={faq.id} className="overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className={`w-full p-5 text-start transition-all duration-300 focus:outline-none ${
                                    openFaq === index ? 'bg-foreground text-background' : 'bg-card hover:bg-muted/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{faq.title}</span>
                                    <Plus
                                        className={`h-5 w-5 transition-transform duration-300 ${
                                            openFaq === index ? 'rotate-45' : ''
                                        }`}
                                    />
                                </div>
                            </button>

                            {openFaq === index && (
                                <CardContent className="border-t bg-muted/50 p-5">
                                    <div
                                        className="text-foreground"
                                        dangerouslySetInnerHTML={{ __html: faq.description }}
                                    />
                                </CardContent>
                            )}
                        </Card>
                    ))
                ) : (
                    <Card className="p-8 text-center">
                        <HelpCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-xl font-semibold text-muted-foreground">{t('No FAQs Found')}</h3>
                        <p className="text-muted-foreground">
                            {t('There are no frequently asked questions available at the moment.')}
                        </p>
                    </Card>
                )}
            </div>

            {/* Still Have Questions Section */}
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
                                {settings.knowledge_base_is_on === 'on' && (
                                    <Button
                                        variant="outline"
                                        className="border-2 border-white/20 bg-card/20 text-background hover:bg-card/30"
                                        asChild
                                    >
                                        <Link href={route('support-ticket.knowledge', [slug])}>
                                            <Book className="me-2 h-4 w-4" />
                                            {t('Browse Knowledge Base')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full justify-center md:w-1/3">
                            <div className="relative h-48 w-48 md:h-56 md:w-56">
                                <img
                                    src={getImagePath(
                                        'packages/noble/SupportTicket/src/Resources/assets/images/faq-image.svg'
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
