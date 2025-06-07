import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button, Input, Select } from "@/components/ui";

interface CreateUserForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    [key: string]: string;
}

export default function CreateUserPage() {
    const { data, setData, post, processing} = useForm<CreateUserForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout title="Add New User">
            <Head title="Add New User" />
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-6">Add New User</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={data.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                            /*onError={errors.name}*/
                            required
                        />
                        
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                            /*error={errors.email}*/
                            required
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                                /*error={errors.password}*/
                                required
                            />
                            
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                                /*error={errors.password_confirmation}*/
                                required
                            />
                        </div>
                        
                        <Select
                            value={data.role}
                            /*onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('role', e.target.value)}*/
                            /*error={errors.role}*/
                            /*options={[
                                { value: 'admin', label: 'Administrator' },
                                { value: 'manager', label: 'Manager' },
                                { value: 'customer', label: 'Customer' },
                            ]}*/
                        />
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}