import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  db,
  isFirebaseConfigured,
  stripUndefined,
  handleFirestoreError,
  OperationType,
} from '../services/firebase/firestore';
import { useAuth } from './AuthContext';

import loungeBackdropImg from '../assets/images/glassy_lounge_backdrop_1794551389317.jpg';

export type BlurIntensity = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GlassSurfaceTone = 'dark' | 'light';
export type TextColorMode = 'warm_ivory' | 'emerald_ink';
export type IconThemeStyle = 'frosted' | 'solid' | 'glow_outline';
export type BackgroundPreset =
  | 'lounge_interior'
  | 'ambient'
  | 'deep_emerald'
  | 'gradient'
  | 'desert_dawn'
  | 'custom';
export type AccentPreset = 'gold' | 'emerald' | 'cyan' | 'violet' | 'rose' | 'custom';

export const LOUNGE_INTERIOR_IMAGE = loungeBackdropImg;

export interface TextColorOption {
  id: TextColorMode;
  pairedTone: GlassSurfaceTone;
  name: string;
  nameAr: string;
  pairedThemeLabel: string;
  pairedThemeLabelAr: string;
  swatchHex: string;
  isLightText: boolean;
}

export const TEXT_COLOR_OPTIONS: TextColorOption[] = [
  {
    id: 'warm_ivory',
    pairedTone: 'dark',
    name: 'Warm Sand Ivory',
    nameAr: 'عاجي رملي دافئ',
    pairedThemeLabel: 'Smoked Dark Theme',
    pairedThemeLabelAr: 'الوضع الداكن المدخّن',
    swatchHex: '#FAF0DC',
    isLightText: true,
  },
  {
    id: 'emerald_ink',
    pairedTone: 'light',
    name: 'Saudi Emerald Ink',
    nameAr: 'حبر زمردي سعودي',
    pairedThemeLabel: 'Crystal Light Theme',
    pairedThemeLabelAr: 'الوضع الفاتح الكريستالي',
    swatchHex: '#0B3B30',
    isLightText: false,
  },
];

export interface IconThemeOption {
  id: IconThemeStyle;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
}

export const ICON_THEME_OPTIONS: IconThemeOption[] = [
  {
    id: 'frosted',
    name: 'Frosted Glass Badge',
    nameAr: 'أيقونة زجاجية مصنفرة',
    desc: 'Translucent glass tile with accent border & frosted sheen',
    descAr: 'خلفية زجاجية شفافة مع إطار ملون وبريق مصنفر',
  },
  {
    id: 'solid',
    name: 'Solid Accent Fill',
    nameAr: 'تعبئة لونية صلبة',
    desc: 'High-contrast solid accent fill for bold icon clarity',
    descAr: 'تعبئة بلون التمييز لوضوح بارز ومباشر للأيقونات',
  },
  {
    id: 'glow_outline',
    name: 'Luminous Glass Ring',
    nameAr: 'حلقة زجاجية متوهجة',
    desc: 'Clear glass outline framed by a soft glowing accent halo',
    descAr: 'إطار زجاجي شفاف محاط بهالة إضاءة ناعمة',
  },
];

export interface AccentColorOption {
  id: AccentPreset;
  name: string;
  nameAr: string;
  hex: string;
  darkSurfaceTextHex: string;
  lightSurfaceTextHex: string;
  rgb: string;
  glow: string;
}

export const ACCENT_PRESETS: AccentColorOption[] = [
  {
    id: 'gold',
    name: 'Desert Champagne',
    nameAr: 'شامبين صحراوي',
    hex: '#C6A46B',
    darkSurfaceTextHex: '#DFBF84',
    lightSurfaceTextHex: '#846121',
    rgb: '198, 164, 107',
    glow: 'rgba(198, 164, 107, 0.45)',
  },
  {
    id: 'emerald',
    name: 'Saudi Emerald',
    nameAr: 'زمرد سعودي',
    hex: '#10B981',
    darkSurfaceTextHex: '#34D399',
    lightSurfaceTextHex: '#047857',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
  {
    id: 'cyan',
    name: 'Red Sea Turquoise',
    nameAr: 'فيروز البحر الأحمر',
    hex: '#06B6D4',
    darkSurfaceTextHex: '#22D3EE',
    lightSurfaceTextHex: '#0E7490',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.45)',
  },
  {
    id: 'violet',
    name: 'Royal Jacaranda',
    nameAr: 'جاكاراندا ملكي',
    hex: '#8B5CF6',
    darkSurfaceTextHex: '#B39DDB',
    lightSurfaceTextHex: '#6D28D9',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.45)',
  },
  {
    id: 'rose',
    name: 'Taif Rose',
    nameAr: 'ورد الطائف',
    hex: '#F43F5E',
    darkSurfaceTextHex: '#FDA4AF',
    lightSurfaceTextHex: '#BE123C',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.45)',
  },
];

export interface BackgroundPresetOption {
  id: BackgroundPreset;
  name: string;
  nameAr: string;
  previewBg: string;
  baseColor: string;
  gradientImage?: string;
  imageUrl?: string;
  recommendedTone: GlassSurfaceTone;
  description: string;
  descriptionAr: string;
}

