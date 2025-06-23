import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Bell, Trash2, Check, CheckCheck, AlertTriangle, Package, Users, Store, Settings } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    is_read: boolean;
    data?: Record<string, unknown>;
    created_at: string;
}

interface NotificationsPageProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function NotificationsPage({ notifications }: NotificationsPageProps) {
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState<{ title: string; message: string; open: boolean }>({ title: '', message: '', open: false });

    useEffect(() => {
        const removeStartListener = router.on('start', () => setLoading(true));
        const removeFinishListener = router.on('finish', () => setLoading(false));

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <Package className="h-4 w-4 text-green-500" />;
            case 'user':
                return <Users className="h-4 w-4 text-blue-500" />;
            case 'restaurant':
                return <Store className="h-4 w-4 text-orange-500" />;
            case 'system':
                return <Settings className="h-4 w-4 text-purple-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'order':
                return 'bg-green-100 text-green-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            case 'restaurant':
                return 'bg-orange-100 text-orange-800';
            case 'system':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedNotifications(notifications.data.map(n => n.id));
        } else {
            setSelectedNotifications([]);
        }
    };

    const handleSelectNotification = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedNotifications(prev => [...prev, id]);
        } else {
            setSelectedNotifications(prev => prev.filter(n => n !== id));
        }
    };

    const handleMarkAsRead = (id: number) => {
        router.patch(route('admin.notifications.read', id), {}, {
            onSuccess: () => setModalState({ title: 'Success', message: 'Notification marked as read.', open: true }),
            onError: () => setModalState({ title: 'Error', message: 'Failed to mark notification as read.', open: true }),
            preserveScroll: true,
        });
    };

    const handleMarkAllAsRead = () => {
        router.patch(route('admin.notifications.read-all'), {}, {
            onSuccess: () => setModalState({ title: 'Success', message: 'All notifications marked as read.', open: true }),
            onError: () => setModalState({ title: 'Error', message: 'Failed to mark all notifications as read.', open: true }),
            preserveScroll: true,
        });
    };

    const handleDeleteNotification = (id: number) => {
        router.delete(route('admin.notifications.destroy', id), {
            onSuccess: () => setModalState({ title: 'Success', message: 'Notification deleted successfully.', open: true }),
            onError: () => setModalState({ title: 'Error', message: 'Failed to delete notification.', open: true }),
            preserveScroll: true,
        });
    };

    const handleBulkDelete = () => {
        if (selectedNotifications.length === 0) {
            setModalState({ title: 'Info', message: 'Please select notifications to delete.', open: true });
            return;
        }

        const allSelectedOnPage = selectedNotifications.length === notifications.data.length;

        if (allSelectedOnPage) {
            handleClearAll();
            return;
        }

        router.delete(route('admin.notifications.bulk-delete'), {
            data: { ids: selectedNotifications },
            onSuccess: () => {
                setSelectedNotifications([]);
                setModalState({ title: 'Success', message: `${selectedNotifications.length} notifications deleted.`, open: true });
            },
            onError: () => setModalState({ title: 'Error', message: 'Failed to delete notifications.', open: true }),
            preserveScroll: true,
        });
    };

    const handleClearAll = () => {
        router.delete(route('admin.notifications.clear-all'), {
            onSuccess: () => {
                setSelectedNotifications([]);
                setModalState({ title: 'Success', message: 'All notifications cleared.', open: true });
            },
            onError: () => setModalState({ title: 'Error', message: 'Failed to clear all notifications.', open: true }),
            preserveScroll: true,
        });
    };

    const unreadCount = notifications.data.filter(n => !n.is_read).length;

    return (
        <AdminLayout>
            <Head title="Notifications" />
            
            <AlertDialog open={modalState.open} onOpenChange={(open) => !open && setModalState({ title: '', message: '', open: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{modalState.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {modalState.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setModalState({ title: '', message: '', open: false })}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">
                            Manage your system notifications
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                            <Button
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                variant="outline"
                                size="sm"
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Mark all read
                            </Button>
                        )}
                        {selectedNotifications.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={loading}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Selected ({selectedNotifications.length})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Notifications</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete {selectedNotifications.length} notification(s)? This action cannot be undone.
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={loading}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear All Notifications</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete all notifications? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClearAll}>
                                        Clear All
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{notifications.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Read</CardTitle>
                            <Check className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{notifications.total - unreadCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Page</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{notifications.data.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Notifications</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={selectedNotifications.length === notifications.data.length && notifications.data.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-muted-foreground">Select All</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {notifications.data.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                                <p className="text-muted-foreground">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start space-x-4 p-4 rounded-lg border ${
                                            !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3 flex-1">
                                            <Checkbox
                                                checked={selectedNotifications.includes(notification.id)}
                                                onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                                            />
                                            <div className="flex items-start space-x-3 flex-1">
                                                {getNotificationIcon(notification.type)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="text-sm font-medium">{notification.title}</h4>
                                                        <Badge className={getNotificationColor(notification.type)}>
                                                            {notification.type}
                                                        </Badge>
                                                        {!notification.is_read && (
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                                Unread
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                        <span>{notification.time}</span>
                                                        <span>{notification.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {!notification.is_read && (
                                                <Button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    disabled={loading}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this notification? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteNotification(notification.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            {notifications.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.notifications.all'), { page: notifications.current_page - 1 })}
                                >
                                    Previous
                                </Button>
                            )}
                            <span className="text-sm text-muted-foreground">
                                Page {notifications.current_page} of {notifications.last_page}
                            </span>
                            {notifications.current_page < notifications.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.notifications.all'), { page: notifications.current_page + 1 })}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
} 