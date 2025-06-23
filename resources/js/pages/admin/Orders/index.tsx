import React, { useEffect, useState } from 'react';
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
import { Plus, Filter, MoreHorizontal, Edit, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, BarChart, MapPin, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Badge, Button, Card, Input, Label } from '@/components/ui';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Driver } from '@/TypesGlobaux/user';
import { toast } from 'sonner';

interface Order {
  id: number;
  customer: {
    last_name: string;
    first_name: string;
    id: number;
    name: string;
    email: string;
    assigned_driver?: Driver;
  };
  restaurant: {
    restaurant_name: string;
    id: number;
    name: string;
  };
  order_status: {
    id: number;
    status: string;
  };
  assigned_driver?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  total_amount: string;
  delivery_fee: string;
  created_at: string;
  status: string;
  formatted_total: string;
}

interface Restaurant {
  id: number;
  restaurant_name: string;
}

interface OrderStatus {
  id: number;
  status: string;
  name: string;
}

interface PageProps {
  orders: {
    data: Order[];
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
  orderStatuses: OrderStatus[];
  restaurants: Restaurant[];
  filters: {
    status?: string;
    restaurant?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    sort?: string;
    direction?: string;
  };
  user?: {
    role: string;
  };
}

export default function OrdersIndex({ orders, orderStatuses, restaurants, filters, user }: PageProps) {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Assuming flash messages are passed via props (e.g., as a prop named 'flash')
    // If not, adjust according to your Inertia setup
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flash = (window as any).flash || (window as any).props?.flash || (window as any).app?.props?.flash || {};
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.data.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedOrders.length) return;

