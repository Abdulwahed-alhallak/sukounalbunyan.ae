import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImagePath } from '@/utils/helpers';

interface ImageSliderProps {
    images: string[];
    className?: string;
    showThumbnails?: boolean;
    showControls?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    onImageClick?: (index: number) => void;
    onClose?: () => void;
    showCloseButton?: boolean;
    aspectRatio?: 'square' | 'video' | 'auto';
    showZoom?: boolean;
    showDownload?: boolean;
}

export function ImageSlider({
    images,
    className,
    showThumbnails = true,
    showControls = true,
    autoPlay = false,
    autoPlayInterval = 3000,
    onImageClick,
    onClose,
    showCloseButton = false,
    aspectRatio = 'auto',
    showZoom = false,
    showDownload = false,
}: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const processedImages = images.map((img) => (img ? getImagePath(img) : '')).filter(Boolean);

    useEffect(() => {
        if (!autoPlay || processedImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % processedImages.length);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, processedImages.length]);

    if (!processedImages.length) {
        return (
            <div className={cn('flex h-64 w-full items-center justify-center rounded-lg bg-muted', className)}>
                <p className="text-sm text-muted-foreground">No images available</p>
            </div>
        );
    }

    const aspectRatioClass = {
        square: 'aspect-square',
        video: 'aspect-video',
        auto: 'min-h-[200px]',
    }[aspectRatio];

    return (
        <div className={cn('relative w-full max-w-full', className)}>
            {/* Action Buttons */}
            {(showZoom || showDownload || showCloseButton) && (
                <div className="absolute right-3 top-3 z-20 flex gap-1">
                    {showZoom && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-card/90 shadow-sm hover:bg-card"
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <ZoomIn className="h-3 w-3" />
                        </Button>
                    )}
                    {showDownload && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-card/90 shadow-sm hover:bg-card"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = processedImages[currentIndex];
                                link.download = `image-${currentIndex + 1}.jpg`;
                                link.click();
                            }}
                        >
                            <Download className="h-3 w-3" />
                        </Button>
                    )}
                    {showCloseButton && onClose && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-card/90 shadow-sm hover:bg-card"
                            onClick={onClose}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}

            {/* Main Image Container */}
            <div className={cn('relative overflow-hidden rounded-lg border bg-muted', aspectRatioClass)}>
                <img
                    src={processedImages[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className={cn(
                        'h-full w-full cursor-pointer object-cover transition-transform duration-300',
                        isZoomed ? 'scale-150' : 'hover:scale-[1.02]'
                    )}
                    onClick={() => onImageClick?.(currentIndex)}
                />

                {/* Navigation Controls */}
                {showControls && processedImages.length > 1 && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 bg-card/90 shadow-sm hover:bg-card"
                            onClick={() =>
                                setCurrentIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length)
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 bg-card/90 shadow-sm hover:bg-card"
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % processedImages.length)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {/* Slide Indicators */}
                {processedImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {processedImages.map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    'h-2 w-2 rounded-full transition-all duration-200',
                                    index === currentIndex ? 'scale-125 bg-card' : 'bg-card/60 hover:bg-card/80'
                                )}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}

                {/* Image Counter */}
                {processedImages.length > 1 && (
                    <div className="absolute left-3 top-3 rounded bg-foreground/60 px-2 py-1 text-xs font-medium text-background">
                        {currentIndex + 1} / {processedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {showThumbnails && processedImages.length > 1 && (
                <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2">
                    {processedImages.map((image, index) => (
                        <button
                            key={index}
                            className={cn(
                                'h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200',
                                index === currentIndex
                                    ? 'border-foreground ring-2 ring-foreground/20'
                                    : 'border-border hover:border-foreground/50'
                            )}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
