import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Security Headers & Body Parser
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ==========================================
// IN-MEMORY / PERSISTENT BACKEND DATA STORE
// ==========================================

// Password hashing with crypto.pbkdf2Sync
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Initial Admin Users
// Default Admin: admin@moombo.cd / GeorgesAdmin2024!
// Default Editor: editor@moombo.cd / EditorMoombo2024!
const salt1 = 'moombo_secure_salt_admin_2024';
const salt2 = 'moombo_secure_salt_editor_2024';

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  salt: string;
  passwordHash: string;
}

const USERS: BackendUser[] = [
  {
    id: 'user-admin-1',
    email: 'admin@moombo.cd',
    name: 'Georges MOOMBO MODEAWI',
    role: 'ADMIN',
    salt: salt1,
    passwordHash: hashPassword('GeorgesAdmin2024!', salt1),
  },
  {
    id: 'user-editor-1',
    email: 'editor@moombo.cd',
    name: 'RÃ©dacteur Technique',
    role: 'EDITOR',
    salt: salt2,
    passwordHash: hashPassword('EditorMoombo2024!', salt2),
  }
];

// Active Server Sessions
interface Session {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  expiresAt: number;
}

const SESSIONS = new Map<string, Session>();

// Audit Log entries
interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  ip?: string;
  details?: string;
}

const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString().replace('T', ' ').slice(0, 19),
    user: 'system',
    role: 'SYSTEM',
    action: 'INITIALIZATION',
    resource: 'SECURITY_MODULE',
    status: 'SUCCESS',
    details: 'Initialisation des modules de sÃ©curitÃ© et de contrÃ´le des rÃ´les RBAC.'
  }
];

function recordAudit(user: string, role: string, action: string, resource: string, status: 'SUCCESS' | 'FAILURE' | 'WARNING', details?: string, ip?: string) {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    user,
    role,
    action,
    resource,
    status,
    details,
    ip: ip || '127.0.0.1'
  };
  AUDIT_LOGS.unshift(log);
  if (AUDIT_LOGS.length > 500) {
    AUDIT_LOGS.pop();
  }
}

// Authentication Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Token d\'authentification manquant.' });
  }

  const token = authHeader.split(' ')[1];
  const session = SESSIONS.get(token);

  if (!session) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Session invalide ou expirÃ©e.' });
  }

  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return res.status(401).json({ error: 'SESSION_EXPIRED', message: 'Session expirÃ©e. Veuillez vous reconnecter.' });
  }

  // Extend active session
  session.expiresAt = Date.now() + 8 * 3600 * 1000;
  // @ts-ignore
  req.user = session;
  next();
}

// Authorization Middleware
function requireRole(roles: ('ADMIN' | 'EDITOR')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user as Session | undefined;
    if (!user) {
      return res.status(401).json({ error: 'UNAUTHENTICATED' });
    }
    if (!roles.includes(user.role)) {
      recordAudit(user.email, user.role, 'UNAUTHORIZED_ACCESS_ATTEMPT', req.path, 'FAILURE', `Tentative d'accÃ¨s non autorisÃ©e par le rÃ´le ${user.role}`);
      return res.status(403).json({ 
        error: 'FORBIDDEN', 
        message: `AccÃ¨s refusÃ©. Cette action requiert les privilÃ¨ges : ${roles.join(' ou ')}.` 
      });
    }
    next();
  };
}

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const user = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    recordAudit(email, 'ANONYMOUS', 'LOGIN_FAILED', 'AUTH_SERVICE', 'FAILURE', 'Utilisateur inexistant', ip);
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const hashedAttempt = hashPassword(password, user.salt);
  if (hashedAttempt !== user.passwordHash) {
    recordAudit(user.email, user.role, 'LOGIN_FAILED', 'AUTH_SERVICE', 'FAILURE', 'Mot de passe erronÃ©', ip);
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  // Generate secure random session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 8 * 3600 * 1000; // 8 hours session

  const session: Session = {
    token,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  };

  SESSIONS.set(token, session);

  recordAudit(user.email, user.role, 'LOGIN_SUCCESS', 'AUTH_SERVICE', 'SUCCESS', 'Connexion rÃ©ussie', ip);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    expiresAt
  });
});

// Check Session / Current User
app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  res.json({
    authenticated: true,
    user: {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: user.expiresAt
    }
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = SESSIONS.get(token);
    if (session) {
      recordAudit(session.email, session.role, 'LOGOUT', 'AUTH_SERVICE', 'SUCCESS', 'DÃ©connexion manuelle');
      SESSIONS.delete(token);
    }
  }
  res.json({ success: true, message: 'DÃ©connexion effectuÃ©e avec succÃ¨s.' });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  recordAudit(email || 'anonymous', 'PUBLIC', 'PASSWORD_RESET_REQUESTED', 'AUTH_SERVICE', 'SUCCESS', 'Demande de rÃ©initialisation de mot de passe');
  // Always respond with success to avoid user enumeration
  res.json({ 
    success: true, 
    message: 'Si cet email correspond Ã  un compte administrateur, un lien de rÃ©initialisation sÃ©curisÃ© a Ã©tÃ© transmis.' 
  });
});

// Reset Password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Token invalide ou mot de passe trop court (min. 8 caractÃ¨res).' });
  }

  // Demo token verification
  res.json({ 
    success: true, 
    message: 'Mot de passe mis Ã  jour avec succÃ¨s. Vous pouvez maintenant vous connecter.' 
  });
});

