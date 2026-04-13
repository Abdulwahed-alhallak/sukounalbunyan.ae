import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelectEnhanced } from '@/components/ui/multi-select-enhanced';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useFormFields } from '@/hooks/useFormFields';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProps {
    onSuccess: () => void;
    users: Array<{
        id: number;
        name: string;
    }>;
}

export default function Create({ onSuccess, users }: CreateProps) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        user_ids: [],
        description: '',
        budget: 0,
        start_date: '',
        end_date: '',
        location_name: '',
        latitude: '',
        longitude: '',
        geofence_radius: 100,
    });

    // AI hooks for name and description fields
    const nameAI = useFormFields('aiField', data, setData, errors, 'create', 'name', 'Name', 'taskly', 'project');
    const descriptionAI = useFormFields('aiField', data, setData, errors, 'create', 'description', 'Description', 'taskly', 'project');

    const [isLocating, setIsLocating] = React.useState(false);

    const autoLocate = async () => {
        const query = data.location_name || data.name;
        if (!query) {
            toast.error(t('Please enter a location name or project name first.'));
            return;
        }
        
        setIsLocating(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const results = await response.json();
            
            if (results && results.length > 0) {
                const bestMatch = results[0];
                setData(prev => ({
                    ...prev,
                    latitude: bestMatch.lat,
                    longitude: bestMatch.lon,
                    location_name: bestMatch.display_name
                }));
                toast.success(t('Coordinates acquired automatically via Smart Geocoding!'));
            } else {
                toast.error(t('No coordinates found for this area. Try being more specific.'));
            }
        } catch (error) {
            toast.error(t('Network error while looking up location.'));
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('project.store'), {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{t('Create Project')}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label htmlFor="name">{t('Name')}</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('Enter project name')}
                                className={errors.name ? 'border-destructive' : ''}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                        </div>
                        {nameAI?.map(field => <div key={field.id}>{field.component}</div>)}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label required>{t('Start Date')}</Label>
                        <DatePicker
                            value={data.start_date}
                            onChange={(value) => setData('start_date', value)}
                            placeholder={t('Select start date')}
                        />
                        {errors.start_date && <p className="text-sm text-destructive mt-1">{errors.start_date}</p>}
                    </div>
                    <div>
                        <Label required>{t('End Date')}</Label>
                        <DatePicker
                            value={data.end_date}
                            onChange={(value) => setData('end_date', value)}
                            placeholder={t('Select end date')}
                        />
                        {errors.end_date && <p className="text-sm text-destructive mt-1">{errors.end_date}</p>}
                    </div>
                </div>
                <div>
                    <Label required>{t('Users')}</Label>
                    <MultiSelectEnhanced
                        options={users?.map(user => ({ value: user.id.toString(), label: user.name }))}
                        value={data.user_ids?.map(id => id.toString())}
                        onValueChange={(value) => setData('user_ids', value?.map(v => parseInt(v)))}
                        placeholder={t('Select users')}
                        searchable={true}
                    />
                    {errors.user_ids && <p className="text-sm text-destructive mt-1">{errors.user_ids}</p>}
                </div>

                <div>
                    <CurrencyInput
                        label={t('Budget')}
                        value={data.budget.toString()}
                        onChange={(value) => setData('budget', parseFloat(value) || 0)}
                        error={errors.budget}
                        required
                    />
                </div>

                {/* Geolocation Section */}
                <div className="p-4 border rounded-xl bg-muted/20 space-y-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-foreground" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">{t('Project Geofence Binding')}</h3>
                    </div>
                    
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Label htmlFor="location_name">{t('Location Search/Name')}</Label>
                            <Input
                                id="location_name"
                                value={data.location_name}
                                onChange={(e) => setData('location_name', e.target.value)}
                                placeholder={t('e.g., Riyadh Skyscraper, Dubai Mall')}
                            />
                        </div>
                        <Button type="button" onClick={autoLocate} disabled={isLocating} variant="secondary" className="flex gap-2">
                            <Search className="h-4 w-4" />
                            {isLocating ? t('Scanning...') : t('Auto Locate')}
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>{t('Latitude')} (X)</Label>
                            <Input
                                type="text"
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                placeholder={t('24.7136')}
                            />
                        </div>
                        <div>
                            <Label>{t('Longitude')} (Y)</Label>
                            <Input
                                type="text"
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                placeholder={t('46.6753')}
                            />
                        </div>
                        <div>
                            <Label>{t('Geofence Radius')} (m)</Label>
                            <Input
                                type="number"
                                value={data.geofence_radius}
                                onChange={(e) => setData('geofence_radius', parseInt(e.target.value) || 100)}
                                placeholder="100"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="description">{t('Description')}</Label>
                        <div className="flex gap-2">
                            {descriptionAI?.map(field => <div key={field.id}>{field.component}</div>)}
                        </div>
                    </div>
                    <Textarea
                        id="description"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder={t('Enter project description')}
                        className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? t('Creating...') : t('Create')}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
