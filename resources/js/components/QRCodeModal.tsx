import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export function QRCodeModal({ isOpen, onClose, url, title }: QRCodeModalProps) {
    const { t } = useTranslation();
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        if (isOpen && url) {
            QRCode.toDataURL(url, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            })
                .then((dataUrl) => {
                    setQrUrl(dataUrl);
                })
                .catch((err) => {
                    console.error('Error generating QR code:', err);
                });
        }
    }, [isOpen, url]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-foreground/10 p-2">
                            <QrCode className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                            <p className="text-sm text-muted-foreground">{t('Scan to submit work request')}</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-64 w-64 items-center justify-center rounded border border-border bg-background">
                            {qrUrl ? (
                                <img src={qrUrl} alt="QR Code" className="h-full w-full object-contain" />
                            ) : (
                                <p className="text-muted-foreground">{t('Loading QR code...')}</p>
                            )}
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            {t('Point your camera at the QR code to open the work request form')}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
