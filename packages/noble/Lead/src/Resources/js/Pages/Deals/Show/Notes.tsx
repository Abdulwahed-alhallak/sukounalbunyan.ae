import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Deal } from '../types';

interface NotesProps {
    deal: Deal;
}

export default function Notes({ deal }: NotesProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-lg bg-muted/50 p-6">
            <RichTextEditor
                content={deal.notes || ''}
                onChange={(content) => {
                    router.put(route('lead.deals.update', deal.id), {
                        notes: content,
                    });
                }}
                placeholder={t('Add notes...')}
                className="mt-1 min-h-[300px]"
            />
        </div>
    );
}
