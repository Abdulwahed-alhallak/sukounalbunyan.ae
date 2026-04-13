import { useRef, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { getImagePath } from '@/utils/helpers';

interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Job {
    id: number;
    title: string;
    job_type?: string;
    location?: string;
}

interface Department {
    id: number;
    department_name: string;
}

interface ApprovedBy {
    id: number;
    name: string;
}

interface Offer {
    id: number;
    candidate: Candidate;
    job: Job;
    department?: Department;
    approvedBy?: ApprovedBy;
    position: string;
    salary?: number;
    bonus?: number;
    equity?: string;
    benefits?: string;
    start_date?: string;
    expiration_date?: string;
    offer_date?: string;
    status: string;
    approval_status: string;
}

interface CompanySettings {
    company_name?: string;
    logo_light?: string;
    logo_dark?: string;
    favicon?: string;
}

interface OfferLetterPdfProps {
    offer: Offer;
    companyName: string;
    companySettings: CompanySettings;
    templateContent: string;
}

export default function OfferLetterPdf() {
    const { t } = useTranslation();
    const { offer, companyName, companySettings, templateContent } = usePage<OfferLetterPdfProps>().props;
    const printRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = () => {
        if (!printRef.current) return;

        setIsDownloading(true);
        const candidateName = offer.candidate.first_name + ' ' + offer.candidate.last_name;
        const filename = `offer-letter-${candidateName.replace(/\s+/g, '-').toLowerCase()}.pdf`;

        const element = printRef.current;
        const opt = {
            margin: 0.5,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                setIsDownloading(false);
            });
    };

    useEffect(() => {
        // Auto download on component mount
        setTimeout(() => {
            downloadPDF();
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-muted py-8">
            <Head title={t('Offer Letter')} />

            <div className="mx-auto max-w-4xl px-4">
                <div className="mb-6 text-center">
                    <Button
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="bg-foreground hover:bg-foreground/80"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloading ? t('Downloading...') : t('Download PDF')}
                    </Button>
                </div>

                <div ref={printRef} className="overflow-hidden rounded-lg bg-card shadow-lg">
                    <div className="p-8">
                        {/* Company Header */}
                        <div className="mb-8 flex items-center">
                            {companySettings.logo_dark && (
                                <img
                                    src={getImagePath(companySettings.logo_dark)}
                                    alt={companyName}
                                    className="mr-4 h-12"
                                />
                            )}
                        </div>

                        {/* Offer Letter Content */}
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: templateContent }} />

                        {/* Footer */}
                        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                            <p>
                                {t('Generated on')} {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
