'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  Settings,
  LogOut,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit3,
  FileText,
  Key,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface StudentData {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  address: string;
  aadhaar: string;
  lockerNumber: string;
  currentShift: string;
  enrollmentStatus: 'active' | 'expired' | 'pending';
  enrollmentExpiry: string;
  joinDate: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  type: string;
  status: 'completed' | 'pending' | 'failed';
  receipt?: string;
}

export default function StudentProfilePage() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if student is authenticated
    const authData = localStorage.getItem('studentAuth');
    if (!authData) {
      router.push('/student/auth');
      return;
    }

    // Load mock student data
    const mockStudent: StudentData = {
      id: 'STU001',
      name: 'Rahul Kumar',
      fatherName: 'Ramesh Kumar',
      phone: JSON.parse(authData).phone,
      address: 'H.No. 123, Sector 15, Rohini, New Delhi - 110085',
      aadhaar: '****-****-1234',
      lockerNumber: 'L-045',
      currentShift: 'Morning (6:00 AM - 2:00 PM)',
      enrollmentStatus: 'active',
      enrollmentExpiry: '2024-08-15',
      joinDate: '2024-01-15',
    };

    const mockPayments: Payment[] = [
      {
        id: 'PAY001',
        amount: 2500,
        date: '2024-07-01',
        type: 'Monthly Fee - July 2024',
        status: 'completed',
        receipt: 'RCP-2024-07-001',
      },
      {
        id: 'PAY002',
        amount: 2500,
        date: '2024-06-01',
        type: 'Monthly Fee - June 2024',
        status: 'completed',
        receipt: 'RCP-2024-06-001',
      },
      {
        id: 'PAY003',
        amount: 2500,
        date: '2024-08-01',
        type: 'Monthly Fee - August 2024',
        status: 'pending',
      },
    ];

    setStudentData(mockStudent);
    setPayments(mockPayments);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('studentAuth');
    router.push('/student/auth');
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src="/avatars/student.png" />
                <AvatarFallback className="bg-white text-xl font-bold text-blue-600">
                  {studentData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{studentData.name}</h2>
                <p className="text-blue-100">Student ID: {studentData.id}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={getStatusColor(studentData.enrollmentStatus)}>
                    {studentData.enrollmentStatus === 'active'
                      ? 'Active'
                      : studentData.enrollmentStatus === 'expired'
                        ? 'Expired'
                        : 'Pending'}
                  </Badge>
                  <span className="text-sm text-blue-100">
                    Valid till: {new Date(studentData.enrollmentExpiry).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-gray-900">{studentData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Father&apos;s Name</label>
                    <p className="mt-1 text-gray-900">{studentData.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 flex items-center gap-2 text-gray-900">
                      <Phone className="h-4 w-4" />
                      +91 {studentData.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Aadhaar Number</label>
                    <p className="mt-1 text-gray-900">{studentData.aadhaar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Locker Number</label>
                    <p className="mt-1 flex items-center gap-2 text-gray-900">
                      <Key className="h-4 w-4" />
                      {studentData.lockerNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {new Date(studentData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 flex items-start gap-2 text-gray-900">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    {studentData.address}
                  </p>
                </div>
                <Button className="w-full md:w-auto">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>Your fee payment records and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            payment.status === 'completed'
                              ? 'bg-green-100'
                              : payment.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                          }`}
                        >
                          {payment.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : payment.status === 'pending' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.amount}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          {payment.receipt && (
                            <Button size="sm" variant="outline">
                              <Download className="mr-1 h-3 w-3" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <Button asChild className="w-full md:w-auto">
                    <Link href="/student/payment">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Make Payment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrollment Tab */}
          <TabsContent value="enrollment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Enrollment
                </CardTitle>
                <CardDescription>Your current shift timings and enrollment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="font-semibold text-blue-900">Current Shift</h3>
                    <p className="mt-1 text-blue-700">{studentData.currentShift}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <h3 className="font-semibold text-green-900">Enrollment Status</h3>
                    <p className="mt-1 text-green-700 capitalize">{studentData.enrollmentStatus}</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <h3 className="font-semibold text-orange-900">Valid Until</h3>
                    <p className="mt-1 text-orange-700">
                      {new Date(studentData.enrollmentExpiry).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <h3 className="font-semibold text-purple-900">Locker Assigned</h3>
                    <p className="mt-1 text-purple-700">{studentData.lockerNumber}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Button asChild className="mr-2 mb-2 w-full md:w-auto">
                    <Link href="/student/admission">
                      <FileText className="mr-2 h-4 w-4" />
                      Renew Enrollment
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
