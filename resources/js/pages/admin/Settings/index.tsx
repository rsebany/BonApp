import { Head, usePage } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { 
    Users, 
    Store, 
    ShoppingCart, 
    Bell, 
    Settings, 
    Shield, 
    Database, 
    Activity,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';

interface AdminSettingsProps {
    stats: {
        totalUsers: number;
        activeRestaurants: number;
        pendingOrders: number;
        systemHealth: string;
    };
    recentActivities: Array<{
        id: string | number;
        action: string;
        time: string;
        type: string;
    }>;
    systemInfo: {
        version: string;
        lastUpdated: string;
        databaseSize: string;
        uptime: string;
        responseTime: string;
        activeSessions: number;
    };
    systemSettings: {
        maintenanceMode: boolean;
        emailNotifications: boolean;
        autoBackup: boolean;
    };
    [key: string]: any; // Add index signature for PageProps constraint
}

export default function AdminSettings() {
    const { props } = usePage<AdminSettingsProps>();
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(props.systemSettings?.maintenanceMode || false);
    const [emailNotifications, setEmailNotifications] = useState<boolean>(props.systemSettings?.emailNotifications || true);
    const [autoBackup, setAutoBackup] = useState<boolean>(props.systemSettings?.autoBackup || true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Use real data from backend
    const stats = props.stats || {
        totalUsers: 0,
        activeRestaurants: 0,
        pendingOrders: 0,
        systemHealth: 'Unknown'
    };

    const recentActivities = props.recentActivities || [];
    const systemInfo = props.systemInfo || {
        version: '1.0.0',
        lastUpdated: 'Unknown',
        databaseSize: 'Unknown',
        uptime: 'Unknown',
        responseTime: 'Unknown',
        activeSessions: 0
    };

    const quickActions = [
        { title: 'View All Users', href: '/admin/users', icon: Users, color: 'bg-blue-500' },
        { title: 'Manage Restaurants', href: '/admin/restaurants', icon: Store, color: 'bg-green-500' },
        { title: 'Order Management', href: '/admin/orders', icon: ShoppingCart, color: 'bg-orange-500' },
        { title: 'Notifications', href: '/admin/notifications', icon: Bell, color: 'bg-purple-500' },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default: return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    const handleSettingChange = async (setting: string, value: boolean) => {
        setIsUpdating(true);
        
        try {
            if (setting === 'maintenanceMode') {
                // Special handling for maintenance mode
                const response = await fetch('/admin/settings/maintenance-mode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ maintenanceMode: value }),
                });

                if (response.ok) {
                    setMaintenanceMode(value);
                }
            } else {
                // Update other settings
                const response = await fetch('/admin/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        maintenanceMode,
                        emailNotifications: setting === 'emailNotifications' ? value : emailNotifications,
                        autoBackup: setting === 'autoBackup' ? value : autoBackup,
                    }),
                });

                if (response.ok) {
                    if (setting === 'emailNotifications') setEmailNotifications(value);
                    if (setting === 'autoBackup') setAutoBackup(value);
                }
            }
        } catch (error) {
            console.error('Error updating setting:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Settings" />
            
            <SettingsLayout>
                <div className="space-y-6">
                    {/* System Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                System Overview
                            </CardTitle>
                            <CardDescription>
                                Real-time system statistics and health monitoring
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Total Users</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.activeRestaurants.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Active Restaurants</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Pending Orders</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.systemHealth}</div>
                                    <div className="text-sm text-muted-foreground">System Health</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription>
                                Access frequently used administrative functions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto p-4 flex flex-col items-center gap-2"
                                        asChild
                                    >
                                        <a href={action.href}>
                                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                                                <action.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium">{action.title}</span>
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                System Settings
                            </CardTitle>
                            <CardDescription>
                                Configure system-wide settings and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Maintenance Mode</div>
                                    <div className="text-sm text-muted-foreground">
                                        Temporarily disable the application for maintenance
                                    </div>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
                                    disabled={isUpdating}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Email Notifications</div>
                                    <div className="text-sm text-muted-foreground">
                                        Send email notifications for system events
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                                    disabled={isUpdating}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">Automatic Backups</div>
                                    <div className="text-sm text-muted-foreground">
                                        Automatically backup database daily
                                    </div>
                                </div>
                                <Switch
                                    checked={autoBackup}
                                    onCheckedChange={(value) => handleSettingChange('autoBackup', value)}
                                    disabled={isUpdating}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>
                                Latest system activities and events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                            {getActivityIcon(activity.type)}
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{activity.action}</div>
                                                <div className="text-xs text-muted-foreground">{activity.time}</div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {activity.type}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No recent activities
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Button variant="outline" size="sm" className="w-full">
                                    View All Activities
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                System Information
                            </CardTitle>
                            <CardDescription>
                                Technical details about the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Version:</span>
                                        <span className="font-medium">{systemInfo.version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <span className="font-medium">{systemInfo.lastUpdated}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Database Size:</span>
                                        <span className="font-medium">{systemInfo.databaseSize}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Uptime:</span>
                                        <span className="font-medium">{systemInfo.uptime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Response Time:</span>
                                        <span className="font-medium">{systemInfo.responseTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Active Sessions:</span>
                                        <span className="font-medium">{systemInfo.activeSessions}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AdminLayout>
    );
} 