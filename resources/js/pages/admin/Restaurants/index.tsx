import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Filter, MoreHorizontal, Eye, Edit, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge, Button, Card, Input, Label } from '@/components/ui';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Restaurant {
  id: number;
  restaurant_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  address?: {
    address_line1?: string;
    city?: string;
    region?: string;
    country?: {
      country_name?: string;
    };
  };
}

interface PageProps {
  restaurants: {
    data: Restaurant[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  cities: string[];
  filters: {
    search?: string;
    is_active?: boolean;
    city?: string;
    sort?: string;
    direction?: string;
  };
  user?: {
    role: string;
  };
}

export default function RestaurantsIndex({ restaurants, cities, filters, user }: PageProps) {
  const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [error, setError] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRestaurants(restaurants.data.map(restaurant => restaurant.id));
    } else {
      setSelectedRestaurants([]);
    }
  };

  const handleSelectRestaurant = (restaurantId: number) => {
    setSelectedRestaurants(prev => {
      if (prev.includes(restaurantId)) {
        return prev.filter(id => id !== restaurantId);
      }
      return [...prev, restaurantId];
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedRestaurants.length) return;

    setIsDeleting(true);
    try {
      await router.delete(route('admin.restaurants.bulk-delete'), {
        data: { restaurant_ids: selectedRestaurants },
      });
      setSelectedRestaurants([]);
    } catch (error) {
      console.error('Failed to delete restaurants:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (name: string, value: string | boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.restaurants.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSort = (column: string) => {
    const direction = localFilters.sort === column && localFilters.direction === 'asc' ? 'desc' : 'asc';
    setLocalFilters(prev => ({
      ...prev,
      sort: column,
      direction,
    }));
    router.get(route('admin.restaurants.index'), {
      ...localFilters,
      sort: column,
      direction,
    }, {
      preserveState: true,
      preserveScroll: true,
      onError: () => {
        setError('Failed to sort restaurants. Please try again.');
      },
    });
  };

  const getSortIcon = (column: string) => {
    if (localFilters.sort !== column) return <ArrowUpDown className="h-4 w-4" />;
    return localFilters.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const toggleStatus = async (restaurantId: number, currentStatus: boolean) => {
    try {
      await router.put(route('admin.restaurants.update-status', restaurantId), {
        is_active: !currentStatus,
      });
    } catch (error) {
      console.error('Failed to update restaurant status:', error);
    }
  };

  return (
    <AdminLayout title="Restaurants Management">
      <Head title="Restaurants" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold py-2 px-2">Restaurants</h1>
            <p className="text-gray-600 px-2">Manage partner restaurants</p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            {selectedRestaurants.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete Selected'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Restaurants</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedRestaurants.length} selected restaurants? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {user?.role === 'admin' && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={route('admin.restaurants.create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Restaurant
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name, email or phone..."
                      value={localFilters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_active"
                      checked={localFilters.is_active === true}
                      onCheckedChange={(checked) => handleFilterChange('is_active', checked === true)}
                    />
                    <Label htmlFor="is_active">Active Only</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          'w-full justify-between',
                          localFilters.city && 'bg-accent'
                        )}
                      >
                        {localFilters.city || 'All Cities'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <div className="max-h-[300px] overflow-y-auto">
                        <div
                          className="px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                          onClick={() => handleFilterChange('city', '')}
                        >
                          All Cities
                        </div>
                        {cities.map(city => (
                          <div
                            key={city}
                            className="px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                            onClick={() => handleFilterChange('city', city)}
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLocalFilters({
                      sort: filters.sort,
                      direction: filters.direction,
                    });
                    router.get(route('admin.restaurants.index'), {
                      sort: filters.sort,
                      direction: filters.direction,
                    });
                  }}
                >
                  Reset
                </Button>
                <Button type="submit">
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Restaurants Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRestaurants.length === restaurants.data.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('restaurant_name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon('restaurant_name')}
                    </div>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      Phone
                      {getSortIcon('phone')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      {getSortIcon('created_at')}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.data.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRestaurants.includes(restaurant.id)}
                        onCheckedChange={() => handleSelectRestaurant(restaurant.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{restaurant.restaurant_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{restaurant.address?.city}, {restaurant.address?.region}</span>
                        <span className="text-sm text-gray-500">{restaurant.address?.country?.country_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{restaurant.email}</TableCell>
                    <TableCell>{restaurant.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={restaurant.is_active ? 'default' : 'secondary'} 
                        className="cursor-pointer"
                        onClick={() => toggleStatus(restaurant.id, restaurant.is_active)}
                      >
                        {restaurant.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(restaurant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={route('admin.restaurants.show', restaurant.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route('admin.restaurants.edit', restaurant.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this restaurant? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    router.delete(route('admin.restaurants.destroy', restaurant.id), {
                                      onError: () => {
                                        setError('Failed to delete restaurant. Please try again.');
                                      },
                                    });
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {restaurants.links.length > 3 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {restaurants.data.length} of {restaurants.total} restaurants
            </div>
            <div className="flex items-center gap-2">
              {restaurants.links.map((link, i) => (
                <Button
                  key={i}
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => {
                    if (link.url) {
                      router.get(link.url, {}, {
                        preserveState: true,
                        preserveScroll: true,
                      });
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        )}
    </AdminLayout>
  );
}