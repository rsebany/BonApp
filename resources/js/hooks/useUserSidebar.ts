import { useState, useEffect } from 'react';
import axios from 'axios';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon?: string;
}

interface OrderItem {
    id: number;
    restaurant_name: string;
    items: string[];
    total: number;
    status: string;
    estimated_time?: string;
    image_url?: string;
}

interface UserSidebarData {
    notifications: Notification[];
    orders: OrderItem[];
    unreadCount: number;
}

export function useUserSidebar() {
    const [data, setData] = useState<UserSidebarData>({
        notifications: [],
        orders: [],
        unreadCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSidebarData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch notifications and current orders in parallel
            const [notificationsResponse, ordersResponse] = await Promise.all([
                axios.get('/user/notifications'),
                axios.get('/user/orders/current'),
            ]);

            setData({
                notifications: notificationsResponse.data.notifications || [],
                orders: ordersResponse.data.orders || [],
                unreadCount: notificationsResponse.data.unread_count || 0,
            });
        } catch (err) {
            console.error('Error fetching sidebar data:', err);
            setError('Failed to load sidebar data');
            // Set default data on error
            setData({
                notifications: [],
                orders: [],
                unreadCount: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (id: number) => {
        try {
            await axios.patch(`/user/notifications/${id}/read`);
            // Update local state
            setData(prev => ({
                ...prev,
                notifications: prev.notifications.map(notification =>
                    notification.id === id ? { ...notification, read: true } : notification
                ),
                unreadCount: Math.max(0, prev.unreadCount - 1),
            }));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await axios.patch('/user/notifications/read-all');
            // Update local state
            setData(prev => ({
                ...prev,
                notifications: prev.notifications.map(notification => ({ ...notification, read: true })),
                unreadCount: 0,
            }));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchSidebarData();
    }, []);

    // Poll for updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchSidebarData, 30000);
        return () => clearInterval(interval);
    }, []);

    return {
        ...data,
        loading,
        error,
        refetch: fetchSidebarData,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };
} 