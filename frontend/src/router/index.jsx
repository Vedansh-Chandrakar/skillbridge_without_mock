import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { DashboardLayout, AuthLayout } from '@/layouts';

// Route guard
import { ProtectedRoute } from './ProtectedRoute';

// Feature pages — Auth
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/features/auth';

// Feature pages — Admin
import {
  AdminDashboard,
  CampusManagementPage,
  UserManagementPage,
  VerificationRequestsPage,
  AdminAnalyticsPage,
  AdminModerationPage,
  AdminProfilePage,
} from '@/features/admin';

// Feature pages — Campus
import {
  CampusDashboard,
  CampusStudentListPage,
  CampusProfilePage,
  CampusVerificationsPage,
  CampusGigsMonitorPage,
  CampusActivityMonitorPage,
  CompanyOpportunitiesPage,
  CompanyApplicantsPage,
  CampusAnalyticsPage,
} from '@/features/campus';

// Feature pages — Student (Freelancer + Recruiter)
import {
  StudentDashboard,
  BrowseGigsPage,
  GigDetailsPage,
  MyApplicationsPage,
  StudentProfilePage,
  WorkSubmissionsPage,
  StudentAnalyticsPage,
  CrossCampusPage,
  AdvancedFeaturesPage,
} from '@/features/freelancer';
import { PostGigPage, MyGigsPage, ApplicantsPage, RecruitmentStatusPage } from '@/features/recruiter';

// Feature pages — Shared
import { ChatPage } from '@/features/chat';

export const router = createBrowserRouter([
  /* ── Auth (full-screen sliding login/register) ───── */
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <LoginPage /> },

  /* ── Other Auth routes (keep AuthLayout) ─────────── */
  {
    element: <AuthLayout />,
    children: [
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  /* ── Admin routes ────────────────────────────────── */
  {
    element: <ProtectedRoute allowed={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/campuses', element: <CampusManagementPage /> },
          { path: '/admin/users', element: <UserManagementPage /> },
          { path: '/admin/verifications', element: <VerificationRequestsPage /> },
          { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
          { path: '/admin/moderation', element: <AdminModerationPage /> },
          { path: '/admin/chat', element: <ChatPage /> },
          { path: '/admin/profile', element: <AdminProfilePage /> },
        ],
      },
    ],
  },

  /* ── Campus routes ───────────────────────────────── */
  {
    element: <ProtectedRoute allowed={['campus']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/campus', element: <CampusDashboard /> },
          { path: '/campus/students', element: <CampusStudentListPage /> },
          { path: '/campus/verifications', element: <CampusVerificationsPage /> },
          { path: '/campus/profile', element: <CampusProfilePage /> },
          { path: '/campus/gigs', element: <CampusGigsMonitorPage /> },
          { path: '/campus/activity', element: <CampusActivityMonitorPage /> },
          { path: '/campus/opportunities', element: <CompanyOpportunitiesPage /> },
          { path: '/campus/opportunities/:oppId/applicants', element: <CompanyApplicantsPage /> },
          { path: '/campus/analytics', element: <CampusAnalyticsPage /> },
          { path: '/campus/chat', element: <ChatPage /> },
        ],
      },
    ],
  },

  /* ── Student routes (freelancer + recruiter) ─────── */
  {
    element: <ProtectedRoute allowed={['student', 'freelancer', 'recruiter']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/student', element: <StudentDashboard /> },
          // Freelancer views
          { path: '/student/gigs', element: <BrowseGigsPage /> },
          { path: '/student/gigs/:gigId', element: <GigDetailsPage /> },
          { path: '/student/applications', element: <MyApplicationsPage /> },
          { path: '/student/submissions', element: <WorkSubmissionsPage /> },
          // Recruiter views
          { path: '/student/post-gig', element: <PostGigPage /> },
          { path: '/student/my-gigs', element: <MyGigsPage /> },
          { path: '/student/applicants', element: <ApplicantsPage /> },
          { path: '/student/recruitment-status', element: <RecruitmentStatusPage /> },
          // Profile & Chat
          { path: '/student/profile', element: <StudentProfilePage /> },
          { path: '/student/chat', element: <ChatPage /> },
          // Task 3 — Advanced
          { path: '/student/analytics', element: <StudentAnalyticsPage /> },
          { path: '/student/cross-campus', element: <CrossCampusPage /> },
          { path: '/student/advanced', element: <AdvancedFeaturesPage /> },
        ],
      },
    ],
  },

  /* ── Fallback ────────────────────────────────────── */
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

/* Simple placeholder for routes not yet implemented */
function Placeholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          This page is under construction. Coming soon!
        </p>
      </div>
    </div>
  );
}
