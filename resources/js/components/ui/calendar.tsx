import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Button } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={`p-3 ${className}`}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-label-13 font-semibold',
                nav: 'gap-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity',
                nav_button_previous: 'absolute start-1',
                nav_button_next: 'absolute end-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground w-9 font-normal text-label-12 uppercase',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-e-md [&:has([aria-selected].day-outside)]:bg-muted [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-s-md last:[&:has([aria-selected])]:rounded-e-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-md transition-colors',
                day_range_end: 'day-range-end',
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-muted text-foreground font-bold',
                day_outside:
                    'day-outside text-muted-foreground opacity-40 aria-selected:bg-muted aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-30',
                day_range_middle: 'aria-selected:bg-muted aria-selected:text-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={
                {
                    // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                    // IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }
            }
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
