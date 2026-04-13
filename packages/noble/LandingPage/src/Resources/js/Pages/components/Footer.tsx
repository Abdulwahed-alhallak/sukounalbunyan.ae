import { useState } from 'react';
import { toast } from 'sonner';

interface FooterProps {
    settings?: any;
}

export default function Footer({ settings }: FooterProps) {
    const [emailInput, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectionData = settings?.config_sections?.sections?.footer || {};
    const companyName = settings?.company_name || 'Noble Architecture';
    const description = sectionData.description || 'The complete business management solution for modern enterprises.';
    const contactEmail = settings?.contact_email || 'support@dion.sy';
    const newsletterButtonText = sectionData.newsletter_button_text || 'Subscribe';
    const copyrightText = sectionData.copyright_text || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
    
    // Fallback navigation if not provided
    const navSections = sectionData.navigation_sections?.length > 0 
        ? sectionData.navigation_sections 
        : [
            { title: 'Resources', links: [{ text: 'Documentation', href: '#' }, { text: 'Guides', href: '#' }] },
            { title: 'Company', links: [{ text: 'About', href: '#' }, { text: 'Blog', href: '#' }] }
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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    email: emailInput.trim()
                })
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
        <footer className="bg-black py-16 border-t border-neutral-800 text-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand & Newsletter Section */}
                    <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-between">
                        <div>
                            <span className="text-2xl font-extrabold tracking-tight mb-4 inline-block">
                                {companyName}
                            </span>
                            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mb-6">
                                {description}
                            </p>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-white mb-3 tracking-wide uppercase">Subscribe to our newsletter</h3>
                            <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm relative group">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600 pr-24"
                                />
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="absolute right-1 top-1 bottom-1 px-4 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : newsletterButtonText}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {navSections.map((section: any, index: number) => (
                            <div key={index}>
                                <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links?.map((link: any, linkIndex: number) => (
                                        <li key={linkIndex}>
                                            <a 
                                                href={link.href?.startsWith('/page/') ? route('custom-page.show', link.href.replace('/page/', '')) : link.href}
                                                target={link.target === '_blank' ? '_blank' : '_self'}
                                                rel={link.target === '_blank' ? 'noopener noreferrer' : ''}
                                                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
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
                            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Contact</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href={`mailto:${contactEmail}`} className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                                        {contactEmail}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600">
                    <p>{copyrightText}</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
