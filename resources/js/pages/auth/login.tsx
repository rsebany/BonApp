import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Utensils, MapPin, Eye, EyeOff, ChefHat } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/Navigation/SideBar/input-error';
import TextLink from '@/components/Navigation/SideBar/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/User/user-auth-layout';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout 
      title="BonApp"
      description="Discover and order from the best restaurants around you"
    >
      <Head title="Log in to BonApp" />

      <div className="max-w-md w-full mx-auto">
        {/* Food-themed header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to BonApp</h1>
          <p className="text-gray-600 mt-2">Find delicious food near you</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          {status && (
            <div className="mb-4 p-3 bg-orange-50 text-orange-800 text-sm rounded-md flex items-center">
              <ChefHat className="w-4 h-4 mr-2" />
              {status}
            </div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="hungry@example.com"
                  className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <InputError message={errors.email} className="mt-1 text-sm" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                {canResetPassword && (
                  <TextLink 
                    href={route('password.request')} 
                    className="text-xs text-orange-600 hover:text-orange-800"
                    tabIndex={4}
                  >
                    Forgot password?
                  </TextLink>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500 pr-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={3}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <InputError message={errors.password} className="mt-1 text-sm" />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </Label>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors duration-150"
                tabIndex={4} 
                disabled={processing}
              >
                {processing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Utensils className="w-5 h-5 mr-2" />
                )}
                Sign in to order
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or find restaurants near you</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                asChild
              >
                <TextLink href="/restaurants/nearby" className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                  Discover local restaurants
                </TextLink>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            New to BonApp?{' '}
            <TextLink href={route('register')} className="text-orange-600 font-medium hover:text-orange-800">
              Create an account
            </TextLink>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="font-semibold text-gray-700">Are you a restaurant owner?</p>
          <TextLink 
            href="/restaurant/signup" 
            className="text-orange-600 hover:underline font-medium flex items-center justify-center"
          >
            <ChefHat className="w-4 h-4 mr-1" />
            List your restaurant on BonApp
          </TextLink>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By continuing, you agree to BonApp's <TextLink href="#" className="text-orange-600">Terms</TextLink> and 
          acknowledge our <TextLink href="#" className="text-orange-600">Privacy Policy</TextLink>.</p>
        </div>
      </div>
    </AuthLayout>
  );
}