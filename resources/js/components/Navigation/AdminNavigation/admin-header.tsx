import { Bell, Search, Settings, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AdminHeaderProps {
    title?: string;
}

export function AdminHeader({ title = 'Admin Dashboard' }: AdminHeaderProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        window.location.href = '/logout';
    };

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left - Logo & Title */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 bg-gray-50 border-gray-200 rounded-full focus:bg-white"
                    />
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        3
                    </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center space-x-2 p-1 rounded-full border hover:shadow-sm transition-shadow">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user?.avatar} alt={user?.name || 'Admin'} />
                                <AvatarFallback className="bg-blue-500 text-white text-sm">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <div className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} alt={user?.name || 'Admin'} />
                                <AvatarFallback className="bg-blue-500 text-white">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="font-medium text-sm">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}