import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Briefcase, Search } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { t } from 'i18next';

interface FrontendHeaderProps {
    [key: string]: any;
    userSlug?: string;
    brandSettings: {
        logo?: string;
        titleText?: string;
    };
    currentPage?: string;
}

export default function FrontendHeader({ userSlug, brandSettings, currentPage }: FrontendHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href={userSlug ? route('recruitment.frontend.careers.jobs.index', { userSlug }) : '#'}
                        className="flex items-center"
                    >
                        {brandSettings?.logo ? (
                            <img src={getImagePath(brandSettings.logo)} alt="Logo" className="h-10 w-auto" />
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="from-muted/500 rounded-md bg-gradient-to-r to-foreground px-3 py-1 text-lg font-bold text-background">
                                    {(brandSettings?.titleText || 'Careers').charAt(0)}
                                </div>
                                <span className="text-xl font-bold text-foreground">
                                    {brandSettings?.titleText || 'Careers'}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {currentPage === 'track-form' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden border-border text-muted-foreground hover:bg-muted/50 sm:flex"
                                onClick={() => {
                                    if (userSlug) {
                                        window.location.href = route('recruitment.frontend.careers.jobs.index', {
                                            userSlug,
                                        });
                                    }
                                }}
                            >
                                <Briefcase className="me-2 h-4 w-4" />
                                {t('Browse Jobs')}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden border-border text-muted-foreground hover:bg-muted/50 sm:flex"
                                onClick={() => {
                                    if (userSlug) {
                                        window.location.href = route('recruitment.frontend.careers.track.form', {
                                            userSlug,
                                        });
                                    }
                                }}
                            >
                                <Search className="me-2 h-4 w-4" />
                                {t('Track Application')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
