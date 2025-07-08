'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if student is authenticated
    const authData = localStorage.getItem('studentAuth');

    if (authData) {
      const auth = JSON.parse(authData);
      if (auth.isAuthenticated) {
        // Redirect to profile if authenticated
        router.push('/student/profile');
      } else {
        // Redirect to auth if not authenticated
        router.push('/student/auth');
      }
    } else {
      // Redirect to auth if no auth data
      router.push('/student/auth');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
