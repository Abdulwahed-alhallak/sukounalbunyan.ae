import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mail, Phone, Search, Send, CheckCircle2, Inbox } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: number;
    sender: string;
    avatar: string;
    platform: 'whatsapp' | 'email' | 'telegram' | 'internal';
    content: string;
    timestamp: string;
    unread: boolean;
}

export default function UnifiedInboxIndex() {
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);

    const mockMessages: Message[] = [
        {
            id: 1,
            sender: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?u=1',
            platform: 'whatsapp',
            content: 'Hey, I need an update on invoice #402',
            timestamp: '10:42 AM',
            unread: true,
        },
        {
            id: 2,
            sender: 'Noble Architecture',
            avatar: 'https://i.pravatar.cc/150?u=2',
            platform: 'email',
            content: 'Your subscription for Professional Plan is confirmed.',
            timestamp: 'Yesterday',
            unread: false,
        },
        {
            id: 3,
            sender: 'Alex M.',
            avatar: 'https://i.pravatar.cc/150?u=3',
            platform: 'internal',
            content: 'Task "Design System" moved to Review.',
            timestamp: 'Mon',
            unread: false,
        },
    ];

    const PlatformIcon = ({ platform }: { platform: string }) => {
        switch (platform) {
            case 'whatsapp':
                return <Phone className="h-3 w-3 text-foreground" />;
            case 'email':
                return <Mail className="h-3 w-3 text-foreground" />;
            case 'internal':
                return <MessageCircle className="text-noble-cyan h-3 w-3" />;
            default:
                return <Inbox className="h-3 w-3" />;
        }
    };

    return (
        <div className="mx-auto h-[calc(100vh-100px)] max-w-[1600px] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
                    <Inbox className="text-noble-cyan h-7 w-7" />
                    Unified Inbox
                    <Badge variant="outline" className="bg-noble-cyan/10 text-noble-cyan border-noble-cyan text-xs">
                        BETA
                    </Badge>
                </h1>
                <div className="flex gap-2 font-mono text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> WhatsApp Connected
                    </div>
                    <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> IMAP Active
                    </div>
                </div>
            </div>

            <Card className="flex h-[calc(100%-60px)] flex-col overflow-hidden border-border bg-muted/50 shadow-xl dark:border-border dark:bg-foreground md:flex-row">
                {/* Sidebar */}
                <div className="flex w-full flex-col border-e border-border bg-card dark:border-border dark:bg-foreground md:w-80">
                    <div className="border-b border-border p-4 dark:border-border">
                        <div className="relative">
                            <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search omnichannel..."
                                className="border-none bg-muted ps-9 dark:bg-card"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {mockMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setActiveMessage(msg)}
                                className={`cursor-pointer border-b border-border p-4 transition-colors hover:bg-muted/50 dark:border-border/50 dark:hover:bg-card/80 ${activeMessage?.id === msg.id ? 'bg-muted dark:bg-card' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={msg.avatar} />
                                            <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -end-1 rounded-full bg-card p-0.5 shadow-sm dark:bg-foreground">
                                            <PlatformIcon platform={msg.platform} />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="truncate font-semibold text-foreground dark:text-foreground">
                                                {msg.sender}
                                            </span>
                                            <span className="ms-2 whitespace-nowrap text-xs text-muted-foreground">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        <p
                                            className={`mt-0.5 truncate text-sm ${msg.unread ? 'font-medium text-foreground dark:text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {msg.content}
                                        </p>
                                    </div>
                                    {msg.unread && (
                                        <div className="bg-noble-cyan h-2 w-2 self-center rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="bg-muted/50/50 flex flex-1 flex-col dark:bg-foreground/50">
                    {activeMessage ? (
                        <>
                            <div className="flex items-center justify-between border-b border-border bg-card/80 p-4 backdrop-blur-sm dark:border-border dark:bg-foreground/80">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={activeMessage.avatar} />
                                        <AvatarFallback>{activeMessage.sender[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground">
                                            {activeMessage.sender}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <PlatformIcon platform={activeMessage.platform} />
                                            <span className="capitalize">{activeMessage.platform} Channel</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden md:flex">
                                        <CheckCircle2 className="me-2 h-4 w-4" /> Mark Resolved
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                                <div className="flex max-w-[80%] flex-col gap-2">
                                    <div className="rounded-2xl rounded-tl-none border border-border bg-card p-4 shadow-sm dark:border-border dark:bg-foreground">
                                        <p className="text-foreground dark:text-muted-foreground/40">
                                            {activeMessage.content}
                                        </p>
                                    </div>
                                    <span className="ms-2 text-xs text-muted-foreground">
                                        {activeMessage.timestamp}
                                    </span>
                                </div>
                                {/* Simulate agent reply */}
                                {activeMessage.platform === 'whatsapp' && (
                                    <div className="ms-auto flex max-w-[80%] flex-col gap-2 self-end">
                                        <div className="bg-noble-cyan/10 border-noble-cyan/20 dark:bg-noble-cyan/20 dark:border-noble-cyan/10 rounded-2xl rounded-tr-none border p-4 shadow-sm backdrop-blur-md">
                                            <p className="text-foreground dark:text-foreground">
                                                Hello John, here's the PDF for invoice #402.
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 rounded border border-white/20 bg-card/50 p-2 dark:bg-foreground/20">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                                    <span className="text-xs font-bold text-destructive">PDF</span>
                                                </div>
                                                <span className="text-sm font-medium">INV-402.pdf</span>
                                            </div>
                                        </div>
                                        <span className="me-2 text-end text-xs text-muted-foreground">
                                            Just now <CheckCircle2 className="text-noble-cyan inline h-3 w-3" />
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-border bg-card p-4 dark:border-border dark:bg-foreground">
                                <div className="mx-auto flex max-w-4xl items-end gap-2">
                                    <div className="relative flex flex-1 items-center rounded-xl bg-muted p-1 dark:bg-card">
                                        <Input
                                            id="message-input"
                                            placeholder={`Reply via ${activeMessage.platform}...`}
                                            className="border-none bg-transparent px-4 py-6 focus-visible:ring-0"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                                    const message = e.currentTarget.value;
                                                    e.currentTarget.value = '';
                                                    import('@inertiajs/react').then(({ router }) => {
                                                        router.post(
                                                            '/mission-command/unified-inbox/send',
                                                            {
                                                                platform: activeMessage.platform,
                                                                to: activeMessage.sender, // in real app: activeMessage.phoneNumber or email
                                                                content: message,
                                                            },
                                                            {
                                                                onSuccess: () => {
                                                                    // Usually we push to activeMessage stream here
                                                                    alert(
                                                                        'Message queued via ' + activeMessage.platform
                                                                    );
                                                                },
                                                            }
                                                        );
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        size="icon"
                                        className="bg-noble-cyan hover:bg-noble-cyan/90 shadow-noble-cyan/20 h-14 w-14 shrink-0 rounded-xl text-foreground shadow-lg"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="mt-2 text-center text-xs text-muted-foreground">
                                    Press <kbd className="rounded bg-muted px-1 font-mono dark:bg-card">Enter</kbd> to
                                    send directly through {activeMessage.platform} API
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted dark:bg-foreground">
                                <Inbox className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-medium text-foreground dark:text-muted-foreground/60">
                                No message selected
                            </h3>
                            <p className="mt-2 text-sm">Select a conversation from the omnichannel list</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

UnifiedInboxIndex.layout = (page: any) => {
    return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

