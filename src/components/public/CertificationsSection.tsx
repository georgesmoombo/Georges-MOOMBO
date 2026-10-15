import React from 'react';
import { Award, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '../../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certifications" className="py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-14 text-center md:text-left fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4" /> Diplômes & Reconnaissances
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Formations & Certifications Validées
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Un socle académique d'excellence en conception du système d'information doublé d'une veille technologique continue sur les architectures web et la cybersécurité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {CERTIFICATIONS.map(cert => (
            <div 
              key={cert.id}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 fade-in-up zoom-in"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                    {cert.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {cert.title}
                </h3>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  {cert.issuer} • {cert.date}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Compétences Clés
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map(sk => (
                    <span 
                      key={sk}
                      className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium rounded-md"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
