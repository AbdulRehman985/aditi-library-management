'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { api } from '@/utils/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  shift: string;
  feeAmount: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  shift?: string;
  feeAmount?: string;
}

interface AdmissionResult {
  success: boolean;
  admissionId: string;
  student: {
    id: string;
    name: string;
    shift: string;
    feeAmount: number;
  };
}

export default function AdmissionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    shift: '',
    feeAmount: 2500,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [admissionResult, setAdmissionResult] = useState<AdmissionResult | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Shift validation
    if (!formData.shift) {
      newErrors.shift = 'Please select a shift';
    }

    // Fee amount validation
    if (!formData.feeAmount || formData.feeAmount < 1000) {
      newErrors.feeAmount = 'Fee amount must be at least ₹1,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.submitAdmission(formData);
      if (result.success) {
        setSuccess(true);
        setAdmissionResult(result);
      }
    } catch {
      setErrors({ name: 'Admission submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const shifts = [
    { value: 'Morning', label: 'Morning (6:00 AM - 12:00 PM)', popular: true },
    { value: 'Evening', label: 'Evening (12:00 PM - 6:00 PM)', popular: true },
    { value: 'Night', label: 'Night (6:00 PM - 12:00 AM)', popular: false },
  ];

  if (success && admissionResult) {
    return (
      <Layout>
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Admission Successful!</h1>
                <p className="mb-6 text-gray-600">
                  Welcome to ITMS Library! Your admission has been processed successfully.
                </p>

                <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
                  <h3 className="mb-4 font-semibold text-gray-900">Admission Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student ID:</span>
                      <span className="font-medium">{admissionResult.student.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission ID:</span>
                      <span className="font-medium">{admissionResult.admissionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{admissionResult.student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shift:</span>
                      <span className="font-medium">{admissionResult.student.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Fee:</span>
                      <span className="font-medium">₹{admissionResult.student.feeAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                  <Button variant="outline" onClick={() => setSuccess(false)}>
                    New Admission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Student Admission</h1>
            <p className="mt-2 text-gray-600">Fill out the form below to register a new student</p>
          </div>

          {/* Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Admission Form</CardTitle>
              <CardDescription>
                Please provide accurate information for student registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter student's full name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="flex items-center text-sm text-red-600">
                          <AlertCircle className="mr-1 h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="flex items-center text-sm text-red-600">
                          <AlertCircle className="mr-1 h-4 w-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Library Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Library Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="shift">Preferred Shift *</Label>
                    <Select
                      value={formData.shift}
                      onValueChange={(value) => handleChange('shift', value)}
                    >
                      <SelectTrigger className={errors.shift ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.value} value={shift.value}>
                            <div className="flex w-full items-center justify-between">
                              <span>{shift.label}</span>
                              {shift.popular && (
                                <Badge variant="secondary" className="ml-2">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.shift && (
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.shift}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feeAmount">Monthly Fee (₹) *</Label>
                    <Input
                      id="feeAmount"
                      type="number"
                      min="1000"
                      step="100"
                      placeholder="2500"
                      value={formData.feeAmount}
                      onChange={(e) => handleChange('feeAmount', parseInt(e.target.value) || 0)}
                      className={errors.feeAmount ? 'border-red-500' : ''}
                    />
                    {errors.feeAmount && (
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.feeAmount}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Standard fee is ₹2,500 per month. Special rates may apply for certain
                      programs.
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Terms and Conditions</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Monthly fees must be paid by the 10th of each month</li>
                    <li>• Late fee charges apply after the due date</li>
                    <li>• Library rules and regulations must be followed</li>
                    <li>• Minimum enrollment period is 3 months</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Admission...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Submit Admission
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
