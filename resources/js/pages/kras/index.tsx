import { Head } from '@inertiajs/react';

export default function PresidentKras() {
    return (
        <>
            <Head title="President | Key Result Areas" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Key Result Areas (KRAs)
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Institution-wide strategic overview items.
                </p>
                <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                    Strategic oversight metrics data loading...
                </div>
            </div>
        </>
    );
}
