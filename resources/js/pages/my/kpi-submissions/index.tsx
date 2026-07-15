import { Head } from '@inertiajs/react';

export default function UnitActionPlans() {
    return (
        <>
            <Head title="Staff | My Action Plans" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    My Action Plans
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Manage scheduled milestones and operational checklists for
                    your department.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Assigned milestone execution template.
                </div>
            </div>
        </>
    );
}
