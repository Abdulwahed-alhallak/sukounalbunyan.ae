import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { getImagePath } from '@/utils/helpers';
import { PhoneInputComponent } from '@/components/ui/phone-input';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const { t } = useTranslation();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        mobile_no: (user as any).mobile_no || '',
        avatar: (user as any).avatar || '',
        slug: (user as any).slug || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label>{t('Avatar')}</Label>
                    <div className="mt-3 flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-border bg-muted/50">
                            {data.avatar ? (
                                <img
                                    src={getImagePath(data.avatar)}
                                    alt="Avatar Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <svg className="mx-auto mb-1 h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-xs">{t('No Image')}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <MediaPicker
                                value={data.avatar}
                                onChange={(value) => setData('avatar', value)}
                                placeholder={t('Select avatar image...')}
                                showPreview={false}
                            />
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('Upload a profile picture. Recommended size: 200x200px')}
                            </p>
                        </div>
                    </div>
                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div>
                    <Label htmlFor="name">{t('Name')}</Label>

                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={t('Enter your full name')}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <Label htmlFor="email">{t('Email')}</Label>

                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('Enter your email address')}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <PhoneInputComponent
                        label={t('Mobile Number')}
                        value={data.mobile_no}
                        onChange={(value) => setData('mobile_no', value)}
                        placeholder="+1234567890"
                        error={errors.mobile_no}
                    />
                </div>

                {user?.type === 'company' && (
                    <div>
                        <Label htmlFor="slug">{t('URL Slug')}</Label>

                        <Input
                            id="slug"
                            className="mt-1 block w-full"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder={t('Enter custom URL slug (e.g., my-business)')}
                            autoComplete="off"
                        />

                        <InputError className="mt-2" message={errors.slug} />
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-foreground">
                            {t('Your email address is unverified.')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                {t('Click here to re-send the verification email.')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-foreground">
                                {t('A new verification link has been sent to your email address.')}
                            </div>
                        )}
                    </div>
                )}

                {auth.user?.permissions?.includes('edit-profile') && (
                    <div className="flex items-center justify-end gap-4">
                        <Button disabled={processing}>{t('Save Changes')}</Button>
                    </div>
                )}
            </form>
        </section>
    );
}
