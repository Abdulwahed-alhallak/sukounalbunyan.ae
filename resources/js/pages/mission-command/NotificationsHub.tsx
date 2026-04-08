import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Radio, Send, Image as ImageIcon, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NotificationsHub() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        target_audience: 'all',
        image_url: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('mission-command.notifications.send'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Firebase Push Hub | Mission Command" />
            
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-foreground/10 rounded-lg">
                        <Radio className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-background mb-1">
                            Firebase Push Hub
                        </h1>
                        <p className="text-muted-foreground">
                            Compose and broadcast mass push notifications to mobile and web clients.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                        <Card className="bg-card shadow-lg border-foreground/20">
                            <form onSubmit={submit}>
                                <CardHeader>
                                    <CardTitle>Compose Broadcast</CardTitle>
                                    <CardDescription>Dispatch a rich push notification via FCM.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-foreground/80">Notification Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Welcome to DionONE"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                            className="bg-background/50 border-input/50"
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body" className="text-foreground/80">Message Body</Label>
                                        <Textarea
                                            id="body"
                                            placeholder="Type your message here..."
                                            rows={4}
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            required
                                            className="bg-background/50 border-input/50 resize-none"
                                        />
                                        {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image_url" className="text-foreground/80 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Optional Image URL
                                        </Label>
                                        <Input
                                            id="image_url"
                                            type="url"
                                            placeholder="https://example.com/banner.jpg"
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="bg-background/50 border-input/50"
                                        />
                                        <p className="text-xs text-muted-foreground">Used for rich media push notifications in Android/iOS.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target" className="text-foreground/80 flex items-center gap-2">
                                            <UsersIcon className="w-4 h-4" /> Target Audience Segment
                                        </Label>
                                        <Select 
                                            value={data.target_audience} 
                                            onValueChange={(val) => setData('target_audience', val)}
                                        >
                                            <SelectTrigger className="w-full bg-background/50">
                                                <SelectValue placeholder="Select target..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Everyone (Global Broadcast)</SelectItem>
                                                <SelectItem value="students">Students Only</SelectItem>
                                                <SelectItem value="instructors">Instructors Only</SelectItem>
                                                <SelectItem value="companies">B2B Companies</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-border/40 bg-muted/20">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-lg shadow-md shadow-primary/20"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        {processing ? 'Dispatching Payload...' : `Broadcast to ${data.target_audience === 'all' ? 'Everyone' : data.target_audience}`}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-card border-none ring-1 ring-border shadow-xl">
                            <CardHeader className="bg-muted/50 pb-4 border-b border-border/40">
                                <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                                    <span className="h-2 w-2 rounded-full bg-foreground animate-pulse"></span>
                                    Live Preview (iOS)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-4 flex justify-center bg-foreground/40 h-full min-h-[300px] items-center rounded-b-lg">
                                    <div className="w-[300px] bg-foreground/90 backdrop-blur-md rounded-2xl border border-border/50 p-4 shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center text-[10px] font-bold text-black font-sans">
                                                D
                                            </div>
                                            <div className="text-xs text-muted-foreground/60 font-medium tracking-wide">DIONONE</div>
                                            <div className="text-[10px] text-muted-foreground ml-auto">now</div>
                                        </div>
                                        <div className="text-sm font-semibold text-background mb-1">
                                            {data.title || 'Notification Title'}
                                        </div>
                                        <div className="text-xs text-muted-foreground/60 line-clamp-3 leading-relaxed">
                                            {data.body || 'This is how your rich push notification will appear on a users lock screen.'}
                                        </div>
                                        {data.image_url && (
                                            <div className="mt-3 rounded-lg overflow-hidden h-24 bg-foreground/50 border border-border/50">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={data.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