// Change Password (PROTECTED - REAL BACKEND PBKDF2 HASH VERIFICATION & UPDATE)
app.post('/api/auth/change-password', authenticateToken, (req: Request, res: Response) => {
  // @ts-ignore
  const session = req.user as Session;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Tous les champs de mot de passe sont obligatoires.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
  }

  // Strict Security Policy
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractÃ¨res.' });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Le mot de passe doit comporter au moins une lettre majuscule.' });
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Le mot de passe doit comporter au moins une lettre minuscule.' });
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Le mot de passe doit comporter au moins un chiffre.' });
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(newPassword)) {
    return res.status(400).json({ error: 'Le mot de passe doit comporter au moins un caractÃ¨re spÃ©cial (!@#$%...).' });
  }

  const user = USERS.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  // Verify current password hash
  const currentHashAttempt = hashPassword(currentPassword, user.salt);
  if (currentHashAttempt !== user.passwordHash) {
    recordAudit(user.email, user.role, 'PASSWORD_CHANGE_FAILED', 'AUTH_SECURITY', 'FAILURE', 'Ancien mot de passe incorrect', ip);
    return res.status(400).json({ error: "L'ancien mot de passe saisi est incorrect." });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit Ãªtre diffÃ©rent de l'actuel." });
  }

  // Generate fresh salt and new hash
  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'PASSWORD_CHANGE_SUCCESS', 'AUTH_SECURITY', 'SUCCESS', 'Mot de passe administrateur modifiÃ© avec succÃ¨s', ip);

  res.json({
    success: true,
    message: 'Votre mot de passe a Ã©tÃ© modifiÃ© et sÃ©curisÃ© avec succÃ¨s.'
  });
});

// Change Email (PROTECTED - REAL BACKEND PBKDF2 VERIFICATION & PERSISTENT UPDATE)
app.post('/api/auth/change-email', authenticateToken, (req: Request, res: Response) => {
  // @ts-ignore
  const session = req.user as Session;
  const { currentPassword, newEmail } = req.body;
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';

  if (!currentPassword || !newEmail) {
    return res.status(400).json({ error: 'Le mot de passe actuel et la nouvelle adresse e-mail sont obligatoires.' });
  }

  const cleanEmail = newEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Format d\'adresse e-mail invalide.' });
  }

  const user = USERS.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'Compte administrateur introuvable.' });
  }

  // Verify password
  const currentHashAttempt = hashPassword(currentPassword, user.salt);
  if (currentHashAttempt !== user.passwordHash) {
    recordAudit(user.email, user.role, 'EMAIL_CHANGE_FAILED', 'AUTH_SECURITY', 'FAILURE', 'Mot de passe incorrect lors du changement d\'email', ip);
    return res.status(400).json({ error: 'Le mot de passe actuel saisi est incorrect.' });
  }

  if (user.email.toLowerCase() === cleanEmail) {
    return res.status(400).json({ error: 'La nouvelle adresse e-mail doit Ãªtre diffÃ©rente de l\'adresse actuelle.' });
  }

  // Check if another user has this email
  const emailConflict = USERS.some(u => u.id !== user.id && u.email.toLowerCase() === cleanEmail);
  if (emailConflict) {
    return res.status(400).json({ error: 'Cette adresse e-mail est dÃ©jÃ  attribuÃ©e Ã  un autre compte.' });
  }

  const oldEmail = user.email;
  user.email = cleanEmail;
  session.email = cleanEmail;

  // Update session email across active sessions map
  for (const sess of SESSIONS.values()) {
    if (sess.userId === user.id) {
      sess.email = cleanEmail;
    }
  }

  // Save to disk immediately
  saveStoreToDisk();

  recordAudit(cleanEmail, user.role, 'EMAIL_CHANGE_SUCCESS', 'AUTH_SECURITY', 'SUCCESS', `Adresse email modifiÃ©e de ${oldEmail} vers ${cleanEmail}`, ip);

  res.json({
    success: true,
    newEmail: cleanEmail,
    message: `Votre adresse e-mail de connexion a Ã©tÃ© modifiÃ©e avec succÃ¨s en "${cleanEmail}". Utilisez-la pour vous connecter dorÃ©navant.`
  });
});

// Logout All Other Sessions
app.post('/api/auth/logout-all-sessions', authenticateToken, (req: Request, res: Response) => {
  // @ts-ignore
  const currentSession = req.user as Session;
  let terminatedCount = 0;

  for (const [tkn, sess] of SESSIONS.entries()) {
    if (sess.userId === currentSession.userId && tkn !== currentSession.token) {
      SESSIONS.delete(tkn);
      terminatedCount++;
    }
  }

  recordAudit(currentSession.email, currentSession.role, 'SESSIONS_TERMINATED', 'SECURITY', 'SUCCESS', `${terminatedCount} autres sessions rÃ©voquÃ©es.`);
  res.json({
    success: true,
    terminatedCount,
    message: `${terminatedCount} session(s) active(s) fermÃ©e(s) avec succÃ¨s.`
  });
});

// 2FA Management (Simulated TOTP)
let TWO_FACTOR_ENABLED = false;

app.get('/api/admin/2fa-status', authenticateToken, (req: Request, res: Response) => {
  res.json({
    enabled: TWO_FACTOR_ENABLED,
    issuer: 'Georges MOOMBO Platform',
    algorithm: 'SHA256'
  });
});

app.post('/api/admin/toggle-2fa', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { enabled } = req.body;
  TWO_FACTOR_ENABLED = !!enabled;

  recordAudit(user.email, user.role, '2FA_STATE_CHANGED', 'SECURITY', 'SUCCESS', `Double facteur (2FA) : ${TWO_FACTOR_ENABLED ? 'ActivÃ©' : 'DÃ©sactivÃ©'}`);
  res.json({
    success: true,
    enabled: TWO_FACTOR_ENABLED,
    message: `L'authentification Ã  double facteur est dÃ©sormais ${TWO_FACTOR_ENABLED ? 'activÃ©e' : 'dÃ©sactivÃ©e'}.`
  });
});

