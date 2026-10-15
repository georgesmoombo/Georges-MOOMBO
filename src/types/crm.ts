export type Currency = 'USD' | 'CDF' | 'EUR';

export type LeadStatus = 
  | 'Nouveau' 
  | 'Contacté' 
  | 'Qualifié' 
  | 'Devis envoyé' 
  | 'Négociation' 
  | 'Converti' 
  | 'Perdu';

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  service: string;
  budget: string;
  status: LeadStatus;
  createdAt: string;
  lastInteraction: string;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  avatar?: string;
  status: 'Actif' | 'Inactif';
  notes?: string;
}

export type QuoteStatus = 
  | 'Brouillon' 
  | 'Envoyé' 
  | 'Vu' 
  | 'Accepté' 
  | 'Refusé' 
  | 'Expiré';

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  clientId?: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  items: QuoteItem[];
  totalAmount: number;
  currency: Currency;
  status: QuoteStatus;
  date: string;
  validUntil: string;
  estimatedDuration: string;
  notes?: string;
}

export type ProjectStatus = 
  | 'Planification' 
  | 'En cours' 
  | 'En attente' 
  | 'En révision' 
  | 'Terminé' 
  | 'Annulé';

export type TaskStatus = 'À faire' | 'En cours' | 'En révision' | 'Terminé';
export type PriorityLevel = 'Basse' | 'Normale' | 'Haute' | 'Urgente';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
}

export interface ClientProject {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  budget: number;
  currency: Currency;
  startDate: string;
  deliveryDate: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number;
  tasks: Task[];
  repositoryUrl?: string;
  liveUrl?: string;
}

export type InvoiceStatus = 
  | 'Brouillon' 
  | 'Envoyée' 
  | 'Payée' 
  | 'Partiellement payée' 
  | 'En retard' 
  | 'Annulée';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: Currency;
  date: string;
  method: 'Espèces' | 'Virement' | 'Mobile Money' | 'Carte' | 'Autre';
  reference: string;
  status: 'Confirmé' | 'En attente';
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectTitle?: string;
  items: QuoteItem[];
  subTotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: Currency;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  payments: Payment[];
  notes?: string;
}

export type ContractStatus = 
  | 'Brouillon' 
  | 'Envoyé' 
  | 'En attente' 
  | 'Signé' 
  | 'Actif' 
  | 'Terminé' 
  | 'Annulé';

export interface Contract {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  quoteId?: string;
  title: string;
  date: string;
  duration: string;
  amount: number;
  currency: Currency;
  terms: string;
  status: ContractStatus;
  signedAt?: string;
}

export type AppointmentStatus = 
  | 'Demandé' 
  | 'Confirmé' 
  | 'Reporté' 
  | 'Annulé' 
  | 'Terminé';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  notes?: string;
  status: AppointmentStatus;
  meetingLink?: string;
}

export type TicketPriority = 'Faible' | 'Normale' | 'Haute' | 'Urgente';
export type TicketStatus = 'Ouvert' | 'En cours' | 'En attente' | 'Résolu' | 'Fermé';

export interface TicketResponse {
  id: string;
  sender: 'Client' | 'Georges';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface DirectMessage {
  id: string;
  clientId: string;
  sender: 'Admin' | 'Client';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'quote' | 'appointment' | 'message' | 'ticket' | 'invoice' | 'project';
  date: string;
  read: boolean;
  linkSection?: string;
}

export type BlogCategory = 
  | 'Développement web' 
  | 'Informatique de Gestion' 
  | 'Cybersécurité' 
  | 'IA' 
  | 'Bases de données' 
  | 'Réseaux' 
  | 'Conseils numériques';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'Brouillon' | 'Publié' | 'Archivé';
  image: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'Actif' | 'Désinscrit';
}

export type GalleryCategory =
  | 'Logiciels de gestion'
  | 'Applications Web & Mobile'
  | 'Formations & Ateliers'
  | 'Infrastructure & Réseaux'
  | 'Certifications & Événements';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  imageUrl: string;
  tags: string[];
  date: string;
  clientOrContext?: string;
  relatedProjectId?: string;
  featured?: boolean;
  metrics?: string;
}

export interface AdminProfile {
  name: string;
  title: string;
  bio: string;
  contactEmail: string;
  notificationEmail: string;
  whatsapp: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl?: string;
  portfolioUrl: string;
  avatarUrl: string;
  coverUrl?: string;
}

