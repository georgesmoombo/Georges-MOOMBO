import React, { useState } from 'react';
import { 
  Briefcase, FileText, Receipt, CreditCard, Ticket, 
  MessageSquare, Calendar, Bell, User, CheckCircle2, 
  Clock, AlertCircle, Plus, Send, Download, ExternalLink, 
  ShieldCheck, ArrowRight, Printer, Check, X 
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { InvoiceModal } from '../InvoiceModal';
import { Invoice } from '../../types/crm';

export const ClientPortal: React.FC<{
  onOpenNewTicketModal?: () => void;
  onOpenAppointmentModal: () => void;
}> = ({ onOpenAppointmentModal }) => {
  const { 
    clients, currentClientId, setCurrentClientId, currentClient,
    projects, quotes, contracts, invoices, appointments, tickets, 
    messages, notifications, addTicket, addTicketResponse, sendMessage,
    updateQuoteStatus
  } = useCrm();

  const [activeTab, setActiveTab] = useState<
    'projets' | 'devis' | 'contrats' | 'factures' | 'paiements' | 'rendez-vous' | 'tickets' | 'messages' | 'profil'
  >('projets');

  // Selected invoice for PDF view
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New ticket state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'Faible' | 'Normale' | 'Haute' | 'Urgente'>('Normale');

  // Active ticket conversation
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Filter client's specific data
  const clientProjects = projects.filter(p => p.clientId === currentClientId);
  const clientQuotes = quotes.filter(q => q.clientId === currentClientId);
  const clientContracts = contracts.filter(c => c.clientId === currentClientId);
  const clientInvoices = invoices.filter(i => i.clientId === currentClientId);
  const clientAppointments = appointments.filter(a => a.email.toLowerCase() === currentClient?.email.toLowerCase());
  const clientTickets = tickets.filter(t => t.clientId === currentClientId);
  const clientMessages = messages.filter(m => m.clientId === currentClientId);

  // All payments for this client's invoices
  const allClientPayments = clientInvoices.flatMap(inv => 
    inv.payments.map(p => ({ ...p, invoiceNumber: inv.number, projectTitle: inv.projectTitle }))
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketDesc || !currentClient) return;

    addTicket({
      clientId: currentClient.id,
      clientName: currentClient.name,
      subject: newTicketSubject,
      description: newTicketDesc,
      priority: newTicketPriority,
      status: 'Ouvert'
    });

    setNewTicketSubject('');
    setNewTicketDesc('');
    setIsNewTicketOpen(false);
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    addTicketResponse(ticketId, ticketReplyText.trim(), 'Client');
    setTicketReplyText('');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentClient) return;
    sendMessage(currentClient.id, 'Client', chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Portal Banner with Client Switcher */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Espace Sécurisé Client
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenue, {currentClient?.name}
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              {currentClient?.company} • Suivi en temps réel de vos prestations et facturation
            </p>
          </div>

          {/* Quick Client Switcher (for demo/testing live accounts) */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-blue-200 font-semibold">Compte actif :</span>
            <select
              value={currentClientId}
              onChange={e => setCurrentClientId(e.target.value)}
              className="bg-blue-950/80 text-white font-bold rounded-xl px-3 py-1.5 border border-blue-400/30 outline-none cursor-pointer"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Client Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm no-scrollbar">
          {[
            { id: 'projets', label: 'Mon Projet', icon: Briefcase, count: clientProjects.length },
            { id: 'devis', label: 'Mes Devis', icon: FileText, count: clientQuotes.length },
            { id: 'contrats', label: 'Mes Contrats', icon: ShieldCheck, count: clientContracts.length },
            { id: 'factures', label: 'Mes Factures', icon: Receipt, count: clientInvoices.length },
            { id: 'paiements', label: 'Mes Paiements', icon: CreditCard, count: allClientPayments.length },
            { id: 'rendez-vous', label: 'Mes RDV', icon: Calendar, count: clientAppointments.length },
            { id: 'tickets', label: 'Support & Tickets', icon: Ticket, count: clientTickets.filter(t => t.status !== 'Résolu').length },
            { id: 'messages', label: 'Messagerie', icon: MessageSquare, count: clientMessages.length },
            { id: 'profil', label: 'Profil Entreprise', icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Projets en cours */}
        {activeTab === 'projets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mes Projets en Cours & Livrables
              </h2>
            </div>

            {clientProjects.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p>Aucun projet actif pour le moment. Vous pouvez valider un devis pour démarrer les travaux.</p>
              </div>
            ) : (
              clientProjects.map(proj => (
                <div 
                  key={proj.id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          proj.status === 'Terminé' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        }`}>
                          {proj.status}
                        </span>
                        <span className="text-xs text-slate-400">Livraison estimée : {proj.deliveryDate}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                        {proj.description}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block font-semibold">Budget du projet</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {proj.budget} {proj.currency}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Progression globale</span>
                      <span className="text-blue-600 dark:text-blue-400">{proj.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Jalons & Tâches associées ({proj.tasks.length})
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {proj.tasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-3"
                        >
                          <div className={`mt-0.5 ${task.status === 'Terminé' ? 'text-green-500' : 'text-slate-400'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {task.title}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                              {task.description}
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                task.status === 'Terminé' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                              }`}>
                                {task.status}
                              </span>
                              <span className="text-[10px] text-slate-400">Échéance: {task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Devis */}
        {activeTab === 'devis' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mes Propositions Commerciales & Devis
            </h2>

            {clientQuotes.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p>Aucun devis en attente pour votre compte.</p>
              </div>
            ) : (
              clientQuotes.map(quote => (
                <div 
                  key={quote.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                        {quote.number}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {quote.service}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {quote.description}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mb-1 ${
                        quote.status === 'Accepté' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {quote.status}
                      </span>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {quote.totalAmount} {quote.currency}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Détail des prestations :
                    </span>
                    {quote.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <span>{it.description} (x{it.quantity})</span>
                        <span className="font-mono font-bold">{it.total} {quote.currency}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  {quote.status === 'Envoyé' && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => updateQuoteStatus(quote.id, 'Accepté')}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" /> Accepter & Valider le devis
                      </button>
                      <button
                        onClick={() => updateQuoteStatus(quote.id, 'Refusé')}
                        className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                      >
                        Décliner
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Contrats */}
        {activeTab === 'contrats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mes Contrats & Engagements Juridiques
            </h2>

            {clientContracts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p>Aucun contrat archivé pour le moment.</p>
              </div>
            ) : (
              clientContracts.map(ctr => (
                <div 
                  key={ctr.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {ctr.number}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {ctr.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Date d'effet : {ctr.date} • Durée : {ctr.duration}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Statut : {ctr.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {ctr.terms}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Factures */}
        {activeTab === 'factures' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Facturation & Échéances de Règlement
            </h2>

            <div className="grid gap-4">
              {clientInvoices.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                  <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p>Aucune facture enregistrée pour ce compte.</p>
                </div>
              ) : (
                clientInvoices.map(inv => (
                  <div 
                    key={inv.id}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                          {inv.number}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          inv.status === 'Payée' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Émise le {inv.date} • Échéance le {inv.dueDate}
                      </p>
                      {inv.projectTitle && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                          {inv.projectTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {inv.total} {inv.currency}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Printer className="w-4 h-4" /> Afficher / Imprimer PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Paiements */}
        {activeTab === 'paiements' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Historique des Paiements Réalisés
            </h2>

            {allClientPayments.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p>Aucun versement enregistré pour l'instant.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Facture Réf.</th>
                      <th className="p-4 font-bold">Méthode</th>
                      <th className="p-4 font-bold">Réf. Transaction</th>
                      <th className="p-4 font-bold text-right">Montant</th>
                      <th className="p-4 font-bold text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allClientPayments.map(p => (
                      <tr key={p.id}>
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{p.date}</td>
                        <td className="p-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{p.invoiceNumber}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">{p.method}</td>
                        <td className="p-4 font-mono text-xs text-slate-500">{p.reference}</td>
                        <td className="p-4 text-right font-black text-slate-900 dark:text-white font-mono">
                          {p.amount} {p.currency}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Rendez-vous */}
        {activeTab === 'rendez-vous' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mes Rendez-vous Planifiés
              </h2>
              <button
                onClick={onOpenAppointmentModal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" /> Programmer un RDV
              </button>
            </div>

            {clientAppointments.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p>Aucun rendez-vous planifié.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {clientAppointments.map(apt => (
                  <div 
                    key={apt.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        {apt.date} à {apt.time} ({apt.duration})
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {apt.subject}
                      </h4>
                      {apt.notes && (
                        <p className="text-xs text-slate-500 mt-1">{apt.notes}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Support & Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tickets d'Assistance Technique & Support
              </h2>
              <button
                onClick={() => setIsNewTicketOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" /> Nouveau Ticket
              </button>
            </div>

            {/* Create ticket dialog */}
            {isNewTicketOpen && (
              <form onSubmit={handleCreateTicket} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ouvrir un ticket d'assistance</h3>
                  <button type="button" onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Sujet du problème *</label>
                    <input
                      type="text"
                      required
                      value={newTicketSubject}
                      onChange={e => setNewTicketSubject(e.target.value)}
                      placeholder="Ex: Erreur lors de l'édition du reçu de caisse"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Priorité</label>
                    <select
                      value={newTicketPriority}
                      onChange={e => setNewTicketPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Faible">Faible</option>
                      <option value="Normale">Normale</option>
                      <option value="Haute">Haute</option>
                      <option value="Urgente">Urgente (Blocage complet)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Description du problème *</label>
                  <textarea
                    rows={4}
                    required
                    value={newTicketDesc}
                    onChange={e => setNewTicketDesc(e.target.value)}
                    placeholder="Expliquez ce qui s'est produit, le message d'erreur éventuel..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    Soumettre le ticket
                  </button>
                </div>
              </form>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
              {clientTickets.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                  <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p>Aucun ticket d'incident ouvert. Tous vos services fonctionnent parfaitement !</p>
                </div>
              ) : (
                clientTickets.map(tck => (
                  <div 
                    key={tck.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tck.priority === 'Urgente' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            Priorité : {tck.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tck.status === 'Résolu' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}>
                            {tck.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                          {tck.subject}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Ouvert le {tck.createdAt}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                      {tck.description}
                    </p>

                    {/* Responses conversation */}
                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Historique des échanges ({tck.responses.length})
                      </span>
                      {tck.responses.map((resp, rIdx) => (
                        <div 
                          key={rIdx}
                          className={`p-3 rounded-2xl text-xs ${
                            resp.sender === 'Georges'
                              ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between font-bold mb-1">
                            <span>{resp.sender === 'Georges' ? '👨‍💻 Georges MOOMBO (Support)' : '👤 Vous'}</span>
                            <span className="text-[10px] opacity-70">{resp.timestamp}</span>
                          </div>
                          <p>{resp.message}</p>
                        </div>
                      ))}

                      {/* Reply input */}
                      {tck.status !== 'Résolu' && (
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Ajouter une précision ou répondre à Georges..."
                            value={selectedTicketId === tck.id ? ticketReplyText : ''}
                            onFocus={() => setSelectedTicketId(tck.id)}
                            onChange={e => {
                              setSelectedTicketId(tck.id);
                              setTicketReplyText(e.target.value);
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendTicketReply(tck.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                          >
                            Répondre
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Messagerie Directe */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[550px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                GM
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Canal Direct avec Georges MOOMBO
                </h3>
                <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Disponible pour vos questions
                </span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {clientMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Aucun message pour l'instant. Posez une question directement à Georges ci-dessous !
                </div>
              ) : (
                clientMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'Client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm ${
                      msg.sender === 'Client'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p>{msg.content}</p>
                      <span className={`text-[10px] block mt-1 text-right ${
                        msg.sender === 'Client' ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Écrivez votre message à Georges..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Envoyer
              </button>
            </form>
          </div>
        )}

        {/* Tab 9: Profil Client */}
        {activeTab === 'profil' && currentClient && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Fiche Entreprise & Coordonnées Client
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Nom du Contact</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{currentClient.name}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Raison Sociale</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{currentClient.company}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Email de Facturation</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{currentClient.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Téléphone & WhatsApp</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{currentClient.phone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <span className="font-bold block">Assistance technique prioritaire :</span>
              <p>Votre compte client bénéficie d'un canal prioritaire de support. Pour toute intervention matérielle d'urgence à Kinshasa, contactez le support téléphonique au +243 829 725 609.</p>
            </div>
          </div>
        )}

      </div>

      {/* Invoice Modal Preview */}
      <InvoiceModal 
        invoice={selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
      />
    </div>
  );
};
