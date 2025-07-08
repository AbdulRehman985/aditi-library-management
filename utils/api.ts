import {
  mockStudents,
  mockPayments,
  mockNotifications,
  mockStats,
  enrollmentAnalytics,
  Student,
  Payment,
  Notification,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    await delay(1000);
    // Mock authentication - always succeed for demo
    return {
      success: true,
      user: {
        id: 'admin-1',
        name: 'Library Admin',
        email: credentials.email,
        role: 'admin',
      },
    };
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    await delay(800);
    return mockStudents;
  },

  getStudent: async (id: string): Promise<Student | null> => {
    await delay(500);
    return mockStudents.find((student) => student.id === id) || null;
  },

  createStudent: async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    await delay(1200);
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  updateStudentFeeStatus: async (id: string, feeStatus: Student['feeStatus']): Promise<boolean> => {
    await delay(600);
    const studentIndex = mockStudents.findIndex((student) => student.id === id);
    if (studentIndex !== -1) {
      mockStudents[studentIndex].feeStatus = feeStatus;
      return true;
    }
    return false;
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    await delay(700);
    return mockPayments;
  },

  createPayment: async (paymentData: Omit<Payment, 'id' | 'receiptNo'>): Promise<Payment> => {
    await delay(1500);
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY${Date.now()}`,
      receiptNo: `RCP-2024-${String(mockPayments.length + 1).padStart(3, '0')}`,
    };
    mockPayments.push(newPayment);
    return newPayment;
  },

  getPaymentsByStudent: async (studentId: string): Promise<Payment[]> => {
    await delay(500);
    return mockPayments.filter((payment) => payment.studentId === studentId);
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(400);
    return mockNotifications;
  },

  markNotificationAsRead: async (id: string): Promise<boolean> => {
    await delay(300);
    const notificationIndex = mockNotifications.findIndex((notification) => notification.id === id);
    if (notificationIndex !== -1) {
      mockNotifications[notificationIndex].isRead = true;
      return true;
    }
    return false;
  },

  // Dashboard stats
  getStats: async () => {
    await delay(600);
    return mockStats;
  },

  // Admission
  submitAdmission: async (admissionData: {
    name: string;
    email: string;
    phone: string;
    shift: string;
    feeAmount: number;
  }) => {
    await delay(2000); // Longer delay for form submission

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: admissionData.name,
      email: admissionData.email,
      phone: admissionData.phone,
      shift: admissionData.shift as Student['shift'],
      feeStatus: 'Due',
      feeAmount: admissionData.feeAmount,
      lockerNo: null,
      admissionDate: new Date().toISOString().split('T')[0],
      lastPaymentDate: null,
    };

    mockStudents.push(newStudent);

    return {
      success: true,
      student: newStudent,
      admissionId: `ADM-${Date.now()}`,
    };
  },

  // Add enrollment analytics endpoint
  getEnrollmentAnalytics: async () => {
    await delay(800);
    return enrollmentAnalytics;
  },

  // Add enrollment trends endpoint
  getEnrollmentTrends: async (period: 'monthly' | 'yearly' = 'monthly') => {
    await delay(600);
    if (period === 'yearly') {
      return enrollmentAnalytics.yearlyComparison;
    }
    return enrollmentAnalytics.monthlyTrends;
  },

  // Add recent enrollments endpoint
  getRecentEnrollments: async (limit: number = 5) => {
    await delay(500);
    return enrollmentAnalytics.recentEnrollments.slice(0, limit);
  },

  // Add recent departures endpoint
  getRecentDepartures: async (limit: number = 5) => {
    await delay(500);
    return enrollmentAnalytics.recentDepartures.slice(0, limit);
  },
};
