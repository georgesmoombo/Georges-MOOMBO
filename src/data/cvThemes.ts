import { CvThemeId, CvThemeConfig } from '../types/crm';

export const CV_THEMES: Record<CvThemeId, CvThemeConfig> = {
  'blue-pro': {
    id: 'blue-pro',
    name: 'Bleu professionnel',
    description: 'Palette classique et autoritaire : bleu marine profond, bleu royal et accents cyan.',
    primary: [15, 23, 42],        // #0f172a (Navy)
    primaryHex: '#0f172a',
    accent: [37, 99, 235],        // #2563eb (Royal Blue)
    accentHex: '#2563eb',
    secondary: [56, 189, 248],    // #38bdf8 (Sky Cyan)
    secondaryHex: '#38bdf8',
    textDark: [30, 41, 59],       // #1e293b
    textMuted: [100, 116, 139],   // #64748b
    bgCard: [248, 250, 252],      // #f8fafc
    bgCardHex: '#f8fafc',
    border: [226, 232, 240],      // #e2e8f0
    borderHex: '#e2e8f0',
  },
  'midnight-cyan': {
    id: 'midnight-cyan',
    name: 'Bleu nuit et cyan',
    description: 'Style tech et moderne : fond sombre profond, bleu nuit électrique et cyan vif.',
    primary: [9, 13, 22],         // #090d16
    primaryHex: '#090d16',
    accent: [6, 182, 212],        // #06b6d4 (Cyan)
    accentHex: '#06b6d4',
    secondary: [20, 184, 166],    // #14b8a6 (Teal)
    secondaryHex: '#14b8a6',
    textDark: [15, 23, 42],
    textMuted: [71, 85, 105],
    bgCard: [240, 253, 250],      // #f0fdfa
    bgCardHex: '#f0fdfa',
    border: [204, 251, 241],
    borderHex: '#ccfbf1',
  },
  'modern-purple': {
    id: 'modern-purple',
    name: 'Violet moderne',
    description: 'Élégance créative et digitale : indigo profond, violet royal et accents pourpres.',
    primary: [30, 27, 75],        // #1e1b4b
    primaryHex: '#1e1b4b',
    accent: [124, 58, 237],       // #7c3aed (Violet)
    accentHex: '#7c3aed',
    secondary: [168, 85, 247],    // #a855f7
    secondaryHex: '#a855f7',
    textDark: [24, 24, 27],
    textMuted: [113, 113, 122],
    bgCard: [250, 245, 255],      // #faf5ff
    bgCardHex: '#faf5ff',
    border: [243, 232, 255],
    borderHex: '#f3e8ff',
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Noir et blanc classique',
    description: 'Style intemporel, épuré et ultra-lisible : noir carbone et nuances de gris neutre.',
    primary: [9, 9, 11],          // #09090b
    primaryHex: '#09090b',
    accent: [39, 39, 42],         // #27272a (Charcoal)
    accentHex: '#27272a',
    secondary: [113, 113, 122],   // #71717a
    secondaryHex: '#71717a',
    textDark: [24, 24, 27],
    textMuted: [82, 82, 91],
    bgCard: [244, 244, 245],      // #f4f4f5
    bgCardHex: '#f4f4f5',
    border: [228, 228, 231],
    borderHex: '#e4e4e7',
  },
  'elegant-gray': {
    id: 'elegant-gray',
    name: 'Gris élégant',
    description: 'Finesse exécutive : ardoise anthracite, acier brossé et séparateurs argentés.',
    primary: [31, 41, 55],        // #1f2937
    primaryHex: '#1f2937',
    accent: [75, 85, 99],         // #4b5563
    accentHex: '#4b5563',
    secondary: [156, 163, 175],   // #9ca3af
    secondaryHex: '#9ca3af',
    textDark: [17, 24, 39],
    textMuted: [107, 114, 128],
    bgCard: [249, 250, 251],      // #f9fafb
    bgCardHex: '#f9fafb',
    border: [229, 231, 235],
    borderHex: '#e5e7eb',
  },
  'emerald-pro': {
    id: 'emerald-pro',
    name: 'Vert professionnel',
    description: 'Croissance et rigueur managériale : vert forêt profond et émeraude dynamique.',
    primary: [6, 78, 59],         // #064e3b
    primaryHex: '#064e3b',
    accent: [5, 150, 105],        // #059669
    accentHex: '#059669',
    secondary: [16, 185, 129],    // #10b981
    secondaryHex: '#10b981',
    textDark: [6, 30, 23],
    textMuted: [75, 95, 88],
    bgCard: [240, 253, 244],      // #f0fdf4
    bgCardHex: '#f0fdf4',
    border: [209, 250, 229],
    borderHex: '#d1fae5',
  },
};

export const DEFAULT_CV_THEME = CV_THEMES['blue-pro'];
