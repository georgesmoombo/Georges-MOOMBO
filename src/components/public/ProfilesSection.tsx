import React, { useState } from 'react';
import { 
  UserCheck, Github, Linkedin, Twitter, Globe, 
  Mail, Phone, MapPin, ArrowRight, X, ExternalLink, 
  CheckCircle2, Sparkles, MessageSquare 
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ProfileItem } from '../../types/crm';

export const ProfilesSection: React.FC = () => {
  const { profiles } = useCrm();
  const [selectedBioProfile, setSelectedBioProfile] = useState<ProfileItem | null>(null);

  // Filter only active profiles and sort by order
  const activeProfiles = profiles
    .filter(p => p.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeProfiles.length === 0) {
    return null;
  }

  return (
    <section id="profils" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left fade-in-up">
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Identités & Expertises Professionnelles
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Profils Numériques & Direction Technique
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Chaque intervenant apporte une identité visuelle distincte et des compétences ciblées pour la réussite de vos projets d'informatisation et de sécurisation en RDC.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {activeProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-slate-50 dark:bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group fade-in-up zoom-in"
            >
              {/* Cover Banner */}
              <div className="relative h-40 sm:h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={profile.coverUrl || '/cover_photo.jpg'}
                  alt={`Couverture de ${profile.fullName}`}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                />
              </div>

              {/* Card Body */}
              <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Overlapping Avatar */}
                  <div className="-mt-14 mb-3 flex items-end justify-between">
                    <div className="relative">
                      <img
                        src={profile.avatarUrl || '/profile_photo.jpg'}
                        alt={`Photo de profil de ${profile.fullName}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-4 border-white dark:border-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                      />
                      <span
                        className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                        title="Disponible"
                      ></span>
                    </div>

                    {/* Social quick links */}
                    <div className="flex items-center gap-1.5 pb-1">
                      {profile.socialLinks.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {profile.socialLinks.whatsapp && (
                        <a
                          href={profile.socialLinks.whatsapp.startsWith('http') ? profile.socialLinks.whatsapp : `https://wa.me/${profile.socialLinks.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-sm"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.fullName}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {profile.roleTitle}
                    </p>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed line-clamp-3">
                    {profile.shortBio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    {profile.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        +{profile.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Public Contact details if enabled */}
                  {profile.contactInfo.showPublicly && (
                    <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      {profile.contactInfo.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span>{profile.contactInfo.location}</span>
                        </div>
                      )}
                      {profile.contactInfo.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <a href={`mailto:${profile.contactInfo.email}`} className="hover:underline">
                            {profile.contactInfo.email}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedBioProfile(profile)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Découvrir la biographie</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= BIOGRAPHY MODAL ================= */}
      {selectedBioProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Cover Header */}
            <div className="relative h-44 sm:h-52 bg-slate-950 overflow-hidden flex-shrink-0">
              <img
                src={selectedBioProfile.coverUrl || '/cover_photo.jpg'}
                alt={`Couverture ${selectedBioProfile.fullName}`}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <button
                onClick={() => setSelectedBioProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/70 text-white hover:bg-red-600 transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedBioProfile.avatarUrl || '/profile_photo.jpg'}
                    alt={selectedBioProfile.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-4 border-slate-900 shadow-2xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                  />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {selectedBioProfile.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-blue-400">
                      {selectedBioProfile.roleTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                  Présentation Générale
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{selectedBioProfile.shortBio}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                  Biographie & Parcours
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedBioProfile.biography}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                  Domaines d'Expertise & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBioProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact info in modal */}
              {selectedBioProfile.contactInfo.showPublicly && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1.5 text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Coordonnées professionnelles :</span>
                  {selectedBioProfile.contactInfo.location && <div>📍 Localisation : {selectedBioProfile.contactInfo.location}</div>}
                  {selectedBioProfile.contactInfo.email && <div>📧 Email : {selectedBioProfile.contactInfo.email}</div>}
                  {selectedBioProfile.contactInfo.phone && <div>📞 Téléphone : {selectedBioProfile.contactInfo.phone}</div>}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {selectedBioProfile.socialLinks.linkedin && (
                  <a
                    href={selectedBioProfile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:text-blue-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-500" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {selectedBioProfile.socialLinks.github && (
                  <a
                    href={selectedBioProfile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:text-blue-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedBioProfile(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
