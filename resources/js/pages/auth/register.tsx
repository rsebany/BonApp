import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, UtensilsCrossed, ChefHat } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/Navigation/SideBar/input-error';
import TextLink from '@/components/Navigation/SideBar/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  remember: boolean;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthSplitLayout 
      title="Join BonApp"
      description="Create your account to start exploring delicious food"
    >
      <Head title="Sign up for BonApp" />

      <div className="bg-white rounded-xl p-8">
        <form className="space-y-5" onSubmit={submit}>
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                required
                autoFocus
                tabIndex={1}
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="John Doe"
                className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-[#00A699] focus:ring-[#00A699]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <InputError message={errors.name} className="mt-1 text-sm" />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                required
                tabIndex={2}
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="hungry@example.com"
                className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-[#00A699] focus:ring-[#00A699]"
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
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                tabIndex={3}
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-[#00A699] focus:ring-[#00A699] pr-10"
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
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <InputError message={errors.password} className="mt-1 text-sm" />
          </div>

          <div>
            <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                required
                tabIndex={4}
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="••••••••"
                className="py-3 px-4 pl-10 block w-full border-gray-300 rounded-lg text-sm focus:border-[#00A699] focus:ring-[#00A699]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <InputError message={errors.password_confirmation} className="mt-1 text-sm" />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="h-4 w-4 text-[#00A699] focus:ring-[#00A699] border-gray-300 rounded"
            />
            <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </Label>
          </div>

          <div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#00A699] to-[#008489] hover:from-[#008489] hover:to-[#00A699] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors duration-150"
              tabIndex={5} 
              disabled={processing}
            >
              {processing ? (
                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <UtensilsCrossed className="w-5 h-5 mr-2" />
              )}
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              asChild
            >
              <TextLink href={route('login')} className="flex items-center justify-center">
                Sign in instead
              </TextLink>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing up, you agree to BonApp's <TextLink href="#" className="text-[#00A699]">Terms</TextLink> and 
          acknowledge our <TextLink href="#" className="text-[#00A699]">Privacy Policy</TextLink>.</p>
        </div>

        <div className="mt-8 text-center lg:hidden">
          <p className="font-semibold text-gray-700">Are you a restaurant owner?</p>
          <TextLink 
            href="/restaurant/signup" 
            className="text-[#00A699] hover:underline font-medium flex items-center justify-center"
          >
            <ChefHat className="w-4 h-4 mr-1" />
            List your restaurant on BonApp
          </TextLink>
        </div>
      </div>
    </AuthSplitLayout>
  );
}