import { Head } from '@inertiajs/react';

export default function AdminKpiSubmissions() {
    return (
        <>
            <Head title="Admin | KPI Proposals" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    KPI Proposals
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Review, approve, or reject new KPI criteria submissions from
                    staff units.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Proposal review dashboard template.
                </div>
            </div>
        </>
    );
}
