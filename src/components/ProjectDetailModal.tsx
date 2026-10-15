import React, { useState } from 'react';
import { 
  X, CheckCircle2, Layers, Cpu, Calendar, User, 
  ArrowRight, ShieldCheck, Share2, Copy, Check, MessageSquare, 
  ExternalLink, Github, AlertTriangle, Lightbulb 
} from 'lucide-react';
import { Project } from '../data/portfolioData';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectForQuote: (projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectForQuote,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!project) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#projet-${project.id}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = encodeURIComponent(`Découvrez le projet "${project.title}" conçu par Georges MOOMBO MODEAWI (Développeur Full Stack & Spécialiste IT) : ${project.description}`);
  const whatsappShare = `https://wa.me/?text=${shareText}%20${encodeURIComponent(currentUrl)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const emailShare = `mailto:?subject=${encodeURIComponent(project.title)}&body=${shareText}%20${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white active:scale-95"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-emerald-500/80 rounded-full text-xs font-semibold uppercase tracking-wider">
              Statut : {project.status}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {project.title}
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300">
          
          {/* Key Metric & Client Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 block">
                  Impact Mesuré
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {project.metrics}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-600" /> Année: {project.year}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-600" /> {project.client}</span>
            </div>
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Problème Identifié
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.problem || "Processus manuel lent avec risques d'erreurs et manque de traçabilité des flux."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Solution Apportée
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.solution || "Automatisation complète via une interface intuitive, calculs précis et reporting immédiat."}
              </p>
            </div>
          </div>

          {/* Detailed Presentation */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Présentation Complète
            </h4>
            <p className="leading-relaxed text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {project.fullDescription}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Fonctionnalités Majeures
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {project.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" /> Architecture Technique
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 italic">
              {project.architecture}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Partager le Projet (Section 6 Requirement) */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-blue-600" /> Partager ce projet
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Lien copié !" : "Copier le lien"}
              </button>

              <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>

              <a
                href={linkedinShare}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#0077b5] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                LinkedIn
              </a>

              <a
                href={facebookShare}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#1877f2] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                Facebook
              </a>

              <a
                href={emailShare}
                className="px-3.5 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                Email
              </a>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Fermer l'aperçu
          </button>
          <button
            onClick={() => {
              onSelectForQuote(project.title);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            Demander un projet similaire <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
