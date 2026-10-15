export interface Project {
  id: string;
  title: string;
  category: 'Tous' | 'Web' | 'Mobile' | 'Gestion' | 'Finance' | 'RH' | 'Systèmes' | 'Base de données' | 'Cybersécurité' | 'IA';
  description: string;
  fullDescription: string;
  problem: string;
  solution: string;
  features: string[];
  tags: string[];
  metrics: string;
  architecture: string;
  client: string;
  year: string;
  status: 'Déployé' | 'En production' | 'Maintenance' | 'Prototype';
  demoUrl?: string;
  githubUrl?: string;
  gallery?: string[];
}

export interface ServiceDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  advantages: string[];
  features: string[];
  estimatedDelay: string;
  startingPrice: number;
  currency: 'USD' | 'CDF';
  iconName: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  description: string;
  skills: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const PORTFOLIO_INFO = {
  name: "Georges MOOMBO MODEAWI",
  title: "Développeur Full Stack & Expert en conception du système d'information",
  subtitle: "Expert en Solutions Numériques d'Entreprise, SaaS & Cybersécurité",
  birthDate: "16/01/2002",
  birthPlace: "Libenge, RDC",
  location: "RDC, Kinshasa",
  phone: "+243829725609",
  phoneDisplay: "+243 829 725 609",
  email: "georgesweahmoombo@gmail.com",
  whatsappUrl: "https://wa.me/243829725609?text=Bonjour%20Georges%20MOOMBO,%20je%20souhaite%20échanger%20avec%20vous%20concernant%20un%20projet%20numérique.",
  availability: "Disponible pour nouveaux projets & recrutements",
  experienceYears: "5 ans",
};

export const STATS = [
  { number: "15+", label: "Projets Déployés", detail: "Logiciels de gestion, ERP & applications web" },
  { number: "250+", label: "Assistances Techniques", detail: "Dépannages d'urgence & maintenance" },
  { number: "10+", label: "Entreprises Clientes", detail: "PME, commerces & organisations à Kinshasa" },
  { number: "99.8%", label: "Disponibilité Systèmes", detail: "Normes de sécurité & conformité OHADA" },
];

