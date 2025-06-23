import { useState, useEffect } from 'react';
import axios from 'axios';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    is_read: boolean;
    data?: Record<string, unknown>;
}

interface SearchResult {
    id: number;
    type: 'user' | 'order' | 'restaurant';
    title: string;
    subtitle: string;
    url: string;
    role?: string;
    status?: string;
}

interface SearchResponse {
    users: SearchResult[];
    orders: SearchResult[];
    restaurants: SearchResult[];
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('admin.notifications.index'));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await axios.patch(route('admin.notifications.read', id));
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(route('admin.notifications.read-all'));
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, is_read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
}

export function useSearch() {
    const [searchResults, setSearchResults] = useState<SearchResponse>({
        users: [],
        orders: [],
        restaurants: [],
    });
    const [searchLoading, setSearchLoading] = useState(false);

    const performSearch = async (query: string) => {
        if (!query || query.length < 2) {
            setSearchResults({ users: [], orders: [], restaurants: [] });
            return;
        }

        try {
            setSearchLoading(true);
            const response = await axios.get(route('admin.search'), {
                params: { q: query }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults({ users: [], orders: [], restaurants: [] });
        } finally {
            setSearchLoading(false);
        }
    };

    return {
        searchResults,
        searchLoading,
        performSearch,
    };
} 