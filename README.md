# 📌 Project Status: Deal Not Closed

🚫 **Deal not finalized** – The client requested a fully custom solution within a ₹12,000 budget, which was not feasible due to actual development, domain, and hosting costs.

📂 The SRS and proposal have been retained here for reference in case of future similar projects.

---

# Aditi Library Management System

A modern, premium library management system built with Next.js 14, designed for mobile-first responsive use and premium user experience.

## 🎯 Key Features

- **Student Management**: Registration, profile management, shift scheduling, fee status tracking, and locker assignment.
- **Admission Module**: Multi-step admission form with shift and duration selection, Aadhaar validation, and real-time seat availability.
- **Payment Tracking**: Automated fee collection, digital payment methods (UPI, Card, Net Banking, Wallet), receipt generation, and payment history.
- **Smart Notifications**: Real-time alerts for due/overdue payments, system announcements, and reminders.
- **Dashboard & Analytics**: Real-time dashboard with key metrics (students, revenue, enrollments, departures, retention), summary cards, and quick actions.
- **Student Portal**: Student authentication (phone/OTP), profile view, payment history, enrollment status, and 24/7 access options.
- **Admin/Staff Portal**: Staff login, student management, payment recording, notification sending, and analytics access.
- **Mobile-First Design**: Responsive UI, touch-friendly controls, collapsible sidebar, and mobile drawer navigation.
- **Premium UI/UX**: Modern design using shadcn/ui, consistent theming, and smooth transitions.
- **Security**: Secure data handling, session management, and demo authentication.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS 3 + shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Linting**: ESLint + Prettier

## 📱 Mobile-First Responsive Design

This application is built with mobile-first principles:

### Design Guidelines

- **Touch Targets**: Minimum 44px touch targets for mobile accessibility
- **Typography**: Mobile-optimized text sizes with responsive scaling
- **Navigation**: Collapsible sidebar with mobile drawer
- **Spacing**: Responsive padding and margins
- **Safe Areas**: Support for device safe area insets

### Responsive Breakpoints

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

### Mobile Features

- Slide-out navigation drawer
- Touch-friendly buttons and controls
- Optimized form layouts
- Responsive data tables
- Mobile-optimized notifications

## 🔧 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aditi_library
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📋 Demo Credentials

For testing the application, use these demo credentials:

- **Email**: admin@aditilibrary.com
- **Password**: admin123

## 🗂️ Project Structure

```
aditi_library/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/         # Dashboard page
│   ├── students/          # Student management
│   ├── payments/          # Payment tracking
│   ├── notifications/     # Notification system
│   ├── admission/         # Student admission
│   └── login/            # Authentication
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # App header
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Layout.tsx        # Main layout wrapper
├── utils/                 # Utilities and mock data
│   ├── mockData.ts       # Sample data
│   ├── api.ts            # Mock API functions
│   └── store.ts          # Zustand state management
└── lib/                   # Library utilities
```

## 🎨 UI Components

The application uses shadcn/ui components for a consistent, premium design:

- **Navigation**: Responsive sidebar with mobile drawer
- **Forms**: Validated forms with error handling
- **Tables**: Sortable, filterable data tables
- **Cards**: Information display cards
- **Buttons**: Various button styles and states
- **Badges**: Status indicators
- **Modals**: Dialog and sheet overlays

## 📊 Pages & Modules Overview

1. **Landing Page**: Welcome, feature highlights, and quick access links.
2. **Login**: Staff and student authentication (email/password, phone/OTP).
3. **Dashboard**: Key metrics, summary cards, recent payments, overdue students, and quick actions.
4. **Students**: List, search, filter, add, and manage students; update fee status; export data.
5. **Payments**: Record, track, and view payment history; digital payment options; receipt generation.
6. **Notifications**: Send and view system announcements, payment reminders, and alerts.
7. **Admission**: Multi-step student admission form with shift/duration selection and validation.
8. **Analytics**: Enrollment trends, revenue, and retention analytics (for staff/admin).
9. **Student Portal**: Profile, payment history, enrollment status, and logout.
10. **Signup**: Student registration with phone verification and onboarding.

## 🔄 State Management

The application uses Zustand for lightweight state management:

- **Authentication**: User login state and session persistence
- **UI State**: Sidebar, loading states, notifications
- **Data Caching**: Efficient data management

## 🎯 Development Guidelines

### Code Style

- ESLint configuration with Next.js recommended rules
- Prettier formatting with 2-space indentation
- TypeScript strict mode enabled
- Tailwind class sorting enforced

### Mobile-First Development

1. Start with mobile layout (320px+)
2. Progressive enhancement for larger screens
3. Touch-friendly interactive elements
4. Optimize for performance on mobile devices

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Deploy with default Next.js settings
3. Environment variables are not required for the demo

## 📝 License

This project is built for demonstration purposes. Feel free to use and modify as needed.

---

Built with ❤️ using Next.js 14 and modern web technologies.
