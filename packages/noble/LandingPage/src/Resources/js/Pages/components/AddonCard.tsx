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
        <div className="group relative flex flex-col p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                    <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                    {addon.name}
                </h3>
                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                    {addon.description}
                </p>
            </div>

            <div className="mt-auto">
                <div className="mb-6">
                    {displayPrice ? (
                        <div className="flex items-baseline">
                            <span className="text-2xl font-black text-white">{formatAdminCurrency(displayPrice)}</span>
                            <span className="text-neutral-500 text-sm ml-1 font-medium">{priceLabel}</span>
                        </div>
                    ) : (
                        <span className="text-lg font-bold text-white tracking-tight">{t('Free')}</span>
                    )}
                </div>

                <Button 
                    onClick={onViewDetails}
                    className="w-full bg-white text-black hover:bg-neutral-200 font-bold rounded-xl transition-all h-11"
                >
                    {t('View Details')}
                </Button>
            </div>
        </div>
    );
}