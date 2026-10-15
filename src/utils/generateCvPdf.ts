import { jsPDF } from 'jspdf';
import { CV_THEMES, DEFAULT_CV_THEME } from '../data/cvThemes';
import { 
  CvThemeId, 
  ProfessionalExperience, 
  CvFooterSettings, 
  formatExperienceDuration 
} from '../types/crm';

export interface CvExportOptions {
  fullName?: string;
  roleTitle?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  themeId?: CvThemeId;
  experiences?: ProfessionalExperience[];
  footer?: CvFooterSettings;
  customSummary?: string;
}

// Convert image url to base64 safely
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if (!imageUrl) {
        resolve(null);
        return;
      }
      if (imageUrl.startsWith('data:image/')) {
        resolve(imageUrl);
        return;
      }
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataURL);
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = imageUrl;
    } catch {
      resolve(null);
    }
  });
}

export async function generateCvPdf(options?: CvExportOptions) {
  // Official name & job title requirements
  const fullName = 'Georges MOOMBO MODEAWI';
  const roleTitle = options?.roleTitle || "Expert en conception du système d'information";
  
  // Concise smart summary prioritized for 1-page A4
  const bio = options?.customSummary || options?.bio || 
    "Consultant expert en conception et informatisation des systèmes d'information, modélisation UML & bases relationnelles (MySQL), logiciels métiers de gestion (stocks, facturation bidevise OHADA, caisses POS) et sécurisation des données d'entreprise à Kinshasa et à distance.";
  
  const email = options?.email || "georgesweahmoombo@gmail.com";
  const phone = options?.phone || "+243 829 725 609";
  const location = options?.location || "Kinshasa, RDC";
  const github = options?.githubUrl || "github.com/georgesmoombo";
  const linkedin = options?.linkedinUrl || "linkedin.com/in/georges-moombo";
  const avatarUrl = options?.avatarUrl || "/profile_photo.jpg";

  // Selected Theme (reactive from options, or DOM CSS variables, or default)
  let theme = (options?.themeId && CV_THEMES[options.themeId]) ? CV_THEMES[options.themeId] : null;

  if (!theme && typeof document !== 'undefined') {
    const printableArea = document.getElementById('cv-printable-area');
    const primaryHex = printableArea 
      ? window.getComputedStyle(printableArea).getPropertyValue('--theme-primary').trim()
      : document.documentElement.style.getPropertyValue('--cv-theme-primary').trim();
    const accentHex = printableArea 
      ? window.getComputedStyle(printableArea).getPropertyValue('--theme-accent').trim()
      : document.documentElement.style.getPropertyValue('--cv-theme-accent').trim();

    if (primaryHex || accentHex) {
      const found = Object.values(CV_THEMES).find(
        t => (primaryHex && t.primaryHex.toLowerCase() === primaryHex.toLowerCase()) ||
             (accentHex && t.accentHex.toLowerCase() === accentHex.toLowerCase())
      );
      if (found) {
        theme = found;
      }
    }
  }

  if (!theme) {
    theme = DEFAULT_CV_THEME;
  }

  // Experiences (take top 3 prioritized for exact 1 page)
  const rawExperiences = options?.experiences && options.experiences.length > 0 
    ? options.experiences 
    : [
        {
          id: 'exp-1',
          position: 'Lead Développeur & Consultant Systèmes d\'Information',
          company: 'Cabinet Numérique & Indépendant',
          startDate: '2022-01',
          endDate: '',
          isCurrent: true,
          description: 'Pilotage de la conception et déploiement de logiciels métiers sur mesure (stocks, facturation OHADA, caisses POS).',
          achievements: [
            'Plus de 15 logiciels de gestion opérationnels déployés',
            'Réduction moyenne de 45% des pertes d\'inventaire client'
          ],
          skills: ['Conception SI', 'MySQL', 'React', 'PHP MVC', 'Normes OHADA'],
          location: 'Kinshasa',
          order: 1
        },
        {
          id: 'exp-2',
          position: 'Développeur Full Stack & Gestionnaire Bases de Données',
          company: 'Sociétés de Conseil & Distribution',
          startDate: '2020-03',
          endDate: '2021-12',
          isCurrent: false,
          description: 'Informatisation de la facturation bimonétaire (USD/CDF) et automatisation des inventaires.',
          achievements: [
            'Migration complète de registres papier vers bases SQL',
            'Édition inaltérable de factures et journal des ventes'
          ],
          skills: ['PHP', 'MySQL', 'JavaScript', 'Excel VBA', 'Réseaux'],
          location: 'Kinshasa',
          order: 2
        },
        {
          id: 'exp-3',
          position: 'Technicien Support IT & Formateur Bureautique',
          company: 'Services Numériques',
          startDate: '2019-01',
          endDate: '2020-02',
          isCurrent: false,
          description: 'Support matériel, sécurisation réseau et formation des équipes de gestion sur Excel avancé.',
          achievements: ['Plus de 200 dépannages avec zéro perte de données'],
          skills: ['Support IT', 'Sauvegarde 3-2-1', 'Excel TCD'],
          location: 'Kinshasa',
          order: 3
        }
      ];

  const experiences = [...rawExperiences]
    .sort((a, b) => a.order - b.order)
    .slice(0, 3); // Top 3 prioritized to enforce single A4 page

  // CV Footer Settings
  const footerSettings: CvFooterSettings = options?.footer || {
    showFooter: true,
    footerText: 'Curriculum Vitae certifié conforme • Références professionnelles disponibles sur demande.',
    professionalName: fullName,
    contactInfoText: `Tél : ${phone}  •  Email : ${email}`,
    confidentialityNotice: 'Document professionnel confidentiel.',
  };

  // Create A4 PDF doc in portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 10;
  const contentWidth = pageWidth - (marginX * 2); // 190mm

  // Fetch avatar image
  let photoData: string | null = null;
  try {
    photoData = await getBase64ImageFromUrl(avatarUrl);
  } catch {
    photoData = null;
  }

  // ========================================================
  // HEADER BANNER (Height: 33mm)
  // ========================================================
  const headerHeight = 33;
  doc.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Accent divider line below header
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.rect(0, headerHeight - 1.2, pageWidth, 1.2, 'F');

  // Avatar rendering
  const photoSize = 23;
  const photoX = marginX;
  const photoY = 5;
  const textStartX = photoData ? photoX + photoSize + 4.5 : marginX;

  if (photoData) {
    try {
      // Photo frame with theme accent border
      doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
      doc.roundedRect(photoX - 0.5, photoY - 0.5, photoSize + 1, photoSize + 1, 2, 2, 'F');
      doc.addImage(photoData, 'JPEG', photoX, photoY, photoSize, photoSize);
    } catch {
      // Graceful fallback without breaking
    }
  }

  // Name (Strictly Georges MOOMBO MODEAWI)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16.5);
  doc.text(fullName, textStartX, 12);

  // Professional Title with Theme Accent / Secondary
  doc.setTextColor(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(roleTitle.toUpperCase(), textStartX, 17);

  // Contact line in header
  doc.setTextColor(226, 232, 240); // slate-200
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const cleanPhone = phone.replace(/[^0-9+ ]/g, '').trim();
  const contactText1 = `Tél / WhatsApp : ${cleanPhone}   •   Email : ${email}   •   ${location}`;
  const contactText2 = `LinkedIn : ${linkedin.replace(/^https?:\/\//, '')}   •   GitHub : ${github.replace(/^https?:\/\//, '')}   •   Disponibilité : Immédiate`;
  doc.text(contactText1, textStartX, 22.5);
  doc.text(contactText2, textStartX, 27);

  // ========================================================
  // TWO-COLUMN LAYOUT (Height: ~245mm from Y=36 to Y=281)
  // Left Column: 58mm (Skills, Education, Languages, Tools)
  // Right Column: 128mm (Summary, Experiences, Realizations)
  // ========================================================
  const bodyTopY = 36;
  const colLeftWidth = 58;
  const colGap = 4;
  const colRightX = marginX + colLeftWidth + colGap;
  const colRightWidth = contentWidth - colLeftWidth - colGap; // 128mm

  // Left Column Background Card
  const leftColHeight = 244;
  doc.setFillColor(theme.bgCard[0], theme.bgCard[1], theme.bgCard[2]);
  doc.roundedRect(marginX, bodyTopY, colLeftWidth, leftColHeight, 2, 2, 'F');
  doc.setDrawColor(theme.border[0], theme.border[1], theme.border[2]);
  doc.setLineWidth(0.25);
  doc.roundedRect(marginX, bodyTopY, colLeftWidth, leftColHeight, 2, 2, 'S');

  // Helper for Section Titles in Columns
  const drawColTitle = (title: string, x: number, y: number, width: number, isLeftCol: boolean = false) => {
    // Title text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(title.toUpperCase(), x, y);

    // Accent line below title
    doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.rect(x, y + 1.2, isLeftCol ? width - 4 : width, 0.45, 'F');
  };

  // --------------------------------------------------------
  // LEFT COLUMN CONTENT
  // --------------------------------------------------------
  let leftY = bodyTopY + 5;
  const leftInnerX = marginX + 3.5;
  const leftInnerWidth = colLeftWidth - 7;

  // 1. COMPÉTENCES CLÉS
  drawColTitle("Compétences Clés", leftInnerX, leftY, leftInnerWidth, true);
  leftY += 4.5;

  const coreSkills = [
    { title: "Conception SI & UML", desc: "Use cases, classes, séquences, 3NF, architecture SI" },
    { title: "Comptabilité OHADA", desc: "Facturation bimonétaire, stocks FIFO/PUMP" },
    { title: "Bases de Données MySQL", desc: "Requêtes complexes, triggers, intégrité" },
    { title: "Développement Full Stack", desc: "React, TypeScript, PHP MVC, REST" },
    { title: "Cybersécurité & Sauvegarde", desc: "RBAC, stratégie 3-2-1, défense LAN" },
    { title: "Bureautique Décisionnelle", desc: "Excel expert, formules complexes, TCD" },
  ];

  coreSkills.forEach(s => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
    doc.text(`▸ ${s.title}`, leftInnerX, leftY);
    leftY += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
    const lines = doc.splitTextToSize(s.desc, leftInnerWidth - 2);
    doc.text(lines, leftInnerX + 2, leftY);
    leftY += (lines.length * 2.8) + 1.8;
  });

  leftY += 1.5;

  // 2. FORMATION & DIPLÔMES
  drawColTitle("Formation & Diplômes", leftInnerX, leftY, leftInnerWidth, true);
  leftY += 4.5;

  const education = [
    {
      title: "Diplôme Supérieur en Informatique de Gestion & Conception de SI",
      school: "Enseignement Supérieur Technique",
      detail: "Modélisation UML & relationnelle, bases MySQL, gestion de projets informatiques & comptabilité."
    },
    {
      title: "Spécialisation Full Stack & Web",
      school: "Formation Continue Professionnelle",
      detail: "React, TypeScript, API REST, architecture MVC."
    },
    {
      title: "Sécurité des Systèmes d'Information",
      school: "Pratique Opérationnelle Terrain",
      detail: "Politiques RBAC, audits LAN, sauvegardes 3-2-1."
    }
  ];

  education.forEach(e => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
    const titleLines = doc.splitTextToSize(`• ${e.title}`, leftInnerWidth);
    doc.text(titleLines, leftInnerX, leftY);
    leftY += titleLines.length * 2.9;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.3);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(e.school, leftInnerX + 2, leftY);
    leftY += 2.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
    const detLines = doc.splitTextToSize(e.detail, leftInnerWidth - 2);
    doc.text(detLines, leftInnerX + 2, leftY);
    leftY += (detLines.length * 2.6) + 2.2;
  });

  leftY += 1.5;

  // 3. LANGUES & MOBILITÉ
  drawColTitle("Langues & Mobilité", leftInnerX, leftY, leftInnerWidth, true);
  leftY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
  doc.text("• Français : Courant / Langue de travail", leftInnerX, leftY);
  leftY += 3.3;
  doc.text("• Lingala : Langue maternelle (Courant)", leftInnerX, leftY);
  leftY += 3.3;
  doc.text("• Anglais : Technique & Documentation IT", leftInnerX, leftY);
  leftY += 3.3;
  doc.text("• Mobilité : Kinshasa & Missions distance", leftInnerX, leftY);

  // --------------------------------------------------------
  // RIGHT COLUMN CONTENT
  // --------------------------------------------------------
  let rightY = bodyTopY + 5;

  // 1. PROFIL PROFESSIONNEL & SYNTHÈSE
  drawColTitle("Profil Professionnel & Synthèse", colRightX, rightY, colRightWidth);
  rightY += 4.8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
  const bioLines = doc.splitTextToSize(bio, colRightWidth);
  doc.text(bioLines, colRightX, rightY);
  rightY += (bioLines.length * 3.3) + 4.5;

  // 2. EXPÉRIENCES PROFESSIONNELLES (DYNAMIC & FULLY MODIFIABLE)
  drawColTitle("Expériences Professionnelles & Réalisations", colRightX, rightY, colRightWidth);
  rightY += 4.8;

  experiences.forEach((exp) => {
    // Format duration string
    const duration = formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent);
    const startYear = exp.startDate ? exp.startDate.slice(0, 7) : '';
    const endYear = exp.isCurrent ? 'Présent' : (exp.endDate ? exp.endDate.slice(0, 7) : '');
    const dateLabel = `${startYear} - ${endYear} • (${duration})`;

    // Position Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
    doc.text(exp.position, colRightX, rightY);

    // Date Badge on right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(dateLabel, colRightX + colRightWidth, rightY, { align: 'right' });
    rightY += 3.4;

    // Company & Location
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(`${exp.company} ${exp.location ? `— ${exp.location}` : ''}`, colRightX, rightY);
    rightY += 3.2;

    // Description
    if (exp.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
      const descLines = doc.splitTextToSize(exp.description, colRightWidth);
      doc.text(descLines, colRightX, rightY);
      rightY += (descLines.length * 3.0) + 0.8;
    }

    // Key Achievements (Top 2)
    if (exp.achievements && exp.achievements.length > 0) {
      const topAchievements = exp.achievements.slice(0, 2);
      topAchievements.forEach(ach => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.4);
        doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
        const achLines = doc.splitTextToSize(`✔ ${ach}`, colRightWidth - 2);
        doc.text(achLines, colRightX + 1.5, rightY);
        rightY += (achLines.length * 2.8) + 0.4;
      });
    }

    // Associated skills badges
    if (exp.skills && exp.skills.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
      doc.text(`Compétences : ${exp.skills.slice(0, 5).join(' • ')}`, colRightX, rightY);
      rightY += 3.6;
    } else {
      rightY += 2;
    }
  });

  rightY += 1.5;

  // 3. PROJETS PHARES D'INFORMATISATION
  drawColTitle("Solutions Logicielles Métiers Déployées", colRightX, rightY, colRightWidth);
  rightY += 4.8;

  const keyProjects = [
    {
      title: "Gestion de Stock & Inventaires Automatisés",
      stack: "MySQL, PHP, React",
      impact: "-45% d'écarts d'inventaire",
      desc: "Suivi des mouvements en temps réel, alertes ruptures et valorisation FIFO/PUMP pour dépôts grossistes."
    },
    {
      title: "Facturation Commerciale aux Normes OHADA",
      stack: "Bidevise USD/CDF, UML & MySQL",
      impact: "70% de temps gagné en clôture",
      desc: "Édition inaltérable de factures normalisées, suivi des créances et journal des ventes exportable."
    },
    {
      title: "Caisse Enregistreuse & Point de Vente (POS)",
      stack: "Interface tactile, Mobile Money",
      impact: "Encaissement < 15 secondes",
      desc: "Vente au comptoir, impression tickets, multi-règlements et clôtures journalières automatisées (X/Z)."
    },
    {
      title: "Audit de Sécurité & Durcissement Réseau PME",
      stack: "Sauvegarde 3-2-1, VLAN, Firewall",
      impact: "100% de résilience intrusion",
      desc: "Segmentation réseau, isolation comptable, chiffrement des données et formation anti-phishing."
    }
  ];

  const maxAllowedY = footerSettings.showFooter ? pageHeight - 16 : pageHeight - 8;

  keyProjects.forEach(p => {
    if (rightY + 9 > maxAllowedY) return; // Prevent any spill beyond single page

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(theme.textDark[0], theme.textDark[1], theme.textDark[2]);
    doc.text(p.title, colRightX, rightY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(`[ ${p.impact} ]`, colRightX + colRightWidth, rightY, { align: 'right' });
    rightY += 2.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
    const pLines = doc.splitTextToSize(p.desc, colRightWidth);
    doc.text(pLines, colRightX, rightY);
    rightY += (pLines.length * 2.7) + 2.2;
  });

  // ========================================================
  // CV FOOTER (Strictly fits on Page 1 before 297mm!)
  // ========================================================
  if (footerSettings.showFooter) {
    const footerY = pageHeight - 11;

    // Thin separator line matching theme border
    doc.setDrawColor(theme.border[0], theme.border[1], theme.border[2]);
    doc.setLineWidth(0.3);
    doc.line(marginX, footerY, pageWidth - marginX, footerY);

    // Footer text with theme primary/muted
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
    doc.text(
      `${footerSettings.footerText}  •  ${footerSettings.professionalName}`,
      marginX,
      footerY + 4
    );

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.2);
    doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.text(
      footerSettings.confidentialityNotice || 'Document officiel • Reproduction interdite sans accord',
      pageWidth - marginX,
      footerY + 4,
      { align: 'right' }
    );

    // Optional second line with contact or timestamp
    if (footerSettings.contactInfoText) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(theme.textMuted[0], theme.textMuted[1], theme.textMuted[2]);
      doc.text(footerSettings.contactInfoText, marginX, footerY + 7.5);
      doc.text(`Thème : ${theme.name} • Format A4 certifié`, pageWidth - marginX, footerY + 7.5, { align: 'right' });
    }
  }

  // Strict Guarantee: Single-Page A4 enforcement
  const totalPages = doc.getNumberOfPages();
  if (totalPages > 1) {
    for (let p = totalPages; p > 1; p--) {
      doc.deletePage(p);
    }
  }

  // Filename requirement
  const fileName = 'CV_Georges_MOOMBO_MODEAWI.pdf';
  doc.save(fileName);
}
