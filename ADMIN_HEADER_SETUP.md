# Admin Header Setup Documentation

## Overview
The admin header has been updated to match your backend structure with real search functionality and notifications system.

## Features Implemented

### 1. Search Functionality
- **Global Search**: Search across users, orders, and restaurants
- **Real-time Results**: Results update as you type (with 300ms debounce)
- **Categorized Results**: Results are grouped by type (Users, Orders, Restaurants)
- **Click Navigation**: Click on any result to navigate to the detail page

**Backend Routes:**
- `GET /admin/search` - Global search endpoint
- Returns JSON with categorized results

### 2. Notifications System
- **Real Notifications**: Connected to database notifications table
- **Unread Count**: Shows badge with unread notification count
- **Mark as Read**: Click notifications to mark as read
- **Mark All Read**: Button to mark all notifications as read
- **Auto-refresh**: Polls for new notifications every 30 seconds

**Backend Routes:**
- `GET /admin/notifications` - Get notifications
- `PATCH /admin/notifications/{id}/read` - Mark notification as read
- `PATCH /admin/notifications/read-all` - Mark all as read
- `GET /admin/notifications/unread-count` - Get unread count

### 3. User Profile Integration
- **Proper Name Display**: Uses `first_name` and `last_name` from your User model
- **Avatar Support**: Uses `avatar_url` field if available
- **Profile Links**: Links to admin profile and settings pages

## Database Changes

### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255), -- 'order', 'user', 'system', 'restaurant'
    title VARCHAR(255),
    message TEXT,
    data JSON NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Files Created/Modified

### Backend Files
1. **Models:**
   - `app/Models/Notification.php` - Notification model

2. **Controllers:**
   - `app/Http/Controllers/Admin/NotificationController.php` - Handle notifications
   - `app/Http/Controllers/Admin/SearchController.php` - Handle search

3. **Services:**
   - `app/Services/NotificationService.php` - Create notifications for events

4. **Database:**
   - `database/migrations/2025_06_23_001606_create_notifications_table.php`
   - `database/seeders/NotificationSeeder.php` - Sample notifications

5. **Routes:**
   - Updated `routes/web.php` with new admin routes

### Frontend Files
1. **Components:**
   - Updated `resources/js/components/Navigation/AdminNavigation/admin-header.tsx`

2. **Hooks:**
   - `resources/js/hooks/useNotifications.ts` - Custom hooks for notifications and search

## Usage

### Creating Notifications
Use the NotificationService to create notifications for various events:

```php
use App\Services\NotificationService;

// Create order notification
NotificationService::createOrderNotification($order, 'new');

// Create user notification
NotificationService::createUserNotification($user, 'registered');

// Create restaurant notification
NotificationService::createRestaurantNotification($restaurant, 'updated');

// Create system notification
NotificationService::createSystemNotification('System Update', 'Maintenance completed');
```

### Search Functionality
The search automatically searches across:
- **Users**: By first_name, last_name, email
- **Orders**: By order ID, customer name, restaurant name
- **Restaurants**: By restaurant name, email, phone

### Notification Types
- `order` - Order-related notifications
- `user` - User registration/updates
- `restaurant` - Restaurant updates
- `system` - System notifications

## Sample Data
The NotificationSeeder creates sample notifications:
- New order received
- New user registration
- Restaurant status update
- System maintenance
- Order delivered

## Integration Points
The header is now fully integrated with your existing:
- User authentication system
- Admin routes and middleware
- Database structure
- Inertia.js setup

## Next Steps
1. **Event Integration**: Add notification creation to your existing controllers (UserController, OrderController, etc.)
2. **Real-time Updates**: Consider adding WebSocket support for real-time notifications
3. **Notification Preferences**: Add user preferences for notification types
4. **Email Notifications**: Extend to send email notifications for important events 