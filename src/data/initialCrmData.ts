import { 
  Lead, Client, Quote, ClientProject, Invoice, 
  Contract, Appointment, SupportTicket, DirectMessage, 
  BlogArticle, NewsletterSubscriber, AppNotification 
} from '../types/crm';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Jean-Paul Kabange",
    company: "Dépôt Central de Kinshasa",
    email: "jp.kabange@depotcentral.cd",
    phone: "+243 812 345 678",
    address: "Avenue du Commerce, Gombe, Kinshasa",
    joinedDate: "2023-11-15",
    status: "Actif",
    notes: "Client fidèle utilisant le logiciel de gestion de stock et caisse."
  },
  {
    id: "cli-2",
    name: "Marie-Claire Tshela",
    company: "Cabinet Conseil B2B Kin",
    email: "mc.tshela@conseilb2b.cd",
    phone: "+243 998 765 432",
    address: "Boulevard du 30 Juin, Kinshasa",
    joinedDate: "2024-02-10",
    status: "Actif",
    notes: "Utilise le module de Facturation OHADA et le reporting financier."
  },
  {
    id: "cli-3",
    name: "Ing. Bernard Malembe",
    company: "Centre Médical de l'Avenir",
    email: "b.malembe@centre-avenir.cd",
    phone: "+243 820 112 233",
    address: "Quartier Matonge, Kalamu, Kinshasa",
    joinedDate: "2024-04-05",
    status: "Actif",
    notes: "Maintenance réseau LAN et sauvegarde 3-2-1 sous contrat annuel."
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Patrick Ilunga",
    company: "Kinshasa Logistics Services",
    phone: "+243 815 678 901",
    email: "patrick.ilunga@kinlogistics.cd",
    source: "Site Web",
    service: "Systèmes de Gestion sur Mesure",
    budget: "1 200 USD",
    status: "Devis envoyé",
    createdAt: "2024-09-28",
    lastInteraction: "2024-10-04",
    notes: "Recherche un ERP de suivi de flotte et facturation des conteneurs."
  },
  {
    id: "lead-2",
    name: "Aimé Mukendi",
    company: "Pharmacie Nouvelle Espérance",
    phone: "+243 971 234 567",
    email: "pharmacie.esperance@gmail.com",
    source: "Recommandation",
    service: "Point de Vente (POS) & Caisse",
    budget: "800 USD",
    status: "Qualifié",
    createdAt: "2024-10-02",
    lastInteraction: "2024-10-05",
    notes: "A besoin d'une caisse tactile avec lecteur code-barres et gestion des péremptions."
  },
  {
    id: "lead-3",
    name: "Sarah Bolamba",
    company: "Boutique Mode & Élégance",
    phone: "+243 823 456 789",
    email: "sarah.bolamba@mode-elegance.cd",
    source: "WhatsApp Direct",
    service: "Création de Sites Web & Portails",
    budget: "450 USD",
    status: "Contacté",
    createdAt: "2024-10-05",
    lastInteraction: "2024-10-06",
    notes: "Site vitrine avec catalogue de robes et commande WhatsApp intégrée."
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: "quo-1",
    number: "DEV-2024-001",
    clientId: "cli-1",
    clientName: "Jean-Paul Kabange",
    company: "Dépôt Central de Kinshasa",
    email: "jp.kabange@depotcentral.cd",
    phone: "+243 812 345 678",
    service: "Systèmes de Gestion sur Mesure",
    description: "Extension du système de gestion de stock avec intégration des inventaires tournants et module code-barres mobile.",
    items: [
      { id: "item-1", description: "Développement module inventaires tournants", quantity: 1, unitPrice: 350, total: 350 },
      { id: "item-2", description: "Compatibilité douchette code-barres & terminal", quantity: 1, unitPrice: 150, total: 150 },
      { id: "item-3", description: "Formation des magasiniers et paramétrage", quantity: 2, unitPrice: 75, total: 150 }
    ],
    totalAmount: 650,
    currency: "USD",
    status: "Accepté",
    date: "2024-09-15",
    validUntil: "2024-10-15",
    estimatedDuration: "14 jours",
    notes: "Acompte de 50% versé au démarrage."
  },
  {
    id: "quo-2",
    number: "DEV-2024-002",
    clientName: "Patrick Ilunga",
    company: "Kinshasa Logistics Services",
    email: "patrick.ilunga@kinlogistics.cd",
    phone: "+243 815 678 901",
    service: "Systèmes de Gestion sur Mesure",
    description: "Conception complète d'une plateforme de gestion des expéditions et facturation bidevise USD/CDF.",
    items: [
      { id: "item-1", description: "Conception base de données Merise & API backend", quantity: 1, unitPrice: 500, total: 500 },
      { id: "item-2", description: "Interface tableau de bord et suivi d'expéditions", quantity: 1, unitPrice: 450, total: 450 },
      { id: "item-3", description: "Module de facturation OHADA et reçus", quantity: 1, unitPrice: 250, total: 250 }
    ],
    totalAmount: 1200,
    currency: "USD",
    status: "Envoyé",
    date: "2024-10-01",
    validUntil: "2024-11-01",
    estimatedDuration: "25 jours",
    notes: "En attente de validation du conseil d'administration."
  }
];

