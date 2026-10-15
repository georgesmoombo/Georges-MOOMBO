import React from 'react';
import { RouterProvider, useRouter, Link } from './router/RouterContext';
import { AuthProvider } from './auth/AuthContext';
import { CrmProvider } from './context/CrmContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Public & Client Apps
import { PublicApp } from './public/PublicApp';
import { ClientApp } from './client/ClientApp';

// Admin Auth Pages
import { LoginPage } from './auth/pages/LoginPage';
import { ForgotPasswordPage } from './auth/pages/ForgotPasswordPage';

// Admin Application Pages
import { DashboardPage } from './admin/pages/DashboardPage';
import { SecurityAuditPage } from './admin/pages/SecurityAuditPage';
import { AdminSectionPage } from './admin/pages/AdminSectionPage';
import { SettingsPage } from './admin/pages/SettingsPage';
import { AdminGalleryPage } from './admin/pages/AdminGalleryPage';
import { ProfilesPage } from './admin/pages/ProfilesPage';
import { ExperiencesPage } from './admin/pages/ExperiencesPage';
import { FooterSettingsPage } from './admin/pages/FooterSettingsPage';

import { ShieldAlert, ArrowLeft } from 'lucide-react';

function RouteDispatcher() {
  const { pathname } = useRouter();

  // Normalize path without trailing slash (except root)
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // 1. PUBLIC ROUTES
  if (
    path === '/' ||
    path === '/about' ||
    path === '/skills' ||
    path === '/cybersecurity' ||
    path === '/projects' ||
    path.startsWith('/projects/') ||
    path === '/gallery' ||
    path === '/profiles' ||
    path === '/services' ||
    path === '/certifications' ||
    path === '/testimonials' ||
    path === '/blog' ||
    path.startsWith('/blog/') ||
    path === '/quote' ||
    path === '/appointment' ||
    path === '/contact'
  ) {
    return <PublicApp />;
  }

  // 2. CLIENT PORTAL ROUTE (/client)
  if (path === '/client' || path.startsWith('/client/')) {
    return <ClientApp />;
  }

  // 3. ADMIN AUTHENTICATION ROUTES (Public to admins/visitors)
  if (path === '/admin/login') {
    return <LoginPage />;
  }
  if (path === '/admin/forgot-password' || path === '/admin/reset-password') {
    return <ForgotPasswordPage />;
  }

  // 4. ADMIN PROTECTED ROUTES
  if (path === '/admin' || path === '/admin/dashboard') {
    return (
      <ProtectedRoute requiredRole="EDITOR">
        <DashboardPage />
      </ProtectedRoute>
    );
  }

  // Dedicated Profiles Page (EDITOR or ADMIN)
  if (path === '/admin/profiles' || path === '/admin/profile') {
    return (
      <ProtectedRoute requiredRole="EDITOR">
        <ProfilesPage />
      </ProtectedRoute>
    );
  }

  // Dedicated Settings Page (ADMIN ONLY)
  if (path === '/admin/settings') {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SettingsPage />
      </ProtectedRoute>
    );
  }

  // Dedicated Experiences Page (EDITOR or ADMIN)
  if (path === '/admin/experiences' || path === '/admin/experience') {
    return (
      <ProtectedRoute requiredRole="EDITOR">
        <ExperiencesPage />
      </ProtectedRoute>
    );
  }

  // Dedicated Footer & CV Settings Page (ADMIN ONLY)
  if (path === '/admin/footer-settings' || path === '/admin/footer' || path === '/admin/cv-settings') {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <FooterSettingsPage />
      </ProtectedRoute>
    );
  }

  // Dedicated Gallery Page (EDITOR or ADMIN)
  if (path === '/admin/gallery' || path === '/admin/media') {
    return (
      <ProtectedRoute requiredRole="EDITOR">
        <AdminGalleryPage />
      </ProtectedRoute>
    );
  }

  // Security & Audit (ADMIN ONLY)
  if (path === '/admin/security' || path === '/admin/audit-logs') {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <SecurityAuditPage />
      </ProtectedRoute>
    );
  }

  // Financial & Sensitive modules (ADMIN ONLY)
  if (
    path === '/admin/contracts' ||
    path === '/admin/invoices' ||
    path === '/admin/payments' ||
    path === '/admin/analytics' ||
    path === '/admin/seo'
  ) {
    const sec = path.replace('/admin/', '');
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminSectionPage section={sec} />
      </ProtectedRoute>
    );
  }

  // General Management modules (EDITOR or ADMIN)
  if (
    path === '/admin/leads' ||
    path === '/admin/clients' ||
    path === '/admin/projects' ||
    path === '/admin/services' ||
    path === '/admin/quotes' ||
    path === '/admin/appointments' ||
    path === '/admin/tickets' ||
    path === '/admin/messages' ||
    path === '/admin/blog' ||
    path === '/admin/certifications' ||
    path === '/admin/skills' ||
    path === '/admin/testimonials' ||
    path === '/admin/notifications'
  ) {
    const sec = path.replace('/admin/', '');
    return (
      <ProtectedRoute requiredRole="EDITOR">
        <AdminSectionPage section={sec} />
      </ProtectedRoute>
    );
  }

  // 5. 404 NOT FOUND
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black mb-2">404</h1>
      <h2 className="text-xl font-bold mb-3">Page Introuvable</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        La page ou ressource demandée (<code>{pathname}</code>) n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Retourner à l'accueil
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CrmProvider>
          <RouteDispatcher />
        </CrmProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
