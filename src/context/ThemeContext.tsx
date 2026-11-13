import React, { createContext, useContext, useState, useEffect } from 'react';

export type BlurIntensity = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GlassSurfaceTone = 'dark' | 'light';
export type BackgroundPreset =
  | 'lounge_interior'
  | 'ambient'
  | 'deep_emerald'
  | 'gradient'
  | 'desert_dawn'
  | 'custom';
export type AccentPreset = 'gold' | 'emerald' | 'cyan' | 'violet' | 'rose' | 'custom';

export const LOUNGE_INTERIOR_IMAGE = '/src/assets/images/glassy_lounge_backdrop_1794551389317.jpg';

export interface AccentColorOption {
  id: AccentPreset;
  name: string;
  nameAr: string;
  hex: string;
  rgb: string;
  glow: string;
}

export const ACCENT_PRESETS: AccentColorOption[] = [
  {
    id: 'gold',
    name: 'Desert Champagne',
    nameAr: 'شامبين صحراوي',
    hex: '#C6A46B',
    rgb: '198, 164, 107',
    glow: 'rgba(198, 164, 107, 0.4)',
  },
  {
    id: 'emerald',
    name: 'Saudi Emerald',
    nameAr: 'زمرد سعودي',
    hex: '#10B981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'cyan',
    name: 'Red Sea Turquoise',
    nameAr: 'فيروز البحر الأحمر',
    hex: '#06B6D4',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'violet',
    name: 'Royal Jacaranda',
    nameAr: 'جاكاراندا ملكي',
    hex: '#8B5CF6',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'rose',
    name: 'Taif Rose',
    nameAr: 'ورد الطائف',
    hex: '#F43F5E',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.4)',
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
    previewBg: 'radial-gradient(circle at 15% 20%, #16483D 0%, #091B17 85%)',
    baseColor: '#091B17',
    gradientImage: 'radial-gradient(circle at 15% 20%, #16483D 0%, #091B17 85%)',
    recommendedTone: 'dark',
    description: 'Rich obsidian-emerald depth engineered for smoked glass contrast',
    descriptionAr: 'عمق زمردي داكن مصمم لتباين أنيق مع الزجاج المدخن',
  },
  {
    id: 'ambient',
    name: 'Ambient Warm Sand',
    nameAr: 'توهج رملي دافئ',
    previewBg: 'radial-gradient(at 0% 0%, #FAF6EE 0px, transparent 50%), radial-gradient(at 100% 100%, #E7DCC6 0px, transparent 50%), #F6F4EF',
    baseColor: '#F6F4EF',
    gradientImage: 'radial-gradient(at 0% 0%, #FAF6EE 0px, transparent 50%), radial-gradient(at 100% 100%, #E7DCC6 0px, transparent 50%)',
    recommendedTone: 'light',
    description: 'Soft warm desert glow paired with bright crystal frosted cards',
    descriptionAr: 'توهج صحراوي ناعم مع بطاقات زجاجية كريستالية مشرقة',
  },
  {
    id: 'gradient',
    name: 'Modern Executive Mesh',
    nameAr: 'تدرج تنفيذي حديث',
    previewBg: 'linear-gradient(135deg, #F3EFE6 0%, #E6DDD0 50%, #D9CDB8 100%)',
    baseColor: '#E6DDD0',
    gradientImage: 'linear-gradient(135deg, #F3EFE6 0%, #E6DDD0 50%, #D9CDB8 100%)',
    recommendedTone: 'light',
    description: 'Clean executive champagne mesh gradient',
    descriptionAr: 'تدرج لوني تنفيذي نقي بدرجات الشامبين الدافئة',
  },
  {
    id: 'desert_dawn',
    name: 'AlUla Dawn Horizon',
    nameAr: 'فجر العلا الذهبي',
    previewBg: 'radial-gradient(circle at 80% 10%, #F5E8D0 0%, #EADAC0 45%, #DECBA9 100%)',
    baseColor: '#EADAC0',
    gradientImage: 'radial-gradient(circle at 80% 10%, #F5E8D0 0%, #EADAC0 45%, #DECBA9 100%)',
    recommendedTone: 'light',
    description: 'Sunrise sandstone tones for bright editorial clarity',
    descriptionAr: 'درجات الصخور الرملية عند شروق الشمس لوضوح تحريري مشرق',
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
  blurIntensity: BlurIntensity;
  cardTranslucency: number; // 0.1 to 0.92
  borderOpacity: number; // 0.08 to 0.75
  glowStrength: number; // 0 to 1
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
  blurIntensity: 'xl',
  cardTranslucency: 0.46,
  borderOpacity: 0.22,
  glowStrength: 0.4,
  backgroundPreset: 'lounge_interior',
  customBgUrl: '',
  accentPreset: 'gold',
  customAccentHex: '#C6A46B',
  visitorGlassy: DEFAULT_VISITOR_GLASSY,
};

