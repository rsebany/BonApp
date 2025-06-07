import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button, Input, Textarea } from "@/components/ui";
import { CreateRestaurantForm } from "@/types/forms";

export default function CreateRestaurantPage() {
    const { data, setData, post, processing, errors } = useForm<CreateRestaurantForm & { [key: string]: string }>({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        opening_hours: '',
        cuisine_type: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.restaurants.store'));
    };

    return (
        <AdminLayout title="Add New Restaurant">
            <Head title="Add New Restaurant" />
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-6">Add New Restaurant</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                            <Input
                                value={data.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                /*onError={errors.name}*/
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <Textarea
                                value={data.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <Input
                                value={data.address}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('address', e.target.value)}
                                /*error={errors.address}*/
                                required
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <Input
                                    value={data.phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                                <Input
                                    value={data.opening_hours}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('opening_hours', e.target.value)}
                                    placeholder="e.g. 9:00 AM - 10:00 PM"
                                />
                                {errors.opening_hours && <p className="mt-1 text-sm text-red-600">{errors.opening_hours}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                                <Input
                                    value={data.cuisine_type}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('cuisine_type', e.target.value)}
                                    placeholder="e.g. Italian, Chinese, etc."
                                />
                                {errors.cuisine_type && <p className="mt-1 text-sm text-red-600">{errors.cuisine_type}</p>}
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Restaurant'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}