import { ProfileItem } from '../types/crm';

export const INITIAL_PROFILES: ProfileItem[] = [
  {
    id: 'prof-1',
    fullName: 'Georges MOOMBO MODEAWI',
    roleTitle: 'Directeur Technique & Développeur Full Stack Lead',
    shortBio: "Conception de systèmes d'information, logiciels de gestion sur mesure (stock, facturation OHADA, caisse POS), applications web & mobiles et sécurisation informatique à Kinshasa.",
    biography: "Consultant IT, Expert en conception du système d'information et Développeur Full Stack à Kinshasa (RDC). J'accompagne les entreprises, commerces et organisations dans l'optimisation de leurs opérations : modélisation de bases de données, logiciels de stock avec inventaires automatisés, facturation normalisée OHADA (USD/CDF), applications web & mobiles réactives, et protection d'infrastructures numériques.",
    avatarUrl: '/profile_photo.jpg',
    coverUrl: '/cover_photo.jpg',
    skills: ["Conception du système d'information", 'Bases de Données MySQL', 'PHP & MVC', 'React & TypeScript', 'Comptabilité OHADA', 'Sécurité Systèmes & Réseaux'],
    socialLinks: {
      github: 'https://github.com/georgesmoombo',
      linkedin: 'https://linkedin.com/in/georges-moombo',
      facebook: 'https://facebook.com/georgesmoombo',
      twitter: 'https://x.com/georgesmoombo',
      portfolio: 'https://georges-moombo.cd',
      whatsapp: 'https://wa.me/243829725609',
      email: 'georgesweahmoombo@gmail.com'
    },
    contactInfo: {
      email: 'georgesweahmoombo@gmail.com',
      phone: '+243 829 725 609',
      whatsapp: '+243829725609',
      location: 'Kinshasa, République Démocratique du Congo',
      showPublicly: true
    },
    isActive: true,
    order: 1,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20'
  },
  {
    id: 'prof-2',
    fullName: 'Clarisse KABASELE MATONDO',
    roleTitle: 'Consultante en Comptabilité Informatisée & Normes OHADA',
    shortBio: 'Experte en paramétrage ERP, audits de conformité financière et formation des équipes de trésorerie.',
    biography: 'Avec plus de 6 ans d\'expérience dans le conseil financier et fiscal en Afrique centrale, Clarisse accompagne les directeurs financiers dans l\'informatisation des processus comptables, la gestion des écritures de clôture et l\'optimisation de la fiscalité d\'entreprise.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    skills: ['Comptabilité OHADA', 'ERP Saari / Sage', 'Audit Fiscal RDC', 'Tableaux de Bord Financiers', 'Contrôle Interne'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/clarisse-kabasele',
      email: 'clarisse.kabasele@consulting.cd'
    },
    contactInfo: {
      email: 'clarisse.kabasele@consulting.cd',
      location: 'Kinshasa - Gombe',
      showPublicly: true
    },
    isActive: true,
    order: 2,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-15'
  },
  {
    id: 'prof-3',
    fullName: 'Patrick TSHIBANGU ILUNGA',
    roleTitle: 'Ingénieur Systèmes, Réseaux & Sécurité Périmétrique',
    shortBio: 'Spécialiste en virtualisation, baies de serveurs, protocoles VPN et politiques de sauvegarde 3-2-1.',
    biography: 'Certifié Cisco et Mikrotik, Patrick prend en charge le déploiement physique des infrastructures réseaux d\'entreprises, le câblage Cat6, la mise en place de tunnels VPN sécurisés et la résilience contre les attaques ransomwares.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
    skills: ['MikroTik & Cisco', 'VLAN & VPN IPsec', 'Sauvegarde NAS 3-2-1', 'Linux Server', 'Pare-feu Matériel'],
    socialLinks: {
      github: 'https://github.com/patrick-tshibangu',
      linkedin: 'https://linkedin.com/in/patrick-tshibangu'
    },
    contactInfo: {
      location: 'Kinshasa - Limete',
      showPublicly: false
    },
    isActive: true,
    order: 3,
    createdAt: '2024-02-18',
    updatedAt: '2024-03-10'
  }
];
