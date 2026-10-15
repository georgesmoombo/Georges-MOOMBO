import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Briefcase, FileText, 
  Receipt, Calendar, Ticket, MessageSquare, Newspaper, 
  Mail, Plus, Check, X, Printer, ArrowRight, TrendingUp, 
  DollarSign, CheckCircle2, Clock, AlertCircle, Edit, Trash2, Filter 
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { LeadStatus, ProjectStatus, TaskStatus, InvoiceStatus, QuoteStatus, AppointmentStatus, TicketStatus, Currency } from '../../types/crm';
import { InvoiceModal } from '../InvoiceModal';
import { Invoice, Quote } from '../../types/crm';

export const AdminDashboard: React.FC = () => {
  const {
    leads, clients, quotes, projects, invoices, contracts,
    appointments, tickets, messages, blogArticles, subscribers,
    addLead, updateLeadStatus, deleteLead,
    addClient, updateClient,
    addQuote, updateQuoteStatus,
    addProject, updateProjectProgress, updateTaskStatus, addTaskToProject,
    addInvoice, updateInvoiceStatus, addPaymentToInvoice,
    updateAppointmentStatus,
    addTicketResponse, updateTicketStatus,
    sendMessage, addBlogArticle, resetToDemoData
  } = useCrm();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'clients' | 'projects' | 'quotes' | 'invoices' | 'calendar' | 'tickets' | 'messages' | 'blog' | 'newsletter'
  >('overview');

  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  // New Lead Modal State
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadService, setNewLeadService] = useState('Systèmes de Gestion sur Mesure');
  const [newLeadBudget, setNewLeadBudget] = useState('1000 USD');

  // New Task State
  const [selectedProjForTask, setSelectedProjForTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Basse' | 'Normale' | 'Haute' | 'Urgente'>('Normale');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // New Payment State
  const [selectedInvForPay, setSelectedInvForPay] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number>(100);
  const [payMethod, setPayMethod] = useState<'Mobile Money' | 'Virement' | 'Espèces'>('Mobile Money');
  const [payRef, setPayRef] = useState('');
  const [emailsCopied, setEmailsCopied] = useState(false);

  // Financial Metrics calculations
  const totalRevenue = invoices
    .filter(i => i.status === 'Payée' || i.status === 'Partiellement payée')
    .flatMap(i => i.payments)
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'Envoyée' || i.status === 'En retard')
    .reduce((acc, i) => acc + i.total, 0);

  const activeProjectsCount = projects.filter(p => p.status === 'En cours').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Résolu' && t.status !== 'Fermé').length;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    addLead({
      name: newLeadName,
      company: newLeadCompany || 'Particulier',
      phone: newLeadPhone,
      email: newLeadEmail || 'non.renseigne@client.cd',
      source: 'Saisie Administrateur',
      service: newLeadService,
      budget: newLeadBudget,
      status: 'Nouveau',
      notes: 'Prospect créé manuellement depuis le panneau administrateur.'
    });

    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setIsNewLeadOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjForTask || !newTaskTitle) return;

    addTaskToProject(selectedProjForTask, {
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      assignee: 'Georges MOOMBO',
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
      status: 'À faire'
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setSelectedProjForTask(null);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvForPay || payAmount <= 0) return;

    addPaymentToInvoice(selectedInvForPay, {
      amount: payAmount,
      currency: 'USD',
      method: payMethod,
      reference: payRef || `PAY-${Date.now().toString().slice(-6)}`,
      status: 'Confirmé'
    });

    setSelectedInvForPay(null);
    setPayRef('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" /> Console Administrateur & CRM
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gestion de l'Activité • Georges MOOMBO
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Pilotez l'ensemble de votre portefeuille clients, devis, projets, tickets et factures en temps réel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsNewLeadOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Nouveau Prospect
            </button>
            <button
              onClick={resetToDemoData}
              className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              title="Réinitialiser avec les données de démonstration"
            >
              Données Démo
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs sm:text-sm no-scrollbar">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
            { id: 'leads', label: `Prospects (${leads.length})`, icon: TrendingUp },
            { id: 'clients', label: `Clients (${clients.length})`, icon: Users },
            { id: 'projects', label: `Projets (${projects.length})`, icon: Briefcase },
            { id: 'quotes', label: `Devis (${quotes.length})`, icon: FileText },
            { id: 'invoices', label: `Factures (${invoices.length})`, icon: Receipt },
            { id: 'calendar', label: `RDV (${appointments.length})`, icon: Calendar },
            { id: 'tickets', label: `Tickets (${openTicketsCount} ouverts)`, icon: Ticket },
            { id: 'blog', label: `Blog (${blogArticles.length})`, icon: Newspaper },
            { id: 'newsletter', label: `Abonnés (${subscribers.length})`, icon: Mail },
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
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= 1. OVERVIEW / DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Chiffre d'Affaires Encaissé</span>
                <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono">
                  {totalRevenue.toLocaleString()} USD
                </div>
                <span className="text-[11px] text-slate-400 block pt-1">Sur factures acquittées</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Créances / Factures en cours</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {pendingRevenue.toLocaleString()} USD
                </div>
                <span className="text-[11px] text-slate-400 block pt-1">À encaisser à échéance</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Projets en Production</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                  {activeProjectsCount}
                </div>
                <span className="text-[11px] text-slate-400 block pt-1">Chantiers logiciels actifs</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Tickets Support Ouverts</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                  {openTicketsCount}
                </div>
                <span className="text-[11px] text-slate-400 block pt-1">Demandes d'assistance en attente</span>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" /> Nouveaux Prospects CRM
                  </h3>
                  <button onClick={() => setActiveTab('leads')} className="text-xs text-blue-400 hover:underline">
                    Voir tout
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 4).map(lead => (
                    <div key={lead.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-white block">{lead.name}</span>
                        <span className="text-slate-400">{lead.company} • {lead.service}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" /> Prochains Rendez-vous
                  </h3>
                  <button onClick={() => setActiveTab('calendar')} className="text-xs text-blue-400 hover:underline">
                    Voir agenda
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.slice(0, 4).map(apt => (
                    <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-white block">{apt.name}</span>
                        <span className="text-slate-400">{apt.subject} ({apt.duration})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-400 block">{apt.date}</span>
                        <span className="text-slate-400">{apt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PROSPECTS / LEADS PIPELINE (KANBAN & LIST) ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Pipeline de Vente & Gestion des Prospects</h2>
                <p className="text-xs text-slate-400">Suivez le statut de chaque opportunité commerciale du premier contact à la conversion.</p>
              </div>
              <button
                onClick={() => setIsNewLeadOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Ajouter un prospect
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['Nouveau', 'Contacté', 'Qualifié', 'Devis envoyé'] as LeadStatus[]).map(status => {
                const columnLeads = leads.filter(l => l.status === status);
                return (
                  <div key={status} className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700 flex flex-col space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                        {status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-700 text-xs font-bold text-blue-400">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                      {columnLeads.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">Aucun prospect</div>
                      ) : (
                        columnLeads.map(lead => (
                          <div key={lead.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2.5 text-xs shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-white text-sm">{lead.name}</span>
                              <button 
                                onClick={() => deleteLead(lead.id)}
                                className="text-slate-500 hover:text-red-400 p-1"
                                title="Supprimer le prospect"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-slate-400">
                              <div className="font-semibold text-slate-300">{lead.company}</div>
                              <div>{lead.service}</div>
                              <div className="text-blue-400 font-bold mt-1">Budget : {lead.budget}</div>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              📞 {lead.phone}
                            </div>

                            {/* Move status buttons */}
                            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                              <select
                                value={lead.status}
                                onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                                className="bg-slate-800 text-[11px] font-bold text-slate-300 rounded-lg px-2 py-1 border border-slate-700 outline-none"
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
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 3. CLIENTS DIRECTORY ================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Annuaire des Clients & Comptes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {clients.map(cli => {
                const cliProjects = projects.filter(p => p.clientId === cli.id);
                const cliInvoices = invoices.filter(i => i.clientId === cli.id);
                const cliTotal = cliInvoices.reduce((acc, i) => acc + i.total, 0);

                return (
                  <div key={cli.id} className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
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

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs flex justify-between">
                      <span>Projets actifs : <strong>{cliProjects.length}</strong></span>
                      <span>Total facturé : <strong>{cliTotal} USD</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. PROJECTS KANBAN ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Gestion des Projets Clients & Tâches</h2>
                <p className="text-xs text-slate-400">Tableau de bord opérationnel pour le suivi des livrables.</p>
              </div>
            </div>

            {projects.map(proj => (
              <div key={proj.id} className="p-6 sm:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400">
                      Client : {proj.clientName}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">{proj.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">{proj.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProjForTask(proj.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une tâche
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Avancement du chantier</span>
                    <span className="text-blue-400">{proj.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>

                {/* Kanban columns for tasks in this project */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  {(['À faire', 'En cours', 'En révision', 'Terminé'] as TaskStatus[]).map(status => {
                    const statusTasks = proj.tasks.filter(t => t.status === status);
                    return (
                      <div key={status} className="p-3 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                        <div className="text-[11px] font-bold uppercase text-slate-400 flex justify-between">
                          <span>{status}</span>
                          <span>({statusTasks.length})</span>
                        </div>
                        <div className="space-y-2">
                          {statusTasks.map(task => (
                            <div key={task.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1">
                              <div className="font-bold text-white">{task.title}</div>
                              <div className="text-[11px] text-slate-400">{task.description}</div>
                              <div className="flex justify-between items-center pt-2">
                                <select
                                  value={task.status}
                                  onChange={e => updateTaskStatus(proj.id, task.id, e.target.value as any)}
                                  className="bg-slate-900 text-[10px] text-blue-300 font-semibold rounded px-1.5 py-0.5 border border-slate-700 outline-none"
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

        {/* ================= 5. DEVIS ================= */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Gestion des Devis & Propositions</h2>
            <div className="grid gap-4">
              {quotes.map(quo => (
                <div key={quo.id} className="p-6 rounded-3xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400">{quo.number}</span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-700 text-slate-300">
                        {quo.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{quo.service} — {quo.clientName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{quo.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black font-mono text-white">{quo.totalAmount} {quo.currency}</span>
                    <select
                      value={quo.status}
                      onChange={e => updateQuoteStatus(quo.id, e.target.value as any)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-700 outline-none"
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

        {/* ================= 6. FACTURES & PAIEMENTS ================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Facturation & Recouvrement</h2>
            <div className="grid gap-4">
              {invoices.map(inv => (
                <div key={inv.id} className="p-6 rounded-3xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400">{inv.number}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        inv.status === 'Payée' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{inv.clientName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Émise le {inv.date} • Échéance : {inv.dueDate}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-lg font-black font-mono text-white">{inv.total} {inv.currency}</span>
                    
                    <button
                      onClick={() => setSelectedInvoiceForModal(inv)}
                      className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> PDF
                    </button>

                    {inv.status !== 'Payée' && (
                      <button
                        onClick={() => setSelectedInvForPay(inv.id)}
                        className="px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                      >
                        + Encaisser
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. CALENDRIER RDV ================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Agenda & Rendez-vous Clients</h2>
            <div className="grid gap-3">
              {appointments.map(apt => (
                <div key={apt.id} className="p-5 rounded-3xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                      {apt.date} à {apt.time} ({apt.duration})
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{apt.subject}</h4>
                    <p className="text-xs text-slate-400">Demandeur : {apt.name} • 📞 {apt.phone} • 📧 {apt.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={apt.status}
                      onChange={e => updateAppointmentStatus(apt.id, e.target.value as any)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-700 outline-none"
                    >
                      <option value="Demandé">Demandé</option>
                      <option value="Confirmé">Confirmé</option>
                      <option value="Reporté">Reporté</option>
                      <option value="Annulé">Annulé</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. TICKETS SUPPORT ================= */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Tickets Support & Maintenance</h2>
            <div className="grid gap-4">
              {tickets.map(tck => (
                <div key={tck.id} className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-blue-400 font-bold uppercase">{tck.clientName}</span>
                      <h4 className="text-lg font-bold text-white mt-1">{tck.subject}</h4>
                      <p className="text-xs text-slate-400">{tck.createdAt}</p>
                    </div>
                    <select
                      value={tck.status}
                      onChange={e => updateTicketStatus(tck.id, e.target.value as any)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 border border-slate-700 outline-none"
                    >
                      <option value="Ouvert">Ouvert</option>
                      <option value="En cours">En cours</option>
                      <option value="En attente">En attente</option>
                      <option value="Résolu">Résolu</option>
                      <option value="Fermé">Fermé</option>
                    </select>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 bg-slate-900 p-4 rounded-2xl">
                    {tck.description}
                  </p>

                  <div className="pt-2 border-t border-slate-700/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Échanges :
                    </span>
                    {tck.responses.map((r, i) => (
                      <div key={i} className="text-xs py-1 text-slate-300">
                        <strong>{r.sender}:</strong> {r.message} <span className="text-[10px] text-slate-500">({r.timestamp})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. BLOG ================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Articles du Blog Professionnel</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {blogArticles.map(art => (
                <div key={art.id} className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-3">
                  <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-white text-base leading-snug">{art.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-3">{art.excerpt}</p>
                  <div className="text-[11px] text-slate-500">{art.date} • {art.readTime}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 10. NEWSLETTER ================= */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Abonnés à la Veille Numérique</h2>
              <button 
                onClick={() => {
                  const emails = subscribers.map(s => s.email).join('\n');
                  navigator.clipboard.writeText(emails);
                  setEmailsCopied(true);
                  setTimeout(() => setEmailsCopied(false), 3000);
                }}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-colors ${
                  emailsCopied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {emailsCopied ? "✓ Adresses copiées !" : "Exporter / Copier Emails"}
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-3">
              {subscribers.map(sub => (
                <div key={sub.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{sub.email}</span>
                  <span className="text-slate-400">Inscrit le {sub.subscribedAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add Lead */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleCreateLead} className="w-full max-w-lg bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Nouveau Prospect CRM</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Nom & Prénom *</label>
              <input
                type="text"
                required
                value={newLeadName}
                onChange={e => setNewLeadName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Entreprise / Organisation</label>
              <input
                type="text"
                value={newLeadCompany}
                onChange={e => setNewLeadCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Téléphone *</label>
                <input
                  type="text"
                  required
                  value={newLeadPhone}
                  onChange={e => setNewLeadPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Email</label>
                <input
                  type="email"
                  value={newLeadEmail}
                  onChange={e => setNewLeadEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsNewLeadOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Task */}
      {selectedProjForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleAddTask} className="w-full max-w-md bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Ajouter une tâche au projet</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Titre de la tâche *</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Description</label>
              <textarea
                rows={2}
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Priorité</label>
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Basse">Basse</option>
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">Échéance</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setSelectedProjForTask(null)} className="px-4 py-2 text-xs font-bold text-slate-400">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Record Payment */}
      {selectedInvForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleRecordPayment} className="w-full max-w-sm bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Encaisser un Paiement</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Montant (USD) *</label>
              <input
                type="number"
                required
                min="1"
                value={payAmount}
                onChange={e => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Moyen de paiement</label>
              <select
                value={payMethod}
                onChange={e => setPayMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Mobile Money">Mobile Money (M-Pesa / Airtel Money)</option>
                <option value="Virement">Virement bancaire</option>
                <option value="Espèces">Espèces</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Référence de transaction</label>
              <input
                type="text"
                placeholder="Ex: MPESA-981240"
                value={payRef}
                onChange={e => setPayRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setSelectedInvForPay(null)} className="px-4 py-2 text-xs font-bold text-slate-400">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold">
                Valider l'encaissement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoice Modal for PDF view & print */}
      <InvoiceModal
        invoice={selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
      />
    </div>
  );
};
