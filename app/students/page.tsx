'use client';

import { useEffect, useState } from 'react';
import { Plus, Download, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import StudentTable from '@/components/StudentTable';
import { useAppStore } from '@/utils/store';
import { api } from '@/utils/api';
import { Student } from '@/utils/mockData';

export default function StudentsPage() {
  const { setLoading, loading } = useAppStore();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading('students', true);
      try {
        const data = await api.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading('students', false);
      }
    };

    loadStudents();
  }, [setLoading]);

  const handleUpdateFeeStatus = async (studentId: string, status: Student['feeStatus']) => {
    try {
      await api.updateStudentFeeStatus(studentId, status);
      // Update local state
      setStudents(prev => 
        prev.map(student => 
          student.id === studentId 
            ? { ...student, feeStatus: status }
            : student
        )
      );
    } catch (error) {
      console.error('Failed to update fee status:', error);
    }
  };

  // Calculate statistics
  const stats = {
    total: students.length,
    paid: students.filter(s => s.feeStatus === 'Paid').length,
    due: students.filter(s => s.feeStatus === 'Due').length,
    overdue: students.filter(s => s.feeStatus === 'Overdue').length,
  };

  const summaryCards = [
    {
      title: 'Total Students',
      value: stats.total,
      icon: Users,
      description: 'All registered students',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Fees Paid',
      value: stats.paid,
      icon: UserCheck,
      description: 'Current month',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Fees Due',
      value: stats.due,
      icon: Clock,
      description: 'Pending payments',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: UserX,
      description: 'Requires attention',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">
              Manage student registrations and fee status
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
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

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>
              View and manage student information, fee status, and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading.students ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading students...</span>
              </div>
            ) : (
              <StudentTable 
                students={students} 
                onUpdateFeeStatus={handleUpdateFeeStatus}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 