import React from 'react';
import { ClientPortal } from '../components/client/ClientPortal';
import { useRouter, Link } from '../router/RouterContext';
import { ArrowLeft, ShieldCheck, Phone } from 'lucide-react';
import { AppointmentModal } from '../components/AppointmentModal';
import { PORTFOLIO_INFO } from '../data/portfolioData';

export const ClientApp: React.FC = () => {
  const [isAppointmentOpen, setIsAppointmentOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Client Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retourner au site public
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Espace Privé Partenaire & Client
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline">Assistance directe :</span>
          <a href={`tel:${PORTFOLIO_INFO.phone}`} className="font-bold text-white hover:text-blue-400 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-500" /> {PORTFOLIO_INFO.phoneDisplay}
          </a>
        </div>
      </header>

      {/* Main Client Content */}
      <div className="flex-1">
        <ClientPortal onOpenAppointmentModal={() => setIsAppointmentOpen(true)} />
      </div>

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </div>
  );
};