export const PROJECTS: Project[] = [
  {
    id: "gestion-stock",
    title: "Système de Gestion de Stock & Inventaires",
    category: "Gestion",
    description: "Application intelligente d'inventaire en temps réel avec alertes de rupture, traçabilité des lots et valorisation FIFO/PUMP.",
    fullDescription: "Solution robuste conçue pour les grossistes et dépôts de vente. Elle élimine les pertes invisibles, automatise le réapprovisionnement et fournit des états journaliers exploitables pour la direction financière.",
    problem: "Écarts récurrents entre le stock physique et théorique, ruptures de stocks imprévues et temps excessif passé lors des inventaires mensuels.",
    solution: "Automatisation intégrale des mouvements de stocks avec validation hiérarchisée, alertes par email/SMS lors de l'atteinte du seuil critique et calcul dynamique du PUMP.",
    features: [
      "Suivi des entrées, sorties, rebuts et transferts entre dépôts",
      "Alertes automatiques avant rupture de stock critique",
      "Calcul automatique de la marge bénéficiaire et du coût moyen pondéré",
      "Lecteur de codes-barres et génération d'étiquettes",
      "Exportation des rapports d'inventaire vers Excel et PDF"
    ],
    tags: ["PHP", "MySQL", "JavaScript", "Tailwind CSS", "Architecture MVC"],
    metrics: "-45% d'écarts d'inventaire dès le premier trimestre",
    architecture: "Architecture MVC modulaire avec base de données MySQL normalisée 3NF et journalisation inviolable des écritures de stock.",
    client: "Dépôt commercial & distributeur de gros, Kinshasa",
    year: "2024",
    status: "En production",
    demoUrl: "https://stock-demo.moombo.cd",
    githubUrl: "https://github.com/georgesmoombo/gestion-stock-pro"
  },
  {
    id: "facturation-ohada",
    title: "Système de Facturation & Recouvrement OHADA",
    category: "Finance",
    description: "Module de facturation commerciale rigoureux conforme aux normes comptables OHADA avec gestion bidevise USD/CDF.",
    fullDescription: "Plateforme financière automatisant le cycle commercial complet : proforma, bons de commande, factures définitives et reçus d'encaissement. Inclut un tableau de bord analytique des créances clients.",
    problem: "Erreurs manuelles dans l'application des taux de change USD/CDF, retards de paiement non suivis et factures papier égarées.",
    solution: "Moteur de calcul financier automatisé appliquant le taux du jour officiel, avec numérotation inaltérable et relances automatisées des impayés.",
    features: [
      "Génération instantanée de factures avec numérotation chronologique normalisée",
      "Gestion multi-devises (USD et Franc Congolais CDF) avec taux configurable",
      "Suivi visuel des échéances et relances automatiques des clients",
      "Journal des ventes directement exportable vers le logiciel comptable"
    ],
    tags: ["JavaScript", "PHP", "Reporting PDF", "Comptabilité OHADA"],
    metrics: "70% de temps gagné sur la préparation des clôtures comptables",
    architecture: "Moteur transactionnel ACID garantissant l'intégrité comptable et empêchant la modification de pièces validées.",
    client: "Cabinet de conseil B2B & PME de services",
    year: "2024",
    status: "En production",
    demoUrl: "https://facturation-demo.moombo.cd",
    githubUrl: "https://github.com/georgesmoombo/facturation-ohada-core"
  },
  {
    id: "gestion-personnel",
    title: "Portail RH, Présences & Gestion de Paie",
    category: "RH",
    description: "Système de gestion des ressources humaines centralisant dossiers agents, congés payés, plannings et calcul de paie.",
    fullDescription: "Système intuitif de gestion des ressources humaines adapté aux PME. Il centralise les dossiers des collaborateurs, surveille les contrats, calcule l'ancienneté et génère les pré-bulletins de salaire.",
    problem: "Dossiers employés dispersés sur papier, litiges fréquents sur les jours de congés et calcul fastidieux des heures supplémentaires.",
    solution: "Portail centralisé avec fiches numériques d'employés, workflow d'approbation des congés et calcul automatisé des retenues fiscales et sociales.",
    features: [
      "Fiches employés exhaustives (état civil, diplômes, contrats, historiques)",
      "Gestion des plannings, congés payés et autorisations d'absence",
      "Suivi des présences et alertes d'expiration de contrats à durée déterminée",
      "Module de calcul automatisé des pré-bulletins de paie et indemnités"
    ],
    tags: ["PHP", "MySQL", "Gestion RH", "Contrôle d'accès RBAC"],
    metrics: "100% de conformité administrative lors des audits sociaux",
    architecture: "Séparation stricte des privilèges d'accès (RBAC) pour protéger les données salariales et médicales confidentielles.",
    client: "PME industrielle & logistique",
    year: "2023",
    status: "Déployé",
    demoUrl: "https://rh-demo.moombo.cd"
  },
  {
    id: "systeme-caisse",
    title: "Point de Vente (POS) & Caisse Enregistreuse",
    category: "Gestion",
    description: "Terminal de vente tactile ultra-rapide pour commerces avec impression tickets, gestion des tiroirs-caisses et clôture journalière Z.",
    fullDescription: "Terminal de vente optimisé pour la rapidité au comptoir. Il accepte les paiements mixtes (Cash, Mobile Money M-Pesa/Airtel Money), synchronise le stock à chaque encaissement et édite le rapport de fin de journée.",
    problem: "Files d'attente aux heures de pointe, erreurs d'encaissement et difficultés à identifier les écarts de caisse en fin de journée.",
    solution: "Interface épurée à haute réactivité utilisable sans souris, mode hors-ligne résilient et clôture journalière assistée par calcul mathématique.",
    features: [
      "Interface tactile utilisable sur écrans tactiles et tablettes",
      "Gestion des règlements combinés (Cash, Mobile Money, Cartes)",
      "Clôture de caisse quotidienne (Rapports X et Z) avec justification des écarts",
      "Historique des transactions et réimpression immédiate des reçus thermiques"
    ],
    tags: ["JavaScript ES6", "MySQL", "POS", "Réseau Local LAN"],
    metrics: "Temps d'encaissement moyen réduit à moins de 15 secondes par client",
    architecture: "Architecture hybride client léger communicant en WebSockets locaux pour une synchronisation instantanée des postes de vente.",
    client: "Chaîne de superettes & commerces de détail",
    year: "2023",
    status: "En production"
  },
  {
    id: "site-web-entreprise",
    title: "Portail Web d'Entreprise & Vitrine B2B",
    category: "Web",
    description: "Site internet professionnel haute performance, responsive et optimisé pour le référencement naturel (SEO) et la conversion.",
    fullDescription: "Présence web premium conçue pour convertir les visiteurs en clients. Temps de chargement inférieur à une seconde, design soigné conforme aux standards UX internationaux et formulaire de contact sécurisé.",
    problem: "Absence de présence numérique crédible face aux concurrents et perte de prospects cherchant des prestataires sur Google.",
    solution: "Architecture Next-gen React avec balisage Schema.org, temps de chargement ultra-rapide et intégration WhatsApp directe.",
    features: [
      "Conception responsive mobile-first testée sur plus de 15 résolutions",
      "Optimisation SEO avancée (balisage Schema.org, OpenGraph, JSON-LD)",
      "Formulaire interactif avec protection anti-spam et notification par email",
      "Catalogue de services avec simulation de devis interactif"
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "SEO Avancé", "Performance"],
    metrics: "+120% d'augmentation de demandes de contact qualifiées",
    architecture: "Composants réactifs optimisés pour des scores Core Web Vitals supérieurs à 95/100.",
    client: "Société de conseil & investissement, Kinshasa",
    year: "2024",
    status: "En production",
    demoUrl: "https://entreprise-demo.moombo.cd"
  },
  {
    id: "bdd-etudiants",
    title: "Base de Données Scolaire & Académique",
    category: "Base de données",
    description: "Plateforme de gestion académique pour le suivi des inscriptions, relevés de notes, grilles de délibération et promotions.",
    fullDescription: "Système de gestion académique permettant à une institution de centraliser les dossiers de milliers d'étudiants, d'enregistrer les cotes d'examen et d'éditer automatiquement les relevés officiels et diplômes.",
    problem: "Saisie manuelle des notes sur tableurs entraînant des erreurs de calcul et des fraudes lors de la délivrance des bulletins.",
    solution: "Base relationnelle sous MySQL normalisée avec calcul automatique des pondérations, verrouillage des notes après signature du jury et délibérations automatisées.",
    features: [
      "Inscription et immatriculation des apprenants par filière et promotion",
      "Saisie sécurisée des notes par matière et calcul automatique des moyennes",
      "Génération des grilles de délibération officielles et procès-verbaux",
      "Impression sécurisée des attestations de réussite et relevés de notes"
    ],
    tags: ["MySQL Avancé", "Modélisation UML & SI", "PHP", "Intégrité des Données"],
    metrics: "Zéro anomalie de calcul sur plus de 1 200 étudiants traités",
    architecture: "Modélisation UML complète (diagrammes de classes, Use Cases et séquences) couplée à une implémentation relationnelle rigoureuse avec déclencheurs SQL.",
    client: "Établissement d'enseignement supérieur, RDC",
    year: "2023",
    status: "Déployé"
  },
  {
    id: "cyber-audit-pme",
    title: "Audit de Sécurité & Durcissement Réseau PME",
    category: "Cybersécurité",
    description: "Programme complet de sécurisation d'infrastructure : filtrage pare-feu, politique de mots de passe, sauvegardes chiffrées et formation anti-phishing.",
    fullDescription: "Intervention globale pour protéger les données comptables et sensibles d'une entreprise contre les attaques de rançongiciels (ransomwares) et les pertes matérielles.",
    problem: "Réseau d'entreprise ouvert sans segmentation, postes utilisateurs vulnérables et absence totale de plan de sauvegarde automatisé.",
    solution: "Mise en place d'un plan de reprise d'activité (PRA), isolation des serveurs de gestion, configuration de pare-feu et chiffrement des sauvegardes distantes.",
    features: [
      "Audit de vulnérabilités et cartographie des risques réseau",
      "Segmentation VLAN pour isoler la comptabilité des postes publics",
      "Mise en place de sauvegardes 3-2-1 automatisées et chiffrées",
      "Atelier de sensibilisation des employés à la détection des e-mails frauduleux"
    ],
    tags: ["Cybersécurité", "VLAN", "Firewall", "Sauvegarde 3-2-1", "Audit IT"],
    metrics: "100% de résilience face aux tests d'intrusion simulés",
    architecture: "Politique de défense en profondeur (Defense in Depth) alignée sur les recommandations de l'ANSSI.",
    client: "Entreprise commerciale de 35 collaborateurs, Kinshasa",
    year: "2024",
    status: "En production"
  },
  {
    id: "assistant-ia-gestion",
    title: "Assistant IA d'Aide à la Décision & Reporting",
    category: "IA",
    description: "Intégration d'un modèle d'intelligence artificielle pour analyser les tendances de ventes et générer des synthèses managériales automatiques.",
    fullDescription: "Outil intelligent branché sur les données de vente et de trésorerie permettant aux gérants de poser des questions en langage naturel et d'obtenir des prévisions fiables.",
    problem: "Les dirigeants n'avaient pas le temps de décortiquer des tableaux Excel de 10 000 lignes pour identifier les produits rentables.",
    solution: "Agent conversationnel basé sur Gemini capable de synthétiser les données d'exploitation et d'alerter sur les anomalies de marge.",
    features: [
      "Interrogation des ventes en français naturel sans compétences SQL",
      "Génération automatique d'un rapport hebdomadaire pour la direction",
      "Détection des anomalies de caisse et prévision des besoins en stock",
      "Respect strict de la confidentialité (données anonymisées avant analyse)"
    ],
    tags: ["Intelligence Artificielle", "Gemini API", "Python", "Business Intelligence"],
    metrics: "Prise de décision accélérée de 3 jours à 5 minutes pour la direction",
    architecture: "Architecture RAG (Retrieval-Augmented Generation) avec traitement sécurisé en proxy backend.",
    client: "Réseau de distribution multi-sites",
    year: "2024",
    status: "Prototype"
  }
];

