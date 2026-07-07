import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Target, Send } from 'lucide-react';

type Submission = {
    id: number;
    submission_month: string;
    compliance_percentage: number;
};

type ActionPlan = {
    id: number;
    description: string;
    responsible_units: string[];
};

type Kpi = {
    id: number;
    code: string;
    name: string;
    action_plans: ActionPlan[];
    submissions: Submission[];
    average_compliance: number;
    active_target: string;
};

type Kra = {
    id: number;
    code: string;
    title: string;
    kpis: Kpi[];
};

type Props = {
    kras: Kra[];
    selectedAY: string;
    unitCode: string;
};

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default function UnitKpis({ kras, selectedAY, unitCode }: Props) {
    const [openKpiId, setOpenKpiId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year: selectedAY,
        submission_month: MONTHS[new Date().getMonth()],
        compliance_percentage: 100,
    });

    const submit = (kpiId: number) => {
        post(`/my/kpis/${kpiId}/submissions`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('compliance_percentage');
                setOpenKpiId(null);
            },
        });
    };

    const totalKpis = kras.reduce((sum, k) => sum + k.kpis.length, 0);

    return (
        <>
            <Head title={`My KPIs — ${unitCode}`} />
            <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
                        <Target className="h-6 w-6 text-green-600" />
                        My KPIs
                    </h1>
                    <p className="text-sm text-gray-500">
                        {totalKpis} KPI{totalKpis === 1 ? '' : 's'} assigned to{' '}
                        <span className="font-semibold text-gray-700">
                            {unitCode}
                        </span>{' '}
                        for AY {selectedAY}.
                    </p>
                </div>

                {totalKpis === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center text-gray-400">
                        No KPIs are currently assigned to your unit for AY{' '}
                        {selectedAY}.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {kras.map((kra) => (
                            <div
                                key={kra.id}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                                <div className="flex items-center gap-3 bg-gray-50/70 p-4">
                                    <span className="rounded-md bg-green-50 px-2.5 py-1 font-mono text-sm font-black text-green-600">
                                        {kra.code}
                                    </span>
                                    <h3 className="text-sm font-bold text-gray-900 md:text-base">
                                        {kra.title}
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {kra.kpis.map((kpi) => (
                                        <div key={kpi.id} className="p-4">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <span className="mr-2 font-mono text-xs font-bold text-gray-500">
                                                        {kpi.code}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {kpi.name}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                kpi.average_compliance >=
                                                                90
                                                                    ? 'bg-emerald-500'
                                                                    : kpi.average_compliance >=
                                                                        50
                                                                      ? 'bg-amber-500'
                                                                      : 'bg-rose-500'
                                                            }`}
                                                            style={{
                                                                width: `${kpi.average_compliance}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600">
                                                        {kpi.average_compliance}
                                                        % complied · target{' '}
                                                        {kpi.active_target}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-2 space-y-1.5 pl-1">
                                                {kpi.action_plans.map(
                                                    (plan, idx) => (
                                                        <p
                                                            key={plan.id}
                                                            className="text-xs leading-relaxed text-gray-600"
                                                        >
                                                            <span className="font-bold text-gray-400">
                                                                {idx + 1}.
                                                            </span>{' '}
                                                            {plan.description}
                                                            <span className="ml-2 inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                                                                <Building2 className="h-2.5 w-2.5" />
                                                                {plan.responsible_units.join(
                                                                    ', ',
                                                                )}
                                                            </span>
                                                        </p>
                                                    ),
                                                )}
                                            </div>

                                            {kpi.submissions.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-1">
                                                    {kpi.submissions.map(
                                                        (sub) => (
                                                            <span
                                                                key={sub.id}
                                                                className="rounded border bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-600"
                                                            >
                                                                {sub.submission_month.substring(
                                                                    0,
                                                                    3,
                                                                )}
                                                                :{' '}
                                                                <strong className="text-gray-900">
                                                                    {
                                                                        sub.compliance_percentage
                                                                    }
                                                                    %
                                                                </strong>
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            {openKpiId === kpi.id ? (
                                                <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">
                                                            Month
                                                        </label>
                                                        <select
                                                            value={
                                                                data.submission_month
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'submission_month',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="block rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
                                                        >
                                                            {MONTHS.map((m) => (
                                                                <option
                                                                    key={m}
                                                                    value={m}
                                                                >
                                                                    {m}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">
                                                            Compliance %
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={
                                                                data.compliance_percentage
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'compliance_percentage',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="block w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() =>
                                                            submit(kpi.id)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <Send className="h-3 w-3" />
                                                        Submit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenKpiId(null)
                                                        }
                                                        className="rounded-md px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                    {errors.compliance_percentage && (
                                                        <p className="w-full text-xs text-red-500">
                                                            {
                                                                errors.compliance_percentage
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenKpiId(kpi.id)
                                                    }
                                                    className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-green-600 hover:text-green-600"
                                                >
                                                    Report this month's progress
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
