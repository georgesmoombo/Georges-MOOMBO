import React, { useEffect } from 'react';
import { useAuth, UserRole } from './AuthContext';
import { useRouter } from '../router/RouterContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'EDITOR' }) => {
  const { isAuthenticated, user, isLoading, hasPermission } = useAuth();
  const { navigate, pathname } = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Vérification de la session administrateur...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">401 — Authentification Requise</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Cette zone est strictement réservée au personnel autorisé. Veuillez vous connecter avec vos identifiants d'administration.
        </p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-xs uppercase tracking-wider"
        >
          Accéder à la page de connexion
        </button>
      </div>
    );
  }

  // Check role permission (e.g. EDITOR trying to access security or critical finances)
  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">403 — Accès Non Autorisé</h1>
        <p className="text-sm text-slate-400 max-w-md mb-2">
          Votre compte (rôle : <strong>{user?.role}</strong>) ne possède pas les privilèges suffisants pour accéder à cette ressource ({pathname}).
        </p>
        <p className="text-xs text-slate-500 max-w-md mb-6">
          Privilèges requis : <strong>{requiredRole}</strong>.
        </p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
