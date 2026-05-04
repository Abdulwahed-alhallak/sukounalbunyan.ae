import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RentalScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RentalScannerModal({ isOpen, onClose }: RentalScannerModalProps) {
    const { t } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Give the DOM a moment to render the dialog content
            const timer = setTimeout(() => {
                try {
                    scannerRef.current = new Html5QrcodeScanner(
                        "qr-reader",
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        false
                    );
                    scannerRef.current.render(onScanSuccess, onScanFailure);
                } catch (e) {
                    console.error("Scanner initialization failed:", e);
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear();
                } catch (e) {
                    console.error("Scanner clear failed:", e);
                }
                scannerRef.current = null;
            }
        }
    }, [isOpen]);

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        if (isScanning) return;
        
        setIsScanning(true);
        
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }

        toast.success(t('Code scanned! Processing...'));

        router.post(route('rental.scan-qr-process'), { qr_code: decodedText }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsScanning(false);
                onClose();
            },
            onError: () => {
                setIsScanning(false);
                toast.error(t('Invalid code or contract not found.'));
                // Restart scanner if needed or close
                onClose();
            }
        });
    };

    const onScanFailure = (error: any) => {
        // handle scan failure, usually better to ignore and keep scanning
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('Warehouse Smart Scanner')}</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col items-center justify-center p-4">
                    {isScanning ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">{t('Processing scan...')}</p>
                        </div>
                    ) : (
                        <div id="qr-reader" className="w-full max-w-sm rounded-lg overflow-hidden border border-border"></div>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={onClose} disabled={isScanning}>
                        {t('Cancel')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
