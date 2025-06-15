import AppLogoIcon from '@/components/Navigation/SideBar/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Visual Content (Full width background) */}
            <div className="hidden lg:block w-1/2 bg-gradient-to-br from-[#00A699] to-[#008489] fixed left-0 top-0 h-full">
                <div className="h-full flex flex-col justify-center p-12 pl-24">
                    <Link href={route('home')} className="flex items-center mb-8">
                        <AppLogoIcon className="w-8 h-8 text-white" />
                        <span className="ml-2 text-2xl font-bold text-white">BonApp</span>
                    </Link>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold text-white mb-4">Discover Local Flavors</h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join our community of food lovers and explore the best restaurants in your city.
                        </p>

                        {quote && (
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-white text-sm italic">
                                            "{quote.message}"
                                        </p>
                                        <p className="text-white/80 text-xs mt-2">- {quote.author}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="w-full lg:w-1/2 ml-auto bg-white">
                <div className="min-h-screen flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <Link href={route('home')} className="lg:hidden flex items-center justify-center mb-8">
                            <AppLogoIcon className="h-10 w-10 text-[#00A699]" />
                        </Link>
                        <div className="text-center mb-8 lg:hidden">
                            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                            <p className="text-gray-600 mt-2">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}