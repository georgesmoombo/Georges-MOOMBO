import React, { useState } from 'react';
import { X, Check, Calculator, ArrowRight, ArrowLeft, Send, Sparkles, Building, Mail, Phone, User } from 'lucide-react';
import { SERVICES, PORTFOLIO_INFO } from '../data/portfolioData';
import { useCrm } from '../context/CrmContext';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId
}) => {
  const { addLead, addQuote } = useCrm();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedService, setSelectedService] = useState(
    preselectedServiceId ? SERVICES.find(s => s.id === preselectedServiceId)?.title || SERVICES[0].title : SERVICES[0].title
  );
  const [featuresNeeded, setFeaturesNeeded] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState('500 - 1000 USD');
  const [estimatedDelay, setEstimatedDelay] = useState('15 à 30 jours');
  const [description, setDescription] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [submittedQuoteNumber, setSubmittedQuoteNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    setFeaturesNeeded(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const currentServiceObj = SERVICES.find(s => s.title === selectedService) || SERVICES[0];

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) return;

    // 1. Create Lead in CRM
    const newLead = addLead({
      name: contactName,
      company: contactCompany || 'Particulier / Professionnel',
      phone: contactPhone,
      email: contactEmail,
      source: "Module Devis Interactif",
      service: selectedService,
      budget: budgetRange,
      status: "Nouveau",
      notes: `Fonctionnalités souhaitées : ${featuresNeeded.join(', ') || 'Standard'}. Détails : ${description}`
    });

    // 2. Automatically generate draft quote in CRM
    const newQuote = addQuote({
      clientName: contactName,
      company: contactCompany || 'Société',
      email: contactEmail,
      phone: contactPhone,
      service: selectedService,
      description: description || `Prestation ${selectedService} pour ${contactCompany || contactName}`,
      items: [
        {
          id: `item-${Date.now()}-1`,
          description: `Conception et déploiement : ${selectedService}`,
          quantity: 1,
          unitPrice: currentServiceObj.startingPrice,
          total: currentServiceObj.startingPrice
        },
        ...(featuresNeeded.length > 0 ? [{
          id: `item-${Date.now()}-2`,
          description: `Modules complémentaires (${featuresNeeded.slice(0, 3).join(', ')})`,
          quantity: 1,
          unitPrice: 150,
          total: 150
        }] : [])
      ],
      totalAmount: currentServiceObj.startingPrice + (featuresNeeded.length > 0 ? 150 : 0),
      currency: "USD",
      status: "Envoyé",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedDuration: estimatedDelay,
      notes: "Demande générée automatiquement via le simulateur de devis."
    });

    setSubmittedQuoteNumber(newQuote.number);
  };

  const handleReset = () => {
    setStep(1);
    setSubmittedQuoteNumber(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={handleReset}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-6 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-200 text-xs uppercase font-bold tracking-wider mb-1">
            <Calculator className="w-4 h-4" /> Simulateur & Demande de Devis
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Obtenez une estimation personnalisée
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Estimation transparente et sans engagement en 3 étapes rapides.
          </p>

          {/* Stepper Dots */}
          {!submittedQuoteNumber && (
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'w-8 bg-white' : 'w-3 bg-white/40'}`} />
              <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'w-8 bg-white' : 'w-3 bg-white/40'}`} />
              <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'w-8 bg-white' : 'w-3 bg-white/40'}`} />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[75vh]">
          {submittedQuoteNumber ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Demande de Devis Enregistrée !
                </h4>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  Référence du dossier : {submittedQuoteNumber}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mt-2">
                  Votre demande a été intégrée dans notre CRM professionnel. <strong>Georges MOOMBO</strong> vous contactera sous 24h avec la proposition détaillée.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-left max-w-md mx-auto space-y-1">
                <div><strong>Service :</strong> {selectedService}</div>
                <div><strong>Contact :</strong> {contactName} ({contactEmail})</div>
                <div><strong>Téléphone :</strong> {contactPhone}</div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/243829725609?text=Bonjour%20Georges,%20je%20viens%20de%20créer%20la%20demande%20de%20devis%20${submittedQuoteNumber}%20pour%20${encodeURIComponent(selectedService)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all text-center"
                >
                  Suivre sur WhatsApp en direct
                </a>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div className="space-y-5">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Choisissez le service concerné
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {SERVICES.map(service => {
                      const isSelected = selectedService === service.title;
                      return (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service.title)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {service.title}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            À partir de {service.startingPrice} {service.currency} • {service.estimatedDelay}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      Étape suivante <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Features, Delays & Budget */}
              {step === 2 && (
                <div className="space-y-5">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Précisez les fonctionnalités & votre calendrier
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Fonctionnalités recommandées pour "{selectedService}"
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {currentServiceObj.features.map((feat, i) => {
                        const checked = featuresNeeded.includes(feat);
                        return (
                          <div
                            key={i}
                            onClick={() => toggleFeature(feat)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                              checked
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400'
                            }`}>
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                            <span>{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Budget Envisagé
                      </label>
                      <select
                        value={budgetRange}
                        onChange={e => setBudgetRange(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Moins de 500 USD">Moins de 500 USD</option>
                        <option value="500 - 1000 USD">500 - 1 000 USD (Recommandé)</option>
                        <option value="1000 - 2500 USD">1 000 - 2 500 USD</option>
                        <option value="Plus de 2500 USD">Plus de 2 500 USD</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Délai Souhaité
                      </label>
                      <select
                        value={estimatedDelay}
                        onChange={e => setEstimatedDelay(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Urgent (< 7 jours)">Urgent (Moins de 7 jours)</option>
                        <option value="15 à 30 jours">15 à 30 jours (Standard)</option>
                        <option value="1 à 2 mois">1 à 2 mois</option>
                        <option value="Flexible">Flexible selon calendrier</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Détails ou besoins spécifiques
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Expliquez brièvement les particularités de votre activité..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-xs sm:text-sm hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      Coordonnées <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Submit */}
              {step === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Vos coordonnées pour l'envoi du devis
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Nom & Prénom *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={e => setContactName(e.target.value)}
                          placeholder="Ex: Patrick Ilunga"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Entreprise / Organisation
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          value={contactCompany}
                          onChange={e => setContactCompany(e.target.value)}
                          placeholder="Ex: Kinshasa Logistics SARL"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Adresse Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          placeholder="patrick@entreprise.cd"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Téléphone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="+243 81 234 5678"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Récapitulatif de votre demande :</div>
                    <div>• Service sélectionné : <strong>{selectedService}</strong></div>
                    <div>• Estimation indicative : <strong>À partir de {currentServiceObj.startingPrice} USD</strong> (ajusté selon cahier des charges)</div>
                    <div>• Confidentialité garantie conformément aux normes de protection des données</div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-xs sm:text-sm hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Précédent
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      Générer & Transmettre la Demande <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
