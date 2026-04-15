import React from 'react';
import * as LucideIcons from 'lucide-react';
import { customSvgs } from '@/components/ui/icon-picker';

interface SocialLink {
    platform: string;
    icon: string;
    url: string;
    link: string;
    enabled: boolean;
}

interface SocialLinksProps {
    socialLinks?: SocialLink[];
    icon?: string;
    className?: string;
    style?: React.CSSProperties;
    textSecondary?: string;
    variant?: 'default' | 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
    userSlug?: string;
}

export default function SocialLinks({
    socialLinks,
    icon,
    className = '',
    style,
    textSecondary = '#64748b',
    variant = 'default',
    size = 'md',
    userSlug,
}: SocialLinksProps) {
    const renderIcon = (iconName: string) => {
        const iconSize = size === 'lg' ? 20 : size === 'sm' ? 16 : 18;
        const iconClasses = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

        // Handle svg: prefixed icons
        if (iconName.startsWith('svg:')) {
            const cleanName = iconName.replace('svg:', '');
            // Try to find in customSvgs with clean name
            if (customSvgs[cleanName as keyof typeof customSvgs]) {
                return (
                    <div
                        dangerouslySetInnerHTML={{ __html: customSvgs[cleanName as keyof typeof customSvgs] }}
                        className={iconClasses}
                    />
                );
            }
            // Try Lucide icon with clean name
            const IconComponent = LucideIcons[cleanName as keyof typeof LucideIcons] as React.ComponentType<{
                size?: number;
            }>;
            if (IconComponent) {
                return <IconComponent size={iconSize} />;
            }
            return <div className={`${iconClasses} flex items-center justify-center rounded bg-muted text-xs`}>?</div>;
        }

        // Handle FontAwesome icons with custom SVGs
        if (customSvgs[iconName as keyof typeof customSvgs]) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: customSvgs[iconName as keyof typeof customSvgs] }}
                    className={iconClasses}
                />
            );
        }

        // Handle Lucide icons
        const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
            size?: number;
        }>;
        if (IconComponent) {
            return <IconComponent size={iconSize} />;
        }

        // Fallback for unknown icons
        return <div className={`${iconClasses} rounded bg-muted`} />;
    };

    // If single icon prop is provided, render just the icon
    if (icon && typeof icon === 'string') {
        // Handle svg: prefixed icons
        if (icon.startsWith('svg:')) {
            const cleanName = icon.replace('svg:', '');
            if (customSvgs[cleanName as keyof typeof customSvgs]) {
                return (
                    <div
                        dangerouslySetInnerHTML={{ __html: customSvgs[cleanName as keyof typeof customSvgs] }}
                        className={className}
                        style={style}
                    />
                );
            }
            const IconComponent = LucideIcons[cleanName as keyof typeof LucideIcons] as React.ComponentType<any>;
            if (IconComponent) {
                return <IconComponent className={className} style={style} />;
            }
        }

        // Handle custom SVGs
        if (customSvgs[icon as keyof typeof customSvgs]) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: customSvgs[icon as keyof typeof customSvgs] }}
                    className={className}
                    style={style}
                />
            );
        }

        // Handle Lucide icons
        const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<any>;
        if (IconComponent) {
            return <IconComponent className={className} style={style} />;
        }

        return <div className={`h-5 w-5 rounded bg-muted ${className}`} style={style} />;
    }

    if (!icon && (!socialLinks || socialLinks.length === 0)) {
        return null;
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8';
            case 'lg':
                return 'w-12 h-12';
            default:
                return 'w-10 h-10';
        }
    };

    const getVariantClasses = () => {
        if (variant === 'dark') {
            return 'bg-card bg-opacity-20 hover:bg-opacity-30 text-background';
        }
        if (variant === 'light') {
            return 'text-background hover:opacity-80';
        }
        return 'bg-muted hover:bg-muted text-muted-foreground';
    };

    return (
        <div className={`flex flex-wrap gap-4 ${className}`}>
            {socialLinks?.map((social, index) => (
                <a
                    key={index}
                    href={social?.url || social?.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${getSizeClasses()} ${getVariantClasses()} flex transform items-center justify-center rounded-full transition-all duration-300 hover:scale-110`}
                    style={variant === 'light' && style ? style : undefined}
                    aria-label={social.platform}
                >
                    {social.icon ? (
                        renderIcon(social.icon)
                    ) : (
                        <span className="text-sm font-semibold capitalize">{social.platform.charAt(0)}</span>
                    )}
                </a>
            ))}
        </div>
    );
}
