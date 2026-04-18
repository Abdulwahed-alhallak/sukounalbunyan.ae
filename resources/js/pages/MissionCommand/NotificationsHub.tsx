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

            <div className="mx-auto flex max-w-4xl flex-col space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-3">
                        <Radio className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                        <h1 className="mb-1 text-3xl font-bold tracking-tight text-background">Firebase Push Hub</h1>
                        <p className="text-muted-foreground">
                            Compose and broadcast mass push notifications to mobile and web clients.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-5">
                    <div className="md:col-span-3">
                        <Card className="border-foreground/20 bg-card shadow-lg">
                            <form onSubmit={submit}>
                                <CardHeader>
                                    <CardTitle>Compose Broadcast</CardTitle>
                                    <CardDescription>Dispatch a rich push notification via FCM.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-foreground/80">
                                            Notification Title
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Welcome toNobleArchitecture"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                            className="border-input/50 bg-background/50"
                                        />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body" className="text-foreground/80">
                                            Message Body
                                        </Label>
                                        <Textarea
                                            id="body"
                                            placeholder="Type your message here..."
                                            rows={4}
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            required
                                            className="resize-none border-input/50 bg-background/50"
                                        />
                                        {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="image_url"
                                            className="flex items-center gap-2 text-foreground/80"
                                        >
                                            <ImageIcon className="h-4 w-4" /> Optional Image URL
                                        </Label>
                                        <Input
                                            id="image_url"
                                            type="url"
                                            placeholder="https://noble.dion.sy/banner.jpg"
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="border-input/50 bg-background/50"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Used for rich media push notifications in Android/iOS.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target" className="flex items-center gap-2 text-foreground/80">
                                            <UsersIcon className="h-4 w-4" /> Target Audience Segment
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
                                <CardFooter className="border-t border-border/40 bg-muted/20 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-foreground font-semibold text-background shadow-md shadow-primary/20 hover:bg-foreground/90"
                                    >
                                        <Send className="me-2 h-4 w-4" />
                                        {processing
                                            ? 'Dispatching Payload...'
                                            : `Broadcast to ${data.target_audience === 'all' ? 'Everyone' : data.target_audience}`}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <Card className="border-none bg-card shadow-xl ring-1 ring-border">
                            <CardHeader className="border-b border-border/40 bg-muted/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground"></span>
                                    Live Preview (iOS)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex h-full min-h-[300px] items-center justify-center rounded-b-lg bg-foreground/40 p-4">
                                    <div className="relative w-[300px] overflow-hidden rounded-2xl border border-border/50 bg-foreground/90 p-4 shadow-2xl backdrop-blur-md">
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground font-sans text-[10px] font-bold text-black">
                                                D
                                            </div>
                                            <div className="text-xs font-medium tracking-wide text-muted-foreground/60">
                                                Noble Architecture
                                            </div>
                                            <div className="ms-auto text-[10px] text-muted-foreground">now</div>
                                        </div>
                                        <div className="mb-1 text-sm font-semibold text-background">
                                            {data.title || 'Notification Title'}
                                        </div>
                                        <div className="line-clamp-3 text-xs leading-relaxed text-muted-foreground/60">
                                            {data.body ||
                                                'This is how your rich push notification will appear on a users lock screen.'}
                                        </div>
                                        {data.image_url && (
                                            <div className="mt-3 h-24 overflow-hidden rounded-lg border border-border/50 bg-foreground/50">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={data.image_url}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
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