export const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: "proj-1",
    clientId: "cli-1",
    clientName: "Dépôt Central de Kinshasa",
    title: "Mise à niveau ERP Stock & Inventaires 2.0",
    description: "Déploiement du module code-barres et optimisation du calcul PUMP multi-entrepôts.",
    budget: 650,
    currency: "USD",
    startDate: "2024-09-20",
    deliveryDate: "2024-10-18",
    status: "En cours",
    priority: "Haute",
    progress: 75,
    tasks: [
      { id: "tsk-1", projectId: "proj-1", title: "Modélisation schéma relationnel lots & DLUO", description: "Tables MySQL pour la traçabilité des lots et dates limites", priority: "Haute", assignee: "Georges MOOMBO", dueDate: "2024-09-25", status: "Terminé" },
      { id: "tsk-2", projectId: "proj-1", title: "Interface scan code-barres", description: "Saisie sans clavier pour magasiniers", priority: "Haute", assignee: "Georges MOOMBO", dueDate: "2024-10-05", status: "Terminé" },
      { id: "tsk-3", projectId: "proj-1", title: "Tests de validation sur le terrain", description: "Simuler 50 entrées/sorties réelles au dépôt", priority: "Normale", assignee: "Georges MOOMBO", dueDate: "2024-10-12", status: "En cours" },
      { id: "tsk-4", projectId: "proj-1", title: "Formation des équipes et PV de recette", description: "Session pratique de 3 heures avec remise des fiches mémo", priority: "Normale", assignee: "Georges MOOMBO", dueDate: "2024-10-18", status: "À faire" }
    ],
    liveUrl: "https://stock.depotcentral.cd"
  },
  {
    id: "proj-2",
    clientId: "cli-2",
    clientName: "Cabinet Conseil B2B Kin",
    title: "Portail Web Institutionnel & Espace Client",
    description: "Site internet professionnel avec présentation des expertises et formulaire de demande de mission.",
    budget: 450,
    currency: "USD",
    startDate: "2024-08-10",
    deliveryDate: "2024-08-28",
    status: "Terminé",
    priority: "Normale",
    progress: 100,
    tasks: [
      { id: "tsk-5", projectId: "proj-2", title: "Maquettage et validation charte", description: "Design responsive premium bleu & blanc", priority: "Normale", assignee: "Georges MOOMBO", dueDate: "2024-08-15", status: "Terminé" },
      { id: "tsk-6", projectId: "proj-2", title: "Développement React & Tailwind", description: "Intégration composant par composant", priority: "Normale", assignee: "Georges MOOMBO", dueDate: "2024-08-22", status: "Terminé" },
      { id: "tsk-7", projectId: "proj-2", title: "Optimisation SEO & Mise en ligne", description: "Configuration DNS et certificat SSL HTTPS", priority: "Haute", assignee: "Georges MOOMBO", dueDate: "2024-08-28", status: "Terminé" }
    ],
    liveUrl: "https://conseilb2b.cd"
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    number: "FAC-2024-015",
    clientId: "cli-1",
    clientName: "Jean-Paul Kabange (Dépôt Central)",
    projectId: "proj-1",
    projectTitle: "Mise à niveau ERP Stock & Inventaires 2.0",
    items: [
      { id: "it-1", description: "Acompte 50% sur réalisation ERP Stock 2.0", quantity: 1, unitPrice: 325, total: 325 }
    ],
    subTotal: 325,
    discount: 0,
    tax: 0,
    total: 325,
    currency: "USD",
    date: "2024-09-20",
    dueDate: "2024-10-05",
    status: "Payée",
    payments: [
      {
        id: "pay-1",
        invoiceId: "inv-1",
        amount: 325,
        currency: "USD",
        date: "2024-09-22",
        method: "Mobile Money",
        reference: "MPESA-894712039",
        status: "Confirmé"
      }
    ],
    notes: "Paiement validé par M-Pesa."
  },
  {
    id: "inv-2",
    number: "FAC-2024-016",
    clientId: "cli-1",
    clientName: "Jean-Paul Kabange (Dépôt Central)",
    projectId: "proj-1",
    projectTitle: "Mise à niveau ERP Stock & Inventaires 2.0",
    items: [
      { id: "it-2", description: "Solde final 50% après recette et formation", quantity: 1, unitPrice: 325, total: 325 }
    ],
    subTotal: 325,
    discount: 0,
    tax: 0,
    total: 325,
    currency: "USD",
    date: "2024-10-15",
    dueDate: "2024-10-30",
    status: "Envoyée",
    payments: [],
    notes: "Payable à la livraison définitive."
  },
  {
    id: "inv-3",
    number: "FAC-2024-014",
    clientId: "cli-3",
    clientName: "Ing. Bernard Malembe (Centre Médical)",
    items: [
      { id: "it-3", description: "Abonnement Maintenance Réseau & Sécurité (Trimestre 3)", quantity: 3, unitPrice: 60, total: 180 }
    ],
    subTotal: 180,
    discount: 0,
    tax: 0,
    total: 180,
    currency: "USD",
    date: "2024-07-01",
    dueDate: "2024-07-15",
    status: "Payée",
    payments: [
      {
        id: "pay-2",
        invoiceId: "inv-3",
        amount: 180,
        currency: "USD",
        date: "2024-07-05",
        method: "Virement",
        reference: "VIR-RAW-99201",
        status: "Confirmé"
      }
    ]
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "ctr-1",
    number: "CTR-2024-001",
    clientId: "cli-1",
    clientName: "Dépôt Central de Kinshasa",
    projectId: "proj-1",
    quoteId: "quo-1",
    title: "Contrat de Conception & Maintenance Applicative ERP Stock",
    date: "2024-09-18",
    duration: "6 mois",
    amount: 650,
    currency: "USD",
    terms: "1. Le prestataire s'engage à livrer le code source et à assurer la formation du personnel.\n2. Le client s'engage à verser 50% au démarrage et 50% à la livraison.\n3. Garantie corrective de 90 jours incluse contre toute anomalie de programmation.",
    status: "Signé",
    signedAt: "2024-09-19"
  },
  {
    id: "ctr-2",
    number: "CTR-2024-002",
    clientId: "cli-3",
    clientName: "Centre Médical de l'Avenir",
    title: "Contrat Annuel d'Infogérance & Sécurisation Réseau",
    date: "2024-01-10",
    duration: "12 mois renouvelable",
    amount: 720,
    currency: "USD",
    terms: "Prestation mensuelle d'assistance technique, contrôle des sauvegardes chiffrées et intervention sur site sous 2h en cas d'urgence réseau.",
    status: "Actif",
    signedAt: "2024-01-12"
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    name: "Patrick Ilunga",
    email: "patrick.ilunga@kinlogistics.cd",
    phone: "+243 815 678 901",
    subject: "Présentation de la maquette ERP Logistics",
    date: "2024-10-10",
    time: "10:30",
    duration: "45 min",
    notes: "Réunion en présentiel au siège de Kinshasa Logistics, Gombe.",
    status: "Confirmé"
  },
  {
    id: "apt-2",
    name: "Aimé Mukendi",
    email: "pharmacie.esperance@gmail.com",
    phone: "+243 971 234 567",
    subject: "Audit du poste d'encaissement pharmacie",
    date: "2024-10-12",
    time: "14:00",
    duration: "30 min",
    notes: "Vérifier la compatibilité de l'imprimante thermique existante.",
    status: "Demandé"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tck-1",
    clientId: "cli-1",
    clientName: "Jean-Paul Kabange",
    subject: "Besoin d'ajouter un nouveau caissier dans le système",
    description: "Nous avons recruté un nouvel agent pour le poste du soir et nous souhaitons lui créer un profil sécurisé avec mot de passe restreint.",
    priority: "Normale",
    status: "Résolu",
    createdAt: "2024-10-03 09:15",
    updatedAt: "2024-10-03 11:30",
    responses: [
      { id: "resp-1", sender: "Client", message: "Bonjour Georges, merci de créer le profil pour notre agent Junior Kabeya.", timestamp: "2024-10-03 09:15" },
      { id: "resp-2", sender: "Georges", message: "Bonjour M. Kabange, le compte a été configuré avec le profil 'Vendeur / Caissier' limitant l'accès aux seules fonctions de saisie de vente sans pouvoir modifier les prix. Ses identifiants vous ont été envoyés par message privé.", timestamp: "2024-10-03 11:30" }
    ]
  },
  {
    id: "tck-2",
    clientId: "cli-3",
    clientName: "Ing. Bernard Malembe",
    subject: "Vérification de la sauvegarde automatique du vendredi",
    description: "Pouvez-vous confirmer que la sauvegarde externe du disque dur réseau NAS s'est bien exécutée sans erreur ?",
    priority: "Faible",
    status: "En cours",
    createdAt: "2024-10-06 08:00",
    updatedAt: "2024-10-06 08:30",
    responses: [
      { id: "resp-3", sender: "Client", message: "Bonjour Georges, juste pour vérifier le rapport de la sauvegarde de vendredi soir.", timestamp: "2024-10-06 08:00" },
      { id: "resp-4", sender: "Georges", message: "Bonjour Ingénieur Malembe, je consulte les logs système et je vous transmets l'état de l'intégrité des archives dans la matinée.", timestamp: "2024-10-06 08:30" }
    ]
  }
];