const THEME_STORAGE_KEY = 'tourflow_theme_appearance_v4';
const THEME_BROADCAST_CHANNEL = 'tourflow_theme_sync';

function hexToRgbTuple(hex: string): string {
  const clean = hex.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '198, 164, 107';
}

interface ThemeContextType {
  settings: ThemeSettings;
  isDarkGlass: boolean;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
  updateVisitorGlassy: (partial: Partial<VisitorGlassySettings>) => void;
  resetToDefaults: () => void;
  currentAccentHex: string;
  currentAccentRgb: string;
  currentAccentGlow: string;
  blurTailwindClass: string;
  blurPixels: number;
  getGlassyCardStyle: (forceDark?: boolean) => React.CSSProperties;
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
  currentAccentRgb: '198, 164, 107',
  currentAccentGlow: 'rgba(198, 164, 107, 0.4)',
  blurTailwindClass: 'backdrop-blur-xl',
  blurPixels: 28,
  getGlassyCardStyle: () => ({}),
  getVisitorGlassyStyle: () => ({}),
  isVisitorTargetGlassy: () => false,
  getDashboardBgStyle: () => ({}),
});

const mergeThemeSettings = (parsed: Partial<ThemeSettings>): ThemeSettings => ({
  ...DEFAULT_THEME_SETTINGS,
  ...parsed,
  visitorGlassy: {
    ...DEFAULT_VISITOR_GLASSY,
    ...(parsed.visitorGlassy || {}),
  },
});

