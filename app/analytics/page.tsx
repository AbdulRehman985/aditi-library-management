'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  BarChart3,
  Calendar,
  Target,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useAppStore } from '@/utils/store';
import { api } from '@/utils/api';

interface EnrollmentAnalytics {
  currentMonth: {
    enrolled: number;
    departed: number;
    netGrowth: number;
  };
  monthlyTrends: Array<{
    month: string;
    enrolled: number;
    departed: number;
    netGrowth: number;
    totalStudents: number;
  }>;
  shiftWiseEnrollment: Array<{
    shift: string;
    enrolled: number;
    departed: number;
    current: number;
  }>;
  recentEnrollments: Array<{
    id: string;
    name: string;
    shift: string;
    enrollmentDate: string;
    feeAmount: number;
    status: string;
  }>;
  recentDepartures: Array<{
    id: string;
    name: string;
    shift: string;
    departureDate: string;
    reason: string;
    lastPaymentDate: string;
  }>;
  yearlyComparison: {
    '2024': { enrolled: number; departed: number; netGrowth: number };
    '2023': { enrolled: number; departed: number; netGrowth: number };
    growth: number;
  };
}

export default function AnalyticsPage() {
  const { setLoading } = useAppStore();
  const [analytics, setAnalytics] = useState<EnrollmentAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading('analytics', true);
      try {
        const data = await api.getEnrollmentAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading('analytics', false);
      }
    };

    loadAnalytics();
  }, [setLoading]);

  if (!analytics) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/4 rounded bg-gray-300"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded bg-gray-300"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    currentMonth,
    monthlyTrends,
    shiftWiseEnrollment,
    recentEnrollments,
    recentDepartures,
    yearlyComparison,
  } = analytics;

  const currentMonthData = monthlyTrends[monthlyTrends.length - 1];
  const previousMonthData = monthlyTrends[monthlyTrends.length - 2];
  const enrollmentTrend = currentMonthData.enrolled > previousMonthData.enrolled ? 'up' : 'down';
  const departureTrend = currentMonthData.departed > previousMonthData.departed ? 'up' : 'down';

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Enrollment Analytics</h1>
          <p className="text-gray-600">Track student enrollment trends and departures</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Enrolled</p>
                  <p className="text-2xl font-bold text-green-600">{currentMonth.enrolled}</p>
                  <div className="mt-1 flex items-center">
                    {enrollmentTrend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <p className="ml-1 text-xs text-gray-500">
                      vs {previousMonthData.enrolled} last month
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-green-50 p-3">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Departed</p>
                  <p className="text-2xl font-bold text-orange-600">{currentMonth.departed}</p>
                  <div className="mt-1 flex items-center">
                    {departureTrend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    )}
                    <p className="ml-1 text-xs text-gray-500">
                      vs {previousMonthData.departed} last month
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-orange-50 p-3">
                  <UserMinus className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Growth</p>
                  <p className="text-2xl font-bold text-purple-600">+{currentMonth.netGrowth}</p>
                  <p className="mt-1 text-xs text-gray-500">Students this month</p>
                </div>
                <div className="rounded-full bg-purple-50 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentMonthData.totalStudents}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Active members</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="shifts">Shift Analysis</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Yearly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Yearly Growth Comparison</CardTitle>
                <CardDescription>2023 vs 2024 enrollment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-sm text-gray-600">2024 Enrolled</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {yearlyComparison['2024'].enrolled}
                    </p>
                    <p className="text-xs text-gray-500">
                      vs {yearlyComparison['2023'].enrolled} in 2023
                    </p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4 text-center">
                    <p className="text-sm text-gray-600">2024 Departed</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {yearlyComparison['2024'].departed}
                    </p>
                    <p className="text-xs text-gray-500">
                      vs {yearlyComparison['2023'].departed} in 2023
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-600">+{yearlyComparison.growth}%</p>
                    <p className="text-xs text-gray-500">Year over year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Monthly Trends Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Enrollment Trends</CardTitle>
                <CardDescription>6-month enrollment and departure history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Month</th>
                        <th className="p-2 text-center">Enrolled</th>
                        <th className="p-2 text-center">Departed</th>
                        <th className="p-2 text-center">Net Growth</th>
                        <th className="p-2 text-center">Total Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrends.map((trend, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{trend.month}</td>
                          <td className="p-2 text-center">
                            <Badge variant="outline" className="text-green-600">
                              +{trend.enrolled}
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant="outline" className="text-orange-600">
                              -{trend.departed}
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <Badge
                              variant="outline"
                              className={trend.netGrowth > 0 ? 'text-green-600' : 'text-red-600'}
                            >
                              {trend.netGrowth > 0 ? '+' : ''}
                              {trend.netGrowth}
                            </Badge>
                          </td>
                          <td className="p-2 text-center font-medium">{trend.totalStudents}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shifts" className="space-y-6">
            {/* Shift-wise Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Shift-wise Enrollment Analysis</CardTitle>
                <CardDescription>Current month enrollment by shift timings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {shiftWiseEnrollment.map((shift, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <h4 className="font-semibold text-gray-900">{shift.shift}</h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Enrolled:</span>
                          <span className="font-medium">+{shift.enrolled}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-600">Departed:</span>
                          <span className="font-medium">-{shift.departed}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 text-sm">
                          <span className="text-blue-600">Current:</span>
                          <span className="font-semibold">{shift.current}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Enrollments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Enrollments</CardTitle>
                  <CardDescription>Latest students who joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between rounded-lg bg-green-50 p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.name}</p>
                          <p className="text-sm text-gray-500">
                            {enrollment.shift} • {enrollment.enrollmentDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            ₹{enrollment.feeAmount}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {enrollment.id}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Departures */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Departures</CardTitle>
                  <CardDescription>Students who left recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDepartures.map((departure) => (
                      <div
                        key={departure.id}
                        className="flex items-center justify-between rounded-lg bg-orange-50 p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{departure.name}</p>
                          <p className="text-sm text-gray-500">
                            {departure.shift} • {departure.departureDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">{departure.reason}</p>
                          <Badge variant="outline" className="text-xs">
                            {departure.id}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