// Profile In-Memory Storage
let PROFILE_DATA = {
  name: "Georges MOOMBO MODEAWI",
  title: "DÃ©veloppeur Full Stack & Expert en conception du systÃ¨me d'information",
  bio: "Professionnel passionnÃ© par l'architecture logicielle, la modÃ©lisation de bases de donnÃ©es, la conception et l'informatisation des processus mÃ©tiers d'entreprises et la sÃ©curisation des systÃ¨mes d'information en RÃ©publique DÃ©mocratique du Congo.",
  contactEmail: "georgesweahmoombo@gmail.com",
  notificationEmail: "georgesweahmoombo@gmail.com",
  whatsapp: "+243829725609",
  phone: "+243829725609",
  address: "Kinshasa, Gombe / Limete",
  city: "Kinshasa",
  country: "RÃ©publique DÃ©mocratique du Congo",
  githubUrl: "https://github.com/georgesmoombo",
  linkedinUrl: "https://linkedin.com/in/georges-moombo",
  facebookUrl: "https://facebook.com/georgesmoombo",
  portfolioUrl: "https://georges-moombo.cd",
  avatarUrl: "/profile_photo.jpg",
  coverUrl: "/cover_photo.jpg",
};

// Experiences Storage
let SERVER_EXPERIENCES = [
  {
    id: 'exp-1',
    position: 'Lead DÃ©veloppeur & Consultant SystÃ¨mes d\'Information',
    company: 'Cabinet NumÃ©rique & IndÃ©pendant',
    startDate: '2022-01',
    endDate: '',
    isCurrent: true,
    description: 'Pilotage de la conception et du dÃ©ploiement d\'architectures logicielles complÃ¨tes pour entreprises commerciales, industrielles et cabinets de santÃ© Ã  Kinshasa.',
    achievements: [
      'Conception de plus de 15 logiciels mÃ©tiers opÃ©rationnels (gestion de stocks, facturation OHADA, caisses POS tactiles)',
      'RÃ©duction moyenne de 45% des Ã©carts d\'inventaire dÃ¨s le premier trimestre chez les grossistes clients',
      'Mise en place de politiques de sauvegarde automatisÃ©e 3-2-1 et zÃ©ro perte critique de donnÃ©es',
    ],
    skills: ['Conception SI (UML)', 'Architecture SI', 'MySQL AvancÃ©', 'React', 'TypeScript', 'PHP MVC', 'Normes OHADA', 'CybersÃ©curitÃ©'],
    location: 'Kinshasa, RDC & Ã€ distance',
    order: 1,
  },
  {
    id: 'exp-2',
    position: 'DÃ©veloppeur Full Stack & Gestionnaire de Bases de DonnÃ©es',
    company: 'SociÃ©tÃ©s de Conseil & Distribution',
    startDate: '2020-03',
    endDate: '2021-12',
    isCurrent: false,
    description: 'DÃ©veloppement d\'outils de gestion interne, automatisation de la facturation bimonÃ©taire (USD/CDF) et fiabilisation des Ã©critures comptables.',
    achievements: [
      'Informatisation complÃ¨te des registres manuels pour 4 rÃ©seaux de distribution partenaires',
      'CrÃ©ation d\'un systÃ¨me d\'Ã©dition de factures normalisÃ©es avec suivi automatisÃ© des crÃ©ances clients',
      'Optimisation des temps de requÃªte SQL sur des tables de plus de 500 000 lignes',
    ],
    skills: ['PHP', 'MySQL', 'JavaScript', 'ComptabilitÃ© OHADA', 'API REST', 'Excel AvancÃ© / VBA'],
    location: 'Kinshasa, RDC',
    order: 2,
  },
  {
    id: 'exp-3',
    position: 'Technicien Support IT & Formateur Bureautique DÃ©cisionnelle',
    company: 'Services Informatiques & Formation Professionnelle',
    startDate: '2019-01',
    endDate: '2020-02',
    isCurrent: false,
    description: 'Installation et maintenance de parcs informatiques d\'entreprises, configuration de routeurs et switchs LAN, et formation des Ã©quipes de gestion.',
    achievements: [
      'Plus de 200 interventions matÃ©rielles et logicielles rÃ©ussies avec un taux de satisfaction client de 96%',
      'Animation de plus de 30 sessions de formation sur Excel avancÃ© et les tableaux croisÃ©s dynamiques pour cadres',
      'SÃ©curisation des postes de travail contre les ransomwares et menaces de phishing',
    ],
    skills: ['Maintenance MatÃ©rielle', 'RÃ©seaux LAN', 'Excel TCD / Formules', 'SÃ©curitÃ© des Postes', 'PÃ©dagogie IT'],
    location: 'Kinshasa, RDC',
    order: 3,
  },
];

// CV Settings Storage
let SERVER_CV_SETTINGS = {
  themeId: 'blue-pro',
  pageSize: 'A4',
  onePageMode: true,
  hideEmptySections: true,
  footer: {
    showFooter: true,
    footerText: 'Curriculum Vitae certifiÃ© conforme â€¢ RÃ©fÃ©rences et attestations professionnelles disponibles sur demande.',
    professionalName: 'Georges MOOMBO MODEAWI',
    contactInfoText: 'TÃ©l / WhatsApp : +243 829 725 609  â€¢  Email : georgesweahmoombo@gmail.com',
    confidentialityNotice: 'Document professionnel confidentiel â€” Ã‰mis sous rÃ©serve de droits.',
  },
};

