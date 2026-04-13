import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImagePath } from '@/utils/helpers';
import {
    Building,
    Users,
    Briefcase,
    ChevronDown,
    ChevronRight,
    Network,
    GitBranch,
    User,
    MapPin,
    Minimize2,
    Maximize2,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from 'lucide-react';

interface OrgNode {
    id: number | string;
    user_id?: number;
    employee_id?: string;
    name: string;
    name_ar?: string;
    avatar?: string;
    department?: string;
    department_id?: number;
    designation?: string;
    branch?: string;
    job_title?: string;
    line_manager?: number;
    isDepartment?: boolean;
    employee_count?: number;
    children: OrgNode[];
}

interface OrgChartProps {
    orgTree: OrgNode[];
    employees: Array<{
        id: number;
        user_id: number;
        employee_id: string;
        name: string;
        name_ar?: string;
        avatar?: string;
        department?: string;
        designation?: string;
        branch?: string;
        line_manager?: number;
        job_title?: string;
    }>;
    departments: Array<{
        id: number;
        name: string;
        branch?: string;
        employee_count: number;
    }>;
    stats: {
        total_employees: number;
        total_departments: number;
        total_branches: number;
        with_manager: number;
        without_manager: number;
    };
}

// Individual Org Node Component
function OrgNodeCard({ node, depth = 0, isCollapsible = true }: { node: OrgNode; depth?: number; isCollapsible?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(depth < 2);
    const { t } = useTranslation();
    const hasChildren = node.children && node.children.length > 0;

    const initials = node.name
        ?.split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || '?';

    return (
        <div className="flex flex-col items-center">
            {/* Node Card */}
            <div
                className={`relative group cursor-pointer transition-all duration-300 ${
                    node.isDepartment
                        ? 'w-56 p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-2 border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10'
                        : 'w-52 p-3 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
                }`}
                onClick={() => hasChildren && isCollapsible && setIsExpanded(!isExpanded)}
            >
                {node.isDepartment ? (
                    /* Department Node */
                    <div className="text-center">
                        <div className="mx-auto h-14 w-14 mb-2 rounded-2xl bg-primary/15 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                            <Building className="h-7 w-7" />
                        </div>
                        <h4 className="font-black text-sm text-foreground uppercase tracking-tight leading-tight">{node.name}</h4>
                        {node.branch && (
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> {node.branch}
                            </p>
                        )}
                        <Badge variant="outline" className="mt-2 text-[9px] font-black bg-primary/10 text-primary border-primary/20 px-2">
                            {node.employee_count || node.children?.length || 0} {t('Members')}
                        </Badge>
                    </div>
                ) : (
                    /* Employee Node */
                    <div className="text-center">
                        <Avatar className="mx-auto h-12 w-12 mb-2 border-2 border-muted shadow-sm group-hover:border-primary/40 transition-colors">
                            <AvatarImage src={getImagePath(node.avatar || 'avatar.png')} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{initials}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-bold text-xs text-foreground leading-tight truncate">{node.name}</h4>
                        {node.name_ar && (
                            <p className="text-[10px] text-muted-foreground font-medium truncate" dir="rtl">{node.name_ar}</p>
                        )}
                        {(node.designation || node.job_title) && (
                            <p className="text-[9px] font-bold text-primary mt-1 flex items-center justify-center gap-1 truncate">
                                <Briefcase className="h-2.5 w-2.5 flex-shrink-0" />
                                <span className="truncate">{node.designation || node.job_title}</span>
                            </p>
                        )}
                        {node.department && (
                            <p className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider truncate">{node.department}</p>
                        )}
                    </div>
                )}

                {/* Expand/Collapse indicator */}
                {hasChildren && isCollapsible && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground shadow-sm group-hover:border-primary/40 group-hover:text-primary transition-colors z-20">
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </div>
                )}
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="relative pt-8 mt-1">
                    {/* Vertical connector from parent */}
                    <div className="absolute top-0 left-1/2 w-[2px] h-8 bg-gradient-to-b from-primary/40 to-primary/10 -translate-x-1/2" />

                    <div className="flex gap-4 justify-center relative">
                        {/* Horizontal connector line */}
                        {node.children.length > 1 && (
                            <div
                                className="absolute top-0 h-[2px] bg-primary/20"
                                style={{
                                    left: `calc(50% - ${(node.children.length - 1) * 56}px)`,
                                    right: `calc(50% - ${(node.children.length - 1) * 56}px)`,
                                }}
                            />
                        )}

                        {node.children.map((child, idx) => (
                            <div key={child.id || idx} className="relative pt-6 flex flex-col items-center">
                                {/* Vertical line to each child */}
                                <div className="absolute top-0 left-1/2 w-[2px] h-6 bg-primary/20 -translate-x-1/2" />
                                <OrgNodeCard node={child} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrgChartIndex({ orgTree, employees, departments, stats }: OrgChartProps) {
    const { t } = useTranslation();
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 15, 150));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 15, 40));
    const handleResetZoom = () => setZoom(100);

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Organizational Chart') }]}
            pageTitle={t('Organizational Chart')}
        >
            <Head title={t('Organizational Chart')} />

            <div className="space-y-6">
                {/* Header Stats Bar */}
                <div className="premium-card p-6 border border-border/30 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                                <Network className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight uppercase">{t('Organizational Hierarchy')}</h1>
                                <p className="text-sm text-muted-foreground font-medium">{t('Interactive personnel command structure visualization.')}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: t('Personnel'), value: stats.total_employees, icon: Users },
                                { label: t('Departments'), value: stats.total_departments, icon: Building },
                                { label: t('Branches'), value: stats.total_branches, icon: MapPin },
                                { label: t('Linked'), value: stats.with_manager, icon: GitBranch },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/50">
                                    <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-black text-foreground">{stat.value}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={handleZoomOut}>
                            <ZoomOut className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-xs font-black text-muted-foreground min-w-[3rem] text-center">{zoom}%</span>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={handleZoomIn}>
                            <ZoomIn className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-[10px] font-bold" onClick={handleResetZoom}>
                            <RotateCcw className="h-3 w-3 mr-1" /> {t('Reset')}
                        </Button>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-muted/30">
                        {orgTree.length} {t('Root Nodes')}
                    </Badge>
                </div>

                {/* Org Tree Canvas */}
                <div className="premium-card border border-border/20 overflow-hidden relative">
                    <div
                        className="w-full overflow-auto pb-16 pt-12 cursor-grab active:cursor-grabbing min-h-[500px]"
                        style={{
                            backgroundImage: 'radial-gradient(hsl(var(--primary) / 0.08) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    >
                        <div
                            className="min-w-max flex justify-center px-12 transition-transform duration-200"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                        >
                            {orgTree.length === 1 ? (
                                <OrgNodeCard node={orgTree[0]} depth={0} />
                            ) : (
                                <div className="flex gap-12">
                                    {orgTree.map((rootNode, idx) => (
                                        <OrgNodeCard key={rootNode.id || idx} node={rootNode} depth={0} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Department Summary Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                    {departments.map((dept) => (
                        <div key={dept.id} className="premium-card p-4 border border-border/20 hover:border-primary/30 transition-all group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Building className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold truncate">{dept.name}</h4>
                                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                                        {dept.branch && <span className="flex items-center gap-0.5"><MapPin className="h-2 w-2" /> {dept.branch}</span>}
                                        <span>•</span>
                                        <span>{dept.employee_count} {t('staff')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
