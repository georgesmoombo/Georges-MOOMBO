import React, { useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { Link } from '../../router/RouterContext';
import { 
  UserCheck, Plus, Search, Edit3, Trash2, Eye, 
  Upload, X, Check, Globe, Github, Linkedin, 
  Twitter, Phone, Mail, MapPin, Sparkles, AlertTriangle, 
  ArrowUp, ArrowDown, ExternalLink, Image as ImageIcon, Camera, RotateCcw, Loader2 
} from 'lucide-react';
import { ProfileItem } from '../../types/crm';
import { processImageFile, saveMediaToIndexedDB } from '../../utils/mediaStorage';

export const ProfilesPage: React.FC = () => {
  const { profiles, addProfile, updateProfile, deleteProfile, toggleProfileActive } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileItem | null>(null);
  const [previewProfile, setPreviewProfile] = useState<ProfileItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    fullName: string;
    roleTitle: string;
    shortBio: string;
    biography: string;
    avatarUrl: string;
    coverUrl: string;
    skills: string;
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    whatsapp: string;
    publicEmail: string;
    phone: string;
    location: string;
    showPublicly: boolean;
    isActive: boolean;
    order: number;
  }>({
    fullName: '',
    roleTitle: '',
    shortBio: '',
    biography: '',
    avatarUrl: '',
    coverUrl: '',
    skills: '',
    github: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    portfolio: '',
    whatsapp: '',
    publicEmail: '',
    phone: '',
    location: '',
    showPublicly: true,
    isActive: true,
    order: 1,
  });

  const sortedProfiles = [...profiles].sort((a, b) => a.order - b.order);

  const filteredProfiles = sortedProfiles.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.shortBio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [uploadStatus, setUploadStatus] = useState<{ field: string; message: string; isError?: boolean } | null>(null);

  // Modal dédié de changement rapide de photo (profil ou couverture) avec aperçu, validation, annulation
  const [photoModal, setPhotoModal] = useState<{
    profile: ProfileItem;
    type: 'avatarUrl' | 'coverUrl';
    previewUrl: string;
    originalUrl: string;
    fileName?: string;
    fileSizeKb?: number;
    isProcessing?: boolean;
    error?: string;
    success?: string;
  } | null>(null);

  const handleOpenPhotoChange = (profile: ProfileItem, type: 'avatarUrl' | 'coverUrl') => {
    setPhotoModal({
      profile,
      type,
      previewUrl: type === 'avatarUrl' ? (profile.avatarUrl || '/profile_photo.jpg') : (profile.coverUrl || '/cover_photo.jpg'),
      originalUrl: type === 'avatarUrl' ? (profile.avatarUrl || '/profile_photo.jpg') : (profile.coverUrl || '/cover_photo.jpg'),
    });
  };

  const handlePhotoModalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoModal) return;

    try {
      setPhotoModal(prev => prev ? ({ ...prev, isProcessing: true, error: undefined, success: undefined }) : null);

      const processed = await processImageFile(file, {
        maxDimension: photoModal.type === 'coverUrl' ? 1920 : 1200,
        quality: 0.92,
      });

      setPhotoModal(prev => prev ? ({
        ...prev,
        previewUrl: processed.dataUrl,
        fileName: file.name,
        fileSizeKb: processed.sizeKb,
        isProcessing: false,
        success: `Image prête (${processed.sizeKb} Ko). Couleurs naturelles préservées. Cliquez sur "Enregistrer les modifications" pour valider.`
      }) : null);
    } catch (err: any) {
      console.error(err);
      setPhotoModal(prev => prev ? ({
        ...prev,
        isProcessing: false,
        error: err.message || 'Erreur lors du traitement du fichier.',
      }) : null);
    }
  };

  const handleConfirmPhotoChange = async () => {
    if (!photoModal) return;
    try {
      setPhotoModal(prev => prev ? ({ ...prev, isProcessing: true }) : null);

      // Persistance IndexedDB
      await saveMediaToIndexedDB(`profile_${photoModal.type}_${Date.now()}`, photoModal.previewUrl);

      // Mise à jour du profil via CrmContext
      const updatedProfile: ProfileItem = {
        ...photoModal.profile,
        [photoModal.type]: photoModal.previewUrl,
      };
      updateProfile(updatedProfile);

      setPhotoModal(prev => prev ? ({
        ...prev,
        isProcessing: false,
        success: '✓ Enregistrement réussi ! Votre photo est mise à jour immédiatement sur le site.'
      }) : null);

      setTimeout(() => {
        setPhotoModal(null);
      }, 1500);
    } catch (err: any) {
      setPhotoModal(prev => prev ? ({
        ...prev,
        isProcessing: false,
        error: 'Échec lors de l\'enregistrement : ' + (err.message || 'erreur inconnue')
      }) : null);
    }
  };

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setUploadStatus(null);
    setFormData({
      fullName: '',
      roleTitle: '',
      shortBio: '',
      biography: '',
      avatarUrl: '/profile_photo.jpg',
      coverUrl: '/cover_photo.jpg',
      skills: 'Informatique de Gestion, MySQL, PHP, React',
      github: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      portfolio: '',
      whatsapp: '+243',
      publicEmail: '',
      phone: '+243',
      location: 'Kinshasa, RDC',
      showPublicly: true,
      isActive: true,
      order: profiles.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProfileItem) => {
    setEditingProfile(p);
    setUploadStatus(null);
    setFormData({
      fullName: p.fullName,
      roleTitle: p.roleTitle,
      shortBio: p.shortBio,
      biography: p.biography,
      avatarUrl: p.avatarUrl || '/profile_photo.jpg',
      coverUrl: p.coverUrl || '/cover_photo.jpg',
      skills: p.skills.join(', '),
      github: p.socialLinks.github || '',
      linkedin: p.socialLinks.linkedin || '',
      facebook: (p.socialLinks as any).facebook || '',
      twitter: p.socialLinks.twitter || '',
      portfolio: p.socialLinks.portfolio || '',
      whatsapp: p.contactInfo.whatsapp || '',
      publicEmail: p.contactInfo.email || '',
      phone: p.contactInfo.phone || '',
      location: p.contactInfo.location || '',
      showPublicly: p.contactInfo.showPublicly,
      isActive: p.isActive,
      order: p.order,
    });
    setIsModalOpen(true);
  };

  // Image Upload handler avec traitement haute fidélité sans filtre artificiel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus({ 
        field, 
        message: 'Traitement de la photo et optimisation sans altération de couleurs...' 
      });

      const processed = await processImageFile(file, {
        maxDimension: field === 'coverUrl' ? 1920 : 1200,
        quality: 0.92,
      });

      setFormData(prev => ({ ...prev, [field]: processed.dataUrl }));
      
      // Double sauvegarde dans IndexedDB pour garantir une persistance totale même après rafraîchissement
      await saveMediaToIndexedDB(`profile_${field}_${Date.now()}`, processed.dataUrl);

      setUploadStatus({ 
        field, 
        message: `✓ Photo chargée (${processed.sizeKb} Ko) - Couleurs naturelles préservées.` 
      });
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      console.error('Erreur téléversement:', err);
      setUploadStatus({ 
        field, 
        message: err.message || 'Erreur lors de la lecture du fichier.', 
        isError: true 
      });
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const profilePayload: Omit<ProfileItem, 'id' | 'createdAt' | 'updatedAt'> = {
      fullName: formData.fullName,
      roleTitle: formData.roleTitle,
      shortBio: formData.shortBio,
      biography: formData.biography,
      avatarUrl: formData.avatarUrl || '/profile_photo.jpg',
      coverUrl: formData.coverUrl || '/cover_photo.jpg',
      skills: skillsArray,
      socialLinks: {
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined,
        facebook: formData.facebook || undefined,
        twitter: formData.twitter || undefined,
        portfolio: formData.portfolio || undefined,
        whatsapp: formData.whatsapp || undefined,
        email: formData.publicEmail || undefined,
      },
      contactInfo: {
        email: formData.publicEmail || undefined,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        location: formData.location || undefined,
        showPublicly: formData.showPublicly,
      },
      isActive: formData.isActive,
      order: Number(formData.order) || 1,
    };

    if (editingProfile) {
      updateProfile({
        ...editingProfile,
        ...profilePayload,
      });
    } else {
      addProfile(profilePayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous certain de vouloir supprimer définitivement le profil "${name}" ?`)) {
      deleteProfile(id);
    }
  };

  return (
    <AdminLayout activeNav="profiles">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Gestion des Profils & Identités Visuelles ({profiles.length})
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Chaque profil dispose de sa propre photo de couverture, photo de profil, biographie et coordonnées.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/#profils"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-400" /> Voir sur le site
            </Link>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Ajouter un profil
            </button>
          </div>
        </div>

        {/* Search and stats bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              Profils actifs : <strong className="text-emerald-400">{profiles.filter(p => p.isActive).length}</strong>
            </span>
            <span className="text-slate-400">
              Profils masqués : <strong className="text-amber-400">{profiles.filter(p => !p.isActive).length}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un profil..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className={`bg-slate-900 rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                p.isActive ? 'border-slate-800 hover:border-blue-500/50' : 'border-amber-500/30 opacity-75'
              }`}
            >
              {/* Cover Banner */}
              <div className="relative h-32 bg-slate-950 overflow-hidden">
                <img
                  src={p.coverUrl}
                  alt={`Couverture de ${p.fullName}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                {/* Active Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                    p.isActive 
                      ? 'bg-emerald-500/80 text-white' 
                      : 'bg-amber-500/80 text-slate-950'
                  }`}>
                    {p.isActive ? 'Publié' : 'Masqué'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-slate-900/80 text-slate-300 backdrop-blur-md">
                    Ordre : {p.order}
                  </span>
                </div>
              </div>

              {/* Avatar & Main Info */}
              <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Overlapping Avatar */}
                  <div className="-mt-12 mb-3 flex items-end justify-between">
                    <div className="relative">
                      <img
                        src={p.avatarUrl}
                        alt={p.fullName}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      {p.isActive && (
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Actif"></span>
                      )}
                    </div>

                    <button
                      onClick={() => setPreviewProfile(p)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Prévisualiser"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Aperçu</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg">{p.fullName}</h3>
                    <p className="text-xs text-blue-400 font-semibold">{p.roleTitle}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {p.shortBio}
                    </p>
                  </div>

                  {/* Boutons distincts pour modifier la photo de profil et la photo de couverture via l'explorateur de fichiers */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenPhotoChange(p, 'avatarUrl')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-blue-600/20 hover:text-blue-400 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700/60 cursor-pointer"
                      title="Ouvrir l'explorateur de fichiers pour changer la photo de profil"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Photo de profil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPhotoChange(p, 'coverUrl')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700/60 cursor-pointer"
                      title="Ouvrir l'explorateur de fichiers pour changer la photo de couverture"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Photo couverture</span>
                    </button>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800">
                    {p.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                    {p.skills.length > 3 && (
                      <span className="text-[10px] text-slate-500">+{p.skills.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleProfileActive(p.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                      p.isActive 
                        ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {p.isActive ? 'Masquer' : 'Publier'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Modifier les informations et photos"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id, p.fullName)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Supprimer ce profil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MODAL ADD / EDIT ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {editingProfile ? 'Modifier le profil' : 'Créer un nouveau profil'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Téléversez les photos et renseignez les compétences et coordonnées.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. VISUAL IDENTITY (COVER + AVATAR) */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-300 block">
                      1. Identité Visuelle (Photos Réelles & Couverture Naturelle)
                    </span>
                    <span className="text-[11px] text-blue-400 font-medium">
                      Couleurs naturelles préservées • Aucun avatar IA • Zéro distorsion
                    </span>
                  </div>

                  {uploadStatus && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      uploadStatus.isError 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {uploadStatus.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                      <span>{uploadStatus.message}</span>
                    </div>
                  )}

                  {/* Cover Photo */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-400">
                        Photo de Couverture (Bannière)
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverUrl: '/cover_photo.jpg' }))}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        title="Utiliser public/cover_photo.jpg"
                      >
                        <RotateCcw className="w-3 h-3" /> Utiliser ma couverture réelle (/cover_photo.jpg)
                      </button>
                    </div>

                    <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                      {formData.coverUrl ? (
                        <img 
                          src={formData.coverUrl} 
                          alt="Aperçu couverture" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                          Aucune couverture définie
                        </div>
                      )}
                      {formData.coverUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverUrl: '' }))}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-700 text-xs"
                          title="Supprimer la couverture"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors flex-shrink-0">
                        <Upload className="w-3.5 h-3.5 text-blue-400" /> Choisir une couverture sur mon PC
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'coverUrl')}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.coverUrl}
                        onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                        placeholder="Ex: /cover_photo.jpg ou fichier local..."
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-400">
                        Photo de Profil Réelle (Portrait Professionnel)
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '/profile_photo.jpg' }))}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        title="Utiliser public/profile_photo.jpg"
                      >
                        <RotateCcw className="w-3 h-3" /> Utiliser ma photo réelle (/profile_photo.jpg)
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                        {formData.avatarUrl ? (
                          <img 
                            src={formData.avatarUrl} 
                            alt="Aperçu photo de profil" 
                            className="w-full h-full object-cover object-top" 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            Avatar
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors flex-shrink-0">
                            <Camera className="w-3.5 h-3.5 text-blue-400" /> Choisir une photo sur mon PC
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'avatarUrl')}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={formData.avatarUrl}
                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                            placeholder="Ex: /profile_photo.jpg ou fichier local..."
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. GENERAL INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ex: Georges MOOMBO MODEAWI"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Titre / Fonction *</label>
                    <input
                      type="text"
                      required
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                      placeholder="Ex: Développeur Full Stack & Spécialiste IT"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Courte présentation *</label>
                    <input
                      type="text"
                      required
                      value={formData.shortBio}
                      onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                      placeholder="Une phrase percutante décrivant la proposition de valeur..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Biographie complète *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.biography}
                      onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                      placeholder="Parcours professionnel, réalisations clés, vision technique et engagements..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Compétences (séparées par virgules) *</label>
                    <input
                      type="text"
                      required
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="Ex: Informatique de Gestion, MySQL, PHP, React, Cybersécurité"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 3. SOCIAL NETWORKS & CONTACT */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <span className="text-xs font-bold uppercase text-slate-300 block">
                    3. Réseaux Sociaux & Coordonnées
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">GitHub</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Twitter / X</label>
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://x.com/..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Site / Portfolio</label>
                      <input
                        type="url"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email Public</label>
                      <input
                        type="email"
                        value={formData.publicEmail}
                        onChange={(e) => setFormData({ ...formData, publicEmail: e.target.value })}
                        placeholder="contact@domaine.cd"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">WhatsApp / Téléphone</label>
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+243 829 725 609"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Localisation / Ville</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Kinshasa, RDC"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.showPublicly}
                          onChange={(e) => setFormData({ ...formData, showPublicly: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Afficher les coordonnées publiquement</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. VISIBILITY & ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <label className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-white block">Statut Actif (Publié)</span>
                      <span className="text-[10px] text-slate-400">Rendre visible sur le portfolio public</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Ordre d'affichage</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {editingProfile ? 'Mettre à jour le profil' : 'Créer et publier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL LIVE PREVIEW ================= */}
        {previewProfile && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" /> Prévisualisation Rendu Public
                </span>
                <button onClick={() => setPreviewProfile(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Card Preview */}
              <div className="p-6 pt-0">
                <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-lg">
                  <div className="h-36 relative bg-slate-900">
                    <img src={previewProfile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 pt-0 relative">
                    <div className="-mt-14 mb-3 flex items-end justify-between">
                      <img
                        src={previewProfile.avatarUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-800"
                      />
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        {previewProfile.isActive ? 'Profil Actif' : 'Masqué'}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-white">{previewProfile.fullName}</h4>
                    <p className="text-xs text-blue-400 font-bold">{previewProfile.roleTitle}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{previewProfile.shortBio}</p>

                    <div className="my-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-white block mb-1">Biographie :</span>
                      {previewProfile.biography}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {previewProfile.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>

                    {previewProfile.contactInfo.showPublicly && (
                      <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                        {previewProfile.contactInfo.email && <div>📧 {previewProfile.contactInfo.email}</div>}
                        {previewProfile.contactInfo.phone && <div>📞 {previewProfile.contactInfo.phone}</div>}
                        {previewProfile.contactInfo.location && <div>📍 {previewProfile.contactInfo.location}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950">
                <button
                  onClick={() => setPreviewProfile(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Fermer l'aperçu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL DÉDIÉ : MODIFIER LA PHOTO (PROFIL OU COUVERTURE) ================= */}
        {photoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
              
              {/* Entête */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    photoModal.type === 'avatarUrl' ? 'bg-blue-600/20 text-blue-400' : 'bg-indigo-600/20 text-indigo-400'
                  }`}>
                    {photoModal.type === 'avatarUrl' ? <Camera className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {photoModal.type === 'avatarUrl' ? 'Modifier la photo de profil' : 'Modifier la photo de couverture'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Profil : <strong className="text-slate-200">{photoModal.profile.fullName}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPhotoModal(null)}
                  disabled={photoModal.isProcessing}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages d'état */}
              {photoModal.error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{photoModal.error}</span>
                </div>
              )}

              {photoModal.success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{photoModal.success}</span>
                </div>
              )}

              {/* Cadre d'aperçu haute fidélité */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Aperçu en direct (Couleurs naturelles • Zéro distorsion)
                </span>

                <div className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center ${
                  photoModal.type === 'avatarUrl' ? 'h-52 w-52 mx-auto rounded-3xl' : 'h-44 w-full'
                }`}>
                  <img
                    src={photoModal.previewUrl}
                    alt="Aperçu sélection"
                    className={`w-full h-full ${photoModal.type === 'avatarUrl' ? 'object-cover object-top' : 'object-cover object-center'}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = photoModal.type === 'avatarUrl' ? '/profile_photo.jpg' : '/cover_photo.jpg';
                    }}
                  />
                  {photoModal.isProcessing && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white text-xs">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      <span>Optimisation et encodage sans filtre...</span>
                    </div>
                  )}
                </div>

                {photoModal.fileName && (
                  <div className="text-[11px] text-slate-400 text-center font-mono">
                    Fichier sélectionné : <span className="text-slate-200">{photoModal.fileName}</span> ({photoModal.fileSizeKb} Ko)
                  </div>
                )}
              </div>

              {/* Commandes d'action & Input File de l'explorateur Windows */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/20">
                    <Upload className="w-4 h-4" />
                    <span>Choisir une autre image sur mon ordinateur</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoModalFileSelected}
                      disabled={photoModal.isProcessing}
                      className="hidden"
                    />
                  </label>

                  {/* Bouton raccourci pour restaurer la photo réelle de base */}
                  {photoModal.profile.id === 'prof-1' && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetPath = photoModal.type === 'avatarUrl' ? '/profile_photo.jpg' : '/cover_photo.jpg';
                        setPhotoModal(prev => prev ? ({
                          ...prev,
                          previewUrl: targetPath,
                          fileName: targetPath,
                          fileSizeKb: undefined,
                          error: undefined,
                          success: 'Fichier local réinitialisé vers ' + targetPath
                        }) : null);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Utiliser le fichier d'origine dans /public"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurer photo locale</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Formats acceptés : JPG, JPEG, PNG, WebP. L'image sera sauvegardée de façon permanente et visible instantanément sur le portfolio.
                </p>
              </div>

              {/* Boutons Confirmation / Annulation */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPhotoModal(null)}
                  disabled={photoModal.isProcessing}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler la modification
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPhotoChange}
                  disabled={photoModal.isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {photoModal.isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Enregistrer les modifications</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
