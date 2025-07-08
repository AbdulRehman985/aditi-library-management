'use client';

import { useState } from 'react';
import { Search, Download, Eye, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Payment } from '@/utils/mockData';

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = paymentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = paymentDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesMethod && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: Payment['method']) => {
    const colors = {
      'Cash': 'bg-gray-100 text-gray-800',
      'Card': 'bg-blue-100 text-blue-800',
      'UPI': 'bg-purple-100 text-purple-800',
      'Bank Transfer': 'bg-green-100 text-green-800',
    };
    
    return (
      <Badge variant="outline" className={colors[method]}>
        {method}
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
            placeholder="Search by student name or receipt number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt No.</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No payments found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">{payment.receiptNo}</span>
                      <span className="text-xs text-gray-500">ID: {payment.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-sm text-gray-500">ID: {payment.studentId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{getMethodBadge(payment.method)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {payment.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(payment.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500 border-t pt-4">
        <span>
          Showing {filteredPayments.length} of {payments.length} payments
        </span>
        <div className="flex items-center space-x-4">
          <span>
            Total Amount: ₹{filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
} 