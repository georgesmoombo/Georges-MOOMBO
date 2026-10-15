import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lead, Client, Quote, ClientProject, Invoice, 
  Contract, Appointment, SupportTicket, DirectMessage, 
  BlogArticle, NewsletterSubscriber, AppNotification, Task, TaskStatus, 
  QuoteStatus, InvoiceStatus, AppointmentStatus, TicketStatus, Payment,
  GalleryItem, SystemSettings, AdminProfile, ProfileItem,
  ProfessionalExperience, CvSettings, SiteFooterSettings
} from '../types/crm';
import { 
  INITIAL_CLIENTS, INITIAL_LEADS, INITIAL_QUOTES, 
  INITIAL_PROJECTS, INITIAL_INVOICES, INITIAL_CONTRACTS, 
  INITIAL_APPOINTMENTS, INITIAL_TICKETS, INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, INITIAL_BLOG_ARTICLES, INITIAL_SUBSCRIBERS 
} from '../data/initialCrmData';
import { INITIAL_GALLERY } from '../data/initialGalleryData';
import { INITIAL_PROFILES } from '../data/initialProfilesData';
import { INITIAL_EXPERIENCES } from '../data/initialExperienceData';
import { INITIAL_CV_SETTINGS, INITIAL_SITE_FOOTER_SETTINGS } from '../data/initialFooterSettings';

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  name: "Georges MOOMBO MODEAWI",
  title: "Développeur Full Stack & Expert en conception du système d'information",
  bio: "Professionnel passionné par l'architecture logicielle, la modélisation de bases de données, la conception et l'informatisation des processus métiers d'entreprises et la sécurisation des systèmes d'information en République Démocratique du Congo.",
  contactEmail: "georgesweahmoombo@gmail.com",
  notificationEmail: "georgesweahmoombo@gmail.com",
  whatsapp: "+243829725609",
  phone: "+243829725609",
  address: "Kinshasa, Gombe / Limete",
  city: "Kinshasa",
  country: "République Démocratique du Congo",
  githubUrl: "https://github.com/georgesmoombo",
  linkedinUrl: "https://linkedin.com/in/georges-moombo",
  portfolioUrl: "https://georges-moombo.cd",
  avatarUrl: "/profile_photo.jpg",
  coverUrl: "/cover_photo.jpg",
};

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  defaultCurrency: 'USD',
  timezone: 'Africa/Kinshasa (GMT+1)',
  language: 'Français (FR)',
  usdToCdfRate: 2850,
  maintenanceMode: false,
  emailNotifications: true,
  soundNotifications: true,
  twoFactorEnabled: false,
};

interface CrmContextType {
  // Data lists
  clients: Client[];
  leads: Lead[];
  quotes: Quote[];
  projects: ClientProject[];
  invoices: Invoice[];
  contracts: Contract[];
  appointments: Appointment[];
  tickets: SupportTicket[];
  messages: DirectMessage[];
  notifications: AppNotification[];
  blogArticles: BlogArticle[];
  subscribers: NewsletterSubscriber[];
  galleryItems: GalleryItem[];
  adminProfile: AdminProfile;
  systemSettings: SystemSettings;
  profiles: ProfileItem[];
  experiences: ProfessionalExperience[];
  cvSettings: CvSettings;
  siteFooterSettings: SiteFooterSettings;
  
  // Current client identity for Client Portal
  currentClientId: string;
  setCurrentClientId: (id: string) => void;
  currentClient: Client | undefined;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastInteraction'>) => Lead;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;

  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => Client;
  updateClient: (client: Client) => void;

  addQuote: (quote: Omit<Quote, 'id' | 'number' | 'date'>) => Quote;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;

