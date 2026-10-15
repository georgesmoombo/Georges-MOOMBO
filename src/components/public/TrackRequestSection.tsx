import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Quote } from '../../types/crm';

export const TrackRequestSection: React.FC = () => {
  const { quotes, leads } = useCrm();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [resultQuote, setResultQuote] = useState<Quote | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();
    const foundQuote = quotes.find(q => 
      q.number.toLowerCase() === trimmed || 
      q.email.toLowerCase() === trimmed ||
      q.phone.includes(trimmed)
    );

    setResultQuote(foundQuote || null);
    setSearched(true);
  };

  return (
    <section id="suivi-demande" className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-50 dark:bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Espace Prospect
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Suivre l'Évolution de Votre Demande de Projet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Entrez votre numéro de dossier (ex: DEV-2024-001) ou votre adresse email pour voir le statut en temps réel.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex: DEV-2024-001 ou votre email..."
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Search className="w-4 h-4" /> Vérifier
            </button>
          </form>

          {searched && (
            <div className="max-w-lg mx-auto pt-2">
              {resultQuote ? (
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-500/30 shadow-md space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {resultQuote.number}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {resultQuote.service}
                      </h4>
                      <p className="text-xs text-slate-500">Pour : {resultQuote.clientName} ({resultQuote.company})</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      resultQuote.status === 'Accepté' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {resultQuote.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between">
                    <span>Montant estimé : <strong>{resultQuote.totalAmount} {resultQuote.currency}</strong></span>
                    <span>Délai prévu : <strong>{resultQuote.estimatedDuration}</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-800 dark:text-blue-300">
                    💡 Votre dossier est en cours de traitement par Georges MOOMBO. Vous pouvez échanger directement sur WhatsApp pour toute précision.
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 text-center">
                  Aucun dossier trouvé pour "{query}". Vérifiez l'orthographe ou créez une nouvelle demande via le bouton "Demander un devis".
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
