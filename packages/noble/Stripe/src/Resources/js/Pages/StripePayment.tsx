import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface StripePaymentProps {
    stripe_session: {
        id: string;
    };
    stripe_key: string;
}

declare global {
    interface Window {
        Stripe: any;
    }
}

const StripePayment: React.FC<StripePaymentProps> = ({ stripe_session, stripe_key }) => {
    const { t } = useTranslation();
    
    useEffect(() => {
        if (stripe_session && stripe_key) {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => {
                const stripe = window.Stripe(stripe_key);
                stripe.redirectToCheckout({
                    sessionId: stripe_session.id
                }).then((result: any) => {
                    if (result.error) {
                        alert(result.error.message);
                    }
                });
            };
            document.head.appendChild(script);
        }
    }, [stripe_session, stripe_key]);

    return (
        <>
            <Head title={t('Stripe Payment')} />
            <div className="min-h-screen flex items-center justify-center bg-muted/50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{t('Redirecting to Stripe...')}</p>
                </div>
            </div>
        </>
    );
};

export default StripePayment;