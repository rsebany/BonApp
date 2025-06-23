import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import React from "react";
import { MoreHorizontal, Eye, Edit, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Restaurant {
    id: number;
    restaurant_name: string;
    email: string;
    phone: string;
    cuisine_type: string;
    is_active: boolean;
    address?: {
        city?: string;
    };
    created_at: string;
}

interface Props {
    restaurants: Restaurant[];
    cities: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>;
}

export default function RestaurantsIndex({ restaurants = [], cities = [], filters = {} }: Props) {
    const [dialogOpen, setDialogOpen] = React.useState<number | null>(null);
    const [restaurantToDelete, setRestaurantToDelete] = React.useState<Restaurant | null>(null);
    const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState(filters.search || "");
    const [city, setCity] = React.useState(filters.city || "");
    const [status, setStatus] = React.useState(filters.is_active || "");

    const restaurantList: Restaurant[] = Array.isArray(restaurants)
        ? restaurants
        : (restaurants.data ?? []);

    console.log('restaurants prop:', restaurants);

    const openDeleteDialog = (restaurant: Restaurant) => {
        setRestaurantToDelete(restaurant);
        setDialogOpen(restaurant.id);
        setDeleteError(null);
    };
    const closeDeleteDialog = () => {
        setDialogOpen(null);
        setRestaurantToDelete(null);
        setDeleteError(null);
    };
    const handleDelete = async () => {
        if (!restaurantToDelete) return;
        setIsDeleting(restaurantToDelete.id);
        setDeleteError(null);
        router.delete(route('admin.restaurants.destroy', restaurantToDelete.id), {
            onSuccess: () => {
                toast.success('Restaurant deleted successfully');
                closeDeleteDialog();
            },
            onError: (errors) => {
                setDeleteError(errors.error || 'Failed to delete restaurant');
                toast.error(errors.error || 'Failed to delete restaurant');
            },
            onFinish: () => setIsDeleting(null),
            preserveScroll: true,
        });
    };
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.restaurants.index'), { search, city, is_active: status }, { preserveState: true });
    };
    const handleToggleActive = (restaurant: Restaurant) => {
        router.post(route('admin.restaurants.toggleStatus', restaurant.id), {}, {
            onSuccess: () => toast.success('Status updated'),
            onError: () => toast.error('Failed to update status'),
            preserveScroll: true,
        });
    };
    return (
        <AdminLayout title="Restaurants">
            <Head title="Restaurants" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Restaurants</h2>
                    <Button asChild>
                        <Link href={route('admin.restaurants.create')}><Plus className="h-4 w-4 mr-2" />Add Restaurant</Link>
                    </Button>
                </div>
                <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                    <div>
                        <label className="block text-xs font-medium mb-1">Search</label>
                        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, email, phone..." />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">City</label>
                        <select className="border rounded px-2 py-1" value={city} onChange={e => setCity(e.target.value)}>
                            <option value="">All</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Status</label>
                        <select className="border rounded px-2 py-1" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <Button type="submit">Filter</Button>
                </form>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {restaurantList.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No restaurants found</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-left">City</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurantList.map((r: Restaurant) => (
                                    <tr key={r.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{r.restaurant_name}</td>
                                        <td className="p-4">{r.email}</td>
                                        <td className="p-4">{r.phone}</td>
                                        <td className="p-4">{r.address?.city || '-'}</td>
                                        <td className="p-4">
                                            <Badge color={r.is_active ? 'green' : 'red'}>
                                                {r.is_active ? <><CheckCircle className="inline h-4 w-4 mr-1" />Active</> : <><XCircle className="inline h-4 w-4 mr-1" />Inactive</>}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Dropdown.Root>
                                                <Dropdown.Trigger asChild>
                                                    <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content className="w-40">
                                                    <Dropdown.Item asChild>
                                                        <Link href={route('admin.restaurants.show', r.id)} className="flex items-center p-2 hover:bg-gray-100"><Eye className="h-4 w-4 mr-2" />View</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item asChild>
                                                        <Link href={route('admin.restaurants.edit', r.id)} className="flex items-center p-2 hover:bg-gray-100"><Edit className="h-4 w-4 mr-2" />Edit</Link>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item asChild>
                                                        <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => openDeleteDialog(r)}><Trash2 className="h-4 w-4 mr-2" />Delete</div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item asChild>
                                                        <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleToggleActive(r)}>
                                                            {r.is_active ? <><XCircle className="h-4 w-4 mr-2" />Deactivate</> : <><CheckCircle className="h-4 w-4 mr-2" />Activate</>}
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
                <AlertDialog open={dialogOpen !== null} onOpenChange={open => !open && closeDeleteDialog()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {restaurantToDelete?.restaurant_name}? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting === restaurantToDelete?.id}>
                                {isDeleting === restaurantToDelete?.id ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        {deleteError && <div className="text-red-500 text-xs mt-2">{deleteError}</div>}
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
} 