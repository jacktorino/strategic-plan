import { Head } from '@inertiajs/react';

export default function AdminReports() {
    return (
        <>
            <Head title="Admin | Reports & Analytics" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Reports & Analytics
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Aggregate compliance statistics and target generation
                    configurations.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    System report designer interface template.
                </div>
            </div>
        </>
    );
}
