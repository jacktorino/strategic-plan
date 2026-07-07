import { Head } from '@inertiajs/react';

export default function AdminUnits() {
    return (
        <>
            <Head title="Admin | Unit Management" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Units
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Manage university departments, personnel configurations, and
                    operational roles.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    User directory and department unit panel template.
                </div>
            </div>
        </>
    );
}
