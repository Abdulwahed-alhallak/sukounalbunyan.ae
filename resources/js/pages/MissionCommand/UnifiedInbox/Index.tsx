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
        { id: 1, sender: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', platform: 'whatsapp', content: 'Hey, I need an update on invoice #402', timestamp: '10:42 AM', unread: true },
        { id: 2, sender: 'Dion Creative', avatar: 'https://i.pravatar.cc/150?u=2', platform: 'email', content: 'Your subscription for Professional Plan is confirmed.', timestamp: 'Yesterday', unread: false },
        { id: 3, sender: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=3', platform: 'internal', content: 'Task "Design System" moved to Review.', timestamp: 'Mon', unread: false },
    ];

    const PlatformIcon = ({ platform }: { platform: string }) => {
        switch (platform) {
            case 'whatsapp': return <Phone className="w-3 h-3 text-foreground" />;
            case 'email': return <Mail className="w-3 h-3 text-foreground" />;
            case 'internal': return <MessageCircle className="w-3 h-3 text-dion-cyan" />;
            default: return <Inbox className="w-3 h-3" />;
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground flex items-center gap-3">
                    <Inbox className="w-7 h-7 text-dion-cyan" />
                    Unified Inbox
                    <Badge variant="outline" className="text-xs bg-dion-cyan/10 text-dion-cyan border-dion-cyan">BETA</Badge>
                </h1>
                <div className="flex gap-2 text-sm text-muted-foreground font-mono">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> WhatsApp Connected</div>
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> IMAP Active</div>
                </div>
            </div>

            <Card className="h-[calc(100%-60px)] shadow-xl border-border dark:border-border bg-muted/50 dark:bg-foreground overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-80 border-r border-border dark:border-border flex flex-col bg-card dark:bg-foreground">
                    <div className="p-4 border-b border-border dark:border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search omnichannel..." className="pl-9 bg-muted dark:bg-card border-none" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {mockMessages.map(msg => (
                            <div 
                                key={msg.id} 
                                onClick={() => setActiveMessage(msg)}
                                className={`p-4 border-b border-border dark:border-border/50 cursor-pointer hover:bg-muted/50 dark:hover:bg-card/80 transition-colors ${activeMessage?.id === msg.id ? 'bg-muted dark:bg-card' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={msg.avatar} />
                                            <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-card dark:bg-foreground rounded-full p-0.5 shadow-sm">
                                            <PlatformIcon platform={msg.platform} />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-foreground dark:text-foreground truncate">{msg.sender}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{msg.timestamp}</span>
                                        </div>
                                        <p className={`text-sm truncate mt-0.5 ${msg.unread ? 'text-foreground dark:text-foreground font-medium' : 'text-muted-foreground'}`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                    {msg.unread && (
                                        <div className="w-2 h-2 rounded-full bg-dion-cyan self-center shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-muted/50/50 dark:bg-foreground/50">
                    {activeMessage ? (
                        <>
                            <div className="p-4 border-b border-border dark:border-border bg-card/80 dark:bg-foreground/80 backdrop-blur-sm flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={activeMessage.avatar} />
                                        <AvatarFallback>{activeMessage.sender[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground">{activeMessage.sender}</h3>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <PlatformIcon platform={activeMessage.platform} />
                                            <span className="capitalize">{activeMessage.platform} Channel</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden md:flex">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="flex flex-col gap-2 max-w-[80%]">
                                    <div className="bg-card dark:bg-foreground border border-border dark:border-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                                        <p className="text-foreground dark:text-muted-foreground/40">{activeMessage.content}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">{activeMessage.timestamp}</span>
                                </div>
                                {/* Simulate agent reply */}
                                {activeMessage.platform === 'whatsapp' && (
                                    <div className="flex flex-col gap-2 max-w-[80%] self-end ms-auto">
                                        <div className="bg-dion-cyan/10 border border-dion-cyan/20 dark:bg-dion-cyan/20 dark:border-dion-cyan/10 rounded-2xl rounded-tr-none p-4 shadow-sm backdrop-blur-md">
                                            <p className="text-foreground dark:text-foreground">Hello John, here's the PDF for invoice #402.</p>
                                            <div className="mt-2 p-2 bg-card/50 dark:bg-foreground/20 rounded border border-white/20 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                                    <span className="text-xs font-bold text-destructive">PDF</span>
                                                </div>
                                                <span className="text-sm font-medium">INV-402.pdf</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground mr-2 text-right">Just now <CheckCircle2 className="w-3 h-3 inline text-dion-cyan" /></span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-card dark:bg-foreground border-t border-border dark:border-border">
                                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                                    <div className="flex-1 bg-muted dark:bg-card rounded-xl p-1 flex items-center relative">
                                        <Input 
                                            id="message-input"
                                            placeholder={`Reply via ${activeMessage.platform}...`} 
                                            className="border-none bg-transparent focus-visible:ring-0 px-4 py-6"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                                    const message = e.currentTarget.value;
                                                    e.currentTarget.value = '';
                                                    import('@inertiajs/react').then(({ router }) => {
                                                        router.post('/mission-command/unified-inbox/send', {
                                                            platform: activeMessage.platform,
                                                            to: activeMessage.sender, // in real app: activeMessage.phoneNumber or email
                                                            content: message
                                                        }, {
                                                            onSuccess: () => {
                                                                // Usually we push to activeMessage stream here
                                                                alert('Message queued via ' + activeMessage.platform);
                                                            }
                                                        });
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button size="icon" className="h-14 w-14 rounded-xl bg-dion-cyan hover:bg-dion-cyan/90 text-foreground shrink-0 shadow-lg shadow-dion-cyan/20">
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="text-center mt-2 text-xs text-muted-foreground">
                                    Press <kbd className="font-mono bg-muted dark:bg-card px-1 rounded">Enter</kbd> to send directly through {activeMessage.platform} API
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="w-20 h-20 bg-muted dark:bg-foreground rounded-full flex items-center justify-center mb-4">
                                <Inbox className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-medium text-foreground dark:text-muted-foreground/60">No message selected</h3>
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
