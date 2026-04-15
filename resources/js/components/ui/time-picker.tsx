'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimePickerProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    required?: boolean;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export function TimePicker({
    value,
    onChange,
    placeholder,
    className,
    id,
    required,
    style,
    disabled,
}: TimePickerProps) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [hour, setHour] = React.useState(value ? value.split(':')[0] : '09');
    const [minute, setMinute] = React.useState(value ? value.split(':')[1] : '00');
    const hourRef = React.useRef<HTMLDivElement>(null);
    const minuteRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            setHour(h);
            setMinute(m);
        }
    }, [value]);

    React.useEffect(() => {
        if (open) {
            setTimeout(() => {
                const hourEl = hourRef.current?.querySelector(`[data-value="${hour}"]`) as HTMLElement;
                const minuteEl = minuteRef.current?.querySelector(`[data-value="${minute}"]`) as HTMLElement;
                if (hourEl && hourRef.current) {
                    hourRef.current.scrollTop = hourEl.offsetTop - 80;
                }
                if (minuteEl && minuteRef.current) {
                    minuteRef.current.scrollTop = minuteEl.offsetTop - 80;
                }
            }, 50);
        }
    }, [open]);

    const handleHourClick = (h: string) => {
        setHour(h);
        const hourEl = hourRef.current?.querySelector(`[data-value="${h}"]`) as HTMLElement;
        if (hourEl && hourRef.current) {
            hourRef.current.scrollTo({ top: hourEl.offsetTop - 80, behavior: 'smooth' });
        }
    };

    const handleMinuteClick = (m: string) => {
        setMinute(m);
        const minuteEl = minuteRef.current?.querySelector(`[data-value="${m}"]`) as HTMLElement;
        if (minuteEl && minuteRef.current) {
            minuteRef.current.scrollTo({ top: minuteEl.offsetTop - 80, behavior: 'smooth' });
        }
    };

    const handleApply = () => {
        onChange(`${hour}:${minute}`);
        setOpen(false);
    };

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className={cn('w-full', className)}>
            {id && <input id={id} type="hidden" value={value || ''} required={required} />}
            <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'h-10 w-full justify-start text-start font-normal',
                            !value && 'text-muted-foreground',
                            disabled && 'cursor-not-allowed opacity-50'
                        )}
                        style={style}
                        disabled={disabled}
                    >
                        <Clock className="me-2 h-4 w-4" />
                        {value || placeholder || t('Select time')}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex gap-0">
                        <div className="flex flex-col">
                            <div className="border-b py-3 text-center text-xs font-semibold">{t('Hour')}</div>
                            <div className="relative h-[200px] overflow-y-auto overflow-x-hidden" ref={hourRef}>
                                <div className="pointer-events-none absolute inset-x-0 top-[80px] z-10 h-[40px] bg-accent/50" />
                                {hours.map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        data-value={h}
                                        onClick={() => handleHourClick(h)}
                                        className={cn(
                                            'flex h-[40px] w-16 items-center justify-center text-sm font-medium transition-colors hover:bg-accent',
                                            hour === h && 'font-bold text-foreground'
                                        )}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="border-s" />
                        <div className="flex flex-col">
                            <div className="border-b py-3 text-center text-xs font-semibold">{t('Minute')}</div>
                            <div className="relative h-[200px] overflow-y-auto overflow-x-hidden" ref={minuteRef}>
                                <div className="pointer-events-none absolute inset-x-0 top-[80px] z-10 h-[40px] bg-accent/50" />
                                {minutes.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        data-value={m}
                                        onClick={() => handleMinuteClick(m)}
                                        className={cn(
                                            'flex h-[40px] w-16 items-center justify-center text-sm font-medium transition-colors hover:bg-accent',
                                            minute === m && 'font-bold text-foreground'
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t p-3">
                        <Button onClick={handleApply} className="w-full" size="sm">
                            {t('Apply')}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
