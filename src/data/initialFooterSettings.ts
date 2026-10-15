import { CvSettings, SiteFooterSettings } from '../types/crm';

export const INITIAL_CV_SETTINGS: CvSettings = {
  themeId: 'blue-pro',
  pageSize: 'A4',
  onePageMode: true,
  hideEmptySections: true,
  footer: {
    showFooter: true,
    footerText: 'Curriculum Vitae certifié conforme • Références et attestations professionnelles disponibles sur demande.',
    professionalName: 'Georges MOOMBO MODEAWI',
    contactInfoText: 'Tél / WhatsApp : +243 829 725 609  •  Email : georgesweahmoombo@gmail.com',
    confidentialityNotice: 'Document professionnel confidentiel — Émis sous réserve de droits.',
  },
};

export const INITIAL_SITE_FOOTER_SETTINGS: SiteFooterSettings = {
  copyrightText: 'Tous droits réservés. Conception logicielle & Systèmes d\'information sécurisés.',
  yearMode: 'auto',
  manualYear: new Date().getFullYear(),
  professionalName: 'Georges MOOMBO MODEAWI',
  shortSlogan: 'Expert en conception du système d\'information & Développeur Full Stack',
  showContactInfo: true,
  contactEmail: 'georgesweahmoombo@gmail.com',
  contactPhone: '+243 829 725 609',
  contactLocation: 'Kinshasa, République Démocratique du Congo',
  socialLinks: {
    github: 'https://github.com/georgesmoombo',
    linkedin: 'https://linkedin.com/in/georges-moombo',
    whatsapp: 'https://wa.me/243829725609',
    twitter: 'https://x.com/georgesmoombo',
    facebook: 'https://facebook.com/georgesmoombo',
    portfolio: 'https://georges-moombo.cd',
  },
  navLinks: [
    { label: 'Accueil', href: '#accueil' },
    { label: 'À propos', href: '#a-propos' },
    { label: 'Profils & Équipe', href: '#profils' },
    { label: 'Projets', href: '#projets' },
    { label: 'Galerie & Réalisations', href: '#galerie' },
    { label: 'Services', href: '#services' },
    { label: 'Blog technique', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  legalNotice: 'Mentions Légales : Portfolio professionnel édité par Georges MOOMBO MODEAWI, Consultant indépendant en conception de systèmes d\'information et technologies logicielles, basé à Kinshasa (République Démocratique du Congo). Hébergement sécurisé avec certificat SSL/TLS valide.',
  privacyPolicy: 'Politique de Confidentialité : Les informations recueillies via les formulaires de demande de devis et de contact sont strictement destinées au traitement direct de vos requêtes professionnelles. Aucune donnée n\'est transmise à des tiers sans votre consentement préalable.',
  complementaryText: 'Disponible pour missions de conseil, conception de logiciels de gestion et interventions à Kinshasa et à distance.',
  showBadges: true,
};
