import AdminLayout from "@/layouts/Admin/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button, Input } from "@/components/ui";
import { FormEvent } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  [key: string]: string;
}

export default function CreateUserPage() {
  const { data, setData, post, processing, errors } = useForm<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'customer', label: 'Customer' },
    { value: 'driver', label: 'Driver' },
  ];

  return (
    <AdminLayout title="Add New User">
      <Head title="Add New User" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Add New User</h2>
          <Button asChild variant="outline">
            <Link href={route('admin.users.index')}>Back to Users</Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="first_name">First Name</label>
                <Input
                  id="first_name"
                  value={data.first_name}
                  onChange={(e) => setData('first_name', e.target.value)}
                  required
                />
                {errors.first_name && <div className="text-red-500 text-xs mt-1">{errors.first_name}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="last_name">Last Name</label>
                <Input
                  id="last_name"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  required
                />
                {errors.last_name && <div className="text-red-500 text-xs mt-1">{errors.last_name}</div>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password_confirmation">Confirm Password</label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  required
                />
                {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
              </div>

             <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="role">
                    Role
                </label>
                <RadixSelect.Root
                    value={data.role}
                    onValueChange={(value) => setData('role', value)}
                >
                    <RadixSelect.Trigger
                    id="role"
                    className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Role"
                    >
                    <RadixSelect.Value placeholder="Select a role" />
                    <RadixSelect.Icon>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </RadixSelect.Icon>
                    </RadixSelect.Trigger>

                    <RadixSelect.Portal>
                    <RadixSelect.Content className="z-50 overflow-hidden bg-white rounded-md shadow-lg border">
                        <RadixSelect.ScrollUpButton />
                        <RadixSelect.Viewport className="p-1">
                        {roleOptions.map((option) => (
                            <RadixSelect.Item
                            key={option.value}
                            value={option.value}
                            className="relative flex items-center px-8 py-2 text-sm rounded-md hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                            >
                            <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                            <RadixSelect.ItemIndicator className="absolute left-2">
                                <Check className="h-4 w-4 text-blue-500" />
                            </RadixSelect.ItemIndicator>
                            </RadixSelect.Item>
                        ))}
                        </RadixSelect.Viewport>
                        <RadixSelect.ScrollDownButton />
                    </RadixSelect.Content>
                    </RadixSelect.Portal>
                </RadixSelect.Root>
                {errors.role && (
                    <div className="text-red-500 text-xs mt-1">{errors.role}</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={route('admin.users.index')}>Cancel</Link>
              </Button>
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