export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: "msg-1",
    clientId: "cli-1",
    sender: "Client",
    content: "Bonjour Georges, l'équipe est très satisfaite de la rapidité du système de caisse avec le nouveau lecteur de code-barres !",
    timestamp: "2024-10-04 16:45",
    read: true
  },
  {
    id: "msg-2",
    clientId: "cli-1",
    sender: "Admin",
    content: "C'est un réel plaisir M. Kabange ! La semaine prochaine nous entamerons le module d'alerte automatique des péremptions.",
    timestamp: "2024-10-04 17:10",
    read: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Nouveau Devis Accepté",
    message: "Le client Jean-Paul Kabange a validé le devis DEV-2024-001 (650 USD).",
    type: "quote",
    date: "Il y a 2 jours",
    read: false,
    linkSection: "quotes"
  },
  {
    id: "notif-2",
    title: "Demande de Rendez-vous",
    message: "Aimé Mukendi a sollicité un créneau pour le 12 octobre à 14:00.",
    type: "appointment",
    date: "Hier",
    read: false,
    linkSection: "appointments"
  },
  {
    id: "notif-3",
    title: "Paiement Enregistré",
    message: "Acompte de 325 USD reçu pour la facture FAC-2024-015.",
    type: "invoice",
    date: "Il y a 4 jours",
    read: true,
    linkSection: "invoices"
  }
];