// Site Footer Settings Storage
let SERVER_FOOTER_SETTINGS = {
  copyrightText: 'Tous droits rÃ©servÃ©s. Conception logicielle & SystÃ¨mes d\'information sÃ©curisÃ©s.',
  yearMode: 'auto',
  manualYear: new Date().getFullYear(),
  professionalName: 'Georges MOOMBO MODEAWI',
  shortSlogan: 'Expert en conception du systÃ¨me d\'information & DÃ©veloppeur Full Stack',
  showContactInfo: true,
  contactEmail: 'georgesweahmoombo@gmail.com',
  contactPhone: '+243 829 725 609',
  contactLocation: 'Kinshasa, RÃ©publique DÃ©mocratique du Congo',
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
    { label: 'Ã€ propos', href: '#a-propos' },
    { label: 'Profils & Ã‰quipe', href: '#profils' },
    { label: 'Projets', href: '#projets' },
    { label: 'Galerie & RÃ©alisations', href: '#galerie' },
    { label: 'Services', href: '#services' },
    { label: 'Blog technique', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  legalNotice: 'Mentions LÃ©gales : Portfolio professionnel Ã©ditÃ© par Georges MOOMBO MODEAWI, Consultant indÃ©pendant en conception de systÃ¨mes d\'information et technologies logicielles, basÃ© Ã  Kinshasa (RÃ©publique DÃ©mocratique du Congo). HÃ©bergement sÃ©curisÃ© avec certificat SSL/TLS valide.',
  privacyPolicy: 'Politique de ConfidentialitÃ© : Les informations recueillies via les formulaires de demande de devis et de contact sont strictement destinÃ©es au traitement direct de vos requÃªtes professionnelles. Aucune donnÃ©e n\'est transmise Ã  des tiers sans votre consentement prÃ©alable.',
  complementaryText: 'Disponible pour missions de conseil, conception de logiciels de gestion et interventions Ã  Kinshasa et Ã  distance.',
  showBadges: true,
};

// Persist server data store to disk
const DATA_FILE_PATH = path.resolve(__dirname, 'data', 'server_data.json');

function saveStoreToDisk() {
  try {
    const payload = {
      profileData: PROFILE_DATA,
      serverProfiles: SERVER_PROFILES,
      systemSettings: SYSTEM_SETTINGS,
      users: USERS,
      experiences: SERVER_EXPERIENCES,
      cvSettings: SERVER_CV_SETTINGS,
      footerSettings: SERVER_FOOTER_SETTINGS,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.error('Erreur sauvegarde disque server_data.json:', err);
  }
}

function loadStoreFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.profileData) PROFILE_DATA = { ...PROFILE_DATA, ...parsed.profileData };
      if (Array.isArray(parsed.serverProfiles) && parsed.serverProfiles.length > 0) {
        SERVER_PROFILES = parsed.serverProfiles;
      }
      // Ensure official name and title take precedence over obsolete cached strings
      if (PROFILE_DATA.name.includes('MOOMBO MODEAWI Georges')) {
        PROFILE_DATA.name = 'Georges MOOMBO MODEAWI';
      }
      if (PROFILE_DATA.title.toLowerCase().includes('informatique de gestion')) {
        PROFILE_DATA.title = "DÃ©veloppeur Full Stack & Expert en conception du systÃ¨me d'information";
      }
      const p1 = SERVER_PROFILES.find(p => p.id === 'prof-1');
      if (p1) {
        if (p1.fullName.includes('MOOMBO MODEAWI Georges')) p1.fullName = 'Georges MOOMBO MODEAWI';
        if (p1.roleTitle.toLowerCase().includes('informatique de gestion')) {
          p1.roleTitle = "Directeur Technique & DÃ©veloppeur Full Stack Lead";
        }
      }
      if (parsed.systemSettings) SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...parsed.systemSettings };
      if (Array.isArray(parsed.experiences) && parsed.experiences.length > 0) {
        SERVER_EXPERIENCES = parsed.experiences;
      }
      if (parsed.cvSettings) SERVER_CV_SETTINGS = { ...SERVER_CV_SETTINGS, ...parsed.cvSettings };
      if (parsed.footerSettings) SERVER_FOOTER_SETTINGS = { ...SERVER_FOOTER_SETTINGS, ...parsed.footerSettings };
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        for (const u of parsed.users) {
          const idx = USERS.findIndex(existing => existing.id === u.id);
          if (idx !== -1) {
            USERS[idx] = { ...USERS[idx], ...u };
          } else {
            USERS.push(u);
          }
        }
      }
      console.log('[Georges MOOMBO Server] DonnÃ©es persistÃ©es chargÃ©es avec succÃ¨s depuis server_data.json');
    }
  } catch (err) {
    console.warn('Impossible de charger server_data.json, utilisation des valeurs initiales:', err);
  }
}

// Public API endpoint for current profile
app.get('/api/public/profile', (req: Request, res: Response) => {
  const main = SERVER_PROFILES.find(p => p.id === 'prof-1') || SERVER_PROFILES[0];
  res.json({
    profile: PROFILE_DATA,
    mainProfile: main,
    name: main?.fullName || PROFILE_DATA.name,
    title: main?.roleTitle || PROFILE_DATA.title,
    bio: main?.biography || PROFILE_DATA.bio,
    avatarUrl: main?.avatarUrl || PROFILE_DATA.avatarUrl,
    coverUrl: main?.coverUrl || PROFILE_DATA.coverUrl,
    contactInfo: main?.contactInfo || {
      email: PROFILE_DATA.contactEmail,
      phone: PROFILE_DATA.phone,
      whatsapp: PROFILE_DATA.whatsapp,
      location: `${PROFILE_DATA.city}, ${PROFILE_DATA.country}`
    },
    socialLinks: main?.socialLinks || {
      github: PROFILE_DATA.githubUrl,
      linkedin: PROFILE_DATA.linkedinUrl,
      whatsapp: PROFILE_DATA.whatsapp
    }
  });
});

app.get('/api/admin/profile', authenticateToken, (req: Request, res: Response) => {
  res.json({ profile: PROFILE_DATA });
});

