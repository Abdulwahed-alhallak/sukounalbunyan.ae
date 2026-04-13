import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface BenefitsProps {
    settings?: any;
}

export default function Benefits({ settings }: BenefitsProps) {
    const sectionData = settings?.config_sections?.sections?.benefits || {};
    const title = sectionData.title || 'Why ChooseNobleArchitecture?';
    const [openAccordion, setOpenAccordion] = useState(0);

    const defaultBenefits = [
        {
            title: 'Unified Business Ecosystem',
            description:
                'Breakdown silos between your business functions. Our integrated modules for HRM, Accounting, CRM, Projects, and POS work in perfect harmony to provide a unified data source for your entire enterprise.',
        },
        {
            title: 'Strategic Human Resource Management',
            description:
                'Transform your workforce management. Efficiently handle recruitment, onboarding, and attendance while ensuring compliant payroll processing. Empower your team with self-service portals and performance tracking.',
        },
        {
            title: 'Professional Financial Precision',
            description:
                'Ensure absolute accuracy with our robust accounting system. Automate billing cycles, reconcile bank transactions, and manage assets with enterprise-grade precision, providing a crystal-clear view of your financial health.',
        },
        {
            title: 'Dynamic Project & Task Mastery',
            description:
                'Deliver projects on time and within budget. Visualize complex workflows with Kanban boards and Gantt charts, enabling seamless collaboration. Track milestones and allocate resources effectively for maximum productivity.',
        },
    ];

    const benefits = sectionData.benefits?.length > 0 ? sectionData.benefits : defaultBenefits;

    return (
        <section className="border-b border-neutral-800 bg-black py-32 text-white">
            <div className="mx-auto max-w-4xl px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">{title}</h2>
                    <p className="text-lg text-neutral-400">The advantages of moving to a unified architecture</p>
                </div>

                <div className="space-y-4">
                    {benefits?.map((benefit: any, index: number) => (
                        <div key={index} className="overflow-hidden border-b border-neutral-800">
                            <button
                                onClick={() => setOpenAccordion(openAccordion === index ? -1 : index)}
                                className="group flex w-full items-center justify-between py-6 text-left transition-colors hover:text-neutral-300"
                            >
                                <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-neutral-300 md:text-2xl">
                                    {benefit.title}
                                </span>
                                <Plus
                                    className={`h-6 w-6 text-neutral-500 transition-transform duration-300 ${openAccordion === index ? 'rotate-45 text-white' : ''}`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden text-lg leading-relaxed text-neutral-400 transition-all duration-300 ${openAccordion === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                {benefit.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
