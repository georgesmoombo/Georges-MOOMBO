import React, { useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { 
  Sliders, Save, RotateCcw, Eye, CheckCircle2, 
  Palette, Globe, Shield, FileText, Phone, Mail, 
  MapPin, Download, ExternalLink, Calendar, CheckSquare, Square, FileDown 
} from 'lucide-react';
import { CV_THEMES } from '../../data/cvThemes';
import { CvThemeId } from '../../types/crm';
import { generateCvPdf } from '../../utils/generateCvPdf';

export const FooterSettingsPage: React.FC = () => {
  const { 
    siteFooterSettings, 
    updateSiteFooterSettings, 
    resetSiteFooterSettingsToDefault,
    cvSettings,
    updateCvSettings,
    resetCvSettingsToDefault,
    adminProfile,
    profiles,
    experiences
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'site' | 'cv'>('site');
  const [siteForm, setSiteForm] = useState(siteFooterSettings);
  const [cvForm, setCvForm] = useState(cvSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Sync state if context changes externally
  React.useEffect(() => {
    setSiteForm(siteFooterSettings);
  }, [siteFooterSettings]);

  React.useEffect(() => {
    setCvForm(cvSettings);
  }, [cvSettings]);

  const handleSaveSiteFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteFooterSettings(siteForm);
    setSaveSuccessMsg("Les paramètres du pied de page public ont été enregistrés et appliqués.");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleResetSiteFooter = () => {
    if (confirm("Voulez-vous vraiment restaurer les paramètres par défaut du pied de page public ?")) {
      resetSiteFooterSettingsToDefault();
      setSaveSuccessMsg("Pied de page public réinitialisé aux valeurs par défaut.");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSaveCvSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCvSettings(cvForm);
    setSaveSuccessMsg("Les paramètres du CV et son thème ont été synchronisés.");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleResetCvSettings = () => {
    if (confirm("Voulez-vous restaurer les paramètres par défaut du CV ?")) {
      resetCvSettingsToDefault();
      setSaveSuccessMsg("Paramètres du CV réinitialisés.");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleTestCvDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      const georges = profiles.find(p => p.id === 'prof-1') || profiles[0];
      await generateCvPdf({
        fullName: "Georges MOOMBO MODEAWI",
        roleTitle: georges?.roleTitle || adminProfile.title,
        bio: cvForm.customSummary || georges?.biography || adminProfile.bio,
        avatarUrl: georges?.avatarUrl || adminProfile.avatarUrl,
        email: siteForm.contactEmail || adminProfile.contactEmail,
        phone: siteForm.contactPhone || adminProfile.phone,
        location: siteForm.contactLocation || adminProfile.city,
        themeId: cvForm.themeId,
        experiences,
        footer: cvForm.footer,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const selectedCvTheme = CV_THEMES[cvForm.themeId] || CV_THEMES['blue-pro'];
  const calculatedYear = siteForm.yearMode === 'auto' ? new Date().getFullYear() : siteForm.manualYear;

  return (
    <AdminLayout activeNav="footer-settings">
      <div className="space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Paramètres des Pieds de Page & Thèmes CV
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Gérez séparément le pied de page du site public, les mentions légales et le pied de page / thèmes du document CV PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestCvDownload}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span>Tester le CV PDF</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Main Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('site')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'site'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>1. Pied de Page du Site Public</span>
          </button>

          <button
            onClick={() => setActiveTab('cv')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cv'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>2. Thèmes & Pied de Page du CV (PDF)</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PIED DE PAGE DU SITE PUBLIC                       */}
        {/* ======================================================== */}
        {activeTab === 'site' && (
          <form onSubmit={handleSaveSiteFooter} className="space-y-6">
            
            {/* Live Preview Box */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Aperçu en Direct du Pied de Page Public
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Année affichée : {calculatedYear}
                </span>
              </div>

              {/* Rendered Live Preview */}
              <div className="p-6 rounded-2xl bg-white text-slate-800 border border-slate-200 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-base font-black text-slate-900 block">
                      {siteForm.professionalName || "Georges MOOMBO MODEAWI"}
                    </span>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      {siteForm.shortSlogan}
                    </span>
                  </div>
                  {siteForm.showContactInfo && (
                    <div className="text-xs text-slate-500 space-y-0.5 sm:text-right">
                      <div>{siteForm.contactEmail}</div>
                      <div>{siteForm.contactPhone}</div>
                      <div>{siteForm.contactLocation}</div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <p>© {calculatedYear} {siteForm.professionalName}. {siteForm.copyrightText}</p>
                  <p className="text-[11px] text-slate-400">{siteForm.complementaryText}</p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Champs & Textes du Pied de Page
              </h3>

              {/* 1. Copyright & Année */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Texte de copyright
                  </label>
                  <input 
                    type="text"
                    value={siteForm.copyrightText}
                    onChange={e => setSiteForm({ ...siteForm, copyrightText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Tous droits réservés. Conception logicielle & Systèmes d'information."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Mode d'année affichée
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSiteForm({ ...siteForm, yearMode: 'auto' })}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        siteForm.yearMode === 'auto'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Automatique ({new Date().getFullYear()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSiteForm({ ...siteForm, yearMode: 'manual' })}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        siteForm.yearMode === 'manual'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Manuel
                    </button>
                  </div>
                  {siteForm.yearMode === 'manual' && (
                    <input 
                      type="number"
                      value={siteForm.manualYear}
                      onChange={e => setSiteForm({ ...siteForm, manualYear: Number(e.target.value) })}
                      className="w-full mt-1.5 px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  )}
                </div>
              </div>

              {/* 2. Nom & Slogan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Nom professionnel affiché
                  </label>
                  <input 
                    type="text"
                    value={siteForm.professionalName}
                    onChange={e => setSiteForm({ ...siteForm, professionalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Slogan ou description courte
                  </label>
                  <input 
                    type="text"
                    value={siteForm.shortSlogan}
                    onChange={e => setSiteForm({ ...siteForm, shortSlogan: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 3. Coordonnées & Visibilité */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Coordonnées du Pied de Page
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-blue-400 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteForm.showContactInfo}
                      onChange={e => setSiteForm({ ...siteForm, showContactInfo: e.target.checked })}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Afficher les coordonnées dans le pied de page</span>
                  </label>
                </div>

                {siteForm.showContactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Email public</label>
                      <input 
                        type="email"
                        value={siteForm.contactEmail}
                        onChange={e => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Téléphone / WhatsApp</label>
                      <input 
                        type="text"
                        value={siteForm.contactPhone}
                        onChange={e => setSiteForm({ ...siteForm, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Localisation</label>
                      <input 
                        type="text"
                        value={siteForm.contactLocation}
                        onChange={e => setSiteForm({ ...siteForm, contactLocation: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Mentions Légales & Confidentialité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Texte des Mentions Légales
                  </label>
                  <textarea 
                    rows={3}
                    value={siteForm.legalNotice}
                    onChange={e => setSiteForm({ ...siteForm, legalNotice: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Texte de la Politique de Confidentialité
                  </label>
                  <textarea 
                    rows={3}
                    value={siteForm.privacyPolicy}
                    onChange={e => setSiteForm({ ...siteForm, privacyPolicy: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 5. Texte complémentaire */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Texte complémentaire de bas de page
                </label>
                <input 
                  type="text"
                  value={siteForm.complementaryText}
                  onChange={e => setSiteForm({ ...siteForm, complementaryText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="Disponible pour missions de conseil et interventions à Kinshasa et à distance."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetSiteFooter}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurer les valeurs par défaut</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>

            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: THÈMES & PIED DE PAGE DU CV                       */}
        {/* ======================================================== */}
        {activeTab === 'cv' && (
          <form onSubmit={handleSaveCvSettings} className="space-y-6">
            
            {/* 1. Theme Selection Matrix */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  Sélection du Thème du CV (Aperçu, Impression & PDF)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choisissez parmi les 6 thèmes professionnels officiels. Le thème sélectionné est appliqué immédiatement et conservé après rechargement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(CV_THEMES) as CvThemeId[]).map(tId => {
                  const t = CV_THEMES[tId];
                  const isSelected = cvForm.themeId === tId;

                  return (
                    <div
                      key={tId}
                      onClick={() => setCvForm({ ...cvForm, themeId: tId })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected 
                          ? 'bg-slate-800/90 shadow-xl' 
                          : 'bg-slate-950/70 hover:bg-slate-800/40 border-slate-800'
                      }`}
                      style={{
                        borderColor: isSelected ? t.accentHex : undefined
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: t.accentHex }}
                          />
                          {t.name}
                        </span>
                        {isSelected && (
                          <span 
                            className="text-[10px] font-black px-2 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: t.accentHex }}
                          >
                            ACTIF
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight">
                        {t.description}
                      </p>

                      {/* Color Palette Samples */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 mr-1 font-mono">Palette :</span>
                        <div className="w-5 h-5 rounded-md shadow-sm" style={{ backgroundColor: t.primaryHex }} title="Primaire" />
                        <div className="w-5 h-5 rounded-md shadow-sm" style={{ backgroundColor: t.accentHex }} title="Accent" />
                        <div className="w-5 h-5 rounded-md shadow-sm" style={{ backgroundColor: t.secondaryHex }} title="Secondaire" />
                        <div className="w-5 h-5 rounded-md shadow-sm border border-slate-700" style={{ backgroundColor: t.bgCardHex }} title="Fond carte" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CV Footer Settings */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Pied de Page du Document CV
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Configurez les informations affichées en bas de page du CV PDF sans dépasser la marge A4.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-blue-400 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={cvForm.footer.showFooter}
                    onChange={e => setCvForm({ 
                      ...cvForm, 
                      footer: { ...cvForm.footer, showFooter: e.target.checked } 
                    })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Afficher le pied de page du CV</span>
                </label>
              </div>

              {cvForm.footer.showFooter && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Texte de pied de page
                      </label>
                      <input 
                        type="text"
                        value={cvForm.footer.footerText}
                        onChange={e => setCvForm({
                          ...cvForm,
                          footer: { ...cvForm.footer, footerText: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                        placeholder="Curriculum Vitae certifié conforme • Références sur demande"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Nom professionnel
                      </label>
                      <input 
                        type="text"
                        value={cvForm.footer.professionalName}
                        onChange={e => setCvForm({
                          ...cvForm,
                          footer: { ...cvForm.footer, professionalName: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                        placeholder="Georges MOOMBO MODEAWI"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Coordonnées ou liens complémentaires
                      </label>
                      <input 
                        type="text"
                        value={cvForm.footer.contactInfoText}
                        onChange={e => setCvForm({
                          ...cvForm,
                          footer: { ...cvForm.footer, contactInfoText: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                        placeholder="Tél / WhatsApp : +243 829 725 609 • Email : georgesweahmoombo@gmail.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Mention facultative de confidentialité
                      </label>
                      <input 
                        type="text"
                        value={cvForm.footer.confidentialityNotice}
                        onChange={e => setCvForm({
                          ...cvForm,
                          footer: { ...cvForm.footer, confidentialityNotice: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                        placeholder="Document professionnel confidentiel — Émis sous réserve de droits."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CV Footer Preview with Theme */}
              {cvForm.footer.showFooter && (
                <div className="p-4 rounded-2xl border space-y-1 text-xs" style={{
                  backgroundColor: selectedCvTheme.bgCardHex,
                  borderColor: selectedCvTheme.borderHex
                }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedCvTheme.accentHex }}>
                    Aperçu du pied de page CV avec le thème {selectedCvTheme.name} :
                  </span>
                  <div className="flex flex-col sm:flex-row justify-between items-center text-slate-600 gap-1 text-[11px]">
                    <span>{cvForm.footer.footerText} • <strong>{cvForm.footer.professionalName}</strong></span>
                    <span className="italic" style={{ color: selectedCvTheme.accentHex }}>{cvForm.footer.confidentialityNotice}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetCvSettings}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurer les valeurs par défaut</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestCvDownload}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le CV PDF</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer la configuration CV</span>
                  </button>
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
};
