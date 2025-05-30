import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types/index';
import { NavUser } from './nav-user';
import { Search, Bell, SlidersHorizontal,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex flex-col gap-4 shrink-0 border-b p-4 bg-white">
            {/* Top row with location selector and user controls */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-gray-600" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            {/* Search and Filter Row */}
            <div className="flex items-center gap-3 w-full">
                {/* Search Input - 40% width */}
                <div className="relative w-[40%]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                    placeholder="Search menu items..."
                    className="pl-10 pr-4 py-2 h-10 rounded-lg bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 w-full"
                    />
                </div>
                {/* Filter Button - 10% width */}
                <div className="w-[5%]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                            variant="outline" 
                            className="h-10 w-full px-3 py-2 border-gray-200 bg-white hover:bg-gray-50 flex justify-center"
                            >
                            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                            <span className="sr-only">Filters</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked>
                                        Available Now
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Vegetarian
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Spicy
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>
                                        Special Offers
                                    </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* User Section - 50% width, aligned to right */}
                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-gray-600 w-10 h-10">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <NavUser />
                    </div>
                </div>
            </div>
        </header>
    );
}