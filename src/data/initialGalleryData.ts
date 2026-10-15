import { GalleryItem } from '../types/crm';

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Interface Système Gestion de Stock & Inventaire',
    category: 'Logiciels de gestion',
    description: 'Tableau de bord ergonomique avec graphiques de réapprovisionnement, alertes de rupture et valorisation PUMP des lots.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    tags: ['MySQL', 'PHP', 'Tailwind CSS', 'FIFO / PUMP'],
    date: 'Janvier 2024',
    clientOrContext: 'Distributeur de gros, Kinshasa Gombe',
    relatedProjectId: 'gestion-stock',
    featured: true,
    metrics: '-45% d\'écarts d\'inventaire constatés'
  },
  {
    id: 'gal-2',
    title: 'Terminal de Caisse Tactile & Point de Vente (POS)',
    category: 'Logiciels de gestion',
    description: 'Interface d\'encaissement ultra-rapide avec impression de tickets thermiques, clôtures journalières X/Z et double monnaie USD/CDF.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    tags: ['JavaScript', 'SQLite', 'Impression ESC/POS', 'Bimonétaire'],
    date: 'Mars 2024',
    clientOrContext: 'Supermarché & Retail, Kinshasa Limete',
    relatedProjectId: 'systeme-caisse',
    featured: true,
    metrics: 'Encaissement fluide sous les 5 secondes par client'
  },
  {
    id: 'gal-3',
    title: 'Plateforme Web d\'Entreprise & Catalogue AgroKin',
    category: 'Applications Web & Mobile',
    description: 'Site vitrine corporate et portail B2B avec système de devis instantané et tableau de bord de commande sécurisé.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'SEO Pro'],
    date: 'Février 2024',
    clientOrContext: 'Société AgroKin SARL',
    relatedProjectId: 'site-entreprise',
    featured: true,
    metrics: '+210% de demandes de devis générées en ligne'
  },
  {
    id: 'gal-4',
    title: 'Logiciel de Facturation Conforme OHADA & Suivi Créances',
    category: 'Logiciels de gestion',
    description: 'Module d\'édition automatisée de factures proforma, définitives et bordereaux de livraison avec relance client par WhatsApp/Email.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    tags: ['PHP', 'MySQL', 'PDFKit', 'Conformité OHADA'],
    date: 'Octobre 2023',
    clientOrContext: 'Cabinet d\'expertise & Négoce, Kinshasa',
    relatedProjectId: 'facturation-ohada',
    featured: false,
    metrics: 'Recouvrement accéléré de 18 jours en moyenne'
  },
  {
    id: 'gal-5',
    title: 'Atelier de Formation Pratique Excel Avancé & Tableaux de Bord',
    category: 'Formations & Ateliers',
    description: 'Animation d\'une session intensive de 3 jours pour 15 cadres comptables : formules matricielles, Power Query et macros d\'automatisation.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    tags: ['Excel Avancé', 'Power Query', 'Tableaux Croisés', 'Comptabilité'],
    date: 'Novembre 2023',
    clientOrContext: 'Équipe administrative et financière PME',
    featured: true,
    metrics: '15 collaborateurs certifiés en compétences avancées'
  },
  {
    id: 'gal-6',
    title: 'Déploiement Baie Serveur & Sécurisation Réseau Local',
    category: 'Infrastructure & Réseaux',
    description: 'Brassage de baie de brassage 24 ports, installation de routeur avec pare-feu matériel, segmentation VLAN et configuration NAS 3-2-1.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['VLAN', 'Câblage Cat6', 'Pare-feu Mikrotik', 'Sauvegarde NAS'],
    date: 'Août 2023',
    clientOrContext: 'Siège social entreprise multisite, Kinshasa',
    featured: false,
    metrics: 'Disponibilité réseau portée à 99.9%'
  },
  {
    id: 'gal-7',
    title: 'Système de Gestion du Personnel & Bulletins de Paie',
    category: 'Logiciels de gestion',
    description: 'Application de pointage biométrique, calcul des retenues fiscales IPR / CNSS RDC et génération des fiches de paie.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    tags: ['IPR RDC', 'CNSS', 'Pointage', 'Bulletins PDF'],
    date: 'Mai 2023',
    clientOrContext: 'PME manufacturière (65 salariés)',
    relatedProjectId: 'gestion-personnel',
    featured: false,
    metrics: 'Paie mensuelle clôturée en 2 heures au lieu de 3 jours'
  },
  {
    id: 'gal-8',
    title: 'Attestation & Référencement Développeur Full Stack',
    category: 'Certifications & Événements',
    description: 'Validation des compétences en architecture logicielle d\'entreprise, modélisation de bases de données relationnelles et sécurité web.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    tags: ['Full Stack', 'Base de données', 'Cybersécurité', 'Kinshasa'],
    date: '2023',
    clientOrContext: 'Parcours académique & professionnel IT',
    featured: false,
    metrics: 'Major de promotion Informatique de Gestion'
  }
];