export const SERVICES: ServiceDetail[] = [
  {
    id: "creation-site-web",
    title: "Création de Sites Web & Portails",
    category: "Web & SaaS",
    description: "Conception de vitrines professionnelles et plateformes web modernes pour accroître votre visibilité et capter de nouveaux clients qualifiés.",
    advantages: [
      "Visibilité 24/7 pour votre entreprise",
      "Design haut de gamme adapté aux smartphones",
      "Référencement naturel sur Google (SEO)",
      "Intégration WhatsApp directe pour convertir les visiteurs"
    ],
    features: [
      "Charte graphique moderne et professionnelle",
      "Formulaire de devis et contact interactif",
      "Balisage SEO Schema.org & OpenGraph",
      "Sécurité HTTPS et rapidité de chargement garantie",
      "Hébergement et configuration de votre nom de domaine"
    ],
    estimatedDelay: "7 à 14 jours",
    startingPrice: 350,
    currency: "USD",
    iconName: "Globe"
  },
  {
    id: "systemes-gestion-sur-mesure",
    title: "Logiciels de Gestion sur Mesure (ERP / PGI)",
    category: "Gestion d'Entreprise",
    description: "Développement d'outils métiers adaptés à vos processus internes : stock, facturation, suivi de caisse et ressources humaines.",
    advantages: [
      "Élimination totale des erreurs de calcul manuel",
      "Maîtrise en temps réel de votre chiffre d'affaires et de vos stocks",
      "Accès sécurisé par profil utilisateur (caissier, gérant, comptable)",
      "Fonctionnement fluide en réseau local ou cloud"
    ],
    features: [
      "Gestion d'inventaire en temps réel et alertes de rupture",
      "Édition de factures aux normes OHADA en USD et Francs Congolais",
      "Rapports financiers et statistiques décisionnelles automatisées",
      "Sauvegarde quotidienne de la base de données",
      "Formation complète de vos opérateurs incluse"
    ],
    estimatedDelay: "15 à 30 jours",
    startingPrice: 650,
    currency: "USD",
    iconName: "LayoutDashboard"
  },
  {
    id: "bases-de-donnees-architecture",
    title: "Conception & Optimisation de Bases de Données",
    category: "Data & Architecture",
    description: "Modélisation relationnelle rigoureuse, administration MySQL/PostgreSQL, sécurisation et restauration d'urgence de données d'entreprises.",
    advantages: [
      "Structure de données robuste et évolutive",
      "Zéro risque de corruption ou de doublons",
      "Requêtes optimisées ultra-rapides",
      "Plan de reprise d'activité (PRA) garanti en cas de sinistre"
    ],
    features: [
      "Modélisation UML (diagrammes de classes, Use Cases) & relationnelle (3NF)",
      "Mise en place de procédures stockées et triggers d'intégrité",
      "Automatisation des sauvegardes locales et distantes chiffrées",
      "Nettoyage et migration de données depuis d'anciens tableurs"
    ],
    estimatedDelay: "5 à 10 jours",
    startingPrice: 280,
    currency: "USD",
    iconName: "Database"
  },
  {
    id: "cybersecurite-audit",
    title: "Audit de Cybersécurité & Protection des Données",
    category: "Cybersécurité",
    description: "Diagnostic de vulnérabilités, sécurisation de votre réseau d'entreprise, protection contre les rançongiciels et gestion des accès.",
    advantages: [
      "Protection de vos secrets d'affaires et données financières",
      "Conformité avec les exigences de confidentialité",
      "Prévention des fraudes internes et attaques extérieures",
      "Tranquillité d'esprit pour la direction"
    ],
    features: [
      "Audit des failles de sécurité physiques et logicielles",
      "Configuration de pare-feux, antivirus centralisés et segmentation réseau",
      "Définition d'une politique de mots de passe et gestion des rôles (RBAC)",
      "Sensibilisation des collaborateurs contre le phishing"
    ],
    estimatedDelay: "3 à 7 jours",
    startingPrice: 300,
    currency: "USD",
    iconName: "ShieldCheck"
  },
  {
    id: "maintenance-reseaux",
    title: "Maintenance Informatique & Réseaux Locaux (LAN)",
    category: "Infrastructure IT",
    description: "Assistance technique préventive et curative, câblage réseau, paramétrage de routeurs/switchs et dépannage matériel à Kinshasa.",
    advantages: [
      "Intervention d'urgence sur site en moins de 2 heures",
      "Réduction drastique des pannes bloquant votre personnel",
      "Réseau Wi-Fi et filaire stable et performant",
      "Contrat de maintenance mensuel disponible"
    ],
    features: [
      "Diagnostic matériel et remplacement de composants défaillants",
      "Installation et partage d'imprimantes réseau et disques NAS",
      "Configuration de routeurs, modems et points d'accès Wi-Fi sécurisés",
      "Nettoyage logiciel et optimisation de la vitesse des postes"
    ],
    estimatedDelay: "Intervention sous 24h",
    startingPrice: 150,
    currency: "USD",
    iconName: "HardDrive"
  },
  {
    id: "formation-bureautique-excel",
    title: "Formations Professionnelles & Excel Avancé",
    category: "Formation & Coaching",
    description: "Ateliers pratiques 100% orientés gestion : Tableaux Croisés Dynamiques, formules complexes, automatisation et bonnes pratiques numériques.",
    advantages: [
      "Gain de productivité immédiat pour vos collaborateurs",
      "Autonomie de votre équipe dans la création de rapports",
      "Exercices basés sur les vrais documents de votre entreprise",
      "Support et fiches mémo fournies"
    ],
    features: [
      "Maîtrise des fonctions financières, logiques et de recherche (XLOOKUP/INDEX)",
      "Tableaux croisés dynamiques et tableaux de bord visuels",
      "Initiation à Power Query pour l'automatisation des retraitements",
      "Sensibilisation aux bonnes pratiques de sauvegarde et de sécurité"
    ],
    estimatedDelay: "Sessions de 2 à 5 jours",
    startingPrice: 200,
    currency: "USD",
    iconName: "GraduationCap"
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-info-gestion",
    title: "Conception du Système d'Information & Bases de Données",
    issuer: "Enseignement Supérieur Technique",
    date: "Kinshasa, RDC",
    badge: "Diplôme Spécialisé",
    description: "Formation approfondie en analyse des processus métiers, conception de bases de données relationnelles, comptabilité générale et programmation d'entreprise.",
    skills: ["Modélisation UML & SI", "Comptabilité OHADA", "Algorithmique", "SQL", "Gestion de Projet"]
  },
  {
    id: "cert-fullstack-web",
    title: "Développement Web Full Stack & Architectures Modernes",
    issuer: "Spécialisation Continue & Projets Pratiques",
    date: "2023 - 2024",
    badge: "Expertise Validée",
    description: "Maîtrise des standards du web moderne : JavaScript ES6+, TypeScript, React, PHP, Tailwind CSS, API REST et protocoles sécurisés.",
    skills: ["React", "TypeScript", "PHP MVC", "REST APIs", "Tailwind CSS", "Git / GitHub"]
  },
  {
    id: "cert-cyber-data",
    title: "Sécurité des Systèmes d'Information & Protection Données",
    issuer: "Veille & Pratique Terrain en Entreprise",
    date: "2024",
    badge: "Sécurité Opérationnelle",
    description: "Application des principes de sécurité défensive, hygiène numérique en entreprise, gestion des privilèges minimaux (PoLP) et plans de reprise d'activité.",
    skills: ["Contrôle d'accès RBAC", "Sauvegarde 3-2-1", "Audit de vulnérabilités", "Réseaux LAN sécurisés"]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-delai",
    question: "Combien de temps faut-il pour concevoir un logiciel de gestion ou un site web ?",
    answer: "Pour un site web vitrine professionnel, comptez généralement entre 7 et 14 jours. Pour un logiciel de gestion sur mesure (stock, facturation, caisse), le délai moyen est de 15 à 30 jours, comprenant les phases de cadrage, développement, tests et formation de votre équipe.",
    category: "Projets"
  },
  {
    id: "faq-devis",
    question: "Comment se déroule la demande de devis et la facturation ?",
    answer: "Vous pouvez effectuer une demande de devis gratuite directement sur ce site via le module interactif. Une fois votre besoin analysé, je vous soumets une proposition détaillée avec échéancier. Les règlements s'effectuent généralement par acomptes (démarrage, recette intermédiaire, livraison finale) par virement bancaire ou Mobile Money.",
    category: "Tarifs"
  },
  {
    id: "faq-devises",
    question: "Acceptez-vous les paiements en Francs Congolais (CDF) et en Dollars (USD) ?",
    answer: "Oui, tous mes systèmes de devis et de facturation prennent en charge nativement le Dollar américain (USD) et le Franc Congolais (CDF), avec application transparente du taux de change officiel du jour.",
    category: "Paiements"
  },
  {
    id: "faq-distance",
    question: "Travaillez-vous uniquement à Kinshasa ou également à distance ?",
    answer: "Je suis basé à Kinshasa pour les interventions matérielles, réunions en entreprise et formations présentielles. Pour le développement web, les logiciels en ligne et le conseil numérique, j'interviens à distance pour toute la RDC et l'international via visioconférence et outils collaboratifs.",
    category: "Localisation"
  },
  {
    id: "faq-support",
    question: "Que se passe-t-il après la livraison du projet ? Y a-t-il une garantie ?",
    answer: "Chaque réalisation bénéficie d'une garantie technique de bon fonctionnement avec support réactif inclus. Un espace client dédié vous permet de suivre vos projets, consulter vos factures et ouvrir des tickets de support en direct avec moi.",
    category: "Support"
  }
];

