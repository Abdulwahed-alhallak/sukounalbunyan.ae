import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/ui/input-error';
import { User } from './types';

interface AssignPlanProps {
    user: User;
    plans: { id: number; name: string }[];
    onSuccess: () => void;
}

export default function AssignPlan({ user, plans, onSuccess }: AssignPlanProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        plan_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.assign.plan', user.id), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{t('Assign New Plan')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="mt-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="plan_id">{t('Select Plan')}</Label>
                    <Select value={data.plan_id} onValueChange={(value) => setData('plan_id', value)}>
                        <SelectTrigger className={errors.plan_id ? 'border-destructive' : ''}>
                            <SelectValue placeholder={t('Select Plan')} />
                        </SelectTrigger>
                        <SelectContent>
                            {plans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.plan_id} />
                </div>
                <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing || !data.plan_id}
                        className="bg-foreground text-background hover:bg-foreground/90"
                    >
                        {processing ? t('Saving...') : t('Assign Plan')}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