export interface SystemSettings {
  defaultCurrency: Currency;
  timezone: string;
  language: string;
  usdToCdfRate: number;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  soundNotifications: boolean;
  twoFactorEnabled: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  portfolio?: string;
  whatsapp?: string;
  email?: string;
}

export interface PublicContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  showPublicly: boolean;
}

export interface ProfileItem {
  id: string;
  fullName: string;
  roleTitle: string;
  shortBio: string;
  biography: string;
  avatarUrl: string;
  coverUrl: string;
  skills: string[];
  socialLinks: SocialLinks;
  contactInfo: PublicContactInfo;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// PROFESSIONAL EXPERIENCES & DURATION
// ==========================================
export interface ProfessionalExperience {
  id: string;
  position: string;         // Poste occupé
  company: string;          // Nom de l'entreprise ou organisation
  startDate: string;        // Date de début (YYYY-MM ou YYYY-MM-DD ou YYYY)
  endDate?: string;         // Date de fin
  isCurrent: boolean;       // Option "Poste actuel"
  description: string;      // Description des responsabilités
  achievements: string[];   // Réalisations principales
  skills: string[];         // Compétences associées
  location?: string;        // Localisation (ex: Kinshasa, RDC)
  order: number;
}

// Calculate duration string accurately
export function formatExperienceDuration(startDateStr: string, endDateStr?: string, isCurrent: boolean = false): string {
  if (!startDateStr) return '';
  
  const start = new Date(startDateStr);
  const end = isCurrent || !endDateStr ? new Date() : new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return isCurrent ? 'En cours' : '';
  }

  // Calculate year and month difference
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth() + 1; // inclusive current month

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0 && months <= 0) {
    months = 1;
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years > 1 ? 'ans' : 'an'}`);
  }
  if (months > 0 && years < 5) {
    parts.push(`${months} mois`);
  }

  return parts.length > 0 ? parts.join(' ') : '1 mois';
}

// Calculate non-overlapping total career years
export function calculateNonOverlappingYears(experiences: ProfessionalExperience[]): number {
  if (!experiences || experiences.length === 0) return 5;

  const intervals: { start: number; end: number }[] = [];

  experiences.forEach(exp => {
    if (!exp.startDate) return;
    const start = new Date(exp.startDate).getTime();
    const end = exp.isCurrent || !exp.endDate ? new Date().getTime() : new Date(exp.endDate).getTime();
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      intervals.push({ start, end });
    }
  });

  if (intervals.length === 0) return 5;

  intervals.sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.start <= current.end) {
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  let totalMs = 0;
  merged.forEach(interval => {
    totalMs += (interval.end - interval.start);
  });

  const totalYears = Math.round((totalMs / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
  return Math.max(1, Math.round(totalYears));
}

// ==========================================
// CV THEMES & CV SETTINGS
// ==========================================
export type CvThemeId = 
  | 'blue-pro'         // Bleu professionnel
  | 'midnight-cyan'    // Bleu nuit et cyan
  | 'modern-purple'    // Violet moderne
  | 'monochrome'       // Noir et blanc classique
  | 'elegant-gray'     // Gris élégant
  | 'emerald-pro';     // Vert professionnel

export interface CvThemeConfig {
  id: CvThemeId;
  name: string;
  description: string;
  primary: [number, number, number];
  primaryHex: string;
  accent: [number, number, number];
  accentHex: string;
  secondary: [number, number, number];
  secondaryHex: string;
  textDark: [number, number, number];
  textMuted: [number, number, number];
  bgCard: [number, number, number];
  bgCardHex: string;
  border: [number, number, number];
  borderHex: string;
}

export interface CvFooterSettings {
  showFooter: boolean;
  footerText: string;
  professionalName: string;
  contactInfoText: string;
  confidentialityNotice: string;
}

export interface CvSettings {
  themeId: CvThemeId;
  pageSize: 'A4';
  onePageMode: boolean;
  footer: CvFooterSettings;
  customSummary?: string;
  hideEmptySections: boolean;
}

// ==========================================
// SITE FOOTER SETTINGS
// ==========================================
export interface FooterNavLink {
  label: string;
  href: string;
}

export interface SiteFooterSettings {
  copyrightText: string;
  yearMode: 'auto' | 'manual';
  manualYear: number;
  professionalName: string;
  shortSlogan: string;
  showContactInfo: boolean;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  socialLinks: SocialLinks;
  navLinks: FooterNavLink[];
  legalNotice: string;
  privacyPolicy: string;
  complementaryText: string;
  showBadges: boolean;
}


