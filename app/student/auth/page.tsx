'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Phone, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function StudentAuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if coming from signup flow
    const signupParam = searchParams.get('signup');
    const phoneParam = searchParams.get('phone');

    if (signupParam === 'true') {
      setIsSignup(true);
      if (phoneParam) {
        setPhoneNumber(phoneParam);
        setStep('otp');
        toast.success('Registration completed! Please verify your phone number.');
      }
    }
  }, [searchParams]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('OTP sent successfully to +91 ' + phoneNumber);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);

    // Simulate OTP verification (123456 is the demo OTP)
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') {
        if (isSignup) {
          // Handle signup completion
          const registrationData = localStorage.getItem('studentRegistration');
          if (registrationData) {
            const userData = JSON.parse(registrationData);
            // Store complete student profile
            localStorage.setItem(
              'studentAuth',
              JSON.stringify({
                phone: phoneNumber,
                isAuthenticated: true,
                loginTime: Date.now(),
                userData: userData,
              })
            );
            localStorage.removeItem('studentRegistration'); // Clean up temp data
            toast.success('Account verified successfully! Welcome to Aditi Library!');
            router.push('/student/admission'); // Direct to admission for new users
          }
        } else {
          // Handle regular login
          toast.success('Login successful!');
          localStorage.setItem(
            'studentAuth',
            JSON.stringify({
              phone: phoneNumber,
              isAuthenticated: true,
              loginTime: Date.now(),
            })
          );
          router.push('/student/profile');
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    toast.success('OTP resent successfully');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aditi Library</h1>
          <p className="mt-2 text-gray-600">Student Portal</p>
        </div>

        {step === 'phone' ? (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                {isSignup ? 'Verify Phone Number' : 'Login with Phone'}
              </CardTitle>
              <CardDescription>
                {isSignup
                  ? 'Enter your registered phone number to verify your account'
                  : 'Enter your phone number to receive an OTP'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="mt-1 flex">
                    <div className="flex items-center rounded-l-md border border-r-0 bg-gray-50 px-3 text-gray-500">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="Enter 10-digit mobile number"
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Demo: Use any 10-digit number</p>
              </div>

              {!isSignup && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    New to Aditi Library?{' '}
                    <Link
                      href="/student/signup"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Verify OTP
              </CardTitle>
              <CardDescription>Enter the 6-digit code sent to +91 {phoneNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <Label>Enter OTP</Label>
                  <div className="mt-2 flex gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="h-12 w-12 text-center text-lg font-semibold"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <Button variant="link" onClick={handleResendOtp} className="text-sm">
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-center text-sm text-blue-800">
                  <strong>Demo OTP:</strong> 123456
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Need help? Contact library staff</p>
        </div>
      </div>
    </div>
  );
}
