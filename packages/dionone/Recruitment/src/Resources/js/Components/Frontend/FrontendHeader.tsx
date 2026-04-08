import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Briefcase, Search } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import { t } from 'i18next';

interface FrontendHeaderProps {
    userSlug?: string;
    brandSettings: {
        logo?: string;
        titleText?: string;
    };
    currentPage?: string;
}

export default function FrontendHeader({ userSlug, brandSettings, currentPage }: FrontendHeaderProps) {
    return (
        <header className="bg-card shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={userSlug ? route('recruitment.frontend.careers.jobs.index', { userSlug }) : '#'} className="flex items-center">
                        {brandSettings?.logo ? (
                            <img src={getImagePath(brandSettings.logo)} alt="Logo" className="h-10 w-auto" />
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-r from-muted/500 to-foreground text-background px-3 py-1 rounded-md font-bold text-lg">
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
                                className="hidden sm:flex border-border text-muted-foreground hover:bg-muted/50"
                                onClick={() => {
                                    if (userSlug) {
                                        window.location.href = route('recruitment.frontend.careers.jobs.index', { userSlug });
                                    }
                                }}
                            >
                                <Briefcase className="h-4 w-4 mr-2" />
                                {t('Browse Jobs')}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden sm:flex border-border text-muted-foreground hover:bg-muted/50"
                                onClick={() => {
                                    if (userSlug) {
                                        window.location.href = route('recruitment.frontend.careers.track.form', { userSlug });
                                    }
                                }}
                            >
                                <Search className="h-4 w-4 mr-2" />
                                {t('Track Application')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}