export const SKILLS_CATEGORIES = [
  {
    category: "Gestion & Comptabilité",
    skills: [
      { name: "Conception du système d'information", level: 95, desc: "Modélisation UML (cas d'utilisation, classes, séquences), architecture SI, optimisation des flux d'entreprise" },
      { name: "Comptabilité Informatisée (OHADA)", level: 90, desc: "Maîtrise des écritures comptables, états financiers, bilan, compte de résultat" },
      { name: "Bureautique Avancée (Excel / VBA)", level: 95, desc: "Tableaux croisés dynamiques, formules complexes, macros d'automatisation, Power Query" },
    ]
  },
  {
    category: "Bases de Données & Data",
    skills: [
      { name: "MySQL & Modélisation", level: 92, desc: "Modélisation relationnelle & UML (diagrammes de classes, 3NF), optimisation de requêtes, triggers" },
      { name: "Administration & Sauvegardes", level: 88, desc: "Sécurisation des bases, plans de reprise d'activité (PRA), réplication et intégrité" },
      { name: "Reporting & Export de Données", level: 90, desc: "Extraction SQL, génération de documents PDF/Excel pour la direction" },
    ]
  },
  {
    category: "Développement Web & Logiciel",
    skills: [
      { name: "HTML5, CSS3 & Tailwind CSS", level: 95, desc: "Création d'interfaces élégantes, ergonomiques, responsives et accessibles" },
      { name: "JavaScript (ES6+) & React", level: 90, desc: "Applications interactives, gestion d'état réactive, intégration d'APIs" },
      { name: "PHP & Backend d'Entreprise", level: 88, desc: "Architecture MVC, traitement sécurisé des formulaires, services web" },
    ]
  },
  {
    category: "Systèmes, Réseaux & Sécurité",
    skills: [
      { name: "Cybersécurité & Protection Données", level: 88, desc: "Gestion des accès RBAC, chiffrement, sensibilisation anti-phishing, hygiène IT" },
      { name: "Réseaux Locaux & Maintenance", level: 92, desc: "Configuration routeurs/switchs, câblage, dépannage hardware et software" },
      { name: "Installation & Solutions Métiers", level: 94, desc: "Déploiement d'outils de gestion, suites bureautiques, systèmes Windows & Linux" },
    ]
  }
];

