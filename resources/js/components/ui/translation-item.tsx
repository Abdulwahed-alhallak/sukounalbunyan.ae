import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TranslationItemProps {
    translationKey: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

export function TranslationItem({ translationKey, value, onChange }: TranslationItemProps) {
    return (
        <div className="grid grid-cols-5 gap-4 border-b p-3 transition-colors hover:bg-muted/30">
            <div className="col-span-2">
                <div className="truncate text-sm font-medium text-foreground" title={translationKey}>
                    {translationKey}
                </div>
            </div>
            <div className="col-span-3">
                {value.length > 100 ? (
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(translationKey, e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                        rows={2}
                        placeholder="Enter translation value..."
                    />
                ) : (
                    <Input
                        value={value}
                        onChange={(e) => onChange(translationKey, e.target.value)}
                        className="text-sm"
                        placeholder="Enter translation value..."
                    />
                )}
            </div>
        </div>
    );
}
