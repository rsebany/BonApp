import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button"; // More specific import
import { Badge } from "@/components/ui/badge"; // More specific import
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { JSX } from "react";

// Define types for Dropdown sub-components
interface DropdownComponent {
    (props: { children: React.ReactNode }): JSX.Element;
    Trigger: React.ComponentType<{ children: React.ReactNode }>;
    Content: React.ComponentType<{ children: React.ReactNode }>;
    Item: React.ComponentType<{ 
        children: React.ReactNode;
        className?: string;
    }>;
    Link: React.ComponentType<{ 
        href: string; 
        method?: string; 
        as?: string; 
        className?: string;
        children: React.ReactNode 
    }>;
}

const DropdownMenu = Dropdown.Root as unknown as DropdownComponent;
DropdownMenu.Trigger = Dropdown.Trigger;
DropdownMenu.Content = Dropdown.Content;
DropdownMenu.Item = Dropdown.Item;

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
    const getRoleBadge = (role: string) => {
        const roleMap: Record<string, 'purple' | 'blue' | 'green' | 'gray'> = {
            admin: 'purple',
            manager: 'blue',
            customer: 'green',
            driver: 'blue' // Added driver role
        };
        return <Badge color={roleMap[role] || 'gray'}>{role}</Badge>;
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
                                            <DropdownMenu>
                                                <DropdownMenu.Trigger >
                                                    <Button variant="ghost" size="sm">Actions</Button>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item>
                                                        <DropdownMenu.Link 
                                                            href={route('admin.users.edit', user.id)}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </DropdownMenu.Link>
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item>
                                                        <DropdownMenu.Link 
                                                            href={route('admin.users.show', user.id)}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            View
                                                        </DropdownMenu.Link>
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item>
                                                        <DropdownMenu.Link
                                                            href={route('admin.users.destroy', user.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </DropdownMenu.Link>
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu>
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