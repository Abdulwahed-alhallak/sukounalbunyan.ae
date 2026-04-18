import {
    Users,
    Tag,
    Briefcase,
    MapPin,
    HelpCircle,
    Megaphone,
    MessageCircle,
    Calendar,
    MessageSquare,
    ClipboardCheck,
    FileText,
    CheckCircle,
    UserCheck,
} from 'lucide-react';

export const recruitmentCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Recruitment Dashboard'),
        href: route('recruitment.index'),
        permission: 'manage-recruitment-dashboard',
        parent: 'dashboard',
        order: 35,
    },
    {
        title: t('Recruitment'),
        icon: Users,
        permission: 'manage-recruitment',
        order: 453,
        children: [
            {
                title: t('Job Locations'),
                href: '/recruitment/job-locations',
                permission: 'manage-job-locations',
            },
            {
                title: t('Custom Questions'),
                href: '/recruitment/custom-questions',
                permission: 'manage-custom-questions',
            },
            {
                title: t('Job Postings'),
                href: '/recruitment/job-postings',
                permission: 'manage-job-postings',
            },
            {
                title: t('Candidates'),
                href: '/recruitment/candidates',
                permission: 'manage-candidates',
            },
            {
                title: t('Interview Rounds'),
                href: '/recruitment/interview-rounds',
                permission: 'manage-interview-rounds',
            },
            {
                title: t('Interviews'),
                href: '/recruitment/interviews',
                permission: 'manage-interviews',
            },
            {
                title: t('Interview Feedback'),
                href: '/recruitment/interview-feedbacks',
                permission: 'manage-interview-feedbacks',
            },
            {
                title: t('Candidate Assessments'),
                href: '/recruitment/candidate-assessments',
                permission: 'manage-candidate-assessments',
            },
            {
                title: t('Offers'),
                href: '/recruitment/offers',
                permission: 'manage-offers',
            },
            {
                title: t('Checklist Items'),
                href: '/recruitment/checklist-items',
                permission: 'manage-checklist-items',
            },
            {
                title: t('Candidate Onboarding'),
                href: '/recruitment/candidate-onboardings',
                permission: 'manage-candidate-onboardings',
            },
            {
                title: t('System Setup'),
                href: '/recruitment/job-categories',
                permission: 'manage-recruitment-system-setup',
            },
        ],
    },
];