export const ACHIEVEMENTS = [
  {
    category: "Projets Déployés",
    title: "Solutions Métiers Opérationnelles",
    count: "15+",
    description: "Systèmes de facturation, gestion des stocks et bases de données installés et utilisés quotidiennement par des entreprises locales.",
    highlights: ["Zéro interruption critique", "Architecture évolutive", "Adoption rapide par les utilisateurs"]
  },
  {
    category: "Assistance Technique",
    title: "Interventions d'Urgence & Maintenance",
    count: "250+",
    description: "Interventions réussies pour des résolutions d'incidents matériels, restaurations de systèmes d'exploitation et réparations de bases corrompues.",
    highlights: ["Délai d'intervention < 2 heures à Kinshasa", "Taux de résolution au 1er contact de 94%", "Préservation totale des données"]
  },
  {
    category: "Formations Données",
    title: "Sessions de Renforcement de Capacités",
    count: "40+",
    description: "Professionnels et gestionnaires formés sur Excel avancé, l'analyse de données financières et les bonnes pratiques de sécurité numérique.",
    highlights: ["Méthodologie 80% pratique", "Cas réels d'entreprises", "Satisfaction 100%"]
  }
];

export const TESTIMONIALS = [
  {
    quote: "Grâce au logiciel de gestion de stock développé par Georges, nous avons enfin une vision claire de nos inventaires. Les alertes de rupture nous évitent des pertes financières considérables.",
    author: "M. Kabange",
    role: "Responsable Logistique & Dépôt",
    location: "Kinshasa, RDC"
  },
  {
    quote: "Georges allie une rare compréhension de la comptabilité avec de vraies compétences informatiques. Son système de facturation est simple, précis et parfaitement conforme aux normes OHADA.",
    author: "Mme. Tshela",
    role: "Directrice Administrative et Financière",
    location: "Kinshasa, Gombe"
  },
  {
    quote: "Ponctualité, rigueur technique et disponibilité exemplaire lors de la mise en place de notre réseau d'entreprise et de la sécurisation de nos postes de travail. Un vrai professionnel digne de confiance.",
    author: "Ing. B. Malembe",
    role: "Gérant de Cabinet Médical",
    location: "Kinshasa, RDC"
  }
];
