import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Moon, Sun, Download, Phone, Mail, MapPin, 
  ChevronUp, LayoutDashboard, Database, Receipt, GraduationCap, 
  Server, Code, Boxes, FileSpreadsheet, Users, Wallet, Globe, 
  UserCheck, HardDrive, CheckCircle2, Award, Briefcase, Cpu, 
  ArrowRight, ShieldCheck, Clock, ExternalLink, Sparkles, Filter, 
  FileText, MessageSquare, Calendar, Calculator, Lock,
  Compass, Target, Eye, Rocket, Home, User, BookOpen, Layers,
  Image as ImageIcon, HelpCircle, Github, Linkedin, Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PORTFOLIO_INFO, STATS, PROJECTS, SKILLS_CATEGORIES, 
  SERVICES, ACHIEVEMENTS, TESTIMONIALS, Project 
} from '../data/portfolioData';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { CVModal } from '../components/CVModal';
import { ContactSection } from '../components/ContactSection';
import { QuoteRequestModal } from '../components/QuoteRequestModal';
import { AppointmentModal } from '../components/AppointmentModal';
import { AIAssistantWidget } from '../components/AIAssistantWidget';
import { CyberSecuritySection } from '../components/public/CyberSecuritySection';
import { CertificationsSection } from '../components/public/CertificationsSection';
import { BlogSection } from '../components/public/BlogSection';
import { FAQSection } from '../components/public/FAQSection';
import { TrackRequestSection } from '../components/public/TrackRequestSection';
import { NewsletterSection } from '../components/public/NewsletterSection';
import { GallerySection } from '../components/public/GallerySection';
import { ProfilesSection } from '../components/public/ProfilesSection';
import { ExperiencesSection } from '../components/public/ExperiencesSection';
import { useCrm } from '../context/CrmContext';
import { useRouter, Link } from '../router/RouterContext';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { calculateNonOverlappingYears } from '../types/crm';

