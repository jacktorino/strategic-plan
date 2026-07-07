import { Head } from '@inertiajs/react';

export default function UnitReports() {
    return (
        <>
            <Head title="Staff | My Reports" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    My Reports
                </h1>
                <p className="mb-6 text-muted-foreground">
                    View your unit's target history and compile operational
                    statistics summaries.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Department reports panel template.
                </div>
            </div>
        </>
    );
}
