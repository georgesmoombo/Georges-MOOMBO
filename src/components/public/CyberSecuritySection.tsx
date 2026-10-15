import React from 'react';
import { ShieldCheck, Lock, Database, RefreshCw, Key, FileWarning, CheckCircle2 } from 'lucide-react';

export const CyberSecuritySection: React.FC = () => {
  const pillars = [
    {
      icon: Database,
      title: "Règle de Sauvegarde 3-2-1 Chiffrée",
      desc: "3 copies des données comptables et commerciales sur 2 supports différents (serveur NAS local + coffre-fort cloud chiffré AES-256), dont 1 copie physique déconnectée pour prévenir les rançongiciels."
    },
    {
      icon: Key,
      title: "Contrôle d'Accès basé sur les Rôles (RBAC)",
      desc: "Chaque collaborateur ne dispose que des privilèges stricts nécessaires à sa mission. Verrouillage des modifications rétroactives sur les pièces comptables et écritures de stock."
    },
    {
      icon: Lock,
      title: "Segmentation Réseau LAN & Pare-Feu",
      desc: "Isolation des serveurs de gestion et postes administratifs par rapport aux accès Wi-Fi visiteurs. Filtrage des flux et fermeture des ports vulnérables."
    },
    {
      icon: RefreshCw,
      title: "Plan de Reprise d'Activité (PRA)",
      desc: "Procédures testées de restauration d'urgence permettant de redémarrer l'ensemble des systèmes informatiques en moins de 2 heures en cas de panne matérielle ou sinistre."
    }
  ];

  return (
    <section id="cybersecurite" className="py-24 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 text-center md:text-left fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" /> Sécurité des Systèmes d'Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            La Cybersécurité : Pilier Fondamental de Toute Entreprise Pérenne
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-500 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            À l'ère où les rançongiciels et pertes accidentelles menacent la survie des PME, chaque application et réseau conçu par Georges MOOMBO MODEAWI intègre une politique de défense en profondeur.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 fade-in-up zoom-in"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Standard garanti
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner: Audit gratuit */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-800 to-indigo-950 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">
              Vous suspectez des vulnérabilités dans votre parc informatique ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Demandez un audit préventif de vos postes, sauvegardes et réseaux à Kinshasa.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-lg shadow-blue-600/30"
          >
            Solliciter un Diagnostic de Sécurité
          </a>
        </div>

      </div>
    </section>
  );
};