  addProject: (project: Omit<ClientProject, 'id'>) => ClientProject;
  updateProjectProgress: (id: string, progress: number) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addTaskToProject: (projectId: string, task: Omit<Task, 'id' | 'projectId'>) => void;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'number'>) => Invoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  addPaymentToInvoice: (invoiceId: string, payment: Omit<Payment, 'id' | 'invoiceId' | 'date'>) => void;

  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => SupportTicket;
  addTicketResponse: (ticketId: string, message: string, sender: 'Client' | 'Georges') => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;

  sendMessage: (clientId: string, sender: 'Admin' | 'Client', content: string) => void;
  
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  addBlogArticle: (article: Omit<BlogArticle, 'id'>) => void;
  addNewsletterSubscriber: (email: string) => { success: boolean, message: string };
  
  // Gallery Management
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Profiles Management
  addProfile: (profile: Omit<ProfileItem, 'id' | 'createdAt' | 'updatedAt'>) => ProfileItem;
  updateProfile: (profile: ProfileItem) => void;
  deleteProfile: (id: string) => void;
  toggleProfileActive: (id: string) => void;

  // Experiences Management
  addExperience: (exp: Omit<ProfessionalExperience, 'id'>) => ProfessionalExperience;
  updateExperience: (exp: ProfessionalExperience) => void;
  deleteExperience: (id: string) => void;

  // CV Settings & Themes Management
  updateCvSettings: (settings: Partial<CvSettings>) => void;
  resetCvSettingsToDefault: () => void;

  // Site Footer Management
  updateSiteFooterSettings: (settings: Partial<SiteFooterSettings>) => void;
  resetSiteFooterSettingsToDefault: () => void;

  // Settings & Profile
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  // Database Backup / Restore
  exportDatabaseAsJson: () => string;
  importDatabaseFromJson: (jsonStr: string) => { success: boolean; error?: string };
  
  resetToDemoData: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(`gm_crm_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gm_crm_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('clients', INITIAL_CLIENTS));
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage('leads', INITIAL_LEADS));
  const [quotes, setQuotes] = useState<Quote[]>(() => loadFromStorage('quotes', INITIAL_QUOTES));
  const [projects, setProjects] = useState<ClientProject[]>(() => loadFromStorage('projects', INITIAL_PROJECTS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', INITIAL_INVOICES));
  const [contracts, setContracts] = useState<Contract[]>(() => loadFromStorage('contracts', INITIAL_CONTRACTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage('appointments', INITIAL_APPOINTMENTS));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadFromStorage('tickets', INITIAL_TICKETS));
  const [messages, setMessages] = useState<DirectMessage[]>(() => loadFromStorage('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>(() => loadFromStorage('blog_articles', INITIAL_BLOG_ARTICLES));
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => loadFromStorage('subscribers', INITIAL_SUBSCRIBERS));
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadFromStorage('gallery_items', INITIAL_GALLERY));
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const loaded = loadFromStorage('admin_profile', INITIAL_ADMIN_PROFILE);
    const isOldDemoAvatar = !loaded.avatarUrl || loaded.avatarUrl.includes('unsplash.com') || loaded.avatarUrl.includes('dicebear');
    const isOldDemoCover = !loaded.coverUrl || loaded.coverUrl.includes('unsplash.com');
    const isOldName = !loaded.name || loaded.name.includes('MOOMBO MODEAWI Georges') || loaded.name.includes('SERVANT');
    const isOldTitle = !loaded.title || loaded.title.toLowerCase().includes('informatique de gestion');
    return {
      ...loaded,
      name: isOldName ? 'Georges MOOMBO MODEAWI' : loaded.name,
      title: isOldTitle ? "Développeur Full Stack & Expert en conception du système d'information" : loaded.title,
      avatarUrl: isOldDemoAvatar ? '/profile_photo.jpg' : loaded.avatarUrl,
      coverUrl: isOldDemoCover ? '/cover_photo.jpg' : loaded.coverUrl,
    };
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => loadFromStorage('system_settings', INITIAL_SYSTEM_SETTINGS));
  const [profiles, setProfiles] = useState<ProfileItem[]>(() => {
    const loaded = loadFromStorage('profiles', INITIAL_PROFILES);
    return loaded.map(p => {
      if (p.id === 'prof-1') {
        const isOldDemoAvatar = !p.avatarUrl || p.avatarUrl.includes('unsplash.com') || p.avatarUrl.includes('dicebear');
        const isOldDemoCover = !p.coverUrl || p.coverUrl.includes('unsplash.com');
        const isOldName = !p.fullName || p.fullName.includes('MOOMBO MODEAWI Georges') || p.fullName.includes('SERVANT');
        const isOldTitle = !p.roleTitle || p.roleTitle.toLowerCase().includes('informatique de gestion');
        return {
          ...p,
          fullName: isOldName ? 'Georges MOOMBO MODEAWI' : p.fullName,
          roleTitle: isOldTitle ? "Directeur Technique & Développeur Full Stack Lead" : p.roleTitle,
          shortBio: p.shortBio ? p.shortBio.replace(/informatique de gestion/gi, "conception du système d'information") : INITIAL_PROFILES[0].shortBio,
          biography: p.biography ? p.biography.replace(/informatique de gestion/gi, "conception du système d'information") : INITIAL_PROFILES[0].biography,
          avatarUrl: isOldDemoAvatar ? '/profile_photo.jpg' : p.avatarUrl,
          coverUrl: isOldDemoCover ? '/cover_photo.jpg' : p.coverUrl,
        };
      }
      return p;
    });
  });

  const [experiences, setExperiences] = useState<ProfessionalExperience[]>(() => loadFromStorage('experiences', INITIAL_EXPERIENCES));
  const [cvSettings, setCvSettings] = useState<CvSettings>(() => {
    const loaded = loadFromStorage('cv_settings', INITIAL_CV_SETTINGS);
    if (loaded?.footer?.professionalName && (loaded.footer.professionalName.includes('MOOMBO MODEAWI Georges') || loaded.footer.professionalName.includes('SERVANT'))) {
      loaded.footer.professionalName = 'Georges MOOMBO MODEAWI';
    }
    return loaded;
  });
  const [siteFooterSettings, setSiteFooterSettings] = useState<SiteFooterSettings>(() => {
    const loaded = loadFromStorage('footer_settings', INITIAL_SITE_FOOTER_SETTINGS);
    if (loaded?.professionalName && (loaded.professionalName.includes('MOOMBO MODEAWI Georges') || loaded.professionalName.includes('SERVANT'))) {
      loaded.professionalName = 'Georges MOOMBO MODEAWI';
    }
    if (loaded?.legalNotice && (loaded.legalNotice.includes('MOOMBO MODEAWI Georges') || loaded.legalNotice.includes('SERVANT'))) {
      loaded.legalNotice = loaded.legalNotice.replace(/SERVANT/g, 'MOOMBO').replace(/MOOMBO MODEAWI Georges/g, 'Georges MOOMBO MODEAWI');
    }
    return loaded;
  });

  // Fetch server data on mount for true cross-tab and cross-session persistence
  useEffect(() => {
    const fetchServerSync = async () => {
      try {
        const [profRes, profileRes, expRes, cvRes, footerRes] = await Promise.all([
          fetch('/api/public/profiles').catch(() => null),
          fetch('/api/public/profile').catch(() => null),
          fetch('/api/public/experiences').catch(() => null),
          fetch('/api/public/cv-settings').catch(() => null),
          fetch('/api/public/footer-settings').catch(() => null),
        ]);

        if (profRes && profRes.ok) {
          const data = await profRes.json();
          if (Array.isArray(data.profiles) && data.profiles.length > 0) {
            setProfiles(prev => {
              const map = new Map<string, ProfileItem>(prev.map(p => [p.id, p]));
              data.profiles.forEach((sp: ProfileItem) => {
                const existing = map.get(sp.id);
                map.set(sp.id, existing ? { ...existing, ...sp } : sp);
              });
              return Array.from(map.values()).sort((a, b) => a.order - b.order);
            });
          }
        }

        if (profileRes && profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.profile) {
            setAdminProfile(prev => ({
              ...prev,
              ...pData.profile,
            }));
          }
        }

        if (expRes && expRes.ok) {
          const expData = await expRes.json();
          if (Array.isArray(expData.experiences) && expData.experiences.length > 0) {
            setExperiences(expData.experiences);
          }
        }

        if (cvRes && cvRes.ok) {
          const cvData = await cvRes.json();
          if (cvData.settings) {
            setCvSettings(prev => ({
              ...prev,
              ...cvData.settings,
              footer: { ...prev.footer, ...(cvData.settings.footer || {}) }
            }));
          }
        }

        if (footerRes && footerRes.ok) {
          const footerData = await footerRes.json();
          if (footerData.settings) {
            setSiteFooterSettings(prev => ({
              ...prev,
              ...footerData.settings,
              socialLinks: { ...prev.socialLinks, ...(footerData.settings.socialLinks || {}) }
            }));
          }
        }
      } catch (err) {
        // Fallback transparent to local storage
      }
    };

    fetchServerSync();
  }, []);
  
  // Active client session in Client Portal
  const [currentClientId, setCurrentClientId] = useState<string>('cli-1');

  // Sync to localStorage
  useEffect(() => { saveToStorage('clients', clients); }, [clients]);
  useEffect(() => { saveToStorage('leads', leads); }, [leads]);
  useEffect(() => { saveToStorage('quotes', quotes); }, [quotes]);
  useEffect(() => { saveToStorage('projects', projects); }, [projects]);
  useEffect(() => { saveToStorage('invoices', invoices); }, [invoices]);
  useEffect(() => { saveToStorage('contracts', contracts); }, [contracts]);
  useEffect(() => { saveToStorage('appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('tickets', tickets); }, [tickets]);
  useEffect(() => { saveToStorage('messages', messages); }, [messages]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('blog_articles', blogArticles); }, [blogArticles]);
  useEffect(() => { saveToStorage('subscribers', subscribers); }, [subscribers]);
  useEffect(() => { saveToStorage('gallery_items', galleryItems); }, [galleryItems]);
  useEffect(() => { saveToStorage('admin_profile', adminProfile); }, [adminProfile]);
  useEffect(() => { saveToStorage('system_settings', systemSettings); }, [systemSettings]);
  useEffect(() => { saveToStorage('profiles', profiles); }, [profiles]);
  useEffect(() => { saveToStorage('experiences', experiences); }, [experiences]);
  useEffect(() => { saveToStorage('cv_settings', cvSettings); }, [cvSettings]);
  useEffect(() => { saveToStorage('footer_settings', siteFooterSettings); }, [siteFooterSettings]);

  const currentClient = clients.find(c => c.id === currentClientId) || clients[0];

  const pushNotification = (title: string, message: string, type: AppNotification['type'], linkSection?: string) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      date: "À l'instant",
      read: false,
      linkSection
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastInteraction'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastInteraction: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    pushNotification(
      "Nouveau Prospect Enregistré", 
      `${newLead.name} (${newLead.company || 'Particulier'}) a exprimé un intérêt pour "${newLead.service}".`, 
      "quote",
      "leads"
    );
    return newLead;
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, lastInteraction: new Date().toISOString().split('T')[0] } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id' | 'joinedDate'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Quotes
  const addQuote = (quoteData: Omit<Quote, 'id' | 'number' | 'date'>): Quote => {
    const quoteCount = quotes.length + 1;
    const number = `DEV-${new Date().getFullYear()}-${String(quoteCount).padStart(3, '0')}`;
    const newQuote: Quote = {
      ...quoteData,
      id: `quo-${Date.now()}`,
      number,
      date: new Date().toISOString().split('T')[0],
    };
    setQuotes(prev => [newQuote, ...prev]);
    pushNotification(
      "Nouveau Devis Émis", 
      `Devis ${number} (${newQuote.totalAmount} ${newQuote.currency}) créé pour ${newQuote.clientName}.`, 
      "quote",
      "quotes"
    );
    return newQuote;
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    const quote = quotes.find(q => q.id === id);
    if (quote && status === 'Accepté') {
      pushNotification(
        "Devis Validé par le Client !", 
        `Le devis ${quote.number} pour ${quote.clientName} a été accepté. Prêt pour conversion en projet !`, 
        "project",
        "quotes"
      );
    }
  };

  // Projects
  const addProject = (projData: Omit<ClientProject, 'id'>): ClientProject => {
    const newProj: ClientProject = {
      ...projData,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [newProj, ...prev]);
    pushNotification("Nouveau Projet Client Créé", `Projet "${newProj.title}" activé pour ${newProj.clientName}.`, "project", "projects");
    return newProj;
  };

  const updateProjectProgress = (id: string, progress: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const updatedTasks = proj.tasks.map(t => t.id === taskId ? { ...t, status } : t);
      // Recalculate progress based on completed tasks
      const completed = updatedTasks.filter(t => t.status === 'Terminé').length;
      const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : proj.progress;
      return { ...proj, tasks: updatedTasks, progress };
    }));
  };

  const addTaskToProject = (projectId: string, taskData: Omit<Task, 'id' | 'projectId'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      projectId
    };
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return { ...proj, tasks: [...proj.tasks, newTask] };
    }));
  };

  // Invoices
  const addInvoice = (invData: Omit<Invoice, 'id' | 'number'>): Invoice => {
    const invCount = invoices.length + 1;
    const number = `FAC-${new Date().getFullYear()}-${String(invCount).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      number,
    };
    setInvoices(prev => [newInv, ...prev]);
    pushNotification("Nouvelle Facture Émise", `Facture ${number} de ${newInv.total} ${newInv.currency} générée pour ${newInv.clientName}.`, "invoice", "invoices");
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const addPaymentToInvoice = (invoiceId: string, paymentData: Omit<Payment, 'id' | 'invoiceId' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceId,
      date: new Date().toISOString().split('T')[0],
      status: 'Confirmé'
    };
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newPayments = [...inv.payments, newPayment];
      const totalPaid = newPayments.reduce((acc, p) => acc + p.amount, 0);
      const isPaid = totalPaid >= inv.total;
      return {
        ...inv,
        payments: newPayments,
        status: isPaid ? 'Payée' : 'Partiellement payée'
      };
    }));
    pushNotification("Paiement Enregistré", `Paiement de ${newPayment.amount} ${newPayment.currency} via ${newPayment.method} validé.`, "invoice", "invoices");
  };

  // Appointments
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'status'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Demandé'
    };
    setAppointments(prev => [newApt, ...prev]);
    pushNotification("Demande de Rendez-vous", `${newApt.name} a réservé le créneau du ${newApt.date} à ${newApt.time}.`, "appointment", "calendar");
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Tickets
  const addTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): SupportTicket => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tck-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      responses: [
        {
          id: `resp-${Date.now()}`,
          sender: 'Client',
          message: ticketData.description,
          timestamp: now
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    pushNotification("Nouveau Ticket Support", `${newTicket.clientName} a ouvert le ticket : "${newTicket.subject}".`, "ticket", "tickets");
    return newTicket;
  };

  const addTicketResponse = (ticketId: string, message: string, sender: 'Client' | 'Georges') => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setTickets(prev => prev.map(tck => {
      if (tck.id !== ticketId) return tck;
      return {
        ...tck,
        updatedAt: now,
        status: sender === 'Georges' ? 'En cours' : tck.status,
        responses: [
          ...tck.responses,
          {
            id: `resp-${Date.now()}`,
            sender,
            message,
            timestamp: now
          }
        ]
      };
    }));
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  // Messages
  const sendMessage = (clientId: string, sender: 'Admin' | 'Client', content: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      clientId,
      sender,
      content,
      timestamp: now,
      read: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Blog
  const addBlogArticle = (articleData: Omit<BlogArticle, 'id'>) => {
    const newArt: BlogArticle = {
      ...articleData,
      id: `art-${Date.now()}`
    };
    setBlogArticles(prev => [newArt, ...prev]);
  };

  // Newsletter
  const addNewsletterSubscriber = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (subscribers.some(s => s.email.toLowerCase() === trimmed)) {
      return { success: false, message: "Cette adresse email est déjà abonnée !" };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'Actif'
    };
    setSubscribers(prev => [newSub, ...prev]);
    return { success: true, message: "Merci ! Vous êtes maintenant inscrit à notre veille technologique." };
  };

  // Gallery Management
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    setGalleryItems(prev => [newItem, ...prev]);
    pushNotification("Nouvel élément galerie", `Réalisation ajoutée : ${newItem.title}`, 'project', '/admin/gallery');
    return newItem;
  };

  const updateGalleryItem = (updated: GalleryItem) => {
    setGalleryItems(prev => prev.map(item => item.id === updated.id ? updated : item));
    pushNotification("Galerie mise à jour", `Réalisation modifiée : ${updated.title}`, 'project', '/admin/gallery');
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  // Profiles Management
  const addProfile = (profileData: Omit<ProfileItem, 'id' | 'createdAt' | 'updatedAt'>): ProfileItem => {
    const newProfile: ProfileItem = {
      ...profileData,
      id: `prof-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProfiles(prev => [...prev, newProfile]);
    pushNotification("Nouveau profil créé", `Le profil "${newProfile.fullName}" a été ajouté.`, 'project', '/admin/profiles');
    return newProfile;
  };

  const updateProfile = (updated: ProfileItem) => {
    const fresh = { ...updated, updatedAt: new Date().toISOString().split('T')[0] };
    setProfiles(prev => prev.map(p => p.id === fresh.id ? fresh : p));
    
    // Si c'est le profil principal de Georges, synchroniser également adminProfile de manière exhaustive
    if (fresh.id === 'prof-1') {
      setAdminProfile(prev => ({
        ...prev,
        name: fresh.fullName || prev.name,
        title: fresh.roleTitle || prev.title,
        bio: fresh.biography || fresh.shortBio || prev.bio,
        avatarUrl: fresh.avatarUrl || prev.avatarUrl,
        coverUrl: fresh.coverUrl || prev.coverUrl,
        githubUrl: fresh.socialLinks?.github || prev.githubUrl,
        linkedinUrl: fresh.socialLinks?.linkedin || prev.linkedinUrl,
        portfolioUrl: fresh.socialLinks?.portfolio || prev.portfolioUrl,
        whatsapp: fresh.contactInfo?.whatsapp || prev.whatsapp,
        phone: fresh.contactInfo?.phone || prev.phone,
        contactEmail: fresh.contactInfo?.email || prev.contactEmail,
      }));
    }

    // Persister également sur le serveur backend si le token d'admin est actif
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch(`/api/admin/profiles/${fresh.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(fresh)
        }).catch(err => console.warn('Erreur synchro serveur profil:', err));
      }
    }

    pushNotification("Profil mis à jour", `Le profil "${fresh.fullName}" a été actualisé et synchronisé avec le site public.`, 'project', '/admin/profiles');
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const toggleProfileActive = (id: string) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // Settings & Profile
  const updateAdminProfile = (patch: Partial<AdminProfile>) => {
    setAdminProfile(prev => {
      const next = { ...prev, ...patch };
      // Synchroniser également avec prof-1
      setProfiles(pList => pList.map(p => {
        if (p.id === 'prof-1') {
          return {
            ...p,
            fullName: patch.name || p.fullName,
            roleTitle: patch.title || p.roleTitle,
            shortBio: patch.bio ? patch.bio.slice(0, 160) + '...' : p.shortBio,
            biography: patch.bio || p.biography,
            avatarUrl: patch.avatarUrl || p.avatarUrl,
            coverUrl: patch.coverUrl || p.coverUrl,
            socialLinks: {
              ...p.socialLinks,
              github: patch.githubUrl || p.socialLinks.github,
              linkedin: patch.linkedinUrl || p.socialLinks.linkedin,
              portfolio: patch.portfolioUrl || p.socialLinks.portfolio,
              whatsapp: patch.whatsapp || p.socialLinks.whatsapp,
              email: patch.contactEmail || p.socialLinks.email,
            },
            contactInfo: {
              ...p.contactInfo,
              email: patch.contactEmail || p.contactInfo.email,
              phone: patch.phone || p.contactInfo.phone,
              whatsapp: patch.whatsapp || p.contactInfo.whatsapp,
              location: patch.city ? `${patch.city}, ${patch.country || 'RDC'}` : p.contactInfo.location,
            }
          };
        }
        return p;
      }));

      // Persister sur le serveur backend si le token d'admin est actif
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gm_admin_token');
        if (token) {
          fetch('/api/admin/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(next)
          }).catch(err => console.warn('Erreur synchro serveur admin profile:', err));
        }
      }

      return next;
    });
    pushNotification("Profil mis à jour", "Les coordonnées et informations professionnelles ont été actualisées et synchronisées avec le site public.", 'project', '/admin/settings');
  };

  const updateSystemSettings = (patch: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...patch }));
    pushNotification("Paramètres système", "Les préférences et devises de la plateforme ont été enregistrées.", 'project', '/admin/settings');
  };

  // Experiences Management
  const addExperience = (newExpData: Omit<ProfessionalExperience, 'id'>): ProfessionalExperience => {
    const newExp: ProfessionalExperience = {
      ...newExpData,
      id: `exp-${Date.now()}`,
      order: typeof newExpData.order === 'number' ? newExpData.order : experiences.length + 1,
      achievements: Array.isArray(newExpData.achievements) ? newExpData.achievements : [],
      skills: Array.isArray(newExpData.skills) ? newExpData.skills : [],
      isCurrent: !!newExpData.isCurrent,
    };

    setExperiences(prev => {
      const next = [...prev, newExp].sort((a, b) => a.order - b.order);
      return next;
    });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch('/api/admin/experiences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newExp)
        }).catch(err => console.warn('Erreur sauvegarde serveur experience:', err));
      }
    }

    pushNotification("Expérience ajoutée", `L'expérience "${newExp.position}" chez ${newExp.company} a été ajoutée.`, 'project', '/admin/experiences');
    return newExp;
  };

  const updateExperience = (updatedExp: ProfessionalExperience) => {
    setExperiences(prev => prev.map(e => e.id === updatedExp.id ? updatedExp : e).sort((a, b) => a.order - b.order));

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch(`/api/admin/experiences/${updatedExp.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedExp)
        }).catch(err => console.warn('Erreur mise à jour serveur experience:', err));
      }
    }

    pushNotification("Expérience mise à jour", `L'expérience "${updatedExp.position}" a été modifiée et répercutée sur le CV et le site public.`, 'project', '/admin/experiences');
  };

  const deleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch(`/api/admin/experiences/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.warn('Erreur suppression serveur experience:', err));
      }
    }

    pushNotification("Expérience supprimée", "L'expérience a été retirée du profil et du CV.", 'project', '/admin/experiences');
  };

  // CV Settings Management
  const updateCvSettings = (patch: Partial<CvSettings>) => {
    setCvSettings(prev => {
      const next: CvSettings = {
        ...prev,
        ...patch,
        footer: {
          ...prev.footer,
          ...(patch.footer || {}),
        }
      };

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gm_admin_token');
        if (token) {
          fetch('/api/admin/cv-settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(next)
          }).catch(err => console.warn('Erreur mise à jour serveur cv-settings:', err));
        }
      }

      return next;
    });

    if (patch.themeId) {
      pushNotification("Thème CV synchronisé", `Le thème du CV a été appliqué pour l'aperçu, l'impression et l'exportation PDF.`, 'project', '/admin/settings');
    }
  };

  const resetCvSettingsToDefault = () => {
    setCvSettings(INITIAL_CV_SETTINGS);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch('/api/admin/cv-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(INITIAL_CV_SETTINGS)
        }).catch(err => console.warn('Erreur reset serveur cv-settings:', err));
      }
    }
    pushNotification("Thème CV réinitialisé", "Les valeurs par défaut du CV et son pied de page ont été restaurées.", 'project', '/admin/settings');
  };

  // Site Footer Management
  const updateSiteFooterSettings = (patch: Partial<SiteFooterSettings>) => {
    setSiteFooterSettings(prev => {
      const next: SiteFooterSettings = {
        ...prev,
        ...patch,
        socialLinks: {
          ...prev.socialLinks,
          ...(patch.socialLinks || {}),
        }
      };

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gm_admin_token');
        if (token) {
          fetch('/api/admin/footer-settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(next)
          }).catch(err => console.warn('Erreur mise à jour serveur footer-settings:', err));
        }
      }

      return next;
    });

    pushNotification("Pied de page mis à jour", "Les paramètres du pied de page du site public ont été enregistrés et appliqués.", 'project', '/admin/settings');
  };

  const resetSiteFooterSettingsToDefault = () => {
    setSiteFooterSettings(INITIAL_SITE_FOOTER_SETTINGS);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gm_admin_token');
      if (token) {
        fetch('/api/admin/footer-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(INITIAL_SITE_FOOTER_SETTINGS)
        }).catch(err => console.warn('Erreur reset serveur footer-settings:', err));
      }
    }
    pushNotification("Pied de page réinitialisé", "Les valeurs par défaut du pied de page public ont été restaurées.", 'project', '/admin/settings');
  };

  // Database Backup / Export / Import
  const exportDatabaseAsJson = (): string => {
    const backupData = {
      metadata: {
        app: "Georges MOOMBO MODEAWI Platform",
        exportedAt: new Date().toISOString(),
        version: "2.7.0"
      },
      clients,
      leads,
      quotes,
      projects,
      invoices,
      contracts,
      appointments,
      tickets,
      messages,
      galleryItems,
      profiles,
      experiences,
      cvSettings,
      siteFooterSettings,
      adminProfile,
      systemSettings,
      blogArticles,
      subscribers
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importDatabaseFromJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, error: "Format JSON invalide." };
      }
      if (Array.isArray(data.clients)) setClients(data.clients);
      if (Array.isArray(data.leads)) setLeads(data.leads);
      if (Array.isArray(data.quotes)) setQuotes(data.quotes);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.invoices)) setInvoices(data.invoices);
      if (Array.isArray(data.contracts)) setContracts(data.contracts);
      if (Array.isArray(data.appointments)) setAppointments(data.appointments);
      if (Array.isArray(data.tickets)) setTickets(data.tickets);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.galleryItems)) setGalleryItems(data.galleryItems);
      if (Array.isArray(data.profiles)) setProfiles(data.profiles);
      if (Array.isArray(data.experiences)) setExperiences(data.experiences);
      if (data.cvSettings && typeof data.cvSettings === 'object') setCvSettings(data.cvSettings);
      if (data.siteFooterSettings && typeof data.siteFooterSettings === 'object') setSiteFooterSettings(data.siteFooterSettings);
      if (data.adminProfile && typeof data.adminProfile === 'object') setAdminProfile(data.adminProfile);
      if (data.systemSettings && typeof data.systemSettings === 'object') setSystemSettings(data.systemSettings);
      if (Array.isArray(data.blogArticles)) setBlogArticles(data.blogArticles);
      if (Array.isArray(data.subscribers)) setSubscribers(data.subscribers);

      pushNotification("Restauration réussie", "La base de données a été restaurée à partir de la sauvegarde JSON.", 'project', '/admin/settings');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Erreur lors de la lecture du fichier JSON." };
    }
  };

  // Reset helper
  const resetToDemoData = () => {
    setClients(INITIAL_CLIENTS);
    setLeads(INITIAL_LEADS);
    setQuotes(INITIAL_QUOTES);
    setProjects(INITIAL_PROJECTS);
    setInvoices(INITIAL_INVOICES);
    setContracts(INITIAL_CONTRACTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTickets(INITIAL_TICKETS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBlogArticles(INITIAL_BLOG_ARTICLES);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setGalleryItems(INITIAL_GALLERY);
    setProfiles(INITIAL_PROFILES);
    setExperiences(INITIAL_EXPERIENCES);
    setCvSettings(INITIAL_CV_SETTINGS);
    setSiteFooterSettings(INITIAL_SITE_FOOTER_SETTINGS);
    setAdminProfile(INITIAL_ADMIN_PROFILE);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
  };

  return (
    <CrmContext.Provider value={{
      clients,
      leads,
      quotes,
      projects,
      invoices,
      contracts,
      appointments,
      tickets,
      messages,
      notifications,
      blogArticles,
      subscribers,
      galleryItems,
      profiles,
      experiences,
      cvSettings,
      siteFooterSettings,
      adminProfile,
      systemSettings,
      currentClientId,
      setCurrentClientId,
      currentClient,
      addLead,
      updateLeadStatus,
      deleteLead,
      addClient,
      updateClient,
      addQuote,
      updateQuoteStatus,
      addProject,
      updateProjectProgress,
      updateTaskStatus,
      addTaskToProject,
      addInvoice,
      updateInvoiceStatus,
      addPaymentToInvoice,
      addAppointment,
      updateAppointmentStatus,
      addTicket,
      addTicketResponse,
      updateTicketStatus,
      sendMessage,
      markAllNotificationsRead,
      unreadNotificationsCount,
      addBlogArticle,
      addNewsletterSubscriber,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      addProfile,
      updateProfile,
      deleteProfile,
      toggleProfileActive,
      addExperience,
      updateExperience,
      deleteExperience,
      updateCvSettings,
      resetCvSettingsToDefault,
      updateSiteFooterSettings,
      resetSiteFooterSettingsToDefault,
      updateAdminProfile,
      updateSystemSettings,
      exportDatabaseAsJson,
      importDatabaseFromJson,
      resetToDemoData
    }}>
      {children}
    </CrmContext.Provider>
  );

};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
