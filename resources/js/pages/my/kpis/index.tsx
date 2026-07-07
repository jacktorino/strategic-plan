import { Head } from '@inertiajs/react';

export default function UnitKpis() {
    return (
        <>
            <Head title="Staff | My KPIs" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    My KPIs
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Track and upload progress metrics against your unit's
                    assigned key targets.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Assigned unit KPI records template.
                </div>
            </div>
        </>
    );
}
