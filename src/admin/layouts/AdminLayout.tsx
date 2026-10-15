import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useRouter, Link } from '../../router/RouterContext';
import { 
  LayoutDashboard, TrendingUp, Users, Briefcase, FileText, 
  Receipt, CreditCard, Calendar, Ticket, MessageSquare, 
  Newspaper, Award, Image, BarChart3, Search, Bell, 
  ShieldCheck, Settings, LogOut, ExternalLink, Menu, X, ChevronRight, UserCheck,
  Clock, Sliders 
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNav }) => {
  const { user, logout, hasPermission } = useAuth();
  const { navigate } = useRouter();
  const { unreadNotificationsCount, notifications, markAllNotificationsRead } = useCrm();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'EDITOR' as const },
    { id: 'leads', path: '/admin/leads', label: 'CRM & Prospects', icon: TrendingUp, role: 'EDITOR' as const },
    { id: 'clients', path: '/admin/clients', label: 'Clients', icon: Users, role: 'EDITOR' as const },
    { id: 'projects', path: '/admin/projects', label: 'Projets', icon: Briefcase, role: 'EDITOR' as const },
    { id: 'services', path: '/admin/services', label: 'Services', icon: UserCheck, role: 'EDITOR' as const },
    { id: 'quotes', path: '/admin/quotes', label: 'Devis', icon: FileText, role: 'EDITOR' as const },
    { id: 'contracts', path: '/admin/contracts', label: 'Contrats', icon: ShieldCheck, role: 'ADMIN' as const },
    { id: 'invoices', path: '/admin/invoices', label: 'Factures', icon: Receipt, role: 'ADMIN' as const },
    { id: 'payments', path: '/admin/payments', label: 'Paiements', icon: CreditCard, role: 'ADMIN' as const },
    { id: 'appointments', path: '/admin/appointments', label: 'Rendez-vous', icon: Calendar, role: 'EDITOR' as const },
    { id: 'tickets', path: '/admin/tickets', label: 'Support & Tickets', icon: Ticket, role: 'EDITOR' as const },
    { id: 'messages', path: '/admin/messages', label: 'Messages', icon: MessageSquare, role: 'EDITOR' as const },
    { id: 'blog', path: '/admin/blog', label: 'Blog', icon: Newspaper, role: 'EDITOR' as const },
    { id: 'certifications', path: '/admin/certifications', label: 'Certifications', icon: Award, role: 'EDITOR' as const },
    { id: 'experiences', path: '/admin/experiences', label: 'Expériences & Carrière', icon: Clock, role: 'EDITOR' as const },
    { id: 'profiles', path: '/admin/profiles', label: 'Profils & Identités', icon: UserCheck, role: 'EDITOR' as const },
    { id: 'footer-settings', path: '/admin/footer-settings', label: 'Pied de page & CV', icon: Sliders, role: 'ADMIN' as const },
    { id: 'analytics', path: '/admin/analytics', label: 'Analytics', icon: BarChart3, role: 'ADMIN' as const },
    { id: 'seo', path: '/admin/seo', label: 'SEO & Référencement', icon: Search, role: 'ADMIN' as const },
    { id: 'security', path: '/admin/security', label: 'Sécurité & Audit', icon: ShieldCheck, role: 'ADMIN' as const },
    { id: 'settings', path: '/admin/settings', label: 'Paramètres', icon: Settings, role: 'ADMIN' as const },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
                GM
              </div>
              <div>
                <span className="font-black text-white text-sm block leading-tight">
                  GM ADMIN
                </span>
                <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                  Console d'Exploitation
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] no-scrollbar text-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isAllowed = hasPermission(item.role);
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isAllowed
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                        : 'text-slate-600 cursor-not-allowed hover:bg-transparent'
                  }`}
                  title={!isAllowed ? 'Accès réservé aux administrateurs' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {!isAllowed && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-500 font-mono">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <img 
              src="/profile_photo.jpg" 
              alt={user?.name || 'Georges MOOMBO'} 
              className="w-8 h-8 rounded-lg object-cover object-top border border-slate-700 bg-slate-800 shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {user?.name}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                user?.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Console d'Administration Sécurisée • Kinshasa, RDC
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Public Site Link */}
            <Link
              to="/"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              title="Basculer instantanément vers le site public dans l'aperçu"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voir le site public</span>
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Notifications ({notifications.length})</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 space-y-0.5">
                        <span className="font-bold text-white block">{n.title}</span>
                        <p className="text-slate-400 text-[11px]">{n.message}</p>
                        <span className="text-[9px] text-slate-500 block">{n.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Child Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
