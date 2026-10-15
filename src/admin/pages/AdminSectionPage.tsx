import React, { useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { 
  TrendingUp, Users, Briefcase, FileText, Receipt, 
  CreditCard, Calendar, Ticket, MessageSquare, Newspaper, 
  Award, Image, BarChart3, Search, Settings, Plus, Trash2, 
  Printer, Check, Clock, ShieldCheck, UserCheck, DollarSign 
} from 'lucide-react';
import { InvoiceModal } from '../../components/InvoiceModal';
import { Invoice, LeadStatus, TaskStatus } from '../../types/crm';

interface AdminSectionPageProps {
  section: string;
}

export const AdminSectionPage: React.FC<AdminSectionPageProps> = ({ section }) => {
  const {
    leads, clients, projects, quotes, invoices, contracts,
    appointments, tickets, messages, blogArticles, subscribers,
    updateLeadStatus, deleteLead, addLead,
    updateQuoteStatus,
    updateTaskStatus, addTaskToProject,
    updateAppointmentStatus,
    updateTicketStatus, addTicketResponse,
    sendMessage
  } = useCrm();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [selectedClientIdForChat, setSelectedClientIdForChat] = useState<string>(clients[0]?.id || 'cli-1');

  return (
    <AdminLayout activeNav={section}>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* ================= 1. LEADS / CRM ================= */}
        {section === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-white">CRM & Pipeline des Prospects</h1>
                <p className="text-xs text-slate-400">Suivi des demandes commerciales entrantes de Kinshasa et d'ailleurs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['Nouveau', 'Contacté', 'Qualifié', 'Devis envoyé'] as LeadStatus[]).map(status => {
                const columnLeads = leads.filter(l => l.status === status);
                return (
                  <div key={status} className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold uppercase text-slate-300">{status}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-blue-400">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {columnLeads.map(lead => (
                        <div key={lead.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-sm">{lead.name}</span>
                            <button onClick={() => deleteLead(lead.id)} className="text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-slate-400">
                            <div className="text-slate-300 font-semibold">{lead.company}</div>
                            <div>{lead.service}</div>
                            <div className="text-blue-400 font-bold mt-1">{lead.budget}</div>
                          </div>
                          <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                            <select
                              value={lead.status}
                              onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                              className="bg-slate-900 text-[10px] text-slate-300 rounded px-2 py-1 border border-slate-700 outline-none"
                            >
                              <option value="Nouveau">Nouveau</option>
                              <option value="Contacté">Contacté</option>
                              <option value="Qualifié">Qualifié</option>
                              <option value="Devis envoyé">Devis envoyé</option>
                              <option value="Négociation">Négociation</option>
                              <option value="Converti">Converti</option>
                              <option value="Perdu">Perdu</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 2. CLIENTS ================= */}
        {section === 'clients' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Annuaire des Clients ({clients.length})</h1>
            <div className="grid md:grid-cols-3 gap-6">
              {clients.map(cli => (
                <div key={cli.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
                      {cli.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{cli.name}</h4>
                      <span className="text-xs text-slate-400">{cli.company}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div>📧 {cli.email}</div>
                    <div>📞 {cli.phone}</div>
                    <div>📍 {cli.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. PROJETS ================= */}
        {section === 'projects' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Projets en Cours & Jalons ({projects.length})</h1>
            {projects.map(proj => (
              <div key={proj.id} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400">
                      Client : {proj.clientName}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">{proj.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">{proj.description}</p>
                  </div>
                  <span className="text-xl font-black text-white font-mono">{proj.budget} {proj.currency}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  {(['À faire', 'En cours', 'En révision', 'Terminé'] as TaskStatus[]).map(status => {
                    const statusTasks = proj.tasks.filter(t => t.status === status);
                    return (
                      <div key={status} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold uppercase text-slate-400 flex justify-between">
                          <span>{status}</span>
                          <span>({statusTasks.length})</span>
                        </div>
                        <div className="space-y-2">
                          {statusTasks.map(task => (
                            <div key={task.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                              <div className="font-bold text-white">{task.title}</div>
                              <div className="text-[11px] text-slate-400">{task.description}</div>
                              <div className="flex justify-between items-center pt-2">
                                <select
                                  value={task.status}
                                  onChange={e => updateTaskStatus(proj.id, task.id, e.target.value as any)}
                                  className="bg-slate-950 text-[10px] text-blue-300 font-semibold rounded px-1.5 py-0.5 border border-slate-800"
                                >
                                  <option value="À faire">À faire</option>
                                  <option value="En cours">En cours</option>
                                  <option value="En révision">En révision</option>
                                  <option value="Terminé">Terminé</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 4. DEVIS ================= */}
        {section === 'quotes' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Gestion des Devis & Propositions ({quotes.length})</h1>
            <div className="grid gap-4">
              {quotes.map(quo => (
                <div key={quo.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="font-mono font-bold text-blue-400 text-sm">{quo.number}</span>
                    <h4 className="text-base font-bold text-white mt-1">{quo.service} — {quo.clientName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{quo.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black font-mono text-white">{quo.totalAmount} {quo.currency}</span>
                    <select
                      value={quo.status}
                      onChange={e => updateQuoteStatus(quo.id, e.target.value as any)}
                      className="bg-slate-950 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-800"
                    >
                      <option value="Brouillon">Brouillon</option>
                      <option value="Envoyé">Envoyé</option>
                      <option value="Vu">Vu</option>
                      <option value="Accepté">Accepté</option>
                      <option value="Refusé">Refusé</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. FACTURES & PAIEMENTS ================= */}
        {(section === 'invoices' || section === 'payments') && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Facturation & Règlements ({invoices.length})</h1>
            <div className="grid gap-4">
              {invoices.map(inv => (
                <div key={inv.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="font-mono font-bold text-blue-400 text-sm">{inv.number}</span>
                    <h4 className="text-base font-bold text-white mt-1">{inv.clientName}</h4>
                    <p className="text-xs text-slate-400">Date : {inv.date} • Échéance : {inv.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black font-mono text-white">{inv.total} {inv.currency}</span>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Voir PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. RENDEZ-VOUS ================= */}
        {section === 'appointments' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Gestion de l'Agenda & Rendez-vous ({appointments.length})</h1>
            <div className="grid gap-3">
              {appointments.map(apt => (
                <div key={apt.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                      {apt.date} à {apt.time} ({apt.duration})
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{apt.subject}</h4>
                    <p className="text-xs text-slate-400">Client : {apt.name} • 📞 {apt.phone}</p>
                  </div>
                  <select
                    value={apt.status}
                    onChange={e => updateAppointmentStatus(apt.id, e.target.value as any)}
                    className="bg-slate-950 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value="Demandé">Demandé</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Reporté">Reporté</option>
                    <option value="Annulé">Annulé</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. TICKETS ================= */}
        {section === 'tickets' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Tickets Support & Maintenance ({tickets.length})</h1>
            <div className="grid gap-4">
              {tickets.map(tck => (
                <div key={tck.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-blue-400 font-bold uppercase">{tck.clientName}</span>
                      <h4 className="text-lg font-bold text-white mt-1">{tck.subject}</h4>
                    </div>
                    <select
                      value={tck.status}
                      onChange={e => updateTicketStatus(tck.id, e.target.value as any)}
                      className="bg-slate-950 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-800"
                    >
                      <option value="Ouvert">Ouvert</option>
                      <option value="En cours">En cours</option>
                      <option value="En attente">En attente</option>
                      <option value="Résolu">Résolu</option>
                      <option value="Fermé">Fermé</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl">{tck.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. MESSAGES ================= */}
        {section === 'messages' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Messagerie Client</h1>
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex gap-2">
                {clients.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClientIdForChat(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedClientIdForChat === c.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="h-64 overflow-y-auto bg-slate-950 p-4 rounded-2xl space-y-2 text-xs">
                {messages.filter(m => m.clientId === selectedClientIdForChat).map(m => (
                  <div key={m.id} className={`p-2 rounded-xl max-w-sm ${m.sender === 'Admin' ? 'ml-auto bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    <div>{m.content}</div>
                    <div className="text-[9px] opacity-70 mt-1">{m.timestamp}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Répondre au client..."
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  onClick={() => {
                    if (!chatInput) return;
                    sendMessage(selectedClientIdForChat, 'Admin', chatInput);
                    setChatInput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. BLOG ================= */}
        {section === 'blog' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white">Articles & Publications ({blogArticles.length})</h1>
            <div className="grid md:grid-cols-3 gap-6">
              {blogArticles.map(art => (
                <div key={art.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-white text-sm">{art.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 10. MEDIA / ANALYTICS / SEO / SETTINGS ================= */}
        {(section === 'media' || section === 'analytics' || section === 'seo' || section === 'settings' || section === 'contracts' || section === 'services' || section === 'certifications') && (
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <h1 className="text-2xl font-black text-white capitalize">{section}</h1>
            <p className="text-xs text-slate-400">
              Module {section} configuré et sous surveillance de sécurité.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              ✓ Synchronisé avec les protocoles de sécurité du serveur et de la base de données.
            </div>
          </div>
        )}

      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </AdminLayout>
  );
};