export const PublicApp: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const { systemSettings, adminProfile, profiles, experiences, siteFooterSettings } = useCrm();
  const { scrollProgress } = useScrollAnimations();

  const totalExperienceYears = calculateNonOverlappingYears(experiences);
  const [activeLegalModal, setActiveLegalModal] = useState<'legal' | 'privacy' | null>(null);

  const georgesProfile = profiles.find(p => p.id === 'prof-1') || profiles[0];
  const coverImage = georgesProfile?.coverUrl || adminProfile.coverUrl || '/cover_photo.jpg';
  const profileImage = georgesProfile?.avatarUrl || adminProfile.avatarUrl || '/profile_photo.jpg';

  // Synchronisation dynamique totale avec les données du Tableau de Bord
  let rawName = georgesProfile?.fullName || adminProfile.name || 'Georges MOOMBO MODEAWI';
  if (rawName.includes('MOOMBO MODEAWI Georges') || rawName.includes('SERVANT')) {
    rawName = 'Georges MOOMBO MODEAWI';
  }
  const activeFullName = rawName;
  const nameParts = activeFullName.trim().split(/\s+/);
  const firstWord = nameParts[0] || 'Georges';
  const otherWords = nameParts.slice(1);
  const initials = 'GM';
  const shortDisplayName = 'Georges M.';

  let rawRole = georgesProfile?.roleTitle || adminProfile.title || "Expert en conception du système d'information & Développeur Full Stack";
  if (rawRole.toLowerCase().includes('informatique de gestion')) {
    rawRole = rawRole.replace(/informatique de gestion/gi, "conception du système d'information");
  }
  const activeRoleTitle = rawRole;
  const activeBio = georgesProfile?.biography || georgesProfile?.shortBio || adminProfile.bio || "Architecte d'écosystèmes numériques, je conçois des systèmes d'information robustes, automatise les processus de gestion et sécurise les infrastructures critiques.";
  const activeLocation = georgesProfile?.contactInfo?.location || (adminProfile.city ? `${adminProfile.city}, ${adminProfile.country || 'RDC'}` : 'Kinshasa, RDC & À distance');
  
  const rawWhatsApp = georgesProfile?.contactInfo?.whatsapp || adminProfile.whatsapp || PORTFOLIO_INFO.phone;
  const cleanWhatsApp = rawWhatsApp.startsWith('http') ? rawWhatsApp : `https://wa.me/${rawWhatsApp.replace(/\D/g, '') || '243829725609'}`;
  
  const activeGithub = georgesProfile?.socialLinks?.github || adminProfile.githubUrl || "https://github.com/georgesmoombo";
  const activeLinkedin = georgesProfile?.socialLinks?.linkedin || adminProfile.linkedinUrl || "https://linkedin.com/in/georges-moombo";
  const activeFacebook = (georgesProfile?.socialLinks as any)?.facebook || (adminProfile as any).facebookUrl || "https://facebook.com/georgesmoombo";

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string>('');

  // Filters state
  const [projectFilter, setProjectFilter] = useState<string>('Tous');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('Toutes');

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Check URL path for deep route handling (e.g. /quote, /appointment, /projects/:id)
  useEffect(() => {
    if (pathname === '/quote') {
      setIsQuoteModalOpen(true);
    } else if (pathname === '/appointment') {
      setIsAppointmentModalOpen(true);
    } else if (pathname === '/gallery') {
      const el = document.getElementById('galerie');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/profiles') {
      const el = document.getElementById('profils');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname.startsWith('/projects/')) {
      const pId = pathname.replace('/projects/', '');
      const p = PROJECTS.find(proj => proj.id === pId);
      if (p) setSelectedProject(p);
    }
  }, [pathname]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
      
      const sections = ['accueil', 'a-propos', 'profils', 'experiences', 'competences', 'cybersecurite', 'projets', 'galerie', 'services', 'certifications', 'blog', 'faq', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'À propos', href: '#a-propos' },
    { name: 'Profils', href: '#profils' },
    { name: 'Expériences', href: '#experiences' },
    { name: 'Compétences', href: '#competences' },
    { name: 'Cybersécurité', href: '#cybersecurite' },
    { name: 'Projets', href: '#projets' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Services', href: '#services' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Blog', href: '#blog' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const dockItems = [
    { id: 'accueil', label: 'Accueil', href: '#accueil', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'a-propos', label: 'À propos', href: '#a-propos', icon: <User className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'profils', label: 'Profils', href: '#profils', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'competences', label: 'Compétences', href: '#competences', icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'cybersecurite', label: 'Cybersécurité', href: '#cybersecurite', icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'projets', label: 'Projets', href: '#projets', icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'services', label: 'Services', href: '#services', icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'galerie', label: 'Galerie', href: '#galerie', icon: <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'faq', label: 'FAQ', href: '#faq', icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'contact', label: 'Contact', href: '#contact', icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'devis', label: 'Devis', href: '#devis', icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, action: () => setIsQuoteModalOpen(true) },
    { id: 'cv', label: 'Télécharger mon CV (PDF)', href: '#cv', icon: <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />, action: () => setIsCVModalOpen(true) },
  ];

  const filteredProjects = projectFilter === 'Tous'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === projectFilter);

  const filteredSkillsCategories = skillCategoryFilter === 'Toutes'
    ? SKILLS_CATEGORIES
    : SKILLS_CATEGORIES.filter(c => c.category === skillCategoryFilter);

  return (
    <div className="min-h-screen bg-[#f3f7fd] dark:bg-[#080d19] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-blue-600 selection:text-white pb-28">
      {/* Scroll Reading Progress Indicator */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }} 
        role="progressbar" 
        aria-valuenow={Math.round(scrollProgress)} 
        aria-valuemin={0} 
        aria-valuemax={100} 
      />

      {/* Ambient background glows & gentle luminous floating particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-36 left-1/4 w-[650px] h-[650px] bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-24 w-[550px] h-[550px] bg-cyan-400/12 dark:bg-cyan-500/12 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 -left-28 w-[600px] h-[600px] bg-indigo-400/12 dark:bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[140px]" />
        {/* Subtle decorative glowing dots */}
        <div className="absolute top-28 left-[18%] w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
        <div className="absolute top-52 right-[20%] w-2 h-2 rounded-full bg-blue-400/40 animate-ping duration-1000" />
        <div className="absolute top-[40%] left-[8%] w-1.5 h-1.5 rounded-full bg-indigo-400/45 animate-pulse" />
        <div className="absolute top-[65%] right-[12%] w-2 h-2 rounded-full bg-purple-400/35 animate-pulse" />
      </div>
      
      {/* Maintenance Mode Banner */}
      {systemSettings.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 py-2.5 px-4 text-center text-xs font-black tracking-wide uppercase sticky top-0 z-50 flex items-center justify-center gap-2 shadow-md">
          <span>⚠️ Note d'information : Plateforme en maintenance programmée. Les demandes de devis et prises de rendez-vous restent traitées en priorité.</span>
        </div>
      )}

      {/* ================= PUBLIC NAVBAR (Base44 Premium Style) ================= */}
      <header className="fixed top-0 w-full z-40 bg-white/80 dark:bg-[#080d19]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Identity matching Screenshot 28 */}
          <div className="flex items-center gap-3">
            <a href="#accueil" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {shortDisplayName}
              </span>
            </a>

            {/* Disponibilité Indicator matching Screenshot 28 */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/60 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              Disponible pour vos projets
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const sectionId = link.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <a 
                  key={link.name} 
                  href={link.href}
                  className={`text-xs font-semibold transition-all relative py-1 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle - Circular Button matching Screenshot 28 */}
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 shadow-sm transition-all cursor-pointer"
              aria-label="Mode sombre/clair"
              title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Devis Quick CTA */}
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" /> Devis Gratuit
            </button>

            {/* Télécharger mon CV Quick CTA */}
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Télécharger mon CV au format PDF"
            >
              <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Télécharger mon CV</span>
            </button>

            {/* Mobile Hamburger */}
            <button 
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-5 py-6 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((link) => (
                    <a 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCVModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Télécharger mon CV (PDF)
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsQuoteModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" /> Demander un devis immédiat
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAppointmentModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" /> Prendre Rendez-vous
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= PUBLIC CONTENT ================= */}
      <main>
        {/* ================= HERO SECTION (Base44 Premium Style - Screenshot 28) ================= */}
        <section id="accueil" className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 overflow-hidden scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Big Bold Typography & CTA Actions */}
              <div className="lg:col-span-7 space-y-6 fade-in-left">
                {/* Mobile Photo Presentation if viewport is small */}
                <div className="flex items-center gap-4 lg:hidden pb-2">
                  <div className="relative shrink-0">
                    <img 
                      src={profileImage} 
                      alt={activeFullName} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                    />
                    <span 
                      className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" 
                      title="Disponible pour vos projets"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                      Disponible pour vos projets
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{activeLocation}</p>
                  </div>
                </div>

                {/* Giant Typography matching Screenshot 28 */}
                <h1 className="tracking-tight leading-[0.92] text-slate-900 dark:text-white font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="block text-slate-950 dark:text-white">{firstWord}</span>
                  {otherWords.length > 0 ? (
                    otherWords.map((word, idx) => (
                      <span key={idx} className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                        {word}
                      </span>
                    ))
                  ) : (
                    <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                      PORTFOLIO
                    </span>
                  )}
                </h1>

                {/* Domains / Subtitle in Cyan matching Screenshot 28 */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-sm sm:text-base font-semibold text-cyan-600 dark:text-cyan-400">
                  {activeRoleTitle.includes('•') ? (
                    activeRoleTitle.split('•').map((item, i, arr) => (
                      <React.Fragment key={i}>
                        <span>{item.trim()}</span>
                        {i < arr.length - 1 && <span className="text-cyan-400">•</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>{activeRoleTitle}</span>
                  )}
                </div>

                {/* Professional Bio */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {activeBio}
                </p>

                {/* 4 Action Buttons matching Screenshot 28 */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* 1. Voir mes projets */}
                  <a
                    href="#projets"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    Voir mes projets <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* 2. Télécharger CV */}
                  <button
                    onClick={() => setIsCVModalOpen(true)}
                    className="px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" /> Télécharger CV
                  </button>

                  {/* 3. Me contacter */}
                  <a
                    href="#contact"
                    className="px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Me contacter
                  </a>

                  {/* 4. Demander un devis */}
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" /> Demander un devis
                  </button>
                </div>

                {/* Social Networks Icons matching Screenshot 28 */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                  <a 
                    href={activeGithub} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:text-blue-600 hover:border-blue-400/50 transition-all shadow-sm" 
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href={activeLinkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:text-blue-600 hover:border-blue-400/50 transition-all shadow-sm" 
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href={activeFacebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:text-blue-600 hover:border-blue-400/50 transition-all shadow-sm" 
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href={cleanWhatsApp} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:text-emerald-600 hover:border-emerald-400/50 transition-all shadow-sm" 
                    title="WhatsApp direct"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Large True Photo with Floating Badges matching Screenshot 28 */}
              <div className="lg:col-span-5 fade-in-right relative">
                <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                  {/* Subtle Colored Aura Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-purple-500/20 rounded-[2.5rem] blur-2xl -z-10" />

                  {/* Main Portrait Card (True Photo Sitting in Leather Chair) */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[4/5] sm:aspect-[3/4]">
                    <img
                      src={profileImage}
                      alt={`${activeFullName} - ${activeRoleTitle}`}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/profile_photo.jpg'; }}
                    />
                  </div>

                  {/* Floating Stat Badge 1 (Top-Left matching Screenshot 28: dynamically calculated years) */}
                  <div className="absolute -top-4 -left-4 sm:-left-8 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 z-20">
                    <div className="text-2xl sm:text-3xl font-black text-cyan-500">
                      +{totalExperienceYears}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                      ans d'expérience
                    </div>
                  </div>

                  {/* Floating Stat Badge 2 (Bottom-Right matching Screenshot 28: +20 projets livrés) */}
                  <div className="absolute -bottom-4 -right-4 sm:-right-8 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 z-20">
                    <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      +20
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                      projets livrés
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= SECTION À PROPOS (Base44 Premium Style - Screenshot 29) ================= */}
        <section id="a-propos" className="py-24 relative overflow-hidden scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header matching Screenshot 29 */}
            <div className="mb-14 space-y-3 fade-in-up">
              {/* Kicker • 01 — À PROPOS */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>01 — À PROPOS</span>
              </div>

              {/* Title with violet gradient on "numériques" */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Architecte d'écosystèmes{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  numériques
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                Je transforme des problèmes complexes en systèmes élégants, performants et sécurisés.
              </p>
            </div>

            {/* 4 Cards Grid (Parcours, Objectifs, Vision, Expertise) matching Screenshot 29 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children mb-14">
              
              {/* Card 1: Parcours */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400/40 transition-all flex flex-col justify-between fade-in-up">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Parcours
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Informaticien passionné, formé au génie logiciel, aux systèmes d'information et à la cybersécurité. Un parcours orienté vers l'excellence technique.
                  </p>
                </div>
              </div>

              {/* Card 2: Objectifs */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between fade-in-up">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Objectifs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Concevoir des systèmes fiables et sûrs, automatiser l'ennuyeux, sécuriser l'essentiel et accompagner les organisations dans leur transformation digitale.
                  </p>
                </div>
              </div>

              {/* Card 3: Vision */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400/40 transition-all flex flex-col justify-between fade-in-up">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Un monde numérique résilient, où chaque organisation — petite ou grande — accède à des technologies robustes, sécurisées et humaines.
                  </p>
                </div>
              </div>

              {/* Card 4: Expertise */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-400/40 transition-all flex flex-col justify-between fade-in-up">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Expertise
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Développement full stack, sécurité offensive & défensive, administration systèmes et réseaux, cloud et intelligence artificielle.
                  </p>
                </div>
              </div>

            </div>

            {/* Row of 4 Stats below cards matching Screenshot 29 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm stagger-children mb-12">
              <div className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">{totalExperienceYears}+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Ans d'expérience</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">20+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Projets livrés</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">3</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Langues parlées</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Français, Anglais, Lingala</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">6+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Domaines d'expertise</div>
              </div>
            </div>

            {/* Preservation of Enterprise & OHADA context card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Spécialisation Entreprise & Kinshasa (RDC)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Solutions de Gestion, POS & Facturation OHADA (USD / CDF)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Accompagnement opérationnel pour PME et commerces : inventaires en temps réel, caisses point de vente, contrôle d'accès sécurisé et protection de vos bases de données MySQL.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" /> Demander un devis
                  </button>
                  <button 
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" /> Prendre rendez-vous
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PROFILS */}
        <ProfilesSection />

        {/* EXPÉRIENCES PROFESSIONNELLES (DYNAMIC & FULLY ADMINISTERED) */}
        <ExperiencesSection onOpenCVModal={() => setIsCVModalOpen(true)} />

        {/* COMPÉTENCES */}
        <section id="competences" className="py-24 bg-white dark:bg-slate-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:text-left fade-in-up">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">Savoir-Faire Technique</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Mes Compétences Opérationnelles</h2>
              <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 stagger-children">
              {SKILLS_CATEGORIES.map((catGroup, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 fade-in-up">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">{catGroup.category}</h3>
                  <div className="space-y-4">
                    {catGroup.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-900 dark:text-white">{skill.name}</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${skill.level}%` }} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{skill.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CYBERSÉCURITÉ */}
        <CyberSecuritySection />

        {/* PROJETS */}
        <section id="projets" className="py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:text-left fade-in-up">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Projets Réalisés</h2>
              <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between fade-in-up zoom-in">
                  <div className="p-6 space-y-3">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase bg-blue-600 text-white rounded-full inline-block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-blue-600 dark:text-blue-400 font-bold">
                      Impact : {project.metrics}
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Voir détails & Partager <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALERIE */}
        <GallerySection
          onSelectForQuote={(name) => {
            setContactSubject(`Demande de devis pour : ${name}`);
            setIsQuoteModalOpen(true);
          }}
          onOpenProjectDetails={(id) => {
            const p = PROJECTS.find(proj => proj.id === id);
            if (p) setSelectedProject(p);
          }}
        />

        {/* SERVICES */}
        <section id="services" className="py-24 bg-white dark:bg-slate-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center md:text-left fade-in-up">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">Prestations</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Services & Accompagnement</h2>
              <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {SERVICES.map((srv) => (
                <div key={srv.id} className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between fade-in-up zoom-in">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{srv.title}</h3>
                      <span className="text-sm font-black text-blue-600 font-mono">Dès {srv.startingPrice} {srv.currency}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">{srv.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setContactSubject(`Demande de devis : ${srv.title}`);
                      setIsQuoteModalOpen(true);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Demander un devis <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <CertificationsSection />

        {/* TÉMOIGNAGES */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 fade-in-up">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Témoignages</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ce que disent mes clients</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl space-y-4 fade-in-up">
                  <p className="text-xs sm:text-sm text-slate-300 italic">"{t.quote}"</p>
                  <div className="border-t border-slate-700 pt-3 text-xs">
                    <div className="font-bold text-blue-400">{t.author}</div>
                    <div className="text-slate-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG */}
        <BlogSection />

        {/* SUIVI PROSPECT */}
        <TrackRequestSection />

        {/* FAQ */}
        <FAQSection />

        {/* NEWSLETTER */}
        <NewsletterSection />

        {/* CONTACT */}
        <ContactSection initialSubject={contactSubject} />

        {/* FOOTER */}
        <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {siteFooterSettings.professionalName || activeFullName}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  {siteFooterSettings.shortSlogan || activeRoleTitle}
                </p>

                {siteFooterSettings.showContactInfo && (
                  <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>{siteFooterSettings.contactEmail || "georgesweahmoombo@gmail.com"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>{siteFooterSettings.contactPhone || "+243 829 725 609"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{siteFooterSettings.contactLocation || "Kinshasa, République Démocratique du Congo"}</span>
                    </div>
                  </div>
                )}

                {/* Social icons */}
                <div className="flex items-center gap-2 pt-2">
                  {siteFooterSettings.socialLinks?.github && (
                    <a href={siteFooterSettings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors" title="GitHub">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {siteFooterSettings.socialLinks?.linkedin && (
                    <a href={siteFooterSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors" title="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {siteFooterSettings.socialLinks?.whatsapp && (
                    <a href={siteFooterSettings.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors" title="WhatsApp direct">
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                  {siteFooterSettings.socialLinks?.portfolio && (
                    <a href={siteFooterSettings.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-500 transition-colors" title="Site officiel">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Navigation Publique</h4>
                <ul className="space-y-2 text-xs">
                  {(siteFooterSettings.navLinks && siteFooterSettings.navLinks.length > 0
                    ? siteFooterSettings.navLinks
                    : [
                        { label: 'Accueil', href: '#accueil' },
                        { label: 'À propos', href: '#a-propos' },
                        { label: 'Profils & Équipe', href: '#profils' },
                        { label: 'Projets', href: '#projets' },
                        { label: 'Galerie & Réalisations', href: '#galerie' },
                        { label: 'Services', href: '#services' },
                        { label: 'Blog technique', href: '#blog' },
                      ]
                  ).map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.href} className="hover:text-blue-600 text-slate-600 dark:text-slate-400 transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Espaces & Documents</h4>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li>
                    <Link to="/client" className="hover:text-blue-600 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" /> Espace Client & Suivi Projets
                    </Link>
                  </li>
                  <li className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => setIsCVModalOpen(true)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <Download className="w-3.5 h-3.5" /> Télécharger mon CV (PDF)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="hover:text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer text-slate-400 text-left"
                    >
                      <Calculator className="w-3.5 h-3.5" /> Demander un devis personnalisé
                    </button>
                  </li>
                  <li className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                    <button
                      onClick={() => setActiveLegalModal('legal')}
                      className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer"
                    >
                      Mentions Légales
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setActiveLegalModal('privacy')}
                      className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer"
                    >
                      Confidentialité
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <p>
                © {siteFooterSettings.yearMode === 'auto' ? new Date().getFullYear() : siteFooterSettings.manualYear}{' '}
                {siteFooterSettings.professionalName || activeFullName}. {siteFooterSettings.copyrightText}
              </p>
              {siteFooterSettings.complementaryText && (
                <p className="text-[11px] text-slate-400">{siteFooterSettings.complementaryText}</p>
              )}
            </div>
          </div>
        </footer>

        {/* Legal & Privacy Modals */}
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  {activeLegalModal === 'legal' ? "Mentions Légales" : "Politique de Confidentialité"}
                </h3>
                <button 
                  onClick={() => setActiveLegalModal(null)} 
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
                {activeLegalModal === 'legal' ? siteFooterSettings.legalNotice : siteFooterSettings.privacyPolicy}
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveLegalModal(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onSelectForQuote={(name) => {
          setContactSubject(`Demande de devis : ${name}`);
          setIsQuoteModalOpen(true);
        }}
      />

      <CVModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
      />

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      <AIAssistantWidget 
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
      />

      {/* ================= FLOATING DOCK NAVIGATION (Base44 Style - Screenshots 28 & 29) ================= */}
      <nav aria-label="Navigation flottante" className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
        <div className="px-2 sm:px-3 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
          {dockItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
                title={item.label}
                aria-label={item.label}
                className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center relative group ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {/* Discrete tooltip */}
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* BACK TO TOP (Matching circular button in Screenshot 29) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 sm:right-8 p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-blue-600 dark:text-blue-400 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 cursor-pointer"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};
