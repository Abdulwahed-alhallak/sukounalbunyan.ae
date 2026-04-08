import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Briefcase, ArrowLeft, CheckCircle2, Clock, Users } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    tasks_count: number;
    description: string | null;
}

interface Props {
    projects: { data: Project[]; total: number; links: any[] };
}

const statusBadge: Record<string, string> = {
    active: 'text-foreground bg-muted',
    completed: 'text-muted-foreground bg-muted',
    on_hold: 'text-muted-foreground bg-muted',
    archived: 'text-muted-foreground bg-muted/50',
};

export default function PortalProjects({ projects }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Portal'), url: route('portal.dashboard') }, { label: t('Projects') }]}>
            <Head title={t('My Projects')} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={route('portal.dashboard')} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('My Projects')}</h1>
                        <p className="text-sm text-muted-foreground">{projects?.total || 0} {t('projects')}</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(projects?.data || []).length === 0 ? (
                        <div className="col-span-full flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
                            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold text-foreground">{t('No projects found')}</h3>
                        </div>
                    ) : (projects.data).map(project => (
                        <div key={project.id} className="group rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-md">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-semibold text-foreground">{project.name}</h3>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[project.status] || statusBadge.active}`}>
                                    {project.status}
                                </span>
                            </div>
                            {project.description && <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{project.description}</p>}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> {project.tasks_count} {t('tasks')}
                                </span>
                                {project.end_date && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {project.end_date}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
