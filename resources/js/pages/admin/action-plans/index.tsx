import { Head } from '@inertiajs/react';

export default function AdminActionPlans() {
    return (
        <>
            <Head title="Admin | Assign Action Plans" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Assign Action Plans
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Delegate strategic action configurations to functional
                    units.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Action plan assigner panel template.
                </div>
            </div>
        </>
    );
}
