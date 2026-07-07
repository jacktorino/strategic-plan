// resources/js/pages/admin/kras/index.tsx
import { Head } from '@inertiajs/react';

type Kra = {
    id: number;
    code: string;
    title: string;
    description: string | null;
};

type Props = {
    kras: Kra[];
};

export default function AdminKras({ kras }: Props) {
    return (
        <>
            <Head title="Admin | Key Result Areas" />

            {/* Content directly renders inside the global wrapper now */}
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold tracking-tight">
                    Key Result Areas (KRAs)
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Manage institution-wide strategic overview items.
                </p>

                {kras.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                        No KRAs created yet.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {kras.map((kra) => (
                            <div
                                key={kra.id}
                                className="rounded-lg border p-4 shadow-sm"
                            >
                                <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                                    {kra.code}
                                </span>
                                <h3 className="text-lg font-bold">
                                    {kra.title}
                                </h3>
                                {kra.description && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {kra.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
