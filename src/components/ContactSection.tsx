import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Copy, Check, MessageSquare, AlertCircle, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_INFO } from '../data/portfolioData';
import { useCrm } from '../context/CrmContext';

interface ContactSectionProps {
  initialSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialSubject = '' }) => {
  const { adminProfile, profiles } = useCrm();
  const georgesProfile = profiles.find(p => p.id === 'prof-1') || profiles[0];

  const contactPhone = georgesProfile?.contactInfo?.phone || adminProfile.phone || PORTFOLIO_INFO.phone;
  const contactEmail = georgesProfile?.contactInfo?.email || adminProfile.contactEmail || PORTFOLIO_INFO.email;
  const contactLocation = georgesProfile?.contactInfo?.location || `${adminProfile.city}, ${adminProfile.country}` || PORTFOLIO_INFO.location;
  const contactWhatsApp = georgesProfile?.contactInfo?.whatsapp || adminProfile.whatsapp || PORTFOLIO_INFO.phone;
  const cleanWhatsAppNumber = contactWhatsApp.replace(/\D/g, '') || '243829725609';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  });

  // Update subject if parent changes it
  React.useEffect(() => {
    if (initialSubject) {
      setFormData(prev => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 600);
  };

  const getWhatsAppPrefilledUrl = () => {
    const text = encodeURIComponent(
      `Bonjour Georges,\nJe suis ${formData.name || 'un prospect'}.\nSujet: ${formData.subject || 'Projet numérique'}\nMessage: ${formData.message || 'Je souhaite collaborer avec vous.'}\nMon email: ${formData.email || 'Non précisé'}`
    );
    return `https://wa.me/${cleanWhatsAppNumber}?text=${text}`;
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-900/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 text-center md:text-left fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            Contact Direct & Devis
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Prêt à Réaliser Votre Projet ?
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Que ce soit pour un logiciel de gestion, un site web, une assistance technique ou une formation, je réponds généralement en moins de 24 heures.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          
          {/* Left Column: Direct Info & Quick Actions */}
          <div className="lg:col-span-2 space-y-6 fade-in-left">
            
            {/* Card: Direct Info */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Coordonnées Professionnelles
              </h3>

              {/* Phone / WhatsApp */}
              <div className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Téléphone / WhatsApp
                    </span>
                    <a 
                      href={`tel:${contactPhone}`} 
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contactPhone, 'phone')}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
                  title="Copier le numéro"
                  aria-label="Copier le numéro de téléphone"
                >
                  {copiedField === 'phone' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Adresse Email
                    </span>
                    <a 
                      href={`mailto:${contactEmail}`} 
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contactEmail, 'email')}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all flex-shrink-0"
                  title="Copier l'adresse email"
                  aria-label="Copier l'adresse email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Localisation
                  </span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {contactLocation}
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Disponible sur Kinshasa et à distance en RDC / International
                  </span>
                </div>
              </div>
            </div>

            {/* Quick CTAs: WhatsApp & Call */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={PORTFOLIO_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp Direct
              </a>

              <a
                href={`mailto:${PORTFOLIO_INFO.email}?subject=Prise%20de%20contact%20-%20Georges%20MOOMBO`}
                className="p-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" /> Écrire par Mail
              </a>
            </div>

            {/* Availability status badge */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span><strong>Statut actuel :</strong> Ouvert aux opportunités et contrats d'entreprise</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-3 fade-in-right">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
              
              {status === 'success' ? (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Message Préparé avec Succès !
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mt-2">
                      Merci <strong>{formData.name}</strong>. Vous pouvez maintenant finaliser l'envoi directement via WhatsApp ou par votre application de messagerie préférée.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                    <a
                      href={getWhatsAppPrefilledUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Envoyer sur WhatsApp en 1 clic
                    </a>

                    <a
                      href={`mailto:${PORTFOLIO_INFO.email}?subject=${encodeURIComponent(formData.subject || 'Contact')}&body=${encodeURIComponent(formData.message + '\n\nDe: ' + formData.name + ' (' + formData.email + ')')}`}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Envoyer via Email
                    </a>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Rédiger un autre message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Envoyer un Message Direct
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Remplissez ce formulaire pour discuter de vos besoins techniques ou obtenir un devis personnalisé.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Votre Nom & Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Jean Mukendi"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Votre Adresse Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ex: jean.mukendi@entreprise.cd"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Sujet de la Demande
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ex: Logiciel de gestion de stock / Site internet / Assistance"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Détails de Votre Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre besoin, les objectifs de votre entreprise, ou le type d'assistance requis..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      'Traitement en cours...'
                    ) : (
                      <>
                        Envoyer le message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