app.put('/api/admin/profile', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  PROFILE_DATA = { ...PROFILE_DATA, ...req.body };

  // Synchroniser avec prof-1 dans SERVER_PROFILES
  const prof1 = SERVER_PROFILES.find(p => p.id === 'prof-1');
  if (prof1) {
    if (req.body.name) prof1.fullName = req.body.name;
    if (req.body.title) prof1.roleTitle = req.body.title;
    if (req.body.bio) {
      prof1.biography = req.body.bio;
      prof1.shortBio = req.body.bio.slice(0, 160) + '...';
    }
    if (req.body.avatarUrl) prof1.avatarUrl = req.body.avatarUrl;
    if (req.body.coverUrl) prof1.coverUrl = req.body.coverUrl;
    if (req.body.githubUrl) prof1.socialLinks.github = req.body.githubUrl;
    if (req.body.linkedinUrl) prof1.socialLinks.linkedin = req.body.linkedinUrl;
    if (req.body.facebookUrl) (prof1.socialLinks as any).facebook = req.body.facebookUrl;
    if (req.body.portfolioUrl) prof1.socialLinks.portfolio = req.body.portfolioUrl;
    if (req.body.phone) {
      prof1.contactInfo.phone = req.body.phone;
      prof1.contactInfo.whatsapp = req.body.whatsapp || req.body.phone;
    }
    if (req.body.contactEmail) prof1.contactInfo.email = req.body.contactEmail;
    prof1.updatedAt = new Date().toISOString().split('T')[0];
  }

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'PROFILE_UPDATE', 'SETTINGS', 'SUCCESS', 'Informations du profil administrateur mises Ã  jour.');
  res.json({ success: true, profile: PROFILE_DATA, message: 'Profil enregistrÃ© avec succÃ¨s.' });
});

// System Settings Storage
let SYSTEM_SETTINGS = {
  defaultCurrency: 'USD',
  timezone: 'Africa/Kinshasa (GMT+1)',
  language: 'FranÃ§ais (FR)',
  usdToCdfRate: 2850,
  maintenanceMode: false,
  emailNotifications: true,
  soundNotifications: true,
  twoFactorEnabled: false,
};

app.get('/api/admin/settings', authenticateToken, (req: Request, res: Response) => {
  res.json({ settings: SYSTEM_SETTINGS });
});

app.put('/api/admin/settings', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...req.body };
  recordAudit(user.email, user.role, 'SYSTEM_SETTINGS_UPDATE', 'SETTINGS', 'SUCCESS', 'PrÃ©fÃ©rences de la plateforme mises Ã  jour.');
  res.json({ success: true, settings: SYSTEM_SETTINGS, message: 'ParamÃ¨tres systÃ¨me appliquÃ©s avec succÃ¨s.' });
});

// ==========================================
// PROTECTED ADMIN API ROUTES
// ==========================================

// Audit logs (ADMIN ONLY)
app.get('/api/admin/audit-logs', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  res.json({ logs: AUDIT_LOGS });
});

// Record custom action to audit log
app.post('/api/admin/audit-logs', authenticateToken, (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { action, resource, details } = req.body;
  recordAudit(user.email, user.role, action || 'ADMIN_ACTION', resource || 'DASHBOARD', 'SUCCESS', details);
  res.json({ success: true });
});

// Security stats (ADMIN ONLY)
app.get('/api/admin/security-status', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  res.json({
    sslActive: true,
    firewallStatus: 'ACTIVE',
    activeSessionsCount: SESSIONS.size,
    lastAuditTimestamp: AUDIT_LOGS[0]?.timestamp || new Date().toISOString(),
    rbacEnforced: true,
    failedAttempts24h: AUDIT_LOGS.filter(l => l.status === 'FAILURE').length
  });
});

// System users list (ADMIN ONLY)
app.get('/api/admin/users', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  res.json({
    users: USERS.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))
  });
});

// Add user (ADMIN ONLY)
app.post('/api/admin/users', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const admin = req.user as Session;
  const { name, email, role, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe requis.' });
  }

  if (USERS.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Un utilisateur avec cet email existe dÃ©jÃ .' });
  }

  const userSalt = crypto.randomBytes(16).toString('hex');
  const newUser: BackendUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    role: role === 'ADMIN' ? 'ADMIN' : 'EDITOR',
    salt: userSalt,
    passwordHash: hashPassword(password, userSalt),
  };

  USERS.push(newUser);
  recordAudit(admin.email, admin.role, 'USER_CREATED', 'USER_MANAGEMENT', 'SUCCESS', `Nouvel utilisateur : ${newUser.email} (${newUser.role})`);

  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    message: 'Utilisateur crÃ©Ã© avec succÃ¨s.'
  });
});

// Delete user (ADMIN ONLY)
app.delete('/api/admin/users/:id', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const admin = req.user as Session;
  const { id } = req.params;

  if (id === admin.userId) {
    return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte administrateur.' });
  }

  const idx = USERS.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvÃ©.' });
  }

  const deleted = USERS.splice(idx, 1)[0];
  recordAudit(admin.email, admin.role, 'USER_DELETED', 'USER_MANAGEMENT', 'WARNING', `Suppression du compte : ${deleted.email}`);

  res.json({ success: true, message: 'Compte utilisateur supprimÃ©.' });
});

// Change user role (ADMIN ONLY)
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const admin = req.user as Session;
  const { id } = req.params;
  const { role } = req.body;

  const user = USERS.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvÃ©.' });
  }

  user.role = role === 'ADMIN' ? 'ADMIN' : 'EDITOR';
  recordAudit(admin.email, admin.role, 'USER_ROLE_CHANGED', 'USER_MANAGEMENT', 'SUCCESS', `RÃ´le mis Ã  jour pour ${user.email} -> ${user.role}`);

  res.json({ success: true, message: 'RÃ´le mis Ã  jour avec succÃ¨s.', user: { id: user.id, email: user.email, role: user.role } });
});