export const BACKGROUND_PRESETS: BackgroundPresetOption[] = [
  {
    id: 'lounge_interior',
    name: 'Luxury Lounge Interior',
    nameAr: 'صالة ضيافة فاخرة',
    previewBg: 'linear-gradient(135deg, #2D2118 0%, #59412D 50%, #1F1915 100%)',
    baseColor: '#1F1915',
    imageUrl: LOUNGE_INTERIOR_IMAGE,
    recommendedTone: 'dark',
    description: 'Warm architectural lounge with walnut slats & golden hour light behind frosted glass',
    descriptionAr: 'تصميم داخلي دافئ بخشب الجوز وإضاءة ذهبية خلف الزجاج المصنفر',
  },
  {
    id: 'deep_emerald',
    name: 'Dark Oasis Emerald',
    nameAr: 'واحة الزمرد الداكنة',
    previewBg: 'radial-gradient(circle at 15% 20%, #247864 0%, #091B17 85%)',
    baseColor: '#091B17',
    gradientImage:
      'radial-gradient(circle at 18% 18%, rgba(36, 130, 106, 0.85) 0%, transparent 45%), radial-gradient(circle at 82% 75%, rgba(198, 164, 107, 0.42) 0%, transparent 48%), radial-gradient(circle at 50% 45%, #123B32 0%, #071411 90%)',
    recommendedTone: 'dark',
    description: 'Rich obsidian-emerald depth with luminous gold & emerald light orbs for glass refraction',
    descriptionAr: 'عمق زمردي داكن مع هالات إضاءة ذهبية تبرز انكسار الزجاج المدخن',
  },
  {
    id: 'ambient',
    name: 'Ambient Warm Sand',
    nameAr: 'توهج رملي دافئ',
    previewBg: 'radial-gradient(at 0% 0%, #FAF6EE 0px, transparent 50%), radial-gradient(at 100% 100%, #E7DCC6 0px, transparent 50%), #F6F4EF',
    baseColor: '#EDE6D8',
    gradientImage:
      'radial-gradient(circle at 15% 15%, rgba(198, 164, 107, 0.45) 0px, transparent 42%), radial-gradient(circle at 85% 25%, rgba(18, 59, 50, 0.18) 0px, transparent 45%), radial-gradient(circle at 75% 85%, rgba(217, 194, 154, 0.65) 0px, transparent 50%)',
    recommendedTone: 'light',
    description: 'Soft warm desert glow paired with bright crystal frosted cards',
    descriptionAr: 'توهج صحراوي ناعم مع بطاقات زجاجية كريستالية مشرقة',
  },
  {
    id: 'gradient',
    name: 'Modern Executive Mesh',
    nameAr: 'تدرج تنفيذي حديث',
    previewBg: 'linear-gradient(135deg, #F3EFE6 0%, #DFD1BA 50%, #C8B494 100%)',
    baseColor: '#E6DDD0',
    gradientImage:
      'radial-gradient(circle at 20% 80%, rgba(18, 59, 50, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(198, 164, 107, 0.5) 0%, transparent 42%), linear-gradient(135deg, #F5F1E8 0%, #E4D7C1 52%, #D4C1A1 100%)',
    recommendedTone: 'light',
    description: 'Layered champagne & sage mesh crafted to showcase light glass blur',
    descriptionAr: 'تدرج لوني تنفيذي بدرجات الشامبين يبرز شفافية الزجاج النهاري',
  },
  {
    id: 'desert_dawn',
    name: 'AlUla Dawn Horizon',
    nameAr: 'فجر العلا الذهبي',
    previewBg: 'radial-gradient(circle at 80% 10%, #F5E8D0 0%, #E5CCA4 45%, #CFA875 100%)',
    baseColor: '#EADAC0',
    gradientImage:
      'radial-gradient(circle at 80% 15%, rgba(244, 162, 97, 0.36) 0%, transparent 44%), radial-gradient(circle at 18% 72%, rgba(18, 59, 50, 0.2) 0%, transparent 45%), radial-gradient(circle at 50% 45%, #F4E7D0 0%, #E0C59D 55%, #C9A678 100%)',
    recommendedTone: 'light',
    description: 'Sunrise sandstone tones with warm depth behind frosted crystal panels',
    descriptionAr: 'درجات الصخور الرملية الدافئة لإبراز عمق الألواح الزجاجية',
  },
];

export type VisitorGlassyTarget =
  | 'navbarGlassy'
  | 'filterBarGlassy'
  | 'experienceCardsGlassy'
  | 'quizGlassy'
  | 'reasonsCardsGlassy'
  | 'aboutSectionGlassy';

export interface VisitorGlassySettings {
  enabled: boolean;
  navbarGlassy: boolean;
  filterBarGlassy: boolean;
  experienceCardsGlassy: boolean;
  quizGlassy: boolean;
  reasonsCardsGlassy: boolean;
  aboutSectionGlassy: boolean;
}

export interface ThemeSettings {
  isGlassyEnabled: boolean;
  glassSurfaceTone: GlassSurfaceTone;
  textColorMode: TextColorMode;
  iconThemeStyle: IconThemeStyle;
  blurIntensity: BlurIntensity;
  blurRadius: number; // Continuous 0..64 px
  cardTranslucency: number; // 0.10 to 0.88
  borderOpacity: number; // 0.12 to 0.80
  glowStrength: number; // 0 to 1
  glassSheen: number; // 0 to 1 specular frost highlight
  backgroundPreset: BackgroundPreset;
  customBgUrl: string;
  accentPreset: AccentPreset;
  customAccentHex: string;
  visitorGlassy: VisitorGlassySettings;
}

