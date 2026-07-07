import { Head } from '@inertiajs/react';

export default function AdminAcademicYears() {
    return (
        <>
            <Head title="Admin | Academic Years" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Academic Years
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Open, close, or initialize planning cycles and evaluation
                    years.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Academic period manager timeline template.
                </div>
            </div>
        </>
    );
}