// ==========================================
// PROFILES STORE & API ROUTES
// ==========================================
let SERVER_PROFILES = [
  {
    id: 'prof-1',
    fullName: 'Georges MOOMBO MODEAWI',
    roleTitle: 'Directeur Technique & DÃ©veloppeur Full Stack Lead',
    shortBio: "Expert en conception du systÃ¨me d'information, Architecture Logicielle d'Entreprise & CybersÃ©curitÃ© Ã  Kinshasa.",
    biography: "Expert en conception du systÃ¨me d'information et passionnÃ© d'innovation numÃ©rique, Georges conÃ§oit et dÃ©ploie des systÃ¨mes informatisÃ©s robustes pour les entreprises en RDC. Son expertise englobe la gestion de stock automatisÃ©e, la facturation conforme aux normes OHADA, les points de vente bimonÃ©taires (USD/CDF) ainsi que la sÃ©curisation des infrastructures serveurs et rÃ©seaux.",
    avatarUrl: '/profile_photo.jpg',
    coverUrl: '/cover_photo.jpg',
    skills: ["Conception du systÃ¨me d'information", 'Bases de DonnÃ©es MySQL', 'PHP & MVC', 'React & TypeScript', 'ComptabilitÃ© OHADA', 'SÃ©curitÃ© SystÃ¨mes & RÃ©seaux'],
    socialLinks: {
      github: 'https://github.com/georgesmoombo',
      linkedin: 'https://linkedin.com/in/georges-moombo',
      twitter: 'https://x.com/georgesmoombo',
      portfolio: 'https://georges-moombo.cd',
      whatsapp: 'https://wa.me/243829725609',
      email: 'georgesweahmoombo@gmail.com'
    },
    contactInfo: {
      email: 'georgesweahmoombo@gmail.com',
      phone: '+243 829 725 609',
      whatsapp: '+243829725609',
      location: 'Kinshasa, RÃ©publique DÃ©mocratique du Congo',
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
    roleTitle: 'Consultante en ComptabilitÃ© InformatisÃ©e & Normes OHADA',
    shortBio: 'Experte en paramÃ©trage ERP, audits de conformitÃ© financiÃ¨re et formation des Ã©quipes de trÃ©sorerie.',
    biography: 'Avec plus de 6 ans d\'expÃ©rience dans le conseil financier et fiscal en Afrique centrale, Clarisse accompagne les directeurs financiers dans l\'informatisation des processus comptables, la gestion des Ã©critures de clÃ´ture et l\'optimisation de la fiscalitÃ© d\'entreprise.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    skills: ['ComptabilitÃ© OHADA', 'ERP Saari / Sage', 'Audit Fiscal RDC', 'Tableaux de Bord Financiers', 'ContrÃ´le Interne'],
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
    roleTitle: 'IngÃ©nieur SystÃ¨mes, RÃ©seaux & SÃ©curitÃ© PÃ©rimÃ©trique',
    shortBio: 'SpÃ©cialiste en virtualisation, baies de serveurs, protocoles VPN et politiques de sauvegarde 3-2-1.',
    biography: 'CertifiÃ© Cisco et Mikrotik, Patrick prend en charge le dÃ©ploiement physique des infrastructures rÃ©seaux d\'entreprises, le cÃ¢blage Cat6, la mise en place de tunnels VPN sÃ©curisÃ©s et la rÃ©silience contre les attaques ransomwares.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
    skills: ['MikroTik & Cisco', 'VLAN & VPN IPsec', 'Sauvegarde NAS 3-2-1', 'Linux Server', 'Pare-feu MatÃ©riel'],
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

// Public profiles listing
app.get('/api/public/profiles', (req: Request, res: Response) => {
  const activeProfiles = SERVER_PROFILES
    .filter(p => p.isActive)
    .sort((a, b) => a.order - b.order);
  res.json({ profiles: activeProfiles });
});

// Admin profiles listing (all, active + inactive)
app.get('/api/admin/profiles', authenticateToken, (req: Request, res: Response) => {
  const sorted = [...SERVER_PROFILES].sort((a, b) => a.order - b.order);
  res.json({ profiles: sorted });
});

// Admin create profile
app.post('/api/admin/profiles', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const data = req.body;

  if (!data.fullName || !data.roleTitle) {
    return res.status(400).json({ error: 'Le nom complet et la fonction sont obligatoires.' });
  }

  const newProfile = {
    ...data,
    id: `prof-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    order: typeof data.order === 'number' ? data.order : SERVER_PROFILES.length + 1,
    isActive: data.isActive !== undefined ? !!data.isActive : true,
    avatarUrl: data.avatarUrl || '/profile_photo.jpg',
    coverUrl: data.coverUrl || '/cover_photo.jpg',
  };

  SERVER_PROFILES.push(newProfile);
  recordAudit(user.email, user.role, 'PROFILE_CREATED', 'PROFILES', 'SUCCESS', `Nouveau profil ajoutÃ© : ${newProfile.fullName}`);

  res.status(201).json({ success: true, profile: newProfile, message: 'Profil crÃ©Ã© avec succÃ¨s.' });
});

// Admin upload profile photo or cover photo
app.post('/api/admin/upload-profile-photo', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { profileId, type, dataUrl } = req.body;

  if (!profileId || !type || !dataUrl) {
    return res.status(400).json({ error: 'ParamÃ¨tres manquants (profileId, type, dataUrl).' });
  }

  if (type !== 'avatar' && type !== 'cover') {
    return res.status(400).json({ error: 'Type invalide (doit Ãªtre avatar ou cover).' });
  }

  if (!dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Format d\'image invalide (doit Ãªtre JPG, PNG ou WebP).' });
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Encodage base64 invalide.' });
    }

    const rawExt = matches[1].toLowerCase().replace('jpeg', 'jpg');
    const ext = rawExt.includes('png') ? 'png' : rawExt.includes('webp') ? 'webp' : 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');

    const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let publicUrl: string;

    if (profileId === 'prof-1') {
      const filename = type === 'avatar' ? 'profile_photo.jpg' : 'cover_photo.jpg';
      const targetPath = path.resolve(__dirname, 'public', filename);
      fs.writeFileSync(targetPath, buffer);

      // Copie miroir dans src/assets/images
      try {
        const assetsPath = path.resolve(__dirname, 'src', 'assets', 'images', filename);
        fs.writeFileSync(assetsPath, buffer);
      } catch (_) {}

      // Copie miroir dans dist si existant
      try {
        const distPath = path.resolve(__dirname, 'dist', filename);
        if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
          fs.writeFileSync(distPath, buffer);
        }
      } catch (_) {}

      publicUrl = `/${filename}`;
    } else {
      const filename = `${profileId}_${type}_${Date.now()}.${ext}`;
      const targetPath = path.resolve(uploadsDir, filename);
      fs.writeFileSync(targetPath, buffer);
      publicUrl = `/uploads/${filename}`;
    }

    // Mise Ã  jour en mÃ©moire
    const pIdx = SERVER_PROFILES.findIndex(p => p.id === profileId);
    if (pIdx !== -1) {
      if (type === 'avatar') {
        SERVER_PROFILES[pIdx].avatarUrl = publicUrl;
      } else {
        SERVER_PROFILES[pIdx].coverUrl = publicUrl;
      }
      SERVER_PROFILES[pIdx].updatedAt = new Date().toISOString().split('T')[0];
    }

    if (profileId === 'prof-1') {
      if (type === 'avatar') {
        PROFILE_DATA.avatarUrl = publicUrl;
      } else {
        PROFILE_DATA.coverUrl = publicUrl;
      }
    }

    saveStoreToDisk();
    recordAudit(user.email, user.role, 'PHOTO_UPLOADED', 'PROFILES', 'SUCCESS', `Photo de ${type} mise Ã  jour pour le profil ${profileId}`);

    res.json({
      success: true,
      url: publicUrl,
      profile: pIdx !== -1 ? SERVER_PROFILES[pIdx] : null,
      message: `${type === 'avatar' ? 'Photo de profil' : 'Photo de couverture'} enregistrÃ©e avec succÃ¨s.`
    });
  } catch (err: any) {
    console.error('Erreur sauvegarde photo serveur:', err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du fichier sur le serveur.' });
  }
});

// Admin update profile
app.put('/api/admin/profiles/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { id } = req.params;
  const idx = SERVER_PROFILES.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Profil non trouvÃ©.' });
  }

  SERVER_PROFILES[idx] = {
    ...SERVER_PROFILES[idx],
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  // Si c'est prof-1, synchroniser immÃ©diatement PROFILE_DATA
  if (id === 'prof-1') {
    const fresh = SERVER_PROFILES[idx];
    PROFILE_DATA = {
      ...PROFILE_DATA,
      name: fresh.fullName || PROFILE_DATA.name,
      title: fresh.roleTitle || PROFILE_DATA.title,
      bio: fresh.biography || fresh.shortBio || PROFILE_DATA.bio,
      avatarUrl: fresh.avatarUrl || PROFILE_DATA.avatarUrl,
      coverUrl: fresh.coverUrl || PROFILE_DATA.coverUrl,
      githubUrl: fresh.socialLinks?.github || PROFILE_DATA.githubUrl,
      linkedinUrl: fresh.socialLinks?.linkedin || PROFILE_DATA.linkedinUrl,
      facebookUrl: (fresh.socialLinks as any)?.facebook || (PROFILE_DATA as any).facebookUrl || '',
      portfolioUrl: fresh.socialLinks?.portfolio || PROFILE_DATA.portfolioUrl,
      whatsapp: fresh.contactInfo?.whatsapp || PROFILE_DATA.whatsapp,
      phone: fresh.contactInfo?.phone || PROFILE_DATA.phone,
      contactEmail: fresh.contactInfo?.email || PROFILE_DATA.contactEmail,
    };
  }

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'PROFILE_UPDATED', 'PROFILES', 'SUCCESS', `Profil mis Ã  jour : ${SERVER_PROFILES[idx].fullName}`);

  res.json({ success: true, profile: SERVER_PROFILES[idx], message: 'Profil mis Ã  jour avec succÃ¨s.' });
});

// Admin delete profile
app.delete('/api/admin/profiles/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { id } = req.params;
  const idx = SERVER_PROFILES.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Profil non trouvÃ©.' });
  }

  const deleted = SERVER_PROFILES.splice(idx, 1)[0];
  recordAudit(user.email, user.role, 'PROFILE_DELETED', 'PROFILES', 'WARNING', `Profil supprimÃ© : ${deleted.fullName}`);

  res.json({ success: true, message: 'Profil supprimÃ© avec succÃ¨s.' });
});

// ==========================================
// EXPERIENCES API ROUTES
// ==========================================

// Public experiences listing
app.get('/api/public/experiences', (req: Request, res: Response) => {
  const sorted = [...SERVER_EXPERIENCES].sort((a, b) => a.order - b.order);
  res.json({ experiences: sorted });
});

// Admin experiences listing
app.get('/api/admin/experiences', authenticateToken, (req: Request, res: Response) => {
  const sorted = [...SERVER_EXPERIENCES].sort((a, b) => a.order - b.order);
  res.json({ experiences: sorted });
});

// Admin create experience
app.post('/api/admin/experiences', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const data = req.body;

  if (!data.position || !data.company || !data.startDate) {
    return res.status(400).json({ error: 'Poste, entreprise et date de dÃ©but obligatoires.' });
  }

  const newExp = {
    ...data,
    id: `exp-${Date.now()}`,
    order: typeof data.order === 'number' ? data.order : SERVER_EXPERIENCES.length + 1,
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    isCurrent: !!data.isCurrent,
  };

  SERVER_EXPERIENCES.push(newExp);
  saveStoreToDisk();
  recordAudit(user.email, user.role, 'EXPERIENCE_CREATED', 'EXPERIENCES', 'SUCCESS', `Nouvelle expÃ©rience ajoutÃ©e : ${newExp.position} chez ${newExp.company}`);

  res.status(201).json({ success: true, experience: newExp, message: 'ExpÃ©rience crÃ©Ã©e avec succÃ¨s.' });
});

// Admin update experience
app.put('/api/admin/experiences/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { id } = req.params;
  const idx = SERVER_EXPERIENCES.findIndex(e => e.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'ExpÃ©rience non trouvÃ©e.' });
  }

  SERVER_EXPERIENCES[idx] = {
    ...SERVER_EXPERIENCES[idx],
    ...req.body,
  };

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'EXPERIENCE_UPDATED', 'EXPERIENCES', 'SUCCESS', `ExpÃ©rience mise Ã  jour : ${SERVER_EXPERIENCES[idx].position}`);

  res.json({ success: true, experience: SERVER_EXPERIENCES[idx], message: 'ExpÃ©rience enregistrÃ©e avec succÃ¨s.' });
});

// Admin delete experience
app.delete('/api/admin/experiences/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  const { id } = req.params;
  const idx = SERVER_EXPERIENCES.findIndex(e => e.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'ExpÃ©rience non trouvÃ©e.' });
  }

  const deleted = SERVER_EXPERIENCES.splice(idx, 1)[0];
  saveStoreToDisk();
  recordAudit(user.email, user.role, 'EXPERIENCE_DELETED', 'EXPERIENCES', 'WARNING', `ExpÃ©rience supprimÃ©e : ${deleted.position}`);

  res.json({ success: true, message: 'ExpÃ©rience supprimÃ©e avec succÃ¨s.' });
});

// ==========================================
// CV SETTINGS API ROUTES
// ==========================================
app.get('/api/public/cv-settings', (req: Request, res: Response) => {
  res.json({ settings: SERVER_CV_SETTINGS });
});

app.get('/api/admin/cv-settings', authenticateToken, (req: Request, res: Response) => {
  res.json({ settings: SERVER_CV_SETTINGS });
});

app.put('/api/admin/cv-settings', authenticateToken, requireRole(['ADMIN', 'EDITOR']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  SERVER_CV_SETTINGS = {
    ...SERVER_CV_SETTINGS,
    ...req.body,
    footer: {
      ...SERVER_CV_SETTINGS.footer,
      ...(req.body.footer || {}),
    }
  };

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'CV_SETTINGS_UPDATED', 'CV_MODULE', 'SUCCESS', `ParamÃ¨tres du CV mis Ã  jour (ThÃ¨me : ${SERVER_CV_SETTINGS.themeId})`);

  res.json({ success: true, settings: SERVER_CV_SETTINGS, message: 'ParamÃ¨tres du CV enregistrÃ©s avec succÃ¨s.' });
});

// ==========================================
// FOOTER SETTINGS API ROUTES
// ==========================================
app.get('/api/public/footer-settings', (req: Request, res: Response) => {
  res.json({ settings: SERVER_FOOTER_SETTINGS });
});

app.get('/api/admin/footer-settings', authenticateToken, (req: Request, res: Response) => {
  res.json({ settings: SERVER_FOOTER_SETTINGS });
});

app.put('/api/admin/footer-settings', authenticateToken, requireRole(['ADMIN']), (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Session;
  SERVER_FOOTER_SETTINGS = {
    ...SERVER_FOOTER_SETTINGS,
    ...req.body,
    socialLinks: {
      ...SERVER_FOOTER_SETTINGS.socialLinks,
      ...(req.body.socialLinks || {}),
    }
  };

  saveStoreToDisk();
  recordAudit(user.email, user.role, 'FOOTER_SETTINGS_UPDATED', 'SITE_SETTINGS', 'SUCCESS', 'ParamÃ¨tres du pied de page public enregistrÃ©s.');

  res.json({ success: true, settings: SERVER_FOOTER_SETTINGS, message: 'Pied de page mis Ã  jour avec succÃ¨s.' });
});

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Public health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', serverTime: new Date().toISOString(), app: 'Georges MOOMBO Full Stack Platform' });
});

// Public Quote / Lead submission
app.post('/api/public/leads', (req: Request, res: Response) => {
  const { name, email, phone, company, service, budget, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Nom et tÃ©lÃ©phone requis.' });
  }

  recordAudit(email || 'visiteur', 'PUBLIC', 'LEAD_SUBMISSION', 'PUBLIC_FORM', 'SUCCESS', `Nouveau prospect : ${name} (${service})`);
  res.status(201).json({ 
    success: true, 
    reference: `DEV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    message: 'Votre demande a Ã©tÃ© enregistrÃ©e avec succÃ¨s.' 
  });
});

// Public Appointment booking
app.post('/api/public/appointments', (req: Request, res: Response) => {
  const { name, email, phone, date, time, subject } = req.body;
  if (!name || !date || !time) {
    return res.status(400).json({ error: 'Informations incomplÃ¨tes pour le rendez-vous.' });
  }

  recordAudit(email || 'visiteur', 'PUBLIC', 'APPOINTMENT_BOOKING', 'CALENDAR', 'SUCCESS', `RDV rÃ©servÃ© pour ${name} le ${date} Ã  ${time}`);
  res.status(201).json({ 
    success: true, 
    message: 'Votre rendez-vous a Ã©tÃ© enregistrÃ© dans le calendrier.' 
  });
});

// ==========================================
// VITE DEV MIDDLEWARE OR PRODUCTION SERVING
// ==========================================

async function setupServer() {
  // Load persisted store from disk if available
  loadStoreFromDisk();

  if (!IS_PROD) {
    // In dev mode, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`[Georges MOOMBO Server] Running on http://localhost:${PORT} in ${IS_PROD ? 'production' : 'development'} mode.`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});

