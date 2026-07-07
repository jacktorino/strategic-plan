import { Head, usePage } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Card } from '@/components/ui/card';
import { login } from '@/routes';

export default function RegistrationPending() {
    const { props } = usePage<{ status?: string }>();

    return (
        <>
            <Head title="Registration Pending" />
            <Card className="p-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <MailCheck className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-semibold">
                    Account pending approval
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {props.status ??
                        'Your registration has been received. An administrator needs to review and approve your account before you can sign in.'}
                </p>
                <p className="mt-6 text-sm text-muted-foreground">
                    Already approved? <TextLink href={login()}>Log in</TextLink>
                </p>
            </Card>
        </>
    );
}

RegistrationPending.layout = {
    title: 'Registration pending',
    description: 'Your account is awaiting approval',
};
