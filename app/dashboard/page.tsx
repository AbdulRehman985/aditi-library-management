'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  BookOpen,
  Clock,
  UserPlus,
  UserMinus,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useAppStore } from '@/utils/store';
import { api } from '@/utils/api';
import { mockStats, mockStudents, mockPayments } from '@/utils/mockData';
import { useRouter } from 'next/navigation';
interface DashboardStats {
  totalStudents: number;
  paidStudents: number;
  dueStudents: number;
  overdueStudents: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newEnrollmentsThisMonth: number;
  departuresThisMonth: number;
  netGrowthThisMonth: number;
  retentionRate: number;
}

export default function DashboardPage() {
  const { user, setLoading } = useAppStore();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentPayments] = useState(mockPayments.slice(0, 3));
  const [overdueStudents] = useState(
    mockStudents.filter((s) => s.feeStatus === 'Overdue').slice(0, 3)
  );
  const Router = useRouter();

  useEffect(() => {
    if (!user) {
      //if User is not loggedIn redirect to login page
      Router.push('/login');
      return;
    }
    const loadDashboardData = async () => {
      setLoading('dashboard', true);
      try {
        const [statsData] = await Promise.all([api.getStats()]);
        setStats(statsData);
      } catch {
        // Dashboard data loading failed
      } finally {
        setLoading('dashboard', false);
      }
    };

    loadDashboardData();
  }, [setLoading, user, Router]);

  const summaryCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      description: 'Active library members',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+12%',
      trendUp: true,
      progress: 85,
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: 'December 2024',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: '+8.2%',
      trendUp: true,
      progress: 92,
    },
    {
      title: 'New Enrollments',
      value: stats.newEnrollmentsThisMonth,
      icon: UserPlus,
      description: 'This month',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      trend: '+24%',
      trendUp: true,
      progress: 78,
    },
    {
      title: 'Departures',
      value: stats.departuresThisMonth,
      icon: UserMinus,
      description: 'This month',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: '-5%',
      trendUp: false,
      progress: 15,
    },
    {
      title: 'Net Growth',
      value: `+${stats.netGrowthThisMonth}`,
      icon: TrendingUp,
      description: `${stats.retentionRate}% retention`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: '+15%',
      trendUp: true,
      progress: 88,
    },
    {
      title: 'Fees Due',
      value: stats.dueStudents,
      icon: Clock,
      description: 'Pending payments',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      trend: '-3%',
      trendUp: false,
      progress: 35,
    },
    {
      title: 'Overdue',
      value: stats.overdueStudents,
      icon: AlertCircle,
      description: 'Immediate attention',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: '-8%',
      trendUp: false,
      progress: 25,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-lg text-gray-600">
              Here&apos;s what&apos;s happening at ITMS Library today.
            </p>
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
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          {summaryCards.map((card, cardIndex) => (
            <Card
              key={cardIndex}
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
                          <ArrowDownRight className="h-3 w-3" />
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

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Recent Payments */}
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Recent Payments</CardTitle>
                  <CardDescription className="text-gray-600">
                    Latest fee payments received
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="hover:border-green-300 hover:bg-green-50"
                >
                  <Link href="/payments">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="group flex items-center justify-between rounded-xl border-0 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.studentName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {payment.method}
                          </Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{payment.receiptNo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{payment.amount}</p>
                      <p className="text-sm text-gray-500">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Overdue Fees Alert */}
          <Card className="border-0 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Overdue Fees
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Students requiring follow-up
                  </CardDescription>
                </div>
                <Badge variant="destructive" className="px-3 py-1 text-sm">
                  {stats.overdueStudents}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-xl border border-red-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.shift} Shift</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">₹{student.feeAmount}</p>
                      <p className="text-xs text-gray-500">Due: {student.lastPaymentDate}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="text-sm" asChild>
                    <Link href="/students">
                      <Users className="mr-1 h-3 w-3" />
                      Manage
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/notifications">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Send Notice
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="border-0 bg-gradient-to-br from-white to-blue-50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                className="group h-24 flex-col gap-3 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              >
                <Link href="/admission">
                  <BookOpen className="h-8 w-8 transition-transform group-hover:scale-110" />
                  <span className="font-medium">New Admission</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="group h-24 flex-col gap-3 border-2 border-purple-200 shadow-lg transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:shadow-xl"
              >
                <Link href="/students">
                  <Users className="h-8 w-8 text-purple-600 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-purple-700">Manage Students</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="group h-24 flex-col gap-3 border-2 border-green-200 shadow-lg transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:shadow-xl"
              >
                <Link href="/payments">
                  <CreditCard className="h-8 w-8 text-green-600 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-green-700">Record Payment</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="group h-24 flex-col gap-3 border-2 border-orange-200 shadow-lg transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:shadow-xl"
              >
                <Link href="/notifications">
                  <AlertCircle className="h-8 w-8 text-orange-600 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-orange-700">Send Notice</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
