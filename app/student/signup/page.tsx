'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface SignupFormData {
  firstName: string;
  lastName: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  dateOfBirth: string;
  acceptTerms: boolean;
  acceptUpdates: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  dateOfBirth?: string;
  acceptTerms?: string;
  acceptUpdates?: string;
}

export default function StudentSignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    fatherName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    dateOfBirth: '',
    acceptTerms: false,
    acceptUpdates: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father&apos;s name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    // Phone number validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Email validation (optional but if provided, should be valid)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Age validation (must be at least 16)
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16) {
        newErrors.dateOfBirth = 'You must be at least 16 years old to register';
      }
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors and try again');
      return;
    }

    setLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setLoading(false);

      // Store registration data temporarily
      const registrationData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        registrationDate: new Date().toISOString(),
        status: 'pending_verification',
      };

      localStorage.setItem('studentRegistration', JSON.stringify(registrationData));

      toast.success('Registration successful! Please verify your phone number.');

      // Redirect to auth page for OTP verification
      router.push(`/student/auth?signup=true&phone=${formData.phone}`);
    }, 2000);
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ITMS Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Already registered?</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/student/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Student Account</h1>
          <p className="text-gray-600">Join ITMS Library and start your learning journey</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your details to create your student account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="Enter father's name"
                  className={errors.fatherName ? 'border-red-500' : ''}
                />
                {errors.fatherName && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fatherName}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex">
                    <div className="flex items-center rounded-l-md border border-r-0 bg-gray-50 px-3 text-gray-500">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="Enter 10-digit mobile number"
                      className={`rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email (optional)"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {formData.dateOfBirth && (
                  <p className="mt-1 text-sm text-gray-600">
                    Age: {calculateAge(formData.dateOfBirth)} years
                  </p>
                )}
                {errors.dateOfBirth && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Address Information */}
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House number, street name, area"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="6-digit pincode"
                    className={errors.pincode ? 'border-red-500' : ''}
                  />
                  {errors.pincode && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange('acceptTerms', checked as boolean)
                      }
                      className={errors.acceptTerms ? 'border-red-500' : ''}
                     />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="acceptTerms" className="text-sm leading-5">
                      I accept the{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      *
                    </Label>
                    {errors.acceptTerms && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="acceptUpdates"
                      checked={formData.acceptUpdates}
                      onCheckedChange={(checked) =>
                        handleInputChange('acceptUpdates', checked as boolean)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="acceptUpdates" className="text-sm leading-5 text-gray-600">
                      I want to receive updates about library services, notifications, and
                      promotional offers via SMS and email
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/student/auth" className="font-medium text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Why Join ITMS Library?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">
                  Multiple shift options to fit your schedule
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">Secure locker facilities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">Peaceful study environment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">Digital payment and receipt system</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">Auto payment reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-blue-800">24/7 access options available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
