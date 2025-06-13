import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/Navigation/SideBar/input-error';
import TextLink from '@/components/Navigation/SideBar/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/User/user-auth-layout';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout 
      title="BonApp"
      description="Discover and order from the best restaurants around you"
    >
      <Head title="Sign up for BonApp" />

      {/* Food-themed registration card */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                autoFocus
                tabIndex={1}
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                disabled={processing}
                placeholder="Enter your full name"
                className="py-3 text-base focus:ring-orange-500 focus:border-orange-500"
              />
              <InputError message={errors.name} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                required
                tabIndex={2}
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                disabled={processing}
                placeholder="Enter your email"
                className="py-3 text-base focus:ring-orange-500 focus:border-orange-500"
              />
              <InputError message={errors.email} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                required
                tabIndex={3}
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                disabled={processing}
                placeholder="Create a password"
                className="py-3 text-base focus:ring-orange-500 focus:border-orange-500"
              />
              <InputError message={errors.password} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="password_confirmation" className="text-gray-700">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                required
                tabIndex={4}
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                disabled={processing}
                placeholder="Confirm your password"
                className="py-3 text-base focus:ring-orange-500 focus:border-orange-500"
              />
              <InputError message={errors.password_confirmation} className="mt-1" />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg shadow-md mt-2"
              tabIndex={5} 
              disabled={processing}
            >
              {processing ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="flex items-center justify-center my-2">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-4 text-sm text-gray-500">or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <TextLink href={route('login')} className="text-orange-600 hover:underline" tabIndex={6}>
                Log in
              </TextLink>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>By signing up, you agree to BonApp's <TextLink href="#" className="text-orange-600">Terms</TextLink> and 
        acknowledge our <TextLink href="#" className="text-orange-600">Privacy Policy</TextLink>.</p>
      </div>

      <div className="mt-8 text-center">
        <p className="font-semibold text-gray-700">Are you a restaurant owner?</p>
        <TextLink 
          href="/restaurant/signup" 
          className="text-orange-600 hover:underline font-medium"
        >
          List your restaurant on BonApp
        </TextLink>
      </div>
    </AuthLayout>
  );
}