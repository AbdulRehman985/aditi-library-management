'use client';

import { useEffect, useState } from 'react';
import { Plus, Download, CreditCard, TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PaymentHistory from '@/components/PaymentHistory';
import { useAppStore } from '@/utils/store';
import { api } from '@/utils/api';
import { Payment } from '@/utils/mockData';

export default function PaymentsPage() {
  const { setLoading, loading } = useAppStore();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading('payments', true);
      try {
        const data = await api.getPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setLoading('payments', false);
      }
    };

    loadPayments();
  }, [setLoading]);

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    todayTotal: payments
      .filter(p => p.date === today && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0),
    monthlyTotal: payments
      .filter(p => p.date.startsWith(thisMonth) && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0),
    completedCount: payments.filter(p => p.status === 'Completed').length,
    pendingCount: payments.filter(p => p.status === 'Pending').length,
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.total.toLocaleString()}`,
      icon: IndianRupee,
      description: 'All time revenue',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Today\'s Collection',
      value: `₹${stats.todayTotal.toLocaleString()}`,
      icon: Calendar,
      description: new Date().toLocaleDateString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'This Month',
      value: `₹${stats.monthlyTotal.toLocaleString()}`,
      icon: TrendingUp,
      description: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Transactions',
      value: stats.completedCount,
      icon: CreditCard,
      description: `${stats.pendingCount} pending`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600">
              Track fee payments and generate receipts
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Methods Breakdown</CardTitle>
              <CardDescription>Distribution of payment methods used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['UPI', 'Cash', 'Card', 'Bank Transfer'].map((method) => {
                  const methodPayments = payments.filter(p => p.method === method && p.status === 'Completed');
                  const amount = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                  const percentage = stats.total > 0 ? (amount / stats.total) * 100 : 0;
                  
                  return (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">{method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{payment.studentName}</p>
                      <p className="text-xs text-gray-500">{payment.receiptNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₹{payment.amount}</p>
                      <p className="text-xs text-gray-500">{payment.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Complete record of all fee payments and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading.payments ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading payments...</span>
              </div>
            ) : (
              <PaymentHistory payments={payments} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 