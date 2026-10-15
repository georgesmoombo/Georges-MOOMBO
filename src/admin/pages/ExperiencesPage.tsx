import React, { useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { 
  Briefcase, Plus, Calendar, Building, MapPin, 
  Trash2, Edit3, CheckCircle2, Award, Clock, ArrowUpDown, 
  ExternalLink, FileDown, CheckSquare, Square, AlertCircle, Save, X 
} from 'lucide-react';
import { 
  ProfessionalExperience, 
  formatExperienceDuration, 
  calculateNonOverlappingYears 
} from '../../types/crm';
import { generateCvPdf } from '../../utils/generateCvPdf';

export const ExperiencesPage: React.FC = () => {
  const { 
    experiences, 
    addExperience, 
    updateExperience, 
    deleteExperience, 
    cvSettings, 
    adminProfile, 
    profiles 
  } = useCrm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ProfessionalExperience | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievementsText: '',
    skillsText: '',
    location: 'Kinshasa, RDC',
    order: 1,
  });

  const totalCareerYears = calculateNonOverlappingYears(experiences);

  const openCreateModal = () => {
    setEditingExperience(null);
    setFormError(null);
    setFormData({
      position: '',
      company: '',
      startDate: new Date().toISOString().slice(0, 7),
      endDate: '',
      isCurrent: true,
      description: '',
      achievementsText: '',
      skillsText: '',
      location: 'Kinshasa, RDC',
      order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ProfessionalExperience) => {
    setEditingExperience(exp);
    setFormError(null);
    setFormData({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: !!exp.isCurrent,
      description: exp.description || '',
      achievementsText: (exp.achievements || []).join('\n'),
      skillsText: (exp.skills || []).join(', '),
      location: exp.location || 'Kinshasa, RDC',
      order: exp.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position.trim() || !formData.company.trim() || !formData.startDate) {
      setFormError("Veuillez renseigner au minimum le poste, l'entreprise et la date de début.");
      return;
    }
    setFormError(null);

    const achievements = formData.achievementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const skills = formData.skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingExperience) {
      updateExperience({
        ...editingExperience,
        position: formData.position.trim(),
        company: formData.company.trim(),
        startDate: formData.startDate,
        endDate: formData.isCurrent ? '' : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description.trim(),
        achievements,
        skills,
        location: formData.location.trim(),
        order: Number(formData.order) || 1,
      });
      setSuccessMessage(`Expérience "${formData.position}" modifiée avec succès.`);
    } else {
      addExperience({
        position: formData.position.trim(),
        company: formData.company.trim(),
        startDate: formData.startDate,
        endDate: formData.isCurrent ? '' : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description.trim(),
        achievements,
        skills,
        location: formData.location.trim(),
        order: Number(formData.order) || experiences.length + 1,
      });
      setSuccessMessage(`Nouvelle expérience "${formData.position}" créée et synchronisée.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = (id: string) => {
    deleteExperience(id);
    setDeleteConfirmId(null);
    setSuccessMessage("Expérience supprimée du profil et du CV.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleQuickCvDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      const georges = profiles.find(p => p.id === 'prof-1') || profiles[0];
      await generateCvPdf({
        fullName: "Georges MOOMBO MODEAWI",
        roleTitle: georges?.roleTitle || adminProfile.title,
        bio: cvSettings.customSummary || georges?.biography || adminProfile.bio,
        avatarUrl: georges?.avatarUrl || adminProfile.avatarUrl,
        email: georges?.contactInfo?.email || adminProfile.contactEmail,
        phone: georges?.contactInfo?.phone || adminProfile.phone,
        location: georges?.contactInfo?.location || adminProfile.city,
        themeId: cvSettings.themeId,
        experiences,
        footer: cvSettings.footer,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Preview duration during live typing
  const liveDuration = formatExperienceDuration(
    formData.startDate, 
    formData.isCurrent ? undefined : formData.endDate, 
    formData.isCurrent
  );

  return (
    <AdminLayout activeNav="experiences">
      <div className="space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Expériences Professionnelles & Carrière
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Gérez vos postes, entreprises, dates de début et fin, et calculs automatiques de durée pour le CV PDF et le site public.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickCvDownload}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              title="Tester immédiatement l'export PDF du CV avec ces expériences"
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span>Tester CV (PDF)</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une expérience</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Stat Cards (Duration & Counts) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Carrière Totale Non-Chevauchante
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-400">
                +{totalCareerYears} ans
              </span>
              <span className="text-xs text-slate-400">d'activité cumulée</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Calculé rigoureusement à partir des dates réelles sans chevauchement artificiel.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expériences Enregistrées
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {experiences.length}
              </span>
              <span className="text-xs text-slate-400">postes & missions</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Synchronisées en temps réel entre le site public et le document PDF.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Postes en Cours d'Activité
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {experiences.filter(e => e.isCurrent).length}
              </span>
              <span className="text-xs text-slate-400">actif(s) actuellement</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Affichés avec la mention « Présent » et la durée dynamique actualisée.
            </p>
          </div>
        </div>

        {/* Experiences List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Liste des Expériences Chronologiques ({experiences.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              (Les 3 plus récentes sont priorisées sur le CV 1 page A4)
            </span>
          </div>

          {experiences.length === 0 ? (
            <div className="bg-slate-900 p-12 text-center rounded-3xl border border-slate-800 space-y-4">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">Aucune expérience enregistrée pour le moment.</p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Ajouter une première expérience
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {experiences.map((exp, idx) => {
                const duration = formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent);
                const startLabel = exp.startDate || 'Non défini';
                const endLabel = exp.isCurrent ? 'Présent (Poste actuel)' : (exp.endDate || 'Non défini');

                return (
                  <div 
                    key={exp.id}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                          #{exp.order || idx + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {exp.position}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                          {exp.company}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Poste actuel
                          </span>
                        )}
                      </div>

                      {/* Date & Calculated Duration Badge */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>{startLabel} ➔ {endLabel}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-300 font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>Durée calculée : {duration}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                          {exp.description}
                        </p>
                      )}

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {exp.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-blue-400">✔</span>
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills tags */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {exp.skills.map((sk, sIdx) => (
                            <span 
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-mono text-slate-300 border border-slate-700/60"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Modifier cette expérience"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(exp.id)}
                        className="p-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Supprimer cette expérience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-900/30 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white text-center">
                Confirmer la suppression
              </h3>
              <p className="text-xs text-slate-400 text-center">
                Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action modifiera immédiatement le CV PDF et le site public.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Experience Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-4 shadow-2xl">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {editingExperience ? "Modifier l'expérience" : "Ajouter une expérience professionnelle"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
                {formError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{formError}</span>
                  </div>
                )}
                
                {/* 1. Poste & Entreprise */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Poste occupé *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Consultant Systèmes d'Information"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Entreprise ou Organisation *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Cabinet Numérique & PME"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 2. Dates & Option Poste Actuel */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Période & Durée de l'Expérience
                    </span>
                    
                    {/* Switch / Checkbox Poste Actuel */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400">
                      <input 
                        type="checkbox"
                        checked={formData.isCurrent}
                        onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span>Poste actuel (en cours)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        Date de début (Année ou Mois/Année) *
                      </label>
                      <input 
                        type="month"
                        required
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        Date de fin {formData.isCurrent ? '(Désactivé - Poste actuel)' : '*'}
                      </label>
                      <input 
                        type="month"
                        disabled={formData.isCurrent}
                        required={!formData.isCurrent}
                        value={formData.isCurrent ? '' : formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        placeholder={formData.isCurrent ? 'En cours' : ''}
                        className={`w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 ${
                          formData.isCurrent ? 'opacity-40 cursor-not-allowed bg-slate-900' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Live calculated duration preview badge */}
                  {formData.startDate && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">Calcul automatique en temps réel :</span>
                      <span className="font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60">
                        Durée : {liveDuration || 'calcul...'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Localisation & Ordre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Localisation
                    </label>
                    <input 
                      type="text"
                      placeholder="Ex: Kinshasa, RDC"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Ordre d'affichage (1 = Premier)
                    </label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 4. Description des responsabilités */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Description des responsabilités
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Décrivez brièvement votre rôle, vos missions principales et votre cadre d'intervention..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                {/* 5. Réalisations principales */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Réalisations principales (une par ligne)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Conception de plus de 15 logiciels métiers&#10;Réduction de 45% des écarts d'inventaire&#10;Zéro perte critique de données"
                    value={formData.achievementsText}
                    onChange={e => setFormData({ ...formData, achievementsText: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Astuce : Séparez chaque fait marquant par un saut de ligne.
                  </span>
                </div>

                {/* 6. Compétences associées */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Compétences associées (séparées par virgules)
                  </label>
                  <input 
                    type="text"
                    placeholder="Conception SI, MySQL, React, TypeScript, Normes OHADA"
                    value={formData.skillsText}
                    onChange={e => setFormData({ ...formData, skillsText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Submit bar */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingExperience ? "Enregistrer les modifications" : "Créer l'expérience"}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
