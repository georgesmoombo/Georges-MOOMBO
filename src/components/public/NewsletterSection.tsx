import React, { useState } from 'react';
import { Mail, Check, Send } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const NewsletterSection: React.FC = () => {
  const { addNewsletterSubscriber } = useCrm();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const res = addNewsletterSubscriber(email);
    setFeedback(res);
    if (res.success) {
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-blue-200">
          <Mail className="w-7 h-7" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Recevez nos Conseils en Gestion & Cybersécurité
          </h3>
          <p className="text-xs sm:text-sm text-blue-200 max-w-lg mx-auto">
            Abonnez-vous à la veille bimensuelle de Georges MOOMBO : astuces Excel, gestion de stocks, normes OHADA et protection contre les cyberattaques en RDC.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre.email@entreprise.cd"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-blue-200/60 outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-900 font-bold rounded-2xl text-xs sm:text-sm whitespace-nowrap active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            S'abonner <Send className="w-4 h-4" />
          </button>
        </form>

        {feedback && (
          <div className={`text-xs font-semibold max-w-md mx-auto ${
            feedback.success ? 'text-green-300' : 'text-amber-300'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>
    </section>
  );
};
