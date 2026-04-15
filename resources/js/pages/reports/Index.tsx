import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    BarChart3,
    DollarSign,
    Users,
    Target,
    Briefcase,
    CreditCard,
    Shield,
    TrendingUp,
    Clock,
    ShoppingCart,
    Receipt,
    CalendarCheck,
    CalendarOff,
    UserMinus,
    Filter,
    GitBranch,
    PieChart,
    Activity,
    CheckSquare,
    AlertTriangle,
    CalendarDays,
    Star,
    ArrowRight,
    FileText,
} from 'lucide-react';

interface ReportItem {
    key: string;
    label: string;
    description: string;
    icon: string;
}

interface ReportCategory {
    category: string;
    category_label: string;
    category_icon: string;
    items: ReportItem[];
}

interface Props {
    reports: ReportCategory[];
}

const iconMap: Record<string, any> = {
    DollarSign,
    Users,
    Target,
    Briefcase,
    CreditCard,
    Shield,
    TrendingUp,
    Clock,
    ShoppingCart,
    Receipt,
    CalendarCheck,
    CalendarOff,
    UserMinus,
    Filter,
    GitBranch,
    PieChart,
    Activity,
    CheckSquare,
    AlertTriangle,
    CalendarDays,
    Star,
    BarChart3,
    FileText,
};

const categoryColors: Record<string, { gradient: string; shadow: string; text: string }> = {
    financial: { gradient: '', shadow: '', text: 'text-foreground' },
    hrm: { gradient: '', shadow: '', text: 'text-foreground' },
    crm: { gradient: '', shadow: '', text: 'text-foreground' },
    project: { gradient: '', shadow: '', text: 'text-foreground' },
    pos: { gradient: '', shadow: '', text: 'text-foreground' },
    platform: { gradient: '', shadow: '', text: 'text-foreground' },
};

export default function ReportsIndex({ reports }: Props) {
    const { t } = useTranslation();

    const getIcon = (name: string) => iconMap[name] || FileText;

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Report Center') }]} pageTitle={t('Report Center')}>
            <Head title={t('Report Center')} />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-foreground/5">
                        <BarChart3 className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('Report Center')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('Generate and export reports across all modules')}
                        </p>
                    </div>
                </div>

                {/* Report Categories */}
                {reports.map((category) => {
                    const colors = categoryColors[category.category] || categoryColors.financial;
                    const CategoryIcon = getIcon(category.category_icon);

                    return (
                        <div key={category.category} className="space-y-4">
                            {/* Category Header */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-foreground/5">
                                    <CategoryIcon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-lg font-semibold text-foreground">{t(category.category_label)}</h2>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    {category.items.length} {t('reports')}
                                </span>
                            </div>

                            {/* Report Cards Grid */}
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {category.items.map((report) => {
                                    const ReportIcon = getIcon(report.icon);
                                    return (
                                        <Link
                                            key={report.key}
                                            href={route('reports.generate', report.key)}
                                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/30 hover:shadow-lg hover:shadow-primary/5"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-foreground/5">
                                                    <ReportIcon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition group-hover:translate-x-1 group-hover:text-foreground" />
                                            </div>
                                            <h3 className="mt-3 text-sm font-semibold text-foreground transition group-hover:text-foreground">
                                                {t(report.label)}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {t(report.description)}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {reports.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center">
                        <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/30" />
                        <h3 className="text-lg font-semibold text-foreground">{t('No reports available')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('Reports will appear based on your active modules')}
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
