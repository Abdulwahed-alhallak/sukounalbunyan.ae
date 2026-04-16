import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Eye } from 'lucide-react';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

// Import section components
import General from './cms/General';
import Hero from './cms/Hero';
import Header from './cms/Header';
import Features from './cms/Features';
import Stats from './cms/Stats';
import Modules from './cms/Modules';
import Benefits from './cms/Benefits';
import Gallery from './cms/Gallery';
import CTA from './cms/CTA';
import Footer from './cms/Footer';
import Order from './cms/Order';
import Colors from './cms/Colors';
import Pricing from './cms/Pricing';
import { LandingPreview } from './cms/LandingPreview';

interface LandingPageSetting {
    id?: number;
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    config_sections?: any;
}

interface CustomPage {
    id: number;
    title: string;
    slug: string;
}

interface SettingsProps {
    [key: string]: any;
    settings: LandingPageSetting;
    customPages: CustomPage[];
}

export default function Settings({ settings = {}, customPages = [] }: SettingsProps) {
    const { t } = useTranslation();
    const { auth } = usePage<{ auth: { user: any } }>().props;

    if (!auth.user?.permissions?.includes('manage-landing-page')) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground">{t('You do not have permission to access this page.')}</p>
            </div>
        );
    }

    const [activeTab, setActiveTab] = useState<'setup' | 'layout' | 'content' | 'social' | 'engagement' | 'page'>(
        'setup'
    );
    const [activeSection, setActiveSection] = useState<
        | 'general'
        | 'header'
        | 'hero'
        | 'stats'
        | 'features'
        | 'modules'
        | 'benefits'
        | 'gallery'
        | 'cta'
        | 'footer'
        | 'order'
        | 'colors'
        | 'pricing'
    >('general');
    const [isLoading, setIsLoading] = useState(false);

    // Ensure settings is never undefined to prevent crashes
    const safeSettings = settings || {};

    const { data, setData, post, put, processing, reset } = useForm({
        company_name: safeSettings.company_name || '',
        contact_email: safeSettings.contact_email || '',
        contact_phone: safeSettings.contact_phone || '',
        contact_address: safeSettings.contact_address || '',
        config_sections: safeSettings.config_sections || {
            sections: {},
            section_visibility: {
                header: true,
                hero: true,
                stats: true,
                features: true,
                modules: true,
                benefits: true,
                gallery: true,
                cta: true,
                footer: true,
                pricing: true,
            },
            section_order: ['header', 'hero', 'stats', 'features', 'modules', 'benefits', 'gallery', 'cta', 'footer'],
        },
    });

    const getSectionData = (key: string) => {
        return data.config_sections?.sections?.[key] || {};
    };

    const updateSectionData = (key: string, updates: any) => {
        const currentSections = { ...data.config_sections?.sections };
        currentSections[key] = { ...currentSections[key], ...updates };

        setData('config_sections', {
            ...data.config_sections,
            sections: currentSections,
        });
    };

    const updateSectionVisibility = (sectionKey: string, visible: boolean) => {
        setData('config_sections', {
            ...data.config_sections,
            section_visibility: { ...data.config_sections?.section_visibility, [sectionKey]: visible },
        });
    };

    const saveSettings = () => {
        setIsLoading(true);

        post(route('landing-page.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsLoading(false);
                const props = page.props as any;
                if (props.flash?.success) {
                    toast.success(props.flash.success);
                }
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error(t('Failed to save settings'));
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            <Head title={t('Landing Page Settings')} />
            <div className="flex items-center justify-between mb-8">
                <div>
                   {/* Header text removed as it is handled by the unified settings label */}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            try {
                                // @ts-ignore
                                const routeName =
                                    typeof route !== 'undefined' && route().has('landing.page')
                                        ? 'landing.page'
                                        : typeof route !== 'undefined' && route().has('landing_page.index')
                                          ? 'landing_page.index'
                                          : null;
                                if (routeName) {
                                    window.open(route(routeName), '_blank');
                                } else {
                                    window.open('/', '_blank');
                                }
                            } catch (e) {
                                window.open('/', '_blank');
                            }
                        }}
                    >
                        <Eye className="me-2 h-4 w-4" />
                        {t('View Landing Page')}
                    </Button>
                    {auth.user?.permissions?.includes('edit-landing-page') && (
                        <Button
                            onClick={saveSettings}
                            disabled={isLoading}
                            className="text-white"
                            style={{ backgroundColor: 'hsl(var(--primary))' }}
                        >
                            <Save className="me-2 h-4 w-4" />
                            {isLoading ? t('Saving...') : t('Save Changes')}
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-3">
                        {/* Tab Navigation */}
                        <div className="mb-8 flex border-b border-border">
                            {[
                                { key: 'setup', label: t('Setup'), sections: ['general', 'order', 'colors'] },
                                { key: 'layout', label: t('Layout'), sections: ['header', 'hero', 'footer'] },
                                { key: 'content', label: t('Content'), sections: ['features', 'modules', 'benefits'] },
                                { key: 'social', label: t('Social'), sections: ['stats', 'gallery'] },
                                { key: 'engagement', label: t('Engagement'), sections: ['cta'] },
                                { key: 'page', label: t('Page'), sections: ['pricing'] },
                            ]?.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setActiveTab(tab.key as any);
                                        setActiveSection(tab.sections[0] as any);
                                    }}
                                    className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                                        activeTab === tab.key
                                            ? 'rounded-t-lg text-background'
                                            : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    }`}
                                    style={
                                        activeTab === tab.key
                                            ? {
                                                  backgroundColor: 'hsl(var(--primary))',
                                                  borderColor: 'hsl(var(--primary))',
                                              }
                                            : {}
                                    }
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Section Navigation within Tab */}
                        <div className="mb-8 flex flex-wrap gap-2">
                            {(() => {
                                const tabSections = {
                                    setup: [
                                        { key: 'general', label: t('General') },
                                        { key: 'order', label: t('Order') },
                                        { key: 'colors', label: t('Colors') },
                                    ],
                                    layout: [
                                        { key: 'header', label: t('Header') },
                                        { key: 'hero', label: t('Hero') },
                                        { key: 'footer', label: t('Footer') },
                                    ],
                                    content: [
                                        { key: 'features', label: t('Features') },
                                        { key: 'modules', label: t('Modules') },
                                        { key: 'benefits', label: t('Benefits') },
                                    ],
                                    social: [
                                        { key: 'stats', label: t('Stats') },
                                        { key: 'gallery', label: t('Gallery') },
                                    ],
                                    engagement: [{ key: 'cta', label: t('CTA') }],
                                    page: [{ key: 'pricing', label: t('Pricing') }],
                                };
                                return tabSections[activeTab]?.map((section) => (
                                    <Button
                                        key={section.key}
                                        variant={activeSection === section.key ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveSection(section.key as any)}
                                        style={
                                            activeSection === section.key
                                                ? {
                                                      backgroundColor: 'hsl(var(--primary))',
                                                      borderColor: 'hsl(var(--primary))',
                                                      color: 'white',
                                                  }
                                                : {}
                                        }
                                    >
                                        {section.label}
                                    </Button>
                                ));
                            })()}
                        </div>

                        {/* Section Components */}
                        {activeSection === 'general' && (
                            <General data={data} updateSectionData={(field, value) => setData(field as any, value)} />
                        )}

                        {activeSection === 'hero' && (
                            <Hero
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'features' && (
                            <Features
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'header' && (
                            <Header
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                                customPages={customPages || []}
                            />
                        )}

                        {activeSection === 'stats' && (
                            <Stats
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'modules' && (
                            <Modules
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'benefits' && (
                            <Benefits
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'gallery' && (
                            <Gallery
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'cta' && (
                            <CTA
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}

                        {activeSection === 'footer' && (
                            <Footer
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                                customPages={customPages || []}
                            />
                        )}

                        {activeSection === 'order' && (
                            <Order data={data} setData={setData} updateSectionVisibility={updateSectionVisibility} />
                        )}

                        {activeSection === 'colors' && (
                            <Colors
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                                setData={setData}
                            />
                        )}

                        {activeSection === 'pricing' && (
                            <Pricing
                                data={data}
                                getSectionData={getSectionData}
                                updateSectionData={updateSectionData}
                                updateSectionVisibility={updateSectionVisibility}
                            />
                        )}
                    </div>

                    {/* Live Preview Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('Live Preview')}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <LandingPreview settings={data} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
