import React from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { useRouter } from '../../router/RouterContext';
import { 
  TrendingUp, Users, Briefcase, FileText, Receipt, 
  CreditCard, Calendar, Ticket, CheckCircle2, Clock, 
  ArrowUpRight, AlertCircle, ShieldCheck, DollarSign 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { leads, clients, projects, quotes, invoices, appointments, tickets } = useCrm();
  const { navigate } = useRouter();

  // Financial metrics
  const totalPaid = invoices
    .filter(i => i.status === 'Payée' || i.status === 'Partiellement payée')
    .flatMap(i => i.payments)
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'Envoyée' || i.status === 'En retard')
    .reduce((acc, i) => acc + i.total, 0);

  const activeProjects = projects.filter(p => p.status === 'En cours');
  const openTickets = tickets.filter(t => t.status !== 'Résolu' && t.status !== 'Fermé');

  return (
    <AdminLayout activeNav="dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-900/60 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Tableau de Bord Général
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Synthèse opérationnelle et financière de l'activité commerciale et technique.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/leads')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              Nouveau Prospect <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/admin/quotes')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-colors"
            >
              Émettre un Devis
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Encaissé</span>
              <div className="p-2 rounded-xl bg-green-500/15 text-green-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono">
              {totalPaid.toLocaleString()} USD
            </div>
            <span className="text-[11px] text-slate-500 block">Sur l'ensemble des factures acquittées</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Factures à Recouvrer</span>
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {pendingRevenue.toLocaleString()} USD
            </div>
            <span className="text-[11px] text-slate-500 block">En attente d'échéance client</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projets en Production</span>
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              {activeProjects.length}
            </div>
            <span className="text-[11px] text-slate-500 block">Chantiers logiciels et ERP actifs</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tickets Support</span>
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
              {openTickets.length}
            </div>
            <span className="text-[11px] text-slate-500 block">Demandes d'assistance en attente</span>
          </div>
        </div>

        {/* Overview Tables Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* CRM Prospects */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Nouveaux Prospects CRM ({leads.length})
              </h3>
              <button 
                onClick={() => navigate('/admin/leads')}
                className="text-xs text-blue-400 hover:underline"
              >
                Gérer le pipeline →
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map(lead => (
                <div key={lead.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{lead.name}</span>
                    <span className="text-slate-400">{lead.company} • {lead.service}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 block mb-0.5">
                      {lead.status}
                    </span>
                    <span className="text-slate-500 text-[10px]">{lead.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prochains Rendez-vous */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" /> Prochains Rendez-vous ({appointments.length})
              </h3>
              <button 
                onClick={() => navigate('/admin/appointments')}
                className="text-xs text-blue-400 hover:underline"
              >
                Voir l'agenda →
              </button>
            </div>

            <div className="space-y-3">
              {appointments.slice(0, 4).map(apt => (
                <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{apt.name}</span>
                    <span className="text-slate-400">{apt.subject} ({apt.duration})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-400 block">{apt.date}</span>
                    <span className="text-slate-500 text-[10px]">{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
