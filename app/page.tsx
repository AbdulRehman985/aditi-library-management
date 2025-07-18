'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Users, CreditCard, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/utils/store';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description:
        'Comprehensive student registration and profile management with shift scheduling.',
    },
    {
      icon: CreditCard,
      title: 'Payment Tracking',
      description: 'Automated fee collection, receipt generation, and payment history tracking.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Automated reminders for due payments, announcements, and system updates.',
    },
    {
      icon: BookOpen,
      title: 'Modern Interface',
      description: 'Premium UI/UX design with mobile-first responsive layout for all devices.',
    },
  ];

  const benefits = [
    'Real-time dashboard with key metrics',
    'Automated fee tracking and reminders',
    'Mobile-responsive design',
    'Secure data management',
    'Easy student onboarding',
    'Comprehensive reporting',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="safe-area-top border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 sm:text-2xl">ITMS Library</span>
          </div>
          <Button asChild>
            <Link href="/login">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-mobile-3xl font-bold text-gray-900 sm:text-4xl lg:text-6xl">
              Modern Library Management
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="text-mobile-lg mx-auto mt-6 max-w-2xl text-gray-600 sm:text-xl">
              Streamline your library operations with our comprehensive management system. Track
              students, manage payments, and send notifications with ease.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/login">
                  Staff Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/student/auth">Student Login</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/student/signup">Join as Student</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-mobile-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Everything You Need
            </h2>
            <p className="text-mobile-base mt-4 text-gray-600 sm:text-lg">
              Powerful features designed for modern library management
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-mobile-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-mobile-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-mobile-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Why Choose ITMS Library?
              </h2>
              <p className="text-mobile-base mt-4 text-gray-600 sm:text-lg">
                Built with modern technology and designed for efficiency, our system helps you
                manage your library with confidence and ease.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-mobile-base text-gray-700 sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Demo Account</CardTitle>
                  <CardDescription>Try the system with sample data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">admin@itmslibrary.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Password:</span>
                      <span className="font-medium">admin123</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/login">Try Demo</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-mobile-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-mobile-base mt-4 text-gray-600 sm:text-lg">
            Join hundreds of libraries already using our management system.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/login">
                Staff Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/student/auth">Student Login</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/student/signup">Student Signup</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="safe-area-bottom border-t bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">ITMS Library</span>
          </div>
          <p className="text-mobile-sm mt-4 text-gray-600 sm:text-sm">
            © 2025 ITMS Library Management System. 
          </p>
        </div>
      </footer>
    </div>
  );
}
