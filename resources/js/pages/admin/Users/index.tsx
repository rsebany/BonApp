import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import React from "react";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// ... (keep your existing DropdownComponent interface and setup)

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

export default function UsersPage({ users = [] }: { users?: User[] }) {
    const [isDeleting, setIsDeleting] = React.useState<number | null>(null);

    const getRoleBadge = (role: string) => {
        const roleMap: Record<string, 'purple' | 'blue' | 'green' | 'gray'> = {
            admin: 'purple',
            manager: 'blue',
            customer: 'green',
            driver: 'blue'
        };
        return <Badge color={roleMap[role] || 'gray'}>{role}</Badge>;
    };

    const handleDelete = (userId: number) => {
        setIsDeleting(userId);
        router.delete(route('admin.users.destroy', userId), {
            onSuccess: () => {
                toast.success('User deleted');
                setIsDeleting(null);
            },
            onError: () => {
                toast.error('Delete failed');
                setIsDeleting(null);
            },
        });
    };

    return (
        <AdminLayout title="User Management">
            <Head title="User Management" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Users Overview</h2>
                    <Button asChild>
                        <Link href={route('admin.users.create')}>Add New User</Link>
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">{`${user.first_name} ${user.last_name}`}</td>
                                        <td className="p-4 align-middle">{user.email}</td>
                                        <td className="p-4 align-middle">{getRoleBadge(user.role)}</td>
                                        <td className="p-4 align-middle">
                                            <Badge color={user.email_verified_at ? 'green' : 'yellow'}>
                                                {user.email_verified_at ? 'Verified' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Dropdown.Root>
                                                <Dropdown.Trigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content className="w-40">
                                                    <Dropdown.Item asChild>
                                                        <Link 
                                                            href={route('admin.users.show', user.id)} 
                                                            className="flex items-center justify-between w-full p-2 hover:bg-gray-100"
                                                        >
                                                            <div className="flex items-center">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                <span>View</span>
                                                            </div>
                                                        </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item asChild>
                                                        <Link 
                                                            href={route('admin.users.edit', user.id)} 
                                                            className="flex items-center justify-between w-full p-2 hover:bg-gray-100"
                                                        >
                                                            <div className="flex items-center">
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                <span>Edit</span>
                                                            </div>
                                                        </Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item asChild>
                                                        <div>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger className="w-full text-left">
                                                                    <div className="flex items-center justify-between w-full p-2 hover:bg-gray-100 cursor-pointer">
                                                                        <div className="flex items-center">
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            <span>Delete</span>
                                                                        </div>
                                                                    </div>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete {user.first_name} {user.last_name}?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This will permanently delete this user account and all associated data.
                                                                            This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(user.id)}
                                                                            disabled={isDeleting === user.id}
                                                                        >
                                                                            {isDeleting === user.id ? 'Deleting...' : 'Delete'}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </Dropdown.Item>
                                                </Dropdown.Content>
                                            </Dropdown.Root>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}