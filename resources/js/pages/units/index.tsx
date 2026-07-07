import { Head } from '@inertiajs/react';

export default function PresidentUnits() {
    return (
        <>
            <Head title="President | Responsible Units" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Responsible Units
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Overview of university units and assigned targets.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Department assignments overview loading...
                </div>
            </div>
        </>
    );
}