const DEFAULT_VISITOR_GLASSY: VisitorGlassySettings = {
  enabled: true,
  navbarGlassy: true,
  filterBarGlassy: true,
  experienceCardsGlassy: true,
  quizGlassy: true,
  reasonsCardsGlassy: true,
  aboutSectionGlassy: true,
};

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  isGlassyEnabled: true,
  glassSurfaceTone: 'dark',
  textColorMode: 'warm_ivory',
  iconThemeStyle: 'frosted',
  blurIntensity: 'lg',
  blurRadius: 24,
  cardTranslucency: 0.44,
  borderOpacity: 0.26,
  glowStrength: 0.45,
  glassSheen: 0.65,
  backgroundPreset: 'lounge_interior',
  customBgUrl: '',
  accentPreset: 'gold',
  customAccentHex: '#C6A46B',
  visitorGlassy: DEFAULT_VISITOR_GLASSY,
};

const THEME_STORAGE_KEY = 'tourflow_theme_appearance_v4';
const THEME_BROADCAST_CHANNEL = 'tourflow_theme_sync';

function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return [198, 164, 107];
}

function hexToRgbTuple(hex: string): string {
  const [r, g, b] = parseHexRgb(hex);
  return `${r}, ${g}, ${b}`;
}

function getRelativeLuminance(hex: string): number {
  const [r, g, b] = parseHexRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function adjustCustomAccentForSurface(hex: string, useDarkSurface: boolean): string {
  const [r, g, b] = parseHexRgb(hex);
  const lum = getRelativeLuminance(hex);
  if (useDarkSurface) {
    // Ensure custom accent is bright enough on Smoked Dark surfaces
    if (lum >= 0.34) return hex;
    const mix = 0.42;
    const nr = Math.round(r + (250 - r) * mix);
    const ng = Math.round(g + (240 - g) * mix);
    const nb = Math.round(b + (220 - b) * mix);
    return `#${[nr, ng, nb].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  }
  // Ensure custom accent has deep ink contrast on Crystal Light frosted surfaces
  if (lum <= 0.19) return hex;
  const scale = 0.56;
  const nr = Math.max(0, Math.round(r * scale));
  const ng = Math.max(0, Math.round(g * scale));
  const nb = Math.max(0, Math.round(b * scale));
  return `#${[nr, ng, nb].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

interface ThemeContextType {
  settings: ThemeSettings;
  isDarkGlass: boolean;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
  updateVisitorGlassy: (partial: Partial<VisitorGlassySettings>) => void;
  resetToDefaults: () => void;
  currentAccentHex: string;
  currentAccentTextHex: string;
  currentAccentBtnTextHex: string;
  currentAccentRgb: string;
  currentAccentGlow: string;
  blurTailwindClass: string;
  blurPixels: number;
  getGlassyCardStyle: (forceDark?: boolean) => React.CSSProperties;
  getGlassyIconStyle: (options?: { forceDark?: boolean }) => React.CSSProperties;
  getVisitorGlassyStyle: (
    target: VisitorGlassyTarget,
    options?: {
      isDark?: boolean;
      borderSides?: 'all' | 'bottom' | 'none';
    }
  ) => React.CSSProperties;
  isVisitorTargetGlassy: (target: VisitorGlassyTarget) => boolean;
  getDashboardBgStyle: () => React.CSSProperties;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: DEFAULT_THEME_SETTINGS,
  isDarkGlass: true,
  updateSettings: () => {},
  updateVisitorGlassy: () => {},
  resetToDefaults: () => {},
  currentAccentHex: '#C6A46B',
  currentAccentTextHex: '#DFBF84',
  currentAccentBtnTextHex: '#0D2B24',
  currentAccentRgb: '198, 164, 107',
  currentAccentGlow: 'rgba(198, 164, 107, 0.45)',
  blurTailwindClass: 'backdrop-blur-xl',
  blurPixels: 24,
  getGlassyCardStyle: () => ({}),
  getGlassyIconStyle: () => ({}),
  getVisitorGlassyStyle: () => ({}),
  isVisitorTargetGlassy: () => false,
  getDashboardBgStyle: () => ({}),
});

export const getBlurPixels = (intensity: BlurIntensity): number => {
  switch (intensity) {
    case 'none':
      return 0;
    case 'sm':
      return 8;
    case 'md':
      return 16;
    case 'lg':
      return 24;
    case 'xl':
      return 40;
    case '2xl':
      return 56;
  }
};

export const closestBlurIntensity = (px: number): BlurIntensity => {
  if (px <= 2) return 'none';
  if (px <= 11) return 'sm';
  if (px <= 20) return 'md';
  if (px <= 32) return 'lg';
  if (px <= 48) return 'xl';
  return '2xl';
};

/**
 * Normalize legacy or partial theme payloads so Glassy themes strictly stay paired:
 * - Smoked Dark ('dark') <-> Warm Sand Ivory ('warm_ivory')
 * - Crystal Light ('light') <-> Saudi Emerald Ink ('emerald_ink')
 */
function normalizePairedToneAndText(
  rawTone?: GlassSurfaceTone,
  rawTextMode?: string
): { glassSurfaceTone: GlassSurfaceTone; textColorMode: TextColorMode } {
  if (rawTextMode === 'emerald_ink' || rawTextMode === 'obsidian_ink') {
    return { glassSurfaceTone: 'light', textColorMode: 'emerald_ink' };
  }
  if (rawTextMode === 'warm_ivory' || rawTextMode === 'crisp_white') {
    return { glassSurfaceTone: 'dark', textColorMode: 'warm_ivory' };
  }
  const resolvedTone: GlassSurfaceTone = rawTone === 'light' ? 'light' : 'dark';
  return {
    glassSurfaceTone: resolvedTone,
    textColorMode: resolvedTone === 'dark' ? 'warm_ivory' : 'emerald_ink',
  };
}

const mergeThemeSettings = (parsed: Partial<ThemeSettings>): ThemeSettings => {
  const mergedBlurRadius =
    typeof parsed.blurRadius === 'number'
      ? Math.max(0, Math.min(64, parsed.blurRadius))
      : parsed.blurIntensity
      ? getBlurPixels(parsed.blurIntensity)
      : DEFAULT_THEME_SETTINGS.blurRadius;

  const rawCustomBgUrl = typeof parsed.customBgUrl === 'string' ? parsed.customBgUrl : '';
  const normalizedCustomBgUrl =
    !rawCustomBgUrl.startsWith('data:') &&
    rawCustomBgUrl.includes('glassy_lounge_backdrop_1794551389317')
      ? LOUNGE_INTERIOR_IMAGE
      : rawCustomBgUrl;

  const { glassSurfaceTone, textColorMode } = normalizePairedToneAndText(
    parsed.glassSurfaceTone,
    parsed.textColorMode as string | undefined
  );

  return {
    ...DEFAULT_THEME_SETTINGS,
    ...parsed,
    glassSurfaceTone,
    textColorMode,
    customBgUrl: normalizedCustomBgUrl,
    blurRadius: mergedBlurRadius,
    blurIntensity: parsed.blurIntensity || closestBlurIntensity(mergedBlurRadius),
    iconThemeStyle: parsed.iconThemeStyle || DEFAULT_THEME_SETTINGS.iconThemeStyle,
    glassSheen:
      typeof parsed.glassSheen === 'number'
        ? Math.max(0, Math.min(1, parsed.glassSheen))
        : DEFAULT_THEME_SETTINGS.glassSheen,
    visitorGlassy: {
      ...DEFAULT_VISITOR_GLASSY,
      ...(parsed.visitorGlassy || {}),
    },
  };
};

function resolveTextPalette(mode: TextColorMode) {
  if (mode === 'warm_ivory') {
    return {
      isLightText: true,
      heading: '#FAF0DC',
      text: '#EDE0C6',
      muted: '#C8B899',
      shadow: 'none',
    };
  }
  return {
    isLightText: false,
    heading: '#0B3B30',
    text: '#15473A',
    muted: '#42685E',
    shadow: 'none',
  };
}

function toFirestoreThemeConfig(settings: ThemeSettings) {
  return stripUndefined({
    isGlassyEnabled: Boolean(settings.isGlassyEnabled),
    glassSurfaceTone: settings.glassSurfaceTone,
    textColorMode: settings.textColorMode,
    iconThemeStyle: settings.iconThemeStyle,
    blurIntensity: settings.blurIntensity,
    blurRadius: Math.max(0, Math.min(64, Number(settings.blurRadius) || 0)),
    cardTranslucency: Math.max(0.05, Math.min(1, Number(settings.cardTranslucency) || 0.44)),
    borderOpacity: Math.max(0, Math.min(1, Number(settings.borderOpacity) || 0.26)),
    glowStrength: Math.max(0, Math.min(1, Number(settings.glowStrength) || 0.45)),
    glassSheen: Math.max(0, Math.min(1, Number(settings.glassSheen) || 0.65)),
    backgroundPreset: settings.backgroundPreset,
    customBgUrl:
      typeof settings.customBgUrl === 'string' && settings.customBgUrl.length <= 740000
        ? settings.customBgUrl
        : '',
    accentPreset: settings.accentPreset,
    customAccentHex: settings.customAccentHex || '#C6A46B',
    visitorGlassy: {
      enabled: Boolean(settings.visitorGlassy.enabled),
      navbarGlassy: Boolean(settings.visitorGlassy.navbarGlassy),
      filterBarGlassy: Boolean(settings.visitorGlassy.filterBarGlassy),
      experienceCardsGlassy: Boolean(settings.visitorGlassy.experienceCardsGlassy),
      quizGlassy: Boolean(settings.visitorGlassy.quizGlassy),
      reasonsCardsGlassy: Boolean(settings.visitorGlassy.reasonsCardsGlassy),
      aboutSectionGlassy: Boolean(settings.visitorGlassy.aboutSectionGlassy),
    },
    updatedAt: new Date().toISOString(),
  });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCloudAdmin } = useAuth();
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(THEME_STORAGE_KEY);
        if (raw) return mergeThemeSettings(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to load theme settings from storage:', e);
      }
    }
    return DEFAULT_THEME_SETTINGS;
  });

  const lastLocalEditAtRef = useRef<number>(0);
  const cloudWriteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCloudWriteRef = useRef<(() => void) | null>(null);
  const settingsRef = useRef<ThemeSettings>(settings);
  settingsRef.current = settings;

  const flushPendingThemeWrite = useCallback(() => {
    if (cloudWriteTimerRef.current) {
      clearTimeout(cloudWriteTimerRef.current);
      cloudWriteTimerRef.current = null;
    }
    if (pendingCloudWriteRef.current) {
      const fn = pendingCloudWriteRef.current;
      pendingCloudWriteRef.current = null;
      fn();
    }
  }, []);

  const persistThemeToCloud = useCallback(
    (nextSettings: ThemeSettings, immediate = false) => {
      if (!isCloudAdmin || !isFirebaseConfigured() || !db) return;
      const firestoreDb = db;

      if (cloudWriteTimerRef.current) {
        clearTimeout(cloudWriteTimerRef.current);
        cloudWriteTimerRef.current = null;
      }

      const executeWrite = () => {
        pendingCloudWriteRef.current = null;
        setDoc(doc(firestoreDb, 'themeConfig', 'global'), toFirestoreThemeConfig(nextSettings)).catch(
          (err) => {
            handleFirestoreError(err, OperationType.WRITE, 'themeConfig/global');
          }
        );
      };

      if (immediate) {
        executeWrite();
      } else {
        pendingCloudWriteRef.current = executeWrite;
        cloudWriteTimerRef.current = setTimeout(executeWrite, 60);
      }
    },
    [isCloudAdmin]
  );

  // Seed /themeConfig/global once when an authenticated admin connects and doc doesn't exist yet
  useEffect(() => {
    if (!isCloudAdmin || !isFirebaseConfigured() || !db) return;
    const firestoreDb = db;
    let cancelled = false;

    getDoc(doc(firestoreDb, 'themeConfig', 'global'))
      .then((snap) => {
        if (!cancelled && !snap.exists()) {
          setDoc(
            doc(firestoreDb, 'themeConfig', 'global'),
            toFirestoreThemeConfig(settingsRef.current)
          ).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, 'themeConfig/global');
          });
        }
      })
      .catch((err) => {
        console.warn('Unable to inspect cloud theme config:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [isCloudAdmin]);

  // Real-time Firestore listener for all Admin & Visitor devices
  useEffect(() => {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !db) return;

    const unsubscribe = onSnapshot(
      doc(db, 'themeConfig', 'global'),
      (snap) => {
        if (!snap.exists()) return;
        // Skip local optimistic echoes and protect active slider drags
        if (snap.metadata.hasPendingWrites) return;
        if (Date.now() - lastLocalEditAtRef.current < 280) return;

        const remoteData = snap.data() as Partial<ThemeSettings>;
        const merged = mergeThemeSettings(remoteData);
        setSettings((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(merged)) return prev;
          return merged;
        });
      },
      (err) => {
        console.warn('Theme config snapshot error:', err.message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleVisibilityOrUnload = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingThemeWrite();
      }
    };
    window.addEventListener('pagehide', flushPendingThemeWrite);
    document.addEventListener('visibilitychange', handleVisibilityOrUnload);
    return () => {
      window.removeEventListener('pagehide', flushPendingThemeWrite);
      document.removeEventListener('visibilitychange', handleVisibilityOrUnload);
      flushPendingThemeWrite();
    };
  }, [flushPendingThemeWrite]);

  const isDarkGlass = settings.glassSurfaceTone === 'dark';

  const currentAccent = ACCENT_PRESETS.find((p) => p.id === settings.accentPreset);
  const currentAccentHex =
    settings.accentPreset === 'custom'
      ? settings.customAccentHex
      : currentAccent?.hex || '#C6A46B';

  const currentAccentTextHex =
    settings.accentPreset === 'custom'
      ? adjustCustomAccentForSurface(settings.customAccentHex, isDarkGlass)
      : isDarkGlass
      ? currentAccent?.darkSurfaceTextHex || '#DFBF84'
      : currentAccent?.lightSurfaceTextHex || '#846121';

  const currentAccentBtnTextHex =
    getRelativeLuminance(currentAccentHex) < 0.28 ? '#FAF0DC' : '#0D2B24';

  const currentAccentRgb =
    settings.accentPreset === 'custom'
      ? hexToRgbTuple(settings.customAccentHex)
      : currentAccent?.rgb || '198, 164, 107';

  const currentAccentGlow =
    settings.accentPreset === 'custom'
      ? `rgba(${currentAccentRgb}, 0.45)`
      : currentAccent?.glow || 'rgba(198, 164, 107, 0.45)';

  const blurTailwindClass = {
    none: 'backdrop-blur-none',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
  }[settings.blurIntensity];

  const blurPixels = settings.blurRadius;

  const textPalette = resolveTextPalette(settings.textColorMode);

  // Persist to localStorage and bind high-contrast CSS variables dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn('Unable to persist theme settings to localStorage:', e);
      }

      const root = document.documentElement;
      root.style.setProperty('--tourflow-accent', currentAccentHex);
      root.style.setProperty('--tourflow-accent-glow', currentAccentGlow);
      root.style.setProperty('--glass-blur', `${blurPixels}px`);
      root.style.setProperty('--glass-bg-opacity', settings.cardTranslucency.toString());
      root.style.setProperty('--glass-border-opacity', settings.borderOpacity.toString());
      root.style.setProperty('--glass-glow-strength', settings.glowStrength.toString());

      // Dynamic Contrast-Protected Text & Surface Tokens
      root.dataset.glassTone = isDarkGlass ? 'dark' : 'light';
      root.dataset.textTone = textPalette.isLightText ? 'light' : 'dark';
      root.style.setProperty('--tf-heading', textPalette.heading);
      root.style.setProperty('--tf-text', textPalette.text);
      root.style.setProperty('--tf-muted', textPalette.muted);
      root.style.setProperty('--tf-text-shadow', textPalette.shadow);
      root.style.setProperty('--tf-accent-text', currentAccentTextHex);
      root.style.setProperty('--tf-accent-btn-text', currentAccentBtnTextHex);

      if (isDarkGlass) {
        root.style.setProperty('--tf-surface-subtle', 'rgba(250, 240, 220, 0.06)');
        root.style.setProperty('--tf-surface-hover', 'rgba(250, 240, 220, 0.12)');
        root.style.setProperty('--tf-border', 'rgba(250, 240, 220, 0.18)');
        root.style.setProperty('--tf-input-bg', 'rgba(10, 18, 16, 0.72)');
        root.style.setProperty('--tf-table-head', 'rgba(10, 18, 16, 0.56)');
        root.style.setProperty('--tf-modal-bg', '#11231E');
        root.style.setProperty('--tf-modal-subtle', '#0D1B17');
        root.style.setProperty('--tf-success-bg', 'rgba(16, 185, 129, 0.16)');
        root.style.setProperty('--tf-success-border', 'rgba(52, 211, 153, 0.36)');
        root.style.setProperty('--tf-success-text', '#6EE7B7');
        root.style.setProperty('--tf-danger-bg', 'rgba(244, 63, 94, 0.16)');
        root.style.setProperty('--tf-danger-border', 'rgba(251, 113, 133, 0.38)');
        root.style.setProperty('--tf-danger-text', '#FDA4AF');
        root.style.setProperty('--tf-info-text', '#34D399');
      } else {
        root.style.setProperty('--tf-surface-subtle', 'rgba(255, 253, 248, 0.78)');
        root.style.setProperty('--tf-surface-hover', 'rgba(255, 255, 255, 0.95)');
        root.style.setProperty('--tf-border', 'rgba(11, 59, 48, 0.16)');
        root.style.setProperty('--tf-input-bg', 'rgba(255, 255, 255, 0.92)');
        root.style.setProperty('--tf-table-head', 'rgba(244, 239, 229, 0.85)');
        root.style.setProperty('--tf-modal-bg', '#FFFDF8');
        root.style.setProperty('--tf-modal-subtle', '#F7F3EA');
        root.style.setProperty('--tf-success-bg', 'rgba(16, 185, 129, 0.12)');
        root.style.setProperty('--tf-success-border', 'rgba(5, 150, 105, 0.35)');
        root.style.setProperty('--tf-success-text', '#065F46');
        root.style.setProperty('--tf-danger-bg', 'rgba(225, 29, 72, 0.10)');
        root.style.setProperty('--tf-danger-border', 'rgba(225, 29, 72, 0.32)');
        root.style.setProperty('--tf-danger-text', '#9F1239');
        root.style.setProperty('--tf-info-text', '#047857');
      }
    }
  }, [
    settings,
    isDarkGlass,
    currentAccentHex,
    currentAccentTextHex,
    currentAccentBtnTextHex,
    currentAccentGlow,
    blurPixels,
    textPalette,
  ]);

  // Cross-tab synchronization listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        try {
          setSettings(mergeThemeSettings(JSON.parse(e.newValue)));
        } catch {
          // Ignore malformed storage values
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'THEME_UPDATED') {
          setSettings(mergeThemeSettings(event.data.payload));
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      bc?.close();
    };
  }, []);

  const broadcastUpdate = (nextSettings: ThemeSettings) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
        bc.postMessage({ type: 'THEME_UPDATED', payload: nextSettings });
        bc.close();
      } catch {
        // Ignore broadcast errors
      }
    }
  };

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    lastLocalEditAtRef.current = Date.now();
    const prev = settingsRef.current;
    const next: ThemeSettings = { ...prev, ...partial };

    // Keep Smoked Dark <-> Warm Sand Ivory and Crystal Light <-> Saudi Emerald Ink strictly paired
    if (partial.textColorMode !== undefined && partial.glassSurfaceTone === undefined) {
      next.glassSurfaceTone = partial.textColorMode === 'warm_ivory' ? 'dark' : 'light';
    } else if (partial.glassSurfaceTone !== undefined && partial.textColorMode === undefined) {
      next.textColorMode = partial.glassSurfaceTone === 'dark' ? 'warm_ivory' : 'emerald_ink';
    } else if (partial.glassSurfaceTone !== undefined && partial.textColorMode !== undefined) {
      next.textColorMode = partial.glassSurfaceTone === 'dark' ? 'warm_ivory' : 'emerald_ink';
    }

    if (partial.blurRadius !== undefined && partial.blurIntensity === undefined) {
      next.blurIntensity = closestBlurIntensity(partial.blurRadius);
    } else if (partial.blurIntensity !== undefined && partial.blurRadius === undefined) {
      next.blurRadius = getBlurPixels(partial.blurIntensity);
    }

    setSettings(next);
    broadcastUpdate(next);
    persistThemeToCloud(next, false);
  };

  const updateVisitorGlassy = (partial: Partial<VisitorGlassySettings>) => {
    lastLocalEditAtRef.current = Date.now();
    const prev = settingsRef.current;
    const next: ThemeSettings = {
      ...prev,
      visitorGlassy: {
        ...prev.visitorGlassy,
        ...partial,
      },
    };
    setSettings(next);
    broadcastUpdate(next);
    persistThemeToCloud(next, true);
  };

  const resetToDefaults = () => {
    lastLocalEditAtRef.current = Date.now();
    setSettings(DEFAULT_THEME_SETTINGS);
    broadcastUpdate(DEFAULT_THEME_SETTINGS);
    persistThemeToCloud(DEFAULT_THEME_SETTINGS, true);
  };

  const buildGlassOpticalSurface = (
    useDark: boolean,
    borderSides: 'all' | 'bottom' | 'none' = 'all'
  ): React.CSSProperties => {
    const alpha = settings.cardTranslucency;
    const borderAlpha = settings.borderOpacity;
    const glowAlpha = settings.glowStrength;
    const sheen = settings.glassSheen;

    const topHighlight = useDark
      ? (0.04 + sheen * 0.14).toFixed(3)
      : (0.34 + sheen * 0.36).toFixed(3);
    const midHighlight = useDark
      ? (0.01 + sheen * 0.04).toFixed(3)
      : (0.14 + sheen * 0.16).toFixed(3);
    const bottomTint = useDark
      ? (0.01 + sheen * 0.02).toFixed(3)
      : (0.06 + sheen * 0.08).toFixed(3);

    // Maintain comfortable legibility floors so text never bleeds into busy backgrounds
    const darkAlpha = Math.max(0.46, alpha);
    const lightAlpha = Math.max(0.68, alpha);
    const bgColor = useDark
      ? `rgba(11, 20, 18, ${darkAlpha})`
      : `rgba(255, 253, 248, ${lightAlpha})`;

    const sheenGradient = `linear-gradient(135deg, rgba(255, 255, 255, ${topHighlight}) 0%, rgba(255, 255, 255, ${midHighlight}) 42%, rgba(255, 255, 255, ${bottomTint}) 100%)`;

    const resolvedBorderColor = useDark
      ? `rgba(250, 240, 220, ${Math.max(0.14, borderAlpha * 0.85)})`
      : `rgba(11, 59, 48, ${Math.min(0.28, Math.max(0.12, borderAlpha * 0.45))})`;

    const borderProps: React.CSSProperties =
      borderSides === 'none'
        ? {}
        : borderSides === 'bottom'
        ? {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: resolvedBorderColor,
          }
        : {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: resolvedBorderColor,
          };

    const innerRimTop = useDark
      ? `inset 0 1px 1px rgba(250, 240, 220, ${(0.10 + sheen * 0.20).toFixed(2)})`
      : `inset 0 1px 1px rgba(255, 255, 255, ${(0.72 + sheen * 0.25).toFixed(2)})`;

    const innerRimEdge = useDark
      ? `inset 1px 0 0 rgba(250, 240, 220, ${(0.04 + sheen * 0.09).toFixed(2)})`
      : `inset 1px 0 0 rgba(255, 255, 255, ${(0.45 + sheen * 0.25).toFixed(2)})`;

    const baseDrop = useDark
      ? '0 18px 44px -12px rgba(0, 0, 0, 0.50)'
      : '0 14px 34px -10px rgba(11, 59, 48, 0.13)';

    const accentGlow =
      glowAlpha > 0
        ? `, 0 0 ${Math.round(12 + glowAlpha * 28)}px rgba(${currentAccentRgb}, ${(glowAlpha * 0.30).toFixed(2)})`
        : '';

    const saturation = Math.round(145 + sheen * 55);
    const filterValue =
      blurPixels > 0
        ? `blur(${blurPixels}px) saturate(${saturation}%) contrast(103%)`
        : `saturate(${saturation}%)`;

    return {
      backgroundColor: bgColor,
      backgroundImage: sheen > 0.02 ? sheenGradient : 'none',
      ...borderProps,
      boxShadow: `${baseDrop}, ${innerRimTop}, ${innerRimEdge}${accentGlow}`,
      backdropFilter: filterValue,
      WebkitBackdropFilter: filterValue,
    };
  };

  const getGlassyCardStyle = (forceDark?: boolean): React.CSSProperties => {
    const useDark = forceDark ?? isDarkGlass;

    if (!settings.isGlassyEnabled) {
      return {
        backgroundColor: useDark ? '#102420' : '#FFFDF8',
        backgroundImage: 'none',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: useDark ? 'rgba(250, 240, 220, 0.18)' : 'rgba(11, 59, 48, 0.16)',
        boxShadow: useDark
          ? '0 8px 24px rgba(0, 0, 0, 0.28)'
          : '0 6px 20px rgba(11, 59, 48, 0.08)',
      };
    }

    return buildGlassOpticalSurface(useDark, 'all');
  };

  const getGlassyIconStyle = (
    options: { forceDark?: boolean } = {}
  ): React.CSSProperties => {
    const useDark = options.forceDark ?? isDarkGlass;
    const glowPx = Math.round(8 + settings.glowStrength * 18);
    const glowShadow =
      settings.glowStrength > 0
        ? `, 0 0 ${glowPx}px rgba(${currentAccentRgb}, ${(0.22 + settings.glowStrength * 0.30).toFixed(2)})`
        : '';

    const iconInkLightBg =
      settings.accentPreset === 'custom'
        ? adjustCustomAccentForSurface(settings.customAccentHex, false)
        : currentAccent?.lightSurfaceTextHex || '#0B3B30';

    const iconInkDarkBg =
      settings.accentPreset === 'custom'
        ? adjustCustomAccentForSurface(settings.customAccentHex, true)
        : currentAccent?.darkSurfaceTextHex || '#DFBF84';

    if (settings.iconThemeStyle === 'solid') {
      return {
        backgroundColor: currentAccentHex,
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 60%)',
        color: currentAccentBtnTextHex,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.35)',
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.16)${glowShadow}`,
      };
    }

    if (settings.iconThemeStyle === 'glow_outline') {
      return {
        backgroundColor: useDark
          ? `rgba(${currentAccentRgb}, 0.16)`
          : `rgba(${currentAccentRgb}, 0.12)`,
        backgroundImage: 'none',
        color: useDark ? iconInkDarkBg : iconInkLightBg,
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: useDark ? currentAccentHex : iconInkLightBg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.28)${glowShadow}`,
      };
    }

    // Default: 'frosted'
    return {
      backgroundColor: useDark
        ? 'rgba(250, 240, 220, 0.10)'
        : 'rgba(255, 253, 248, 0.86)',
      backgroundImage: useDark
        ? 'linear-gradient(135deg, rgba(250,240,220,0.18) 0%, rgba(250,240,220,0.04) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,250,240,0.60) 100%)',
      color: useDark ? iconInkDarkBg : iconInkLightBg,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: useDark
        ? `rgba(${currentAccentRgb}, 0.52)`
        : `rgba(11, 59, 48, 0.22)`,
      backdropFilter: 'blur(12px) saturate(160%)',
      WebkitBackdropFilter: 'blur(12px) saturate(160%)',
      boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.45)${glowShadow}`,
    };
  };

  const isVisitorTargetGlassy = (target: VisitorGlassyTarget): boolean => {
    return Boolean(
      settings.isGlassyEnabled &&
        settings.visitorGlassy.enabled &&
        settings.visitorGlassy[target]
    );
  };

  const getVisitorGlassyStyle = (
    target: VisitorGlassyTarget,
    options: {
      isDark?: boolean;
      borderSides?: 'all' | 'bottom' | 'none';
    } = {}
  ): React.CSSProperties => {
    const { isDark, borderSides = 'all' } = options;
    const useDark = isDark ?? isDarkGlass;
    const active = isVisitorTargetGlassy(target);

    if (!active) {
      const solidBorder = useDark
        ? 'rgba(250, 240, 220, 0.18)'
        : 'rgba(11, 59, 48, 0.16)';
      const borderProps: React.CSSProperties =
        borderSides === 'none'
          ? {}
          : borderSides === 'bottom'
          ? {
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: solidBorder,
            }
          : {
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: solidBorder,
            };

      return {
        backgroundColor: useDark ? '#102420' : '#FFFDF8',
        backgroundImage: 'none',
        ...borderProps,
        boxShadow: useDark
          ? '0 8px 24px rgba(0, 0, 0, 0.28)'
          : '0 6px 20px rgba(11, 59, 48, 0.08)',
      };
    }

    return buildGlassOpticalSurface(useDark, borderSides);
  };

  const getDashboardBgStyle = (): React.CSSProperties => {
    const useDarkScrim = isDarkGlass;

    if (settings.backgroundPreset === 'custom' && settings.customBgUrl) {
      const overlay = useDarkScrim
        ? 'linear-gradient(135deg, rgba(9, 15, 13, 0.46), rgba(12, 22, 18, 0.56))'
        : 'linear-gradient(rgba(249, 246, 239, 0.72), rgba(245, 240, 231, 0.78))';
      return {
        backgroundColor: useDarkScrim ? '#0D1714' : '#F6F4EF',
        backgroundImage: `${overlay}, url(${settings.customBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      };
    }

    const preset = BACKGROUND_PRESETS.find((p) => p.id === settings.backgroundPreset);
    if (preset?.imageUrl) {
      const overlay = useDarkScrim
        ? 'linear-gradient(135deg, rgba(9, 15, 13, 0.44) 0%, rgba(12, 22, 18, 0.54) 100%)'
        : 'linear-gradient(rgba(249, 246, 239, 0.72), rgba(245, 240, 231, 0.78))';
      return {
        backgroundColor: useDarkScrim ? preset.baseColor : '#F6F4EF',
        backgroundImage: `${overlay}, url(${preset.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      };
    }

    if (preset) {
      // Ensure contrast veil if user mixes light gradient with Smoked Dark or dark gradient with Crystal Light
      const mismatchVeil =
        preset.recommendedTone === 'light' && useDarkScrim
          ? 'linear-gradient(rgba(9, 17, 15, 0.68), rgba(11, 22, 19, 0.74)), '
          : preset.recommendedTone === 'dark' && !useDarkScrim
          ? 'linear-gradient(rgba(249, 246, 239, 0.78), rgba(245, 240, 231, 0.82)), '
          : '';
      return {
        backgroundColor: useDarkScrim && preset.recommendedTone === 'light' ? '#0D1714' : preset.baseColor,
        backgroundImage: `${mismatchVeil}${preset.gradientImage || 'none'}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      };
    }

    return {
      backgroundColor: useDarkScrim ? '#0D1714' : '#F6F4EF',
      backgroundImage: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        isDarkGlass,
        updateSettings,
        updateVisitorGlassy,
        resetToDefaults,
        currentAccentHex,
        currentAccentTextHex,
        currentAccentBtnTextHex,
        currentAccentRgb,
        currentAccentGlow,
        blurTailwindClass,
        blurPixels,
        getGlassyCardStyle,
        getGlassyIconStyle,
        getVisitorGlassyStyle,
        isVisitorTargetGlassy,
        getDashboardBgStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
