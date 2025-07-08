export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night';
  feeStatus: 'Paid' | 'Due' | 'Overdue';
  feeAmount: number;
  lockerNo: number | null;
  admissionDate: string;
  lastPaymentDate: string | null;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  receiptNo: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Monthly Fee' | 'Registration' | 'Late Fee' | 'Locker Fee';
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  type: 'Fee Reminder' | 'System Update' | 'Holiday Notice' | 'General';
  priority: 'Low' | 'Medium' | 'High';
  isRead: boolean;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    shift: 'Morning',
    feeStatus: 'Paid',
    feeAmount: 2500,
    lockerNo: 101,
    admissionDate: '2024-01-15',
    lastPaymentDate: '2024-12-01',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543211',
    shift: 'Evening',
    feeStatus: 'Due',
    feeAmount: 2500,
    lockerNo: null,
    admissionDate: '2024-02-20',
    lastPaymentDate: '2024-11-01',
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    phone: '+91 9876543212',
    shift: 'Night',
    feeStatus: 'Overdue',
    feeAmount: 2500,
    lockerNo: 205,
    admissionDate: '2024-01-10',
    lastPaymentDate: '2024-10-01',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha.patel@email.com',
    phone: '+91 9876543213',
    shift: 'Morning',
    feeStatus: 'Paid',
    feeAmount: 2500,
    lockerNo: 150,
    admissionDate: '2024-03-01',
    lastPaymentDate: '2024-12-05',
  },
  {
    id: '5',
    name: 'Vikram Agarwal',
    email: 'vikram.agarwal@email.com',
    phone: '+91 9876543214',
    shift: 'Evening',
    feeStatus: 'Due',
    feeAmount: 2500,
    lockerNo: null,
    admissionDate: '2024-04-15',
    lastPaymentDate: '2024-11-15',
  },
  {
    id: '6',
    name: 'Anjali Verma',
    email: 'anjali.verma@email.com',
    phone: '+91 9876543215',
    shift: 'Morning',
    feeStatus: 'Paid',
    feeAmount: 2500,
    lockerNo: 75,
    admissionDate: '2024-02-10',
    lastPaymentDate: '2024-12-03',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    studentId: '1',
    studentName: 'Rajesh Kumar',
    amount: 2500,
    date: '2024-12-01',
    method: 'UPI',
    receiptNo: 'RCP-2024-001',
    status: 'Completed',
    type: 'Monthly Fee',
  },
  {
    id: 'PAY002',
    studentId: '4',
    studentName: 'Sneha Patel',
    amount: 2500,
    date: '2024-12-05',
    method: 'Card',
    receiptNo: 'RCP-2024-002',
    status: 'Completed',
    type: 'Monthly Fee',
  },
  {
    id: 'PAY003',
    studentId: '6',
    studentName: 'Anjali Verma',
    amount: 2500,
    date: '2024-12-03',
    method: 'Cash',
    receiptNo: 'RCP-2024-003',
    status: 'Completed',
    type: 'Monthly Fee',
  },
  {
    id: 'PAY004',
    studentId: '1',
    studentName: 'Rajesh Kumar',
    amount: 500,
    date: '2024-01-15',
    method: 'Bank Transfer',
    receiptNo: 'RCP-2024-004',
    status: 'Completed',
    type: 'Registration',
  },
  {
    id: 'PAY005',
    studentId: '2',
    studentName: 'Priya Sharma',
    amount: 2600,
    date: '2024-11-01',
    method: 'UPI',
    receiptNo: 'RCP-2024-005',
    status: 'Completed',
    type: 'Monthly Fee',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'NOT001',
    message: 'Monthly fee payment reminder for December 2024',
    date: '2024-12-01',
    type: 'Fee Reminder',
    priority: 'High',
    isRead: false,
  },
  {
    id: 'NOT002',
    message: 'Library will be closed on December 25th for Christmas',
    date: '2024-12-20',
    type: 'Holiday Notice',
    priority: 'Medium',
    isRead: true,
  },
  {
    id: 'NOT003',
    message: 'System maintenance scheduled for December 15th from 2 AM to 4 AM',
    date: '2024-12-10',
    type: 'System Update',
    priority: 'Low',
    isRead: true,
  },
  {
    id: 'NOT004',
    message: 'Late fee charges will be applied for overdue payments after 10th of each month',
    date: '2024-12-05',
    type: 'General',
    priority: 'Medium',
    isRead: false,
  },
  {
    id: 'NOT005',
    message: 'New study rooms available for booking',
    date: '2024-12-08',
    type: 'General',
    priority: 'Low',
    isRead: true,
  },
];

