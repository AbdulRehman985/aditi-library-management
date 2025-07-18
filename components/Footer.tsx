export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">
            © 2025 ITMS Library Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Powered by Next.js</span>
            <span>•</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 