export const getBlurPixels = (intensity: BlurIntensity): number => {
  switch (intensity) {
    case 'sm':
      return 6;
    case 'md':
      return 12;
    case 'lg':
      return 20;
    case 'xl':
      return 28;
    case '2xl':
      return 40;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const currentAccent = ACCENT_PRESETS.find((p) => p.id === settings.accentPreset);
  const currentAccentHex =
    settings.accentPreset === 'custom'
      ? settings.customAccentHex
      : currentAccent?.hex || '#C6A46B';

  const currentAccentRgb =
    settings.accentPreset === 'custom'
      ? hexToRgbTuple(settings.customAccentHex)
      : currentAccent?.rgb || '198, 164, 107';

  const currentAccentGlow =
    settings.accentPreset === 'custom'
      ? `rgba(${currentAccentRgb}, 0.4)`
      : currentAccent?.glow || 'rgba(198, 164, 107, 0.4)';

  const blurTailwindClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
  }[settings.blurIntensity];

  const blurPixels = getBlurPixels(settings.blurIntensity);

  // Unified Surface Tone applies across BOTH Admin and Visitor Panels (even when Solid is toggled!)
  const isDarkGlass = settings.glassSurfaceTone === 'dark';

  // Persist to localStorage and bind CSS variables dynamically
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
    }
  }, [settings, currentAccentHex, currentAccentGlow, blurPixels]);

  // Cross-tab synchronization listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        try {
          setSettings(mergeThemeSettings(JSON.parse(e.newValue)));
        } catch {}
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
      } catch {}
    }
  };

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      broadcastUpdate(next);
      return next;
    });
  };

  const updateVisitorGlassy = (partial: Partial<VisitorGlassySettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        visitorGlassy: {
          ...prev.visitorGlassy,
          ...partial,
        },
      };
      broadcastUpdate(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_THEME_SETTINGS);
    broadcastUpdate(DEFAULT_THEME_SETTINGS);
  };

  const getGlassyCardStyle = (forceDark?: boolean): React.CSSProperties => {
    const useDark = forceDark ?? isDarkGlass;

    if (!settings.isGlassyEnabled) {
      return {
        backgroundColor: useDark ? '#102420' : '#FFFFFF',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: useDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(217, 194, 154, 0.5)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      };
    }

    const alpha = settings.cardTranslucency;
    const borderAlpha = settings.borderOpacity;
    const glowAlpha = settings.glowStrength;

    const innerRim = useDark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.16)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.7)';

    const baseDrop = useDark
      ? '0 16px 40px -12px rgba(0, 0, 0, 0.45)'
      : '0 8px 30px -8px rgba(18, 59, 50, 0.08)';

    const accentGlow =
      glowAlpha > 0
        ? `, 0 0 ${Math.round(12 + glowAlpha * 28)}px rgba(${currentAccentRgb}, ${(glowAlpha * 0.35).toFixed(2)})`
        : '';

    return {
      backgroundColor: useDark
        ? `rgba(18, 22, 21, ${alpha})`
        : `rgba(255, 255, 255, ${Math.max(0.35, alpha)})`,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: useDark
        ? `rgba(255, 255, 255, ${borderAlpha})`
        : `rgba(217, 194, 154, ${borderAlpha})`,
      boxShadow: `${baseDrop}, ${innerRim}${accentGlow}`,
      backdropFilter: `blur(${blurPixels}px) saturate(155%)`,
      WebkitBackdropFilter: `blur(${blurPixels}px) saturate(155%)`,
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
      // Harmonious Solid Surface when glass is turned off on Admin or specific visitor section
      const solidBorder = useDark
        ? 'rgba(255, 255, 255, 0.14)'
        : 'rgba(217, 194, 154, 0.45)';
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
        backgroundColor: useDark ? '#102420' : '#FFFFFF',
        ...borderProps,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      };
    }

    // Inherit exact unified Glassy V4 controls from Admin ThemeSettings
    const alpha = settings.cardTranslucency;
    const borderAlpha = settings.borderOpacity;
    const glowAlpha = settings.glowStrength;

    const bgColor = useDark
      ? `rgba(18, 22, 21, ${alpha})`
      : `rgba(255, 255, 255, ${Math.max(0.35, alpha)})`;

    const resolvedBorderColor = useDark
      ? `rgba(255, 255, 255, ${borderAlpha})`
      : `rgba(217, 194, 154, ${Math.min(0.9, borderAlpha + 0.15)})`;

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

    const accentGlow =
      glowAlpha > 0
        ? `, 0 0 ${Math.round(12 + glowAlpha * 28)}px rgba(${currentAccentRgb}, ${(glowAlpha * 0.32).toFixed(2)})`
        : '';

    return {
      backgroundColor: bgColor,
      backdropFilter: `blur(${blurPixels}px) saturate(155%)`,
      WebkitBackdropFilter: `blur(${blurPixels}px) saturate(155%)`,
      ...borderProps,
      boxShadow: useDark
        ? `0 16px 40px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)${accentGlow}`
        : `0 8px 30px -8px rgba(18, 59, 50, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)${accentGlow}`,
    };
  };

  const getDashboardBgStyle = (): React.CSSProperties => {
    const useDarkScrim = settings.glassSurfaceTone === 'dark';

    if (settings.backgroundPreset === 'custom' && settings.customBgUrl) {
      const overlay = useDarkScrim
        ? 'linear-gradient(135deg, rgba(12, 16, 15, 0.54), rgba(16, 28, 24, 0.64))'
        : 'linear-gradient(rgba(246, 244, 239, 0.78), rgba(246, 244, 239, 0.85))';
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
        ? 'linear-gradient(135deg, rgba(12, 16, 15, 0.48) 0%, rgba(16, 24, 21, 0.62) 100%)'
        : 'linear-gradient(rgba(246, 244, 239, 0.72), rgba(246, 244, 239, 0.82))';
      return {
        backgroundColor: preset.baseColor,
        backgroundImage: `${overlay}, url(${preset.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      };
    }

    if (preset) {
      return {
        backgroundColor: preset.baseColor,
        backgroundImage: preset.gradientImage || 'none',
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
        currentAccentRgb,
        currentAccentGlow,
        blurTailwindClass,
        blurPixels,
        getGlassyCardStyle,
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
