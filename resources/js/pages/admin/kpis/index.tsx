import { Head } from '@inertiajs/react';

export default function AdminKpis() {
    return (
        <>
            <Head title="Admin | KPI Management" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    KPI Management
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Create, modify, and assign target Key Performance
                    Indicators.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    KPI administrator panel template.
                </div>
            </div>
        </>
    );
}
