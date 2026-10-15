import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

import { FAQ_ITEMS } from '../../data/portfolioData';

export const FAQSection: React.FC = () => {
  const crm = useCrm();
  const faqItems = (crm as any)?.portfolioFaqs?.length ? (crm as any).portfolioFaqs : FAQ_ITEMS;
  const [openId, setOpenId] = useState<string | null>(faqItems?.[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4" /> Questions Fréquentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Tout Ce Que Vous Devez Savoir
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Des réponses claires et transparentes sur mes modalités de collaboration, délais et facturation.
          </p>
        </div>

        <div className="space-y-4 stagger-children">
          {(!faqItems || faqItems.length === 0) ? (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Aucune question fréquente pour le moment.
            </div>
          ) : (
            faqItems.map((item: any) => {
              const isOpen = openId === item.id;
              return (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm fade-in-up"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
