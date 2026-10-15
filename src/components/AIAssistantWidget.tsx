import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, User, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { PORTFOLIO_INFO, PROJECTS, SERVICES, CERTIFICATIONS } from '../data/portfolioData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const SYSTEM_PROMPT = `
Tu es "Assistant Georges", l'assistant numérique intelligent de Georges MOOMBO MODEAWI.
Ton rôle est de répondre avec courtoisie, professionnalisme, rigueur et concision aux visiteurs, recruteurs, prospects et clients.

INFORMATIONS SUR GEORGES MOOMBO MODEAWI :
- Identité : Développeur Full Stack & Consultant en Informatique de Gestion, Solutions Numériques et Cybersécurité.
- Profil professionnel : Concepteur de solutions logicielles d'entreprise (ERP, stocks, facturation OHADA, caisse POS, web & mobile).
- Localisation : Basé à Kinshasa, RDC (interventions sur site et collaborations à distance).
- Contact : Téléphone/WhatsApp : +243 829 725 609, Email : georgesweahmoombo@gmail.com.
- Domaines d'expertise : Conception des Systèmes d'Information (UML, modélisation relationnelle), Informatique de Gestion (normes OHADA, ERP, flux d'entreprise), Bases de données (MySQL), Développement Web Full Stack (React, TypeScript, PHP, Tailwind CSS), Cybersécurité (sauvegarde 3-2-1, RBAC, hygiène IT), Réseaux locaux LAN et Bureautique avancée (Excel expert / VBA).
- Projets phares réalisés : Système de Gestion de Stock, Facturation OHADA, Portail RH & Paie, Terminal de Caisse POS, Site Web d'Entreprise, Base de Données Scolaire, Audit Cybersécurité PME.
- Services proposés : Création de sites web (dès 350 USD), Logiciels de gestion sur mesure (dès 650 USD), Bases de données (dès 280 USD), Audit Cybersécurité (dès 300 USD), Maintenance & Réseaux (dès 150 USD), Formation Excel avancé (dès 200 USD).
- Devises acceptées : USD et Francs Congolais (CDF).
- Modalités de contact : Il est possible de demander un devis gratuit, de prendre rendez-vous en ligne ou d'échanger sur WhatsApp.

CONSIGNES :
- Réponds toujours en français, avec un ton bienveillant, clair et très professionnel.
- Si le visiteur souhaite un devis ou un rendez-vous, invite-le à utiliser les modules dédiés sur la page ou à contacter Georges sur WhatsApp au +243 829 725 609.
- Ne jamais inventer des informations qui ne figurent pas dans la fiche ci-dessus.
`.trim();

export const AIAssistantWidget: React.FC<{
  onOpenQuoteModal: () => void;
  onOpenAppointmentModal: () => void;
}> = ({ onOpenQuoteModal, onOpenAppointmentModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Bonjour ! Je suis l'Assistant Georges. Comment puis-je vous renseigner aujourd'hui sur les compétences, projets, tarifs ou services de Georges MOOMBO ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateLocalAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('tarif') || q.includes('prix') || q.includes('coût') || q.includes('combien')) {
      return "Les tarifs démarrent à 350 USD pour un site web vitrine professionnel, 650 USD pour un logiciel de gestion complet (stock, facturation, RH), 280 USD pour l'optimisation de base de données, et 150 USD pour la maintenance. Vous pouvez générer un devis précis en cliquant sur 'Demander un devis'.";
    }
    if (q.includes('contact') || q.includes('numéro') || q.includes('whatsapp') || q.includes('téléphone') || q.includes('email')) {
      return `Vous pouvez joindre Georges directement par WhatsApp ou appel au ${PORTFOLIO_INFO.phoneDisplay}, ou par e-mail à ${PORTFOLIO_INFO.email}. Il est basé à Kinshasa et répond sous 24h.`;
    }
    if (q.includes('stock') || q.includes('facture') || q.includes('caisse') || q.includes('projet')) {
      return "Georges a développé plusieurs solutions d'envergure en production à Kinshasa : un Système de Gestion de Stock avec valorisation PUMP et code-barres, un Système de Facturation conforme aux normes OHADA (USD/CDF), un module de point de vente POS tactile et un portail RH.";
    }
    if (q.includes('qui') || q.includes('profil') || q.includes('parcours') || q.includes('georges') || q.includes('formation')) {
      return "Georges MOOMBO MODEAWI est Développeur Full Stack et Consultant en Informatique de Gestion basé à Kinshasa (RDC). Il accompagne les entreprises et porteurs de projets dans la conception de logiciels métiers (gestion de stock, facturation OHADA, caisses POS), le développement d'applications web & mobiles, la modélisation de bases de données MySQL et la cybersécurité.";
    }
    if (q.includes('rendez-vous') || q.includes('rdv') || q.includes('rencontrer')) {
      return "Vous pouvez réserver un créneau horaire directement via le module 'Prendre Rendez-vous' sur le site, ou en écrivant sur WhatsApp pour fixer une rencontre à Kinshasa ou en visioconférence.";
    }
    if (q.includes('sécurité') || q.includes('cyber') || q.includes('sauvegarde')) {
      return "Georges applique la politique de sauvegarde 3-2-1 (NAS local + cloud chiffré), le contrôle d'accès strict par rôles (RBAC) et le filtrage réseau LAN pour immuniser les PME contre les rançongiciels et pertes de données.";
    }

    return "Georges MOOMBO est à votre disposition pour vos besoins en développement web, logiciels de gestion (stock, facturation, caisse), bases de données MySQL et cybersécurité. Souhaitez-vous demander un devis ou planifier un rendez-vous ?";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Check if GEMINI_API_KEY is available in environment
      // @ts-ignore
      const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;

      if (apiKey) {
        const ai = new GoogleGenAI({});
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${SYSTEM_PROMPT}\n\nQuestion de l'utilisateur : ${currentInput}`,
        });

        const reply = response.text?.trim() || generateLocalAnswer(currentInput);
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // High quality immediate knowledge response
        setTimeout(() => {
          const reply = generateLocalAnswer(currentInput);
          setMessages(prev => [...prev, {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 400);
      }
    } catch (err) {
      console.warn("Gemini API call fallback to local knowledge engine", err);
      const reply = generateLocalAnswer(currentInput);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Discuter avec l'Assistant Georges"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold text-xs pr-1">Assistant Georges</span>
      </button>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                  Assistant Georges <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <span className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> En ligne • Renseignements & Devis
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fermer l'assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 border-b border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] flex-shrink-0 no-scrollbar">
            <button
              onClick={() => {
                setInput("Quels sont les tarifs de vos services ?");
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-blue-500"
            >
              💰 Tarifs & Prix
            </button>
            <button
              onClick={() => {
                setInput("Parlez-moi de votre système de gestion de stock.");
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-blue-500"
            >
              📦 Logiciel Stock
            </button>
            <button
              onClick={() => {
                setInput("Comment prendre contact avec Georges ?");
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-blue-500"
            >
              📞 Contact & WhatsApp
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[10px] block mt-1 text-right ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs italic">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                Assistant Georges réfléchit...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick CTA Actions */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenQuoteModal();
              }}
              className="flex-1 py-1.5 px-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-bold transition-colors text-center"
            >
              Demander un devis
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAppointmentModal();
              }}
              className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold transition-colors text-center"
            >
              Prendre RDV
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Posez votre question à Georges..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl active:scale-95 transition-all"
              aria-label="Envoyer le message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
