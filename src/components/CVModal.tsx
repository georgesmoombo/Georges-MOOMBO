import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Printer, Download, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, CheckCircle, Award, FileDown, Loader2, Palette, Globe, Shield 
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { generateCvPdf } from '../utils/generateCvPdf';
import { CV_THEMES, DEFAULT_CV_THEME } from '../data/cvThemes';
import { CvThemeId, formatExperienceDuration } from '../types/crm';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const { 
    adminProfile, 
    profiles, 
    experiences, 
    cvSettings, 
    updateCvSettings 
  } = useCrm();

  const georgesProfile = profiles.find(p => p.id === 'prof-1') || profiles[0];

  const fullName = "Georges MOOMBO MODEAWI";
  const roleTitle = "Expert en conception du système d'information";
  const bio = cvSettings.customSummary || georgesProfile?.biography || georgesProfile?.shortBio || adminProfile.bio || 
    "Consultant expert en conception et informatisation des systèmes d'information, modélisation de bases de données relationnelles, logiciels métiers de gestion (stock, facturation OHADA, caisse) et cybersécurité des infrastructures à Kinshasa et à distance.";
  
  const phone = georgesProfile?.contactInfo?.phone || adminProfile.phone || "+243 829 725 609";
  const email = georgesProfile?.contactInfo?.email || adminProfile.contactEmail || "georgesweahmoombo@gmail.com";
  const location = georgesProfile?.contactInfo?.location || (adminProfile.city ? `${adminProfile.city}, ${adminProfile.country || 'RDC'}` : "Kinshasa, République Démocratique du Congo");
  const avatarUrl = georgesProfile?.avatarUrl || adminProfile.avatarUrl || "/profile_photo.jpg";
  const github = georgesProfile?.socialLinks?.github || adminProfile.githubUrl || "https://github.com/georgesmoombo";
  const linkedin = georgesProfile?.socialLinks?.linkedin || adminProfile.linkedinUrl || "https://linkedin.com/in/georges-moombo";

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Reactive local state ensures immediate UI color propagation when switching themes
  const [localThemeId, setLocalThemeId] = useState<CvThemeId>(cvSettings.themeId || 'blue-pro');

  useEffect(() => {
    if (cvSettings.themeId) {
      setLocalThemeId(cvSettings.themeId);
    }
  }, [cvSettings.themeId]);

  const activeThemeId: CvThemeId = localThemeId || cvSettings.themeId || 'blue-pro';
  const theme = CV_THEMES[activeThemeId] || DEFAULT_CV_THEME;

  // Reactive CSS variables mapping
  const cvThemeCssVars = useMemo(() => ({
    '--theme-primary': theme.primaryHex,
    '--theme-secondary': theme.secondaryHex,
    '--theme-accent': theme.accentHex,
    '--theme-bg-card': theme.bgCardHex,
    '--theme-border': theme.borderHex,
    '--theme-text-dark': `rgb(${theme.textDark.join(', ')})`,
    '--theme-text-muted': `rgb(${theme.textMuted.join(', ')})`,
    '--theme-primary-rgb': theme.primary.join(', '),
    '--theme-accent-rgb': theme.accent.join(', '),
    '--theme-secondary-rgb': theme.secondary.join(', '),
  } as React.CSSProperties), [theme]);

  // Sync to DOM elements for immediate CSS variable evaluation in print and dynamic styles
  useEffect(() => {
    if (isOpen) {
      const printableArea = document.getElementById('cv-printable-area');
      if (printableArea) {
        printableArea.style.setProperty('--theme-primary', theme.primaryHex);
        printableArea.style.setProperty('--theme-secondary', theme.secondaryHex);
        printableArea.style.setProperty('--theme-accent', theme.accentHex);
        printableArea.style.setProperty('--theme-bg-card', theme.bgCardHex);
        printableArea.style.setProperty('--theme-border', theme.borderHex);
        printableArea.style.setProperty('--theme-text-dark', `rgb(${theme.textDark.join(', ')})`);
        printableArea.style.setProperty('--theme-text-muted', `rgb(${theme.textMuted.join(', ')})`);
      }
      document.documentElement.style.setProperty('--cv-theme-primary', theme.primaryHex);
      document.documentElement.style.setProperty('--cv-theme-secondary', theme.secondaryHex);
      document.documentElement.style.setProperty('--cv-theme-accent', theme.accentHex);
      document.documentElement.style.setProperty('--cv-theme-bg-card', theme.bgCardHex);
      document.documentElement.style.setProperty('--cv-theme-border', theme.borderHex);
    }
  }, [theme, isOpen]);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: CvThemeId) => {
    setLocalThemeId(themeId);
    updateCvSettings({ themeId });
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateCvPdf({
        fullName,
        roleTitle,
        bio,
        avatarUrl,
        email,
        phone,
        location,
        githubUrl: github,
        linkedinUrl: linkedin,
        portfolioUrl: georgesProfile?.socialLinks?.portfolio || adminProfile.portfolioUrl,
        themeId: activeThemeId,
        experiences: experiences.length > 0 ? experiences : undefined,
        footer: cvSettings.footer,
        customSummary: cvSettings.customSummary,
      });
    } catch (err) {
      console.error('Erreur lors de la génération du CV PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sortedExperiences = [...experiences]
    .sort((a, b) => a.order - b.order)
    .slice(0, 3); // Top 3 prioritized for exact single-page A4

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* CV Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-4 max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar with Theme Selector */}
        <div className="no-print bg-slate-100 dark:bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 flex-shrink-0">
          
          {/* Identity & Status */}
          <div className="flex items-center gap-2.5">
            <div 
              className="w-3.5 h-3.5 rounded-full shadow-sm animate-pulse"
              style={{ backgroundColor: theme.accentHex }}
            />
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block leading-tight">
                CV Intelligent A4 (1 Page) • {fullName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Thème actif : <strong style={{ color: theme.accentHex }}>{theme.name}</strong> • Synchronisé Impression & PDF
              </span>
            </div>
          </div>

          {/* Theme Selector Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Thèmes :
            </span>
            {(Object.keys(CV_THEMES) as CvThemeId[]).map(tId => {
              const tConfig = CV_THEMES[tId];
              const isSelected = activeThemeId === tId;
              return (
                <button
                  key={tId}
                  onClick={() => handleSelectTheme(tId)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white dark:bg-slate-800 shadow-sm border-2' 
                      : 'bg-slate-200/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent'
                  }`}
                  style={{
                    borderColor: isSelected ? tConfig.accentHex : undefined,
                    color: isSelected ? tConfig.accentHex : undefined
                  }}
                  title={tConfig.description}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-black/10" 
                    style={{ backgroundColor: tConfig.accentHex }} 
                  />
                  <span className="hidden sm:inline">{tConfig.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            {/* Primary Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: theme.accentHex,
                boxShadow: `0 4px 14px ${theme.accentHex}40`
              }}
              title="Générer le CV au format A4 exact sur 1 seule page"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération A4...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Télécharger PDF (A4)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-100 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Imprimer directement"
            >
              <Printer className="w-4 h-4" /> Imprimer
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fermer le CV"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRINTABLE & SCROLLABLE A4 PREVIEW CONTAINER               */}
        {/* ========================================================= */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex justify-center">
          
          {/* Virtual A4 Canvas (Aspect ratio 210 / 297 = 1:1.414) */}
          <div 
            id="cv-printable-area" 
            className="w-full max-w-[850px] bg-white shadow-xl rounded-2xl border overflow-hidden flex flex-col justify-between"
            style={{ 
              minHeight: '1050px',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-dark)',
              ...cvThemeCssVars
            }}
          >
            
            {/* 1. Header Banner (Themed via CSS Variables) */}
            <div 
              className="p-6 text-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b-2"
              style={{ 
                backgroundColor: 'var(--theme-primary)',
                borderBottomColor: 'var(--theme-accent)' 
              }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <img 
                  src={avatarUrl} 
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top shadow-md border-2"
                  style={{ borderColor: 'var(--theme-accent)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {fullName}
                  </h1>
                  <p 
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-1"
                    style={{ color: 'var(--theme-secondary)' }}
                  >
                    {roleTitle}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Conception de Systèmes d'Information • Solutions Logicielles Métiers • Cybersécurité
                  </p>
                </div>
              </div>

              {/* Header Contact Box */}
              <div className="text-xs space-y-1 text-slate-200 border-t sm:border-t-0 sm:border-l border-slate-700/80 pt-3 sm:pt-0 sm:pl-5 shrink-0 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Phone className="w-3.5 h-3.5" style={{ color: 'var(--theme-secondary)' }} /> {phone}
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5" style={{ color: 'var(--theme-secondary)' }} /> {email}
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--theme-secondary)' }} /> {location}
                </div>
                <div 
                  className="flex items-center gap-2 text-[11px] font-semibold mt-1 justify-center sm:justify-start px-2 py-0.5 rounded-md"
                  style={{ 
                    color: 'var(--theme-secondary)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <CheckCircle className="w-3 h-3" /> Disponible pour projets & recrutements
                </div>
              </div>
            </div>

            {/* 2. Main Two-Column Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
              
              {/* Left Column (4 cols) */}
              <div 
                className="md:col-span-4 p-4 rounded-2xl border space-y-5"
                style={{ 
                  backgroundColor: 'var(--theme-bg-card)',
                  borderColor: 'var(--theme-border)' 
                }}
              >
                {/* Compétences Clés */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    Compétences Clés
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Conception SI & UML</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Diagrammes UML (Cas d'utilisation, Classes, Séquences), 3NF & Architecture SI</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Comptabilité OHADA</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Facturation bimonétaire, stocks FIFO/PUMP</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Bases de Données MySQL</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Requêtes avancées, triggers, réplication</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Développement Full Stack</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>React, TypeScript, PHP MVC, API REST</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Cybersécurité & Réseaux</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Contrôle d'accès RBAC, sauvegarde 3-2-1</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Bureautique Décisionnelle</span>
                      <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Excel formules matricielles, TCD, reporting</span>
                    </div>
                  </div>
                </div>

                {/* Formation & Diplômes */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    Formation & Diplômes
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Diplôme en Conception de SI</span>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Enseignement Supérieur Technique</span>
                      <span className="text-[10px] block mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Bases de données relationnelles, algorithmique, comptabilité.</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Spécialisation Full Stack</span>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Formation Professionnelle Continue</span>
                      <span className="text-[10px] block mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>React, TypeScript, PHP MVC et architectures modernes.</span>
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Sécurité des Systèmes d'Info</span>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Pratique Opérationnelle Terrain</span>
                      <span className="text-[10px] block mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>RBAC, durcissement réseau et hygiène numérique.</span>
                    </div>
                  </div>
                </div>

                {/* Langues & Mobilité */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    Langues & Mobilité
                  </h3>
                  <div className="space-y-1 text-xs" style={{ color: 'var(--theme-text-dark)' }}>
                    <div><strong>Français :</strong> Courant (Langue de travail)</div>
                    <div><strong>Lingala :</strong> Langue maternelle (Courant)</div>
                    <div><strong>Anglais :</strong> Technique & Documentation IT</div>
                    <div className="text-[11px] pt-1" style={{ color: 'var(--theme-text-muted)' }}>Disponible : Kinshasa & À distance</div>
                  </div>
                </div>

              </div>

              {/* Right Column (8 cols) */}
              <div className="md:col-span-8 space-y-5">
                
                {/* Profil Professionnel */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b flex items-center justify-between"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    <span>Profil Professionnel & Synthèse</span>
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-dark)' }}>
                    {bio}
                  </p>
                </div>

                {/* Expériences Professionnelles (Dynamic & Modifiable) */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b flex items-center justify-between"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    <span>Expériences Professionnelles Récentes</span>
                    <span className="text-[10px] font-normal lowercase" style={{ color: 'var(--theme-text-muted)' }}>
                      (dates & durées calculées automatiquement)
                    </span>
                  </h3>

                  <div className="space-y-3.5">
                    {sortedExperiences.map(exp => {
                      const duration = formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent);
                      const startLabel = exp.startDate ? exp.startDate.slice(0, 7) : '';
                      const endLabel = exp.isCurrent ? 'Présent' : (exp.endDate ? exp.endDate.slice(0, 7) : '');

                      return (
                        <div key={exp.id} className="border-l-2 pl-3 py-0.5" style={{ borderLeftColor: 'var(--theme-accent)' }}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--theme-text-dark)' }}>
                              {exp.position}
                            </span>
                            <span 
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md inline-block w-fit"
                              style={{ 
                                backgroundColor: 'var(--theme-bg-card)',
                                color: 'var(--theme-accent)',
                                border: '1px solid var(--theme-border)'
                              }}
                            >
                              {startLabel} - {endLabel} • {duration}
                            </span>
                          </div>

                          <span className="text-xs font-semibold block mt-0.5" style={{ color: 'var(--theme-accent)' }}>
                            {exp.company} {exp.location ? `— ${exp.location}` : ''}
                          </span>

                          {exp.description && (
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--theme-text-dark)' }}>
                              {exp.description}
                            </p>
                          )}

                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {exp.achievements.slice(0, 2).map((ach, aIdx) => (
                                <li key={aIdx} className="text-[11px] flex items-start gap-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                                  <span style={{ color: 'var(--theme-accent)' }}>✔</span>
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {exp.skills && exp.skills.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {exp.skills.slice(0, 4).map((sk, skIdx) => (
                                <span 
                                  key={skIdx} 
                                  className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium"
                                  style={{ 
                                    backgroundColor: 'var(--theme-bg-card)',
                                    color: 'var(--theme-accent)',
                                    border: '1px solid var(--theme-border)'
                                  }}
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Projets Phares Déployés */}
                <div>
                  <h3 
                    className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b"
                    style={{ 
                      color: 'var(--theme-accent)',
                      borderBottomColor: 'var(--theme-accent)' 
                    }}
                  >
                    Solutions Logicielles Métiers Déployées
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div 
                      className="p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-card)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Gestion de Stock & Inventaires</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Impact : -45% d'écarts d'inventaire</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Alertes de rupture, valorisation FIFO/PUMP pour grossistes.</p>
                    </div>

                    <div 
                      className="p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-card)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Facturation Commerciale OHADA</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Normes OHADA • Bidevise USD/CDF</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Factures inaltérables, recouvrement des créances clients.</p>
                    </div>

                    <div 
                      className="p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-card)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Terminal Point de Vente (POS)</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Encaissement rapide & Tickets</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Caisse tactile, multi-règlements (Cash/Mobile Money), clôtures X/Z.</p>
                    </div>

                    <div 
                      className="p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-card)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <span className="font-bold block" style={{ color: 'var(--theme-text-dark)' }}>Audit de Sécurité Réseau PME</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--theme-accent)' }}>Résilience 100% face aux intrusions</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Segmentation VLAN, sauvegardes 3-2-1 chiffrées, anti-phishing.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Themed CV Footer (Administrable) */}
            {cvSettings.footer.showFooter && (
              <div 
                className="px-6 py-3 border-t text-[11px] flex flex-col sm:flex-row items-center justify-between gap-1"
                style={{ 
                  backgroundColor: 'var(--theme-bg-card)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-muted)'
                }}
              >
                <div>
                  <span>{cvSettings.footer.footerText}</span> • <strong>{cvSettings.footer.professionalName}</strong>
                </div>
                <div className="text-[10px] italic font-semibold" style={{ color: 'var(--theme-accent)' }}>
                  {cvSettings.footer.confidentialityNotice}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Download CTA Bar */}
        <div className="no-print bg-white dark:bg-slate-900 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Format garanti 1 seule page A4 • Thème <strong>{theme.name}</strong> appliqué</span>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: theme.accentHex }}
          >
            <Download className="w-4 h-4" />
            <span>Télécharger CV_Georges_MOOMBO_MODEAWI.pdf</span>
          </button>
        </div>

      </div>
    </div>
  );
};
