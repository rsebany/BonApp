import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button, Input } from '@/components/ui';

interface AdminHeaderProps {
    title?: string;
}

export function AdminHeader({ title = 'Admin Dashboard' }: AdminHeaderProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // Mock notifications data
    const notifications = [
        { id: 1, text: 'New user registered', time: '2 minutes ago' },
        { id: 2, text: 'System update available', time: '1 hour ago' },
        { id: 3, text: 'New message received', time: '3 hours ago' },
    ];

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left - Logo & Title */}
            <div className="flex items-center space-x-3">
                <h1 className={`text-lg font-semibold text-red-500`}>{title}</h1>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative flex items-center">
                    <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-4 pr-12 h-9 bg-gray-50 border-gray-200 rounded-r-none focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button 
                        className="h-9 rounded-l-none px-4 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-200 text-gray-600"
                        onClick={() => console.log('Search:', searchQuery)}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
                {/* Notifications */}
                <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                            <Bell className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                {notifications.length}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-0" align="end">
                        <div className="p-2 border-b">
                            <h3 className="font-medium">Notifications</h3>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 hover:bg-gray-50">
                                    <p className="text-sm">{notification.text}</p>
                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuItem className="justify-center text-sm text-blue-600 hover:bg-gray-50">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
                        <DropdownMenuItem asChild>
                            <Link href={route('admin.profile.edit')} className="w-full">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('admin.profile.edit')} className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('logout')} method="post" as="button" className="w-full text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}