    setIsDeleting(true);
    try {
      await router.delete(route('admin.orders.bulk-delete'), {
        data: { order_ids: selectedOrders },
      });
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to delete orders:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(route('admin.orders.export', {
        ...localFilters,
        order_ids: selectedOrders.length ? selectedOrders : undefined,
      }));
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setLocalFilters(prev => ({
      ...prev,
      date_from: from,
      date_to: to,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.orders.index'), localFilters, {
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
    router.get(route('admin.orders.index'), {
      ...localFilters,
      sort: column,
      direction,
    }, {
      preserveState: true,
      preserveScroll: true,
      onError: () => {
        setError('Failed to sort orders. Please try again.');
      },
    });
  };

  const getSortIcon = (column: string) => {
    if (localFilters.sort !== column) return <ArrowUpDown className="h-4 w-4" />;
    return localFilters.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-100 text-gray-800';

    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-purple-100 text-purple-800',
      'dispatched': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (page: number) => {
    router.get(route('admin.orders.index'), {
      ...localFilters,
      page,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePageSizeChange = (perPage: number) => {
    router.get(route('admin.orders.index'), {
      ...localFilters,
      per_page: perPage,
      page: 1, // Reset to first page when changing page size
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getVisiblePages = () => {
    const current = orders.current_page;
    const last = orders.last_page;
    const delta = 2; // Number of pages to show on each side of current page
    
    const range = [];
    const rangeWithDots = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
      range.push(i);
    }
    
    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }
    
    rangeWithDots.push(...range);
    
    if (current + delta < last - 1) {
      rangeWithDots.push('...', last);
    } else if (last > 1) {
      rangeWithDots.push(last);
    }
    
    return rangeWithDots;
  };

  return (
    <AdminLayout title="Orders Management">
      <Head title="Orders" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold py-2 px-2">Orders</h1>
            <p className="text-gray-600 px-2">Manage food delivery orders</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedOrders.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export Selected'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete Selected'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Orders</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedOrders.length} selected orders? This action cannot be undone.
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
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Button asChild variant="outline">
                  <Link href={route('admin.orders.statistics')}>
                    <BarChart className="h-4 w-4 mr-2" />
                    Statistics
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={route('admin.orders.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Link>
                </Button>
              </>
            )}
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
                      placeholder="Search orders..."
                      value={localFilters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          'w-[120px] text-black', 
                          localFilters.status && 'bg-accent',
                          localFilters.status === 'All Statuses' && 'text-muted-foreground',
                        )}
                      >
                        {localFilters.status === 'All Statuses' ? 'All Statuses' : localFilters.status}
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-black" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[120px] p-0">
                      <div className="flex flex-col">
                        {orderStatuses.map(status => (
                          <Button
                            key={status.status}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm text-gray-500 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              handleFilterChange('status', status.status.toString());
                            }}
                          >
                            {status.status}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Restaurant</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn(
                        'w-[120px]',
                        localFilters.restaurant && 'bg-accent',
                        localFilters.restaurant === 'All Restaurants' && 'text-muted-foreground',
                      )}>
                        {localFilters.restaurant === 'All Restaurants' ? 'All Restaurants' : localFilters.restaurant}
                        <ChevronsUpDown className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[120px] p-0">
                      <div className="flex flex-col">
                        {restaurants.map(restaurant => (
                          <Button
                            key={restaurant.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm text-gray-500 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              handleFilterChange('restaurant', restaurant.id.toString());
                            }}
                          >
                            {restaurant.restaurant_name}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={localFilters.date_from || ''}
                      onChange={(e) => handleDateRangeChange(e.target.value, localFilters.date_to || '')}
                    />
                    <Input
                      type="date"
                      value={localFilters.date_to || ''}
                      onChange={(e) => handleDateRangeChange(localFilters.date_from || '', e.target.value)}
                    />
                  </div>
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
                    router.get(route('admin.orders.index'), {
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

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrders.length === orders.data.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      Order ID
                      {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('total_amount')}
                  >
                    <div className="flex items-center gap-2">
                      Total
                      {getSortIcon('total_amount')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('delivery_fee')}
                  >
                    <div className="flex items-center gap-2">
                      Delivery Fee
                      {getSortIcon('delivery_fee')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon('created_at')}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-500">{order.customer.first_name} {order.customer.last_name} </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.restaurant.restaurant_name}</TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    <TableCell>${order.delivery_fee}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status?.toLowerCase())}>
                        {order.order_status.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.assigned_driver ? (
                        <div>
                          <div className="font-medium">{order.assigned_driver.first_name} {order.assigned_driver.last_name}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={route('admin.orders.show', order.id)} className="text-blue-600 hover:underline">
                          View
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={route('admin.orders.tracking', order.id)}>
                                <MapPin className="h-4 w-4 mr-2" />
                                Track
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={route('admin.orders.history', order.id)}>
                                <Clock className="h-4 w-4 mr-2" />
                                History
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={route('admin.orders.edit', order.id)}>
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
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this order? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      router.delete(route('admin.orders.destroy', order.id), {
                                        onError: () => {
                                          setError('Failed to delete order. Please try again.');
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {orders.links.length > 3 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Page Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div>
                    Showing <span className="font-medium">{((orders.current_page - 1) * orders.per_page) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(orders.current_page * orders.per_page, orders.total)}
                    </span> of{' '}
                    <span className="font-medium">{orders.total}</span> orders
                  </div>
                  
                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <span>Show:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-16">
                          {orders.per_page}
                          <ChevronsUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-16 p-0" align="start">
                        <div className="flex flex-col">
                          {[10, 25, 50, 100].map((size) => (
                            <Button
                              key={size}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 justify-center text-sm",
                                orders.per_page === size && "bg-accent"
                              )}
                              onClick={() => handlePageSizeChange(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={orders.current_page === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  {/* Previous Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={orders.current_page === 1}
                    onClick={() => handlePageChange(orders.current_page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-2 py-1 text-sm text-gray-500">...</span>
                        ) : (
                          <Button
                            variant={page === orders.current_page ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0 text-sm"
                            onClick={() => handlePageChange(page as number)}
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={orders.current_page === orders.last_page}
                    onClick={() => handlePageChange(orders.current_page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Last Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={orders.current_page === orders.last_page}
                    onClick={() => handlePageChange(orders.last_page)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}