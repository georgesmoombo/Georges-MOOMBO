import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useAuth } from '../../auth/AuthContext';
import { useCrm } from '../../context/CrmContext';
import { useRouter } from '../../router/RouterContext';
import { 
  ShieldCheck, Lock, Eye, EyeOff, User, Settings as SettingsIcon, 
  Users, KeyRound, Smartphone, LogOut, CheckCircle2, AlertTriangle, 
  Save, RefreshCw, Download, Upload, Globe, DollarSign, Bell, 
  Trash2, Plus, Clock, ExternalLink, HelpCircle, HardDriveDownload, RotateCcw, Camera, Mail, Sliders, Palette 
} from 'lucide-react';
import { processImageFile, saveMediaToIndexedDB } from '../../utils/mediaStorage';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}

export const SettingsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, token, changeEmail } = useAuth();
  const { 
    adminProfile, updateAdminProfile, 
    systemSettings, updateSystemSettings,
    profiles, updateProfile,
    exportDatabaseAsJson, importDatabaseFromJson,
    resetToDemoData 
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'security' | 'profile' | 'system' | 'users'>('security');

  // --- TAB A: SECURITY STATE ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Email change state
  const [newLoginEmail, setNewLoginEmail] = useState('');
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState('');
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(systemSettings.twoFactorEnabled);
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [twoFAMessage, setTwoFAMessage] = useState<string | null>(null);

  // Logout other sessions
  const [isTerminatingSessions, setIsTerminatingSessions] = useState(false);
  const [sessionTerminatedMsg, setSessionTerminatedMsg] = useState<string | null>(null);

  // --- TAB B: PROFILE STATE ---
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // --- TAB C: SYSTEM PREFERENCES STATE ---
  const [settingsForm, setSettingsForm] = useState(systemSettings);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [importJsonInput, setImportJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // --- TAB D: USERS STATE ---
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'EDITOR' as 'ADMIN' | 'EDITOR', password: '' });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userActionMsg, setUserActionMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load backend profile & system users on mount
  useEffect(() => {
    fetchUsers();
    fetchBackendProfile();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchBackendProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfileForm(data.profile);
        }
      }
    } catch (err) {
      console.warn('Backend profile fallback to local', err);
    }
  };

  // Password rules validation
  const passRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(newPassword),
    matches: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isPasswordValid = 
    passRules.length && 
    passRules.uppercase && 
    passRules.lowercase && 
    passRules.number && 
    passRules.special && 
    passRules.matches;

  // Real backend email change
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailFeedback(null);

    const cleanEmail = newLoginEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailFeedback({
        type: 'error',
        message: 'Format d\'adresse e-mail invalide. Exemple: georges@domaine.cd'
      });
      return;
    }

    if (!emailPasswordConfirm) {
      setEmailFeedback({
        type: 'error',
        message: 'Veuillez saisir votre mot de passe actuel pour valider ce changement.'
      });
      return;
    }

    setIsChangingEmail(true);
    try {
      const res = await changeEmail(emailPasswordConfirm, cleanEmail);
      if (res.success) {
        setEmailFeedback({
          type: 'success',
          message: res.message || `Votre adresse e-mail de connexion a été modifiée avec succès en "${cleanEmail}".`
        });
        setNewLoginEmail('');
        setEmailPasswordConfirm('');
      } else {
        setEmailFeedback({
          type: 'error',
          message: res.error || 'Erreur lors du changement d\'adresse e-mail.'
        });
      }
    } catch (err: any) {
      setEmailFeedback({
        type: 'error',
        message: 'Erreur réseau de communication avec le serveur d\'authentification.'
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  // Real backend password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!isPasswordValid) {
      setPassFeedback({
        type: 'error',
        message: 'Veuillez respecter l\'ensemble des critères de sécurité du mot de passe.'
      });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPassFeedback({
          type: 'success',
          message: data.message || 'Mot de passe administrateur mis à jour avec succès.'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassFeedback({
          type: 'error',
          message: data.error || 'Erreur lors du changement de mot de passe.'
        });
      }
    } catch (err: any) {
      setPassFeedback({
        type: 'error',
        message: 'Erreur réseau de communication avec le serveur d\'authentification.'
      });
    } finally {
      setIsChangingPass(false);
    }
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = async () => {
    setIsTerminatingSessions(true);
    setSessionTerminatedMsg(null);
    try {
      const res = await fetch('/api/auth/logout-all-sessions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSessionTerminatedMsg(data.message || 'Sessions distantes révoquées.');
      }
    } catch (err) {
      setSessionTerminatedMsg('Erreur lors de la déconnexion des sessions.');
    } finally {
      setIsTerminatingSessions(false);
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    setIsToggling2FA(true);
    setTwoFAMessage(null);
    const targetState = !is2FAEnabled;
    try {
      const res = await fetch('/api/admin/toggle-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: targetState })
      });
      const data = await res.json();
      if (res.ok) {
        setIs2FAEnabled(targetState);
        updateSystemSettings({ twoFactorEnabled: targetState });
        setTwoFAMessage(data.message);
      }
    } catch (err) {
      setTwoFAMessage('Erreur lors de la modification du double facteur.');
    } finally {
      setIsToggling2FA(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(profileForm);

    // Sync with primary profile in public profiles catalog
    const mainProf = profiles.find(p => p.id === 'prof-1') || profiles[0];
    if (mainProf) {
      updateProfile({
        ...mainProf,
        fullName: profileForm.name,
        roleTitle: profileForm.title,
        biography: profileForm.bio,
        avatarUrl: profileForm.avatarUrl,
        coverUrl: profileForm.coverUrl || mainProf.coverUrl,
        contactInfo: {
          ...mainProf.contactInfo,
          email: profileForm.contactEmail,
          phone: profileForm.phone,
          whatsapp: profileForm.whatsapp,
          location: `${profileForm.city}, ${profileForm.country}`,
        },
        socialLinks: {
          ...mainProf.socialLinks,
          github: profileForm.githubUrl,
          linkedin: profileForm.linkedinUrl,
          portfolio: profileForm.portfolioUrl,
        }
      });
    }

    try {
      await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
    } catch (err) {
      console.warn('Backend sync error, saved locally');
    }

    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // Save System Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(settingsForm);

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
    } catch (err) {
      console.warn('Backend sync error, saved locally');
    }

    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 3000);
  };

  // Export DB
  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_moombo_platform_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import DB from file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const res = importDatabaseFromJson(content);
        if (res.success) {
          setImportStatus({ success: true, message: 'Restauration complète effectuée avec succès !' });
        } else {
          setImportStatus({ success: false, message: res.error || 'Erreur lors de la restauration.' });
        }
      }
    };
    reader.readAsText(file);
  };

  // Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserActionMsg({ type: 'success', message: 'Utilisateur créé avec succès !' });
        setNewUserForm({ name: '', email: '', role: 'EDITOR', password: '' });
        setIsAddingUser(false);
        fetchUsers();
      } else {
        setUserActionMsg({ type: 'error', message: data.error || 'Impossible d\'ajouter l\'utilisateur.' });
      }
    } catch (err) {
      setUserActionMsg({ type: 'error', message: 'Erreur réseau.' });
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserActionMsg({ type: 'success', message: 'Compte supprimé.' });
        fetchUsers();
      } else {
        setUserActionMsg({ type: 'error', message: data.error || 'Erreur de suppression.' });
      }
    } catch (err) {
      setUserActionMsg({ type: 'error', message: 'Erreur réseau.' });
    }
  };

  return (
    <AdminLayout activeNav="settings">
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <SettingsIcon className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Paramètres & Configuration Système
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Gestion de la sécurité d'accès, profil professionnel, préférences et administration RBAC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
              Admin : {user?.email}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>A. Sécurité du Compte</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-blue-400" />
            <span>B. Profil Administrateur</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-amber-400" />
            <span>C. Préférences & Sauvegarde</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>D. Comptes & Rôles (Super Admin)</span>
          </button>

          <button
            onClick={() => navigate('/admin/experiences')}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 bg-slate-900 text-blue-400 hover:text-white hover:bg-slate-800 border border-blue-900/40 transition-all cursor-pointer ml-auto"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Expériences & Carrière ➔</span>
          </button>

          <button
            onClick={() => navigate('/admin/footer-settings')}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 bg-slate-900 text-indigo-400 hover:text-white hover:bg-slate-800 border border-indigo-900/40 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Pied de Page & Thèmes CV ➔</span>
          </button>
        </div>

        {/* ================= TAB A: SÉCURITÉ DU COMPTE ================= */}
        {activeTab === 'security' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card 1: Modification de l'adresse e-mail de connexion */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" /> Adresse E-mail de Connexion Administrateur
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Modifiez l'adresse e-mail utilisée pour vous connecter à la console d'administration.
                  </p>
                </div>

                {/* Info badge with current email */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                      Adresse E-mail Actuelle de Connexion
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {user?.email || 'admin@moombo.cd'}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold w-fit">
                    ✓ Actif & Vérifié
                  </span>
                </div>

                {emailFeedback && (
                  <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs ${
                    emailFeedback.type === 'success'
                      ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                      : 'bg-red-500/15 border border-red-500/30 text-red-300'
                  }`}>
                    {emailFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {emailFeedback.type === 'success' ? 'Succès' : 'Attention'}
                      </span>
                      <p>{emailFeedback.message}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleChangeEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                      Nouvelle adresse e-mail de connexion *
                    </label>
                    <input
                      type="email"
                      required
                      value={newLoginEmail}
                      onChange={(e) => setNewLoginEmail(e.target.value)}
                      placeholder="exemple@votredomaine.cd"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                      Confirmation de sécurité : Votre mot de passe actuel *
                    </label>
                    <div className="relative">
                      <input
                        type={showEmailPass ? 'text' : 'password'}
                        required
                        value={emailPasswordConfirm}
                        onChange={(e) => setEmailPasswordConfirm(e.target.value)}
                        placeholder="Saisissez votre mot de passe pour confirmer"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white pr-10 focus:border-cyan-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmailPass(!showEmailPass)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showEmailPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingEmail || !newLoginEmail || !emailPasswordConfirm}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-600/25"
                  >
                    {isChangingEmail ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Mise à jour en cours...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Enregistrer la nouvelle adresse e-mail
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Card 2: Modification Sécurisée du Mot de Passe */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-blue-400" /> Modification Sécurisée du Mot de Passe
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Connecté au backend cryptographique (hachage PBKDF2 SHA-512 avec sel dynamique).
                  </p>
                </div>

              {passFeedback && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs ${
                  passFeedback.type === 'success'
                    ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                    : 'bg-red-500/15 border border-red-500/30 text-red-300'
                }`}>
                  {passFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {passFeedback.type === 'success' ? 'Succès' : 'Attention'}
                    </span>
                    <p>{passFeedback.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current password */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Ancien mot de passe actuel *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Saisissez votre mot de passe actuel"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white pr-10 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Nouveau mot de passe fort *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimum 8 caractères complexes"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white pr-10 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Confirmation du nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Répétez à l'identique le nouveau mot de passe"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white pr-10 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength checklist */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">
                    Règles obligatoires de sécurité :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-2 ${passRules.length ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Au moins 8 caractères
                    </div>
                    <div className={`flex items-center gap-2 ${passRules.uppercase ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 lettre majuscule (A-Z)
                    </div>
                    <div className={`flex items-center gap-2 ${passRules.lowercase ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 lettre minuscule (a-z)
                    </div>
                    <div className={`flex items-center gap-2 ${passRules.number ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 chiffre (0-9)
                    </div>
                    <div className={`flex items-center gap-2 ${passRules.special ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1 caractère spécial (!@#$...)
                    </div>
                    <div className={`flex items-center gap-2 ${passRules.matches ? 'text-green-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mots de passe identiques
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass || !isPasswordValid}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {isChangingPass ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Enregistrement cryptographique...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Mettre à jour le mot de passe
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Security Column */}
            <div className="space-y-6">
              
              {/* Sessions Management */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span>Gestion des Sessions Actives</span>
                </div>
                <p className="text-xs text-slate-400">
                  Déconnecte instantanément tous les autres appareils ou navigateurs distants connectés à votre compte.
                </p>

                {sessionTerminatedMsg && (
                  <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                    {sessionTerminatedMsg}
                  </div>
                )}

                <button
                  onClick={handleTerminateOtherSessions}
                  disabled={isTerminatingSessions}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  {isTerminatingSessions ? 'Révocation en cours...' : 'Fermer les autres sessions'}
                </button>
              </div>

              {/* 2FA Card */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Double Facteur (2FA)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    is2FAEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {is2FAEnabled ? 'Activé' : 'Désactivé'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Renforce l'authentification avec un code temporaire TOTP lors de la connexion administrateur.
                </p>

                {twoFAMessage && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                    {twoFAMessage}
                  </div>
                )}

                <button
                  onClick={handleToggle2FA}
                  disabled={isToggling2FA}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    is2FAEnabled
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  {isToggling2FA ? 'Traitement...' : is2FAEnabled ? 'Désactiver le double facteur' : 'Activer le double facteur'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB B: PROFIL ADMINISTRATEUR ================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" /> Identité du Propriétaire / Administrateur
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Coordonnées professionnelles publiques et canaux directs de contact.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" /> Informations enregistrées avec succès !
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Nom Complet
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Titre Professionnel & Positionnement
                </label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Biographie / Présentation Courte
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Email de Contact Public
                </label>
                <input
                  type="email"
                  value={profileForm.contactEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Email de Réception des Alertes & Notifications
                </label>
                <input
                  type="email"
                  value={profileForm.notificationEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, notificationEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Numéro WhatsApp (+243...)
                </label>
                <input
                  type="text"
                  value={profileForm.whatsapp}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Numéro Téléphone Fixe / Mobile
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Ville & Commune
                </label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Pays
                </label>
                <input
                  type="text"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  URL GitHub
                </label>
                <input
                  type="text"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  URL LinkedIn
                </label>
                <input
                  type="text"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    Photo de Profil Réelle (Portrait Professionnel)
                  </label>
                  <button
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, avatarUrl: '/profile_photo.jpg' }))}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> /profile_photo.jpg
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <img
                    src={profileForm.avatarUrl || '/profile_photo.jpg'}
                    alt="Aperçu avatar"
                    className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-slate-700 bg-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                        <Camera className="w-3.5 h-3.5 text-blue-400" /> Choisir une photo sur mon PC
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const res = await processImageFile(file, { maxDimension: 1200, quality: 0.92 });
                              setProfileForm(prev => ({ ...prev, avatarUrl: res.dataUrl }));
                              await saveMediaToIndexedDB(`settings_avatar_${Date.now()}`, res.dataUrl);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        placeholder="/profile_photo.jpg"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    Photo de Couverture Réelle
                  </label>
                  <button
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, coverUrl: '/cover_photo.jpg' }))}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> /cover_photo.jpg
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <img
                    src={profileForm.coverUrl || '/cover_photo.jpg'}
                    alt="Aperçu couverture"
                    className="w-20 h-14 rounded-2xl object-cover object-center border-2 border-slate-700 bg-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5 text-blue-400" /> Choisir une couverture sur mon PC
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const res = await processImageFile(file, { maxDimension: 1920, quality: 0.92 });
                              setProfileForm(prev => ({ ...prev, coverUrl: res.dataUrl }));
                              await saveMediaToIndexedDB(`settings_cover_${Date.now()}`, res.dataUrl);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={profileForm.coverUrl || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, coverUrl: e.target.value })}
                        placeholder="/cover_photo.jpg"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Save className="w-4 h-4" /> Enregistrer le profil
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB C: PRÉFÉRENCES SYSTÈME & SAUVEGARDE ================= */}
        {activeTab === 'system' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveSettings} className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-400" /> Préférences Régionales & Fonctionnelles
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Paramètres monétaires, fuseau horaire de Kinshasa et contrôles de maintenance.
                  </p>
                </div>

                {settingsSaveSuccess && (
                  <div className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Paramètres appliqués !
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Devise par Défaut
                  </label>
                  <select
                    value={settingsForm.defaultCurrency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultCurrency: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                  >
                    <option value="USD">USD ($ - Dollar Américain)</option>
                    <option value="CDF">CDF (FC - Franc Congolais)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Taux Indicatif USD / CDF
                  </label>
                  <input
                    type="number"
                    value={settingsForm.usdToCdfRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, usdToCdfRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">1 USD = {settingsForm.usdToCdfRate} CDF</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                    Fuseau Horaire
                  </label>
                  <input
                    type="text"
                    value={settingsForm.timezone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Mode Maintenance</span>
                    <span className="text-[10px] text-slate-400">Afficher un bandeau aux visiteurs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.maintenanceMode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Alertes par Email</span>
                    <span className="text-[10px] text-slate-400">Lors des nouveaux prospects et RDV</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.emailNotifications}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Signaux Sonores</span>
                    <span className="text-[10px] text-slate-400">Notifications temps réel</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.soundNotifications}
                    onChange={(e) => setSettingsForm({ ...settingsForm, soundNotifications: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" /> Appliquer les préférences
                </button>
              </div>
            </form>

            {/* Backup & Restore Card */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HardDriveDownload className="w-5 h-5 text-emerald-400" /> Sauvegarde & Restauration de la Base de Données
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exportez l'intégralité de vos prospects, factures, devis, projets et galerie au format JSON normalisé.
                </p>
              </div>

              {importStatus && (
                <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {importStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">1. Exporter la sauvegarde complète (JSON)</span>
                  <p className="text-[11px] text-slate-400">
                    Génère un instantané horodaté de toutes les tables, prêt à être archivé sur votre poste ou disque NAS sécurisé.
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Télécharger l'archive JSON
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">2. Importer / Restaurer un fichier JSON</span>
                  <p className="text-[11px] text-slate-400">
                    Restaure toutes les collections à partir d'une sauvegarde valide précédente.
                  </p>
                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-blue-400" /> Sélectionner un fichier JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-400 block">Réinitialisation des Données</span>
                    <span className="text-[10px] text-slate-500">Restaure les données de démonstration officielles</span>
                  </div>
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/20 transition-colors cursor-pointer"
                    >
                      Réinitialiser
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          resetToDemoData();
                          setShowResetConfirm(false);
                          setResetSuccess(true);
                          setTimeout(() => setResetSuccess(false), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Confirmer la réinitialisation
                      </button>
                    </div>
                  )}
                </div>
                {resetSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
                    ✓ Données réinitialisées avec succès aux valeurs officielles.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB D: GESTION DES UTILISATEURS / RÔLES ================= */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" /> Comptes Administrateurs & Éditeurs ({systemUsers.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gestion des privilèges RBAC (ADMIN avec contrôle total ou EDITOR pour la saisie des contenus).
                </p>
              </div>

              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> {isAddingUser ? 'Fermer le formulaire' : 'Ajouter un utilisateur'}
              </button>
            </div>

            {userActionMsg && (
              <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                userActionMsg.type === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {userActionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{userActionMsg.message}</span>
              </div>
            )}

            {/* Add User Form */}
            {isAddingUser && (
              <form onSubmit={handleAddUser} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <span className="font-bold text-white text-sm block">Création d'un nouveau compte</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      placeholder="Ex: Jean Mukendi"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      placeholder="email@domaine.cd"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Rôle</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    >
                      <option value="EDITOR">EDITOR (Rédacteur / CRM)</option>
                      <option value="ADMIN">ADMIN (Super Administrateur)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Mot de passe temporaire</label>
                    <input
                      type="password"
                      required
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      placeholder="Min. 8 caractères"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Créer le compte
                  </button>
                </div>
              </form>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Privilèges (Rôle)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {systemUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 text-xs font-bold">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.id !== user?.id ? (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            title="Supprimer ce compte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Compte actif</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Journal d'audit & tentatives d'accès disponible
              </span>
              <a
                href="/admin/security"
                className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
              >
                Consulter les logs de sécurité <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
