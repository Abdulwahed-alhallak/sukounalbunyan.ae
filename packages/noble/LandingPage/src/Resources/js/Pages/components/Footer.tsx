import { useState } from 'react';
import { toast } from 'sonner';

interface FooterProps {
    [key: string]: any;
    settings?: any;
}

export default function Footer({ settings }: FooterProps) {
    const [emailInput, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectionData = settings?.config_sections?.sections?.footer || {};
    const companyName = settings?.company_name || 'Sukoun Albunyan';
    const description = sectionData.description || 'The complete business management solution for modern enterprises.';
    const contactEmail = settings?.contact_email || 'support@dion.sy';
    const newsletterButtonText = sectionData.newsletter_button_text || 'Subscribe';
    const copyrightText =
        sectionData.copyright_text || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

    // Fallback navigation if not provided
    const navSections =
        sectionData.navigation_sections?.length > 0
            ? sectionData.navigation_sections
            : [
                  {
                      title: 'Resources',
                      links: [
                          { text: 'Documentation', href: '#' },
                          { text: 'Guides', href: '#' },
                      ],
                  },
                  {
                      title: 'Company',
                      links: [
                          { text: 'About', href: '#' },
                          { text: 'Blog', href: '#' },
                      ],
                  },
              ];

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailInput.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(route('newsletter.subscribe'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    email: emailInput.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Thank you for subscribing!');
                setEmailInput('');
            } else {
                toast.error(data.message || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="border-t border-neutral-800 bg-black py-16 text-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">
                    {/* Brand & Newsletter Section */}
                    <div className="flex flex-col justify-between md:col-span-12 lg:col-span-5">
                        <div>
                            <span className="mb-4 inline-block text-2xl font-extrabold tracking-tight">
                                {companyName}
                            </span>
                            <p className="mb-6 max-w-sm text-sm leading-relaxed text-neutral-400">{description}</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
                                Subscribe to our newsletter
                            </h3>
                            <form onSubmit={handleNewsletterSubmit} className="group relative flex max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 pe-24 text-sm outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="absolute bottom-1 end-1 top-1 rounded-md bg-white px-4 text-xs font-semibold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : newsletterButtonText}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-12 lg:col-span-7">
                        {navSections.map((section: any, index: number) => (
                            <div key={index}>
                                <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links?.map((link: any, linkIndex: number) => (
                                        <li key={linkIndex}>
                                            <a
                                                href={
                                                    link.href?.startsWith('/page/')
                                                        ? route('custom-page.show', link.href.replace('/page/', ''))
                                                        : link.href
                                                }
                                                target={link.target === '_blank' ? '_blank' : '_self'}
                                                rel={link.target === '_blank' ? 'noopener noreferrer' : ''}
                                                className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact Column if needed based on settings */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">Contact</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
                                    >
                                        {contactEmail}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between border-t border-neutral-900 pt-8 text-xs text-neutral-600 md:flex-row">
                    <p>{copyrightText}</p>
                    <div className="mt-4 flex space-x-4 md:mt-0">
                        <a href="#" className="transition-colors hover:text-white">
                            Privacy Policy
                        </a>
                        <a href="#" className="transition-colors hover:text-white">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