// Add new enrollment analytics data
export const enrollmentAnalytics = {
  currentMonth: {
    enrolled: 23,
    departed: 5,
    netGrowth: 18,
  },
  monthlyTrends: [
    { month: 'Jul 2024', enrolled: 18, departed: 3, netGrowth: 15, totalStudents: 195 },
    { month: 'Aug 2024', enrolled: 22, departed: 7, netGrowth: 15, totalStudents: 210 },
    { month: 'Sep 2024', enrolled: 19, departed: 4, netGrowth: 15, totalStudents: 225 },
    { month: 'Oct 2024', enrolled: 15, departed: 8, netGrowth: 7, totalStudents: 232 },
    { month: 'Nov 2024', enrolled: 12, departed: 6, netGrowth: 6, totalStudents: 238 },
    { month: 'Dec 2024', enrolled: 23, departed: 5, netGrowth: 18, totalStudents: 256 },
  ],
  shiftWiseEnrollment: [
    { shift: 'Morning', enrolled: 8, departed: 1, current: 67 },
    { shift: 'Day', enrolled: 6, departed: 2, current: 45 },
    { shift: 'Evening', enrolled: 5, departed: 1, current: 72 },
    { shift: 'Night', enrolled: 3, departed: 1, current: 38 },
    { shift: 'Double', enrolled: 1, departed: 0, current: 22 },
    { shift: 'Triple', departed: 0, enrolled: 0, current: 8 },
    { shift: '24-Hour', enrolled: 0, departed: 0, current: 4 },
  ],
  recentEnrollments: [
    {
      id: 'STU256',
      name: 'Priya Sharma',
      shift: 'Morning',
      enrollmentDate: '2024-12-15',
      feeAmount: 2500,
      status: 'active',
    },
    {
      id: 'STU255',
      name: 'Rohit Gupta',
      shift: 'Evening',
      enrollmentDate: '2024-12-14',
      feeAmount: 2800,
      status: 'active',
    },
    {
      id: 'STU254',
      name: 'Anjali Patel',
      shift: 'Day',
      enrollmentDate: '2024-12-13',
      feeAmount: 3000,
      status: 'active',
    },
    {
      id: 'STU253',
      name: 'Vikash Kumar',
      shift: 'Morning',
      enrollmentDate: '2024-12-12',
      feeAmount: 2500,
      status: 'active',
    },
    {
      id: 'STU252',
      name: 'Neha Singh',
      shift: 'Night',
      enrollmentDate: '2024-12-11',
      feeAmount: 2200,
      status: 'active',
    },
  ],
  recentDepartures: [
    {
      id: 'STU189',
      name: 'Amit Verma',
      shift: 'Day',
      departureDate: '2024-12-10',
      reason: 'Course Completion',
      lastPaymentDate: '2024-11-10',
    },
    {
      id: 'STU167',
      name: 'Sunita Roy',
      shift: 'Evening',
      departureDate: '2024-12-08',
      reason: 'Relocation',
      lastPaymentDate: '2024-11-08',
    },
    {
      id: 'STU143',
      name: 'Rakesh Jain',
      shift: 'Morning',
      departureDate: '2024-12-05',
      reason: 'Financial Issues',
      lastPaymentDate: '2024-10-05',
    },
    {
      id: 'STU201',
      name: 'Kavita Mehta',
      shift: 'Double',
      departureDate: '2024-12-03',
      reason: 'Job Change',
      lastPaymentDate: '2024-11-03',
    },
    {
      id: 'STU176',
      name: 'Deepak Sharma',
      shift: 'Night',
      departureDate: '2024-12-01',
      reason: 'Exam Completion',
      lastPaymentDate: '2024-11-01',
    },
  ],
  yearlyComparison: {
    '2024': { enrolled: 187, departed: 34, netGrowth: 153 },
    '2023': { enrolled: 156, departed: 28, netGrowth: 128 },
    growth: 19.5, // percentage growth from 2023 to 2024
  },
};

// Update existing mockStats to include enrollment data
export const mockStats = {
  totalStudents: 256,
  paidStudents: 234,
  dueStudents: 14,
  overdueStudents: 8,
  totalRevenue: 647500,
  monthlyRevenue: 78500,
  // Add enrollment specific stats
  newEnrollmentsThisMonth: 23,
  departuresThisMonth: 5,
  netGrowthThisMonth: 18,
  retentionRate: 92.3,
  averageStayDuration: 8.5, // months
};
