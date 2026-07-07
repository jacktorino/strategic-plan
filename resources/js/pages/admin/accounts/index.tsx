import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';

type PendingUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

type DecidedUser = {
    id: number;
    name: string;
    email: string;
    status: 'approved' | 'rejected';
    role: string | null;
    approved_at: string | null;
    approver?: { name: string } | null;
};

type Props = {
    pending: PendingUser[];
    decided: DecidedUser[];
};

const ROLES = [
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Admin' },
    { value: 'president', label: 'President' },
];

export default function AdminUserAccounts({ pending, decided }: Props) {
    const { props } = usePage<{ success?: string }>();
    const [roleByUser, setRoleByUser] = useState<Record<number, string>>({});

    const approve = (id: number) => {
        router.patch(
            `/admin/accounts/${id}/approve`,
            { role: roleByUser[id] ?? 'staff' },
            { preserveScroll: true },
        );
    };

    const reject = (id: number) => {
        router.patch(
            `/admin/accounts/${id}/reject`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Admin | Approve Accounts" />
            <div className="p-6">
                <h1 className="mb-2 text-2xl font-bold tracking-tight">
                    Approve Accounts
                </h1>
                <p className="mb-6 text-muted-foreground">
                    Review new registrations and assign a role before granting
                    access.
                </p>

                {props.success && (
                    <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                        {props.success}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Pending requests ({pending.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pending.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                                No accounts are waiting for approval.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Requested</TableHead>
                                        <TableHead>Assign role</TableHead>
                                        <TableHead className="text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pending.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue="staff"
                                                    onValueChange={(value) =>
                                                        setRoleByUser(
                                                            (prev) => ({
                                                                ...prev,
                                                                [user.id]:
                                                                    value,
                                                            }),
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-36">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ROLES.map((role) => (
                                                            <SelectItem
                                                                key={role.value}
                                                                value={
                                                                    role.value
                                                                }
                                                            >
                                                                {role.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            reject(user.id)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            approve(user.id)
                                                        }
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {decided.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Recent decisions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Decided by</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {decided.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground capitalize">
                                                {user.role ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.status ===
                                                        'approved'
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.approver?.name ?? '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
