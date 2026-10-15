import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Clock, Award, ArrowRight, Download } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { formatExperienceDuration, calculateNonOverlappingYears } from '../../types/crm';

interface ExperiencesSectionProps {
  onOpenCVModal?: () => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onOpenCVModal }) => {
  const { experiences } = useCrm();

  const sortedExperiences = [...experiences].sort((a, b) => (a.order || 0) - (b.order || 0));
  const totalYears = calculateNonOverlappingYears(experiences);

  return (
    <section id="experiences" className="py-24 bg-slate-50 dark:bg-slate-950/70 scroll-mt-20 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 fade-in-up">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Parcours & Expériences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Expériences Professionnelles{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vérifiées
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Plus de <strong className="text-slate-900 dark:text-white font-bold">{totalYears} ans</strong> d'expertise cumulée en conception de systèmes d'information, logiciels de gestion d'entreprise et cybersécurité.
            </p>
          </div>

          {onOpenCVModal && (
            <button
              onClick={onOpenCVModal}
              className="px-5 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le CV complet (PDF A4)</span>
            </button>
          )}
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-blue-500/30 dark:border-blue-500/20 ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
          {sortedExperiences.map((exp, idx) => {
            const duration = formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent);
            const startLabel = exp.startDate || '';
            const endLabel = exp.isCurrent ? 'Présent' : (exp.endDate || '');

            return (
              <div key={exp.id || idx} className="relative group fade-in-up">
                
                {/* Timeline Node Icon */}
                <div className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                  exp.isCurrent
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30 ring-4 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}>
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all space-y-4">
                  
                  {/* Top Header: Role, Company, Period badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          {exp.position}
                        </h3>
                        {exp.isCurrent && (
                          <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Poste actuel
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" /> {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 flex items-center gap-1.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{startLabel} — {endLabel}</span>
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span className="font-extrabold text-blue-700 dark:text-blue-300">({duration})</span>
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Key Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Réalisations Majeures
                      </span>
                      <ul className="grid sm:grid-cols-2 gap-2 text-xs">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Associated Skills */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1">
                        Compétences appliquées :
                      </span>
                      {exp.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
