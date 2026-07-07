import { Head } from '@inertiajs/react';

export default function UnitCreateKpiSubmission() {
    return (
        <>
            <Head title="Staff | Propose a KPI" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Propose a KPI
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Submit a formal proposal for a new strategic key performance
                    evaluation item.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    KPI configuration proposal submission form template.
                </div>
            </div>
        </>
    );
}
