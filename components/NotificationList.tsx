'use client';

import { useState } from 'react';
import { Search, Bell, BellOff, Clock, AlertCircle, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Notification } from '@/utils/mockData';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.isRead) ||
      (statusFilter === 'unread' && !notification.isRead);
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Fee Reminder':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'System Update':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'Holiday Notice':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'General':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: Notification['type']) => {
    const colors = {
      'Fee Reminder': 'bg-red-100 text-red-800',
      'System Update': 'bg-blue-100 text-blue-800',
      'Holiday Notice': 'bg-green-100 text-green-800',
      'General': 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge variant="outline" className={colors[type]}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Fee Reminder">Fee Reminder</SelectItem>
            <SelectItem value="System Update">System Update</SelectItem>
            <SelectItem value="Holiday Notice">Holiday Notice</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-md cursor-pointer ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              }`}
              onClick={() => !notification.isRead && onMarkAsRead?.(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          {getTypeBadge(notification.type)}
                          {getPriorityBadge(notification.priority)}
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {onMarkAsRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {notification.isRead ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
        <span>
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </span>
        <span>
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>
    </div>
  );
} 