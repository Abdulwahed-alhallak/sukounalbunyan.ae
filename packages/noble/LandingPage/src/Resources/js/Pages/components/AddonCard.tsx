import { Button } from '@/components/ui/button';
import { formatAdminCurrency } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';

interface AddonCardProps {
    addon: {
        id: number;
        name: string;
        description?: string;
        image?: string;
        monthly_price?: number;
        yearly_price?: number;
        package_name: string;
    };
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    priceType?: 'monthly' | 'yearly';
    variant?: string; // Kept for compatibility but ignored for design
    onViewDetails?: () => void;
}

export default function AddonCard({ addon, priceType = 'monthly', onViewDetails }: AddonCardProps) {
    const { t } = useTranslation();
    const displayPrice = priceType === 'yearly' ? addon.yearly_price : addon.monthly_price;
    const priceLabel = priceType === 'yearly' ? '/yr' : '/mo';

    return (
        <div className="group relative flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/60">
            <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 transition-colors group-hover:bg-white group-hover:text-black">
                    <Package className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-white">
                    {addon.name}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">{addon.description}</p>
            </div>

            <div className="mt-auto">
                <div className="mb-6">
                    {displayPrice ? (
                        <div className="flex items-baseline">
                            <span className="text-2xl font-black text-white">{formatAdminCurrency(displayPrice)}</span>
                            <span className="ms-1 text-sm font-medium text-neutral-500">{priceLabel}</span>
                        </div>
                    ) : (
                        <span className="text-lg font-bold tracking-tight text-white">{t('Free')}</span>
                    )}
                </div>

                <Button
                    onClick={onViewDetails}
                    className="h-11 w-full rounded-xl bg-white font-bold text-black transition-all hover:bg-neutral-200"
                >
                    {t('View Details')}
                </Button>
            </div>
        </div>
    );
}
