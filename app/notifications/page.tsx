'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  CheckCheck,
  Bell,
  AlertCircle,
  Info,
  Calendar,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import NotificationList from '@/components/NotificationList';
import { useAppStore } from '@/utils/store';
import { api } from '@/utils/api';
import { Notification } from '@/utils/mockData';

export default function NotificationsPage() {
  const { setLoading, loading, setUnreadNotifications } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading('notifications', true);
      try {
        const data = await api.getNotifications();
        setNotifications(data);
        // Update unread count
        const unreadCount = data.filter((n) => !n.isRead).length;
        setUnreadNotifications(unreadCount);
      } catch {
        // Failed to load notifications
      } finally {
        setLoading('notifications', false);
      }
    };

    loadNotifications();
  }, [setLoading, setUnreadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      // Update unread count
      const newUnreadCount = notifications.filter((n) => !n.isRead && n.id !== id).length;
      setUnreadNotifications(newUnreadCount);
    } catch {
      // Failed to mark notification as read
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      await Promise.all(unreadNotifications.map((n) => api.markNotificationAsRead(n.id)));

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      setUnreadNotifications(0);
    } catch {
      // Failed to mark all notifications as read
    }
  };

  // Calculate statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    high: notifications.filter((n) => n.priority === 'High').length,
    feeReminders: notifications.filter((n) => n.type === 'Fee Reminder').length,
  };

  const summaryCards = [
    {
      title: 'Total Notifications',
      value: stats.total,
      icon: Bell,
      description: 'All notifications',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+5%',
      trendUp: true,
      progress: 75,
    },
    {
      title: 'Unread',
      value: stats.unread,
      icon: AlertCircle,
      description: 'Require attention',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: '-12%',
      trendUp: false,
      progress: 30,
    },
    {
      title: 'High Priority',
      value: stats.high,
      icon: AlertCircle,
      description: 'Urgent notifications',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: '+3%',
      trendUp: true,
      progress: 45,
    },
    {
      title: 'Fee Reminders',
      value: stats.feeReminders,
      icon: Info,
      description: 'Payment related',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: '+8%',
      trendUp: true,
      progress: 60,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent">
              Notifications
            </h1>
            <p className="text-lg text-gray-600">Manage announcements and reminders</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <div className="flex space-x-3">
            {stats.unread > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="hover:border-green-300 hover:bg-green-50"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All Read
                <Badge variant="destructive" className="ml-2">
                  {stats.unread}
                </Badge>
              </Button>
            )}
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              New Notification
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border-2 ${card.borderColor} bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <div
                        className={`flex items-center gap-1 text-xs ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {card.trendUp ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3 rotate-180" />
                        )}
                        {card.trend}
                      </div>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="mt-1 text-xs text-gray-500">{card.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${card.color.replace('text-', 'bg-')}`}
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-xl p-3 ${card.bgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Recent Activity Overview */}
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Notification Types</CardTitle>
              <CardDescription className="text-gray-600">
                Distribution of notification categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Fee Reminder', 'System Update', 'Holiday Notice', 'General'].map(
                  (type, index) => {
                    const typeNotifications = notifications.filter((n) => n.type === type);
                    const unreadInType = typeNotifications.filter((n) => !n.isRead).length;

                    const colors = [
                      'bg-blue-500',
                      'bg-green-500',
                      'bg-purple-500',
                      'bg-orange-500',
                    ];

                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-4 w-4 rounded-full ${colors[index]}`}></div>
                          <span className="font-medium text-gray-900">{type}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {typeNotifications.length}
                          </p>
                          {unreadInType > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadInType} unread
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-purple-50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Priority Breakdown</CardTitle>
              <CardDescription className="text-gray-600">
                Notifications by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['High', 'Medium', 'Low'].map((priority) => {
                  const priorityNotifications = notifications.filter(
                    (n) => n.priority === priority
                  );
                  const unreadInPriority = priorityNotifications.filter((n) => !n.isRead).length;

                  const colors = {
                    High: { text: 'text-red-600', bg: 'bg-red-500', border: 'border-red-200' },
                    Medium: {
                      text: 'text-amber-600',
                      bg: 'bg-amber-500',
                      border: 'border-amber-200',
                    },
                    Low: { text: 'text-green-600', bg: 'bg-green-500', border: 'border-green-200' },
                  };

                  return (
                    <div
                      key={priority}
                      className={`flex items-center justify-between rounded-lg border-2 bg-white p-4 shadow-sm ${colors[priority as keyof typeof colors].border}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-4 w-4 rounded-full ${colors[priority as keyof typeof colors].bg}`}
                        ></div>
                        <span
                          className={`font-semibold ${colors[priority as keyof typeof colors].text}`}
                        >
                          {priority}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {priorityNotifications.length}
                        </p>
                        {unreadInPriority > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {unreadInPriority} unread
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Notifications List */}
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900">All Notifications</CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage all system notifications and announcements
                </CardDescription>
              </div>
              {notifications.length > 0 && (
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  {notifications.length} total
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading.notifications ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="ml-3 font-medium text-gray-600">Loading notifications...</span>
              </div>
            ) : (
              <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
