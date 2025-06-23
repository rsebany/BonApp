import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import React from "react";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    is_available: boolean;
}

interface PaginatedUsers {
    data: User[];
    links: object;
    meta: object;
}

export default function UsersPage({ users }: { users: PaginatedUsers }) {
    const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState<number | null>(null);
    const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

    // Safely access users data
    const usersList = users?.data || [];

    const getRoleBadge = (role: string) => {
        const roleMap: Record<string, 'purple' | 'blue' | 'green' | 'gray'> = {
            admin: 'purple',
            manager: 'blue',
            customer: 'green',
            driver: 'blue'
        };
        return <Badge color={roleMap[role] || 'gray'}>{role}</Badge>;
    };

    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setDialogOpen(user.id);
        setDeleteError(null);
    };

    const closeDeleteDialog = () => {
        setDialogOpen(null);
        setUserToDelete(null);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        
        setDeleteError(null);
        setIsDeleting(userToDelete.id);
        
        try {
            router.delete(route('admin.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    toast.success('User deleted successfully');
                    closeDeleteDialog();
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    // Handle different types of errors
                    if (typeof errors === 'string') {
                        setDeleteError(errors);
                        toast.error(errors);
                    } else if (errors.message) {
                        setDeleteError(errors.message);
                        toast.error(errors.message);
                    } else if (errors.error) {
                        setDeleteError(errors.error);
                        toast.error(errors.error);
                    } else {
                        setDeleteError('Failed to delete user');
                        toast.error('Failed to delete user');
                    }
                },
                onFinish: () => {
                    setIsDeleting(null);
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            setDeleteError('An unexpected error occurred');
            toast.error('An unexpected error occurred');
            setIsDeleting(null);
        }
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
                    {usersList.length === 0 ? (
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
                                {usersList.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">{`${user.first_name} ${user.last_name}`}</td>
                                        <td className="p-4 align-middle">{user.email}</td>
                                        <td className="p-4 align-middle">{getRoleBadge(user.role)}</td>
                                        <td className="p-4 align-middle">
                                            <Badge color={user.is_available ? 'green' : 'red'}>
                                                {user.is_available ? 'Available' : 'Unavailable'}
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
                                                        <div 
                                                            className="flex items-center justify-between w-full p-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => openDeleteDialog(user)}
                                                        >
                                                            <div className="flex items-center">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                <span>Delete</span>
                                                            </div>
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

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={dialogOpen !== null} onOpenChange={(open) => !open && closeDeleteDialog()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}? 
                                This action cannot be undone and will permanently delete the user account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {deleteError && (
                            <div className="text-red-500 px-4 py-2 bg-red-50 rounded">
                                {deleteError}
                            </div>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={closeDeleteDialog}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting !== null}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting !== null ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}