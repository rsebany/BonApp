import { Bell, Search, Settings, User, LogOut, Users, Package, Store, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Button, Input } from '@/components/ui';
import { useNotifications, useSearch } from '@/hooks/useNotifications';

interface AdminHeaderProps {
    title?: string;
}

export function AdminHeader({ title = 'Admin Dashboard' }: AdminHeaderProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { searchResults, searchLoading, performSearch } = useSearch();

    // Handle search input changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.length >= 2) {
                performSearch(searchQuery);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch]);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                // Only close if search query is empty
                if (searchQuery.length === 0) {
                    setSearchOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery]);

    const handleSearchClick = () => {
        setSearchOpen(true);
    };

    const handleSearchInputFocus = () => {
        setSearchOpen(true);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSearchOpen(true);
    };

    const handleSearchResultClick = () => {
        // Keep dropdown open after clicking a result
        // setSearchOpen(false); // Removed this line
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handleClearSearch();
        }
    };

    const handleNotificationClick = (notification: { id: number; type: string; title: string; message: string; time: string; is_read: boolean; data?: Record<string, unknown> }) => {
        markAsRead(notification.id);
        setNotificationsOpen(false);
        // Navigate to notifications page
        router.visit(route('admin.notifications.all'));
    };

    const getUserInitials = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
        }
        return user?.first_name?.charAt(0)?.toUpperCase() || 'A';
    };

    const getUserFullName = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user?.first_name || 'Admin User';
    };

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left - Logo & Title */}
            <div className="flex items-center space-x-3">
                <h1 className={`text-lg font-semibold text-green-500 `}>{title}</h1>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
                <div className="relative flex items-center">
                    <Input
                        type="search"
                        placeholder="Search users, orders, restaurants..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={handleSearchInputFocus}
                        onKeyDown={handleKeyDown}
                        className="pl-4 pr-12 h-9 bg-gray-50 border-gray-200 rounded-r-none focus:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {searchQuery.length > 0 && (
                        <Button 
                            className="absolute right-12 h-9 w-9 p-0 hover:bg-gray-200"
                            onClick={handleClearSearch}
                            variant="ghost"
                            size="sm"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button 
                        className="h-9 rounded-l-none px-4 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-200 text-gray-600"
                        onClick={handleSearchClick}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search Results Dropdown */}
                {searchOpen && (searchQuery.length >= 2 || searchResults.users.length > 0 || searchResults.orders.length > 0 || searchResults.restaurants.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                        {searchLoading ? (
                            <div className="p-4 text-center text-gray-500">Searching...</div>
                        ) : (
                            <>
                                {searchResults.users.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">Users</div>
                                        {searchResults.users.map((user) => (
                                            <Link 
                                                key={`user-${user.id}`} 
                                                href={user.url} 
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                                                onClick={handleSearchResultClick}
                                            >
                                                <Users className="h-4 w-4 text-blue-500" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium">{user.title}</div>
                                                    <div className="text-xs text-gray-500">{user.subtitle}</div>
                                                </div>
                                                <div className="text-xs text-gray-400">{user.role}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {searchResults.orders.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">Orders</div>
                                        {searchResults.orders.map((order) => (
                                            <Link 
                                                key={`order-${order.id}`} 
                                                href={order.url} 
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                                                onClick={handleSearchResultClick}
                                            >
                                                <Package className="h-4 w-4 text-green-500" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium">{order.title}</div>
                                                    <div className="text-xs text-gray-500">{order.subtitle}</div>
                                                </div>
                                                <div className="text-xs text-gray-400">{order.status}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {searchResults.restaurants.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">Restaurants</div>
                                        {searchResults.restaurants.map((restaurant) => (
                                            <Link 
                                                key={`restaurant-${restaurant.id}`} 
                                                href={restaurant.url} 
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                                                onClick={handleSearchResultClick}
                                            >
                                                <Store className="h-4 w-4 text-orange-500" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium">{restaurant.title}</div>
                                                    <div className="text-xs text-gray-500">{restaurant.subtitle}</div>
                                                </div>
                                                <div className="text-xs text-gray-400">{restaurant.status}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {searchQuery.length >= 2 && searchResults.users.length === 0 && searchResults.orders.length === 0 && searchResults.restaurants.length === 0 && (
                                    <div className="p-4 text-center text-gray-500">
                                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                        <p>No results found for "{searchQuery}"</p>
                                        <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
                {/* Notifications */}
                <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-0" align="end">
                        <div className="p-2 border-b flex justify-between items-center">
                            <h3 className="font-medium">Notifications</h3>
                            {unreadCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    Mark all read
                                </Button>
                            )}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <DropdownMenuItem 
                                        key={notification.id} 
                                        className={`flex flex-col items-start p-3 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-center space-x-2 w-full">
                                            <div className={`w-2 h-2 rounded-full ${!notification.is_read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                            <p className="text-sm font-medium">{notification.title}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">No notifications</div>
                            )}
                        </div>
                        <DropdownMenuItem asChild>
                            <Link href={route('admin.notifications.all')} className="justify-center text-sm text-blue-600 hover:bg-gray-50">
                                View all notifications
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center space-x-2 p-1 rounded-full border hover:shadow-sm transition-shadow">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user?.avatar_url} alt={getUserFullName()} />
                                <AvatarFallback className="bg-blue-500 text-white text-sm">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <div className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar_url} alt={getUserFullName()} />
                                <AvatarFallback className="bg-blue-500 text-white">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="font-medium text-sm">{getUserFullName()}</p>
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
                            <Link href={route('admin.settings')} className="w-full">
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