export const INITIAL_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "art-1",
    slug: "pourquoi-informatiser-gestion-stock-pme-kinshasa",
    title: "Pourquoi et comment informatiser la gestion de stock d'une PME à Kinshasa ?",
    category: "Informatique de Gestion",
    excerpt: "Découvrez comment l'abandon des fiches papier et des tableurs Excel non sécurisés permet de réduire jusqu'à 40% des pertes invisibles de marchandises.",
    content: `
Dans le tissu économique dynamique de Kinshasa, de nombreuses entreprises commerciales gèrent encore leurs approvisionnements sur des cahiers de registre ou des classeurs Excel partagés sans protection.

### Les 3 dangers mortels de la gestion manuelle :
1. **Les écarts d'inventaire inexplicables :** Sans traçabilité unitaire ni signature numérique lors de chaque sortie, les disparitions de marchandises ne sont détectées qu'en fin d'année.
2. **Les ruptures de stock sur les produits phares :** Rien n'est plus préjudiciable qu'un client qui repart chez le concurrent parce que le magasinier ignorait qu'il ne restait que deux cartons.
3. **Le temps gaspillé lors des inventaires :** Bloquer tout le personnel pendant deux jours de fermeture pour compter manuellement les étagères est un gouffre financier.

### La solution : un logiciel sur mesure adapté aux réalités locales
Un système de gestion de stock moderne doit fonctionner même lors de coupures temporaires d'Internet, gérer le double affichage USD et Francs Congolais, et proposer des alertes visuelles avant rupture de seuil critique.
    `.trim(),
    author: "Georges MOOMBO MODEAWI",
    date: "02 Octobre 2024",
    readTime: "5 min de lecture",
    tags: ["Gestion de Stock", "PME", "OHADA", "Kinshasa", "Automatisation"],
    status: "Publié",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "art-2",
    slug: "cybersecurite-pme-5-reflexes-proteger-donnees-bancaires",
    title: "Cybersécurité pour entreprises : 5 réflexes essentiels pour protéger vos données",
    category: "Cybersécurité",
    excerpt: "Les petites et moyennes entreprises sont désormais les cibles privilégiées des cybercriminels. Voici les mesures concrètes et peu coûteuses à adopter immédiatement.",
    content: `
On pense souvent à tort que les pirates informatiques ne ciblent que les grandes multinationales ou les ministères. En réalité, plus de 60% des attaques de rançongiciels (ransomwares) touchent des structures de moins de 50 employés.

### Les 5 règles d'or de l'hygiène informatique :
1. **La règle de sauvegarde 3-2-1 :** Garder 3 copies de vos données stratégiques, sur 2 supports différents (NAS local + Cloud chiffré), dont 1 copie physique déconnectée du réseau.
2. **Le principe du moindre privilège (RBAC) :** Un caissier ou un agent d'accueil ne doit jamais posséder les droits administrateur sur sa session Windows.
3. **Méfiance absolue face aux clés USB non vérifiées :** En RDC, la prolifération des clés USB partagées entre collègues est le premier vecteur d'infection virale.
4. **La double authentification (2FA) sur les messageries :** Activer la validation par code SMS ou application mobile sur vos adresses professionnelles.
5. **Segmentation du réseau Wi-Fi :** Ne jamais laisser vos clients ou visiteurs se connecter au même réseau local que celui qui héberge votre logiciel comptable.
    `.trim(),
    author: "Georges MOOMBO MODEAWI",
    date: "24 Septembre 2024",
    readTime: "6 min de lecture",
    tags: ["Cybersécurité", "Sauvegarde 3-2-1", "Protection Données", "Antivirus", "Réseaux"],
    status: "Publié",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "art-3",
    slug: "modelisation-merise-bases-de-donnees-relationnelles-performantes",
    title: "Modélisation Merise : la clé d'une base de données MySQL indestructible",
    category: "Bases de données",
    excerpt: "Pourquoi concevoir un Modèle Conceptuel des Données (MCD) rigoureux avant d'écrire la moindre ligne de code SQL est indispensable pour la longévité de votre application.",
    content: `
L'une des erreurs les plus fréquentes commises par les développeurs débutants est de créer directement des tables dans phpMyAdmin sans réflexion architecturale préalable.

### Les conséquences d'un schéma mal pensé :
- Redondances d'informations entraînant des incohérences lors des mises à jour.
- Impossibilité d'ajouter de nouvelles fonctionnalités sans casser tout le code existant.
- Requêtes SQL lentes qui mettent à genoux le serveur dès que la base atteint 100 000 lignes.

### La méthode Merise en pratique :
En passant par le MCD (Modèle Conceptuel des Données) puis le MLD (Modèle Logique des Données), on s'assure du respect des 3 formes normales (3NF). Résultat : intégrité référentielle garantie, clés étrangères verrouillées et suppression des risques d'orphelins.
    `.trim(),
    author: "Georges MOOMBO MODEAWI",
    date: "15 Septembre 2024",
    readTime: "7 min de lecture",
    tags: ["MySQL", "Merise", "Architecture", "SQL", "Développement"],
    status: "Publié",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000"
  }
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: "sub-1", email: "directeur.general@kin-transit.cd", subscribedAt: "2024-09-12", status: "Actif" },
  { id: "sub-2", email: "compta@solutions-plus.cd", subscribedAt: "2024-09-20", status: "Actif" },
  { id: "sub-3", email: "technique@vision-sarl.cd", subscribedAt: "2024-10-01", status: "Actif" }
];
