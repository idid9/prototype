import React, { createContext, useContext, useState, useEffect } from 'react';

export type BlurIntensity = 'sm' | 'md' | 'lg' | 'xl';
export type BackgroundPreset = 'ambient' | 'gradient' | 'desert_dawn' | 'deep_emerald' | 'studio' | 'custom';
export type AccentPreset = 'emerald' | 'gold' | 'violet' | 'cyan' | 'rose' | 'custom';

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
    glow: 'rgba(198, 164, 107, 0.35)',
  },
  {
    id: 'emerald',
    name: 'Saudi Emerald',
    nameAr: 'زمرد سعودي',
    hex: '#10B981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'cyan',
    name: 'Red Sea Turquoise',
    nameAr: 'فيروز البحر الأحمر',
    hex: '#06B6D4',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  {
    id: 'violet',
    name: 'Royal Jacaranda',
    nameAr: 'جاكاراندا ملكي',
    hex: '#8B5CF6',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
  {
    id: 'rose',
    name: 'Taif Rose',
    nameAr: 'ورد الطائف',
    hex: '#F43F5E',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
];

export interface BackgroundPresetOption {
  id: BackgroundPreset;
  name: string;
  nameAr: string;
  previewBg: string;
  description: string;
}

export const BACKGROUND_PRESETS: BackgroundPresetOption[] = [
  {
    id: 'ambient',
    name: 'Ambient Warm Sand',
    nameAr: 'توهج رملي دافئ',
    previewBg: 'radial-gradient(at 0% 0%, #FAF6EE 0px, transparent 50%), radial-gradient(at 100% 100%, #EDE6D6 0px, transparent 50%), #F6F4EF',
    description: 'Soft organic warm desert glow with diffuse ambient lighting',
  },
  {
    id: 'deep_emerald',
    name: 'Dark Oasis Emerald',
    nameAr: 'واحة الزمرد الداكنة',
    previewBg: 'radial-gradient(circle at 10% 20%, #123B32 0%, #0B241F 90%)',
    description: 'High contrast dark green hospitality backdrop',
  },
  {
    id: 'gradient',
    name: 'Modern Executive Gradient',
    nameAr: 'تدرج تنفيذي حديث',
    previewBg: 'linear-gradient(135deg, #F3EFE6 0%, #E8E1D1 50%, #DDD4BF 100%)',
    description: 'Subtle corporate luxury diagonal mesh',
  },
  {
    id: 'desert_dawn',
    name: 'AlUla Dawn Horizon',
    nameAr: 'فجر العلا الذهبي',
    previewBg: 'radial-gradient(circle at 80% 10%, #F5E8D0 0%, #EDE0C7 40%, #E3D1B4 100%)',
    description: 'Sunrise hues inspired by sandstone canyons',
  },
  {
    id: 'studio',
    name: 'Studio Minimalist Ivory',
    nameAr: 'عاجي استوديو نقي',
    previewBg: '#F6F4EF',
    description: 'Clean pristine editorial canvas with zero noise',
  },
];

export interface ThemeSettings {
  isGlassyEnabled: boolean;
  blurIntensity: BlurIntensity;
  cardTranslucency: number; // 0.1 to 1.0
  borderOpacity: number; // 0.1 to 0.8
  isGlowEnabled: boolean;
  backgroundPreset: BackgroundPreset;
  customBgUrl: string;
  accentPreset: AccentPreset;
  customAccentHex: string;
}

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  isGlassyEnabled: true,
  blurIntensity: 'md',
  cardTranslucency: 0.78,
  borderOpacity: 0.45,
  isGlowEnabled: true,
  backgroundPreset: 'ambient',
  customBgUrl: '',
  accentPreset: 'gold',
  customAccentHex: '#C6A46B',
};

const THEME_STORAGE_KEY = 'tourflow_theme_appearance_v1';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
  resetToDefaults: () => void;
  currentAccentHex: string;
  currentAccentGlow: string;
  blurTailwindClass: string;
  getGlassyCardStyle: (isDark?: boolean) => React.CSSProperties;
  getDashboardBgStyle: () => React.CSSProperties;
  isCustomizingOpen: boolean;
  setIsCustomizingOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: DEFAULT_THEME_SETTINGS,
  updateSettings: () => {},
  resetToDefaults: () => {},
  currentAccentHex: '#C6A46B',
  currentAccentGlow: 'rgba(198, 164, 107, 0.35)',
  blurTailwindClass: 'backdrop-blur-md',
  getGlassyCardStyle: () => ({}),
  getDashboardBgStyle: () => ({}),
  isCustomizingOpen: false,
  setIsCustomizingOpen: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(THEME_STORAGE_KEY);
        if (raw) return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(raw) };
      } catch (e) {
        console.error('Failed to load theme settings from storage:', e);
      }
    }
    return DEFAULT_THEME_SETTINGS;
  });

  const [isCustomizingOpen, setIsCustomizingOpen] = useState(false);

  // Compute active accent hex & glow
  const currentAccent = ACCENT_PRESETS.find((p) => p.id === settings.accentPreset);
  const currentAccentHex = settings.accentPreset === 'custom'
    ? settings.customAccentHex
    : currentAccent?.hex || '#C6A46B';

  const currentAccentGlow = settings.accentPreset === 'custom'
    ? `${settings.customAccentHex}40`
    : currentAccent?.glow || 'rgba(198, 164, 107, 0.35)';

  // Compute blur Tailwind class
  const blurTailwindClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  }[settings.blurIntensity];

  // Save to localStorage and update CSS custom properties
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));

      const root = document.documentElement;
      root.style.setProperty('--tourflow-accent', currentAccentHex);
      root.style.setProperty('--tourflow-accent-glow', currentAccentGlow);
      root.style.setProperty('--tourflow-card-translucency', settings.cardTranslucency.toString());
      root.style.setProperty('--tourflow-border-opacity', settings.borderOpacity.toString());
    }
  }, [settings, currentAccentHex, currentAccentGlow]);

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_THEME_SETTINGS);
  };

  // Helper generating dynamic style for cards
  const getGlassyCardStyle = (isDark = false): React.CSSProperties => {
    if (!settings.isGlassyEnabled) {
      return {
        backgroundColor: isDark ? '#123B32' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(217, 194, 154, 0.5)',
      };
    }

    const alpha = settings.cardTranslucency;
    const borderAlpha = settings.borderOpacity;

    let boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
    if (settings.isGlowEnabled) {
      boxShadow = `0 4px 20px 0 ${currentAccentGlow}`;
    }

    return {
      backgroundColor: isDark
        ? `rgba(18, 59, 50, ${Math.min(0.95, alpha + 0.15)})`
        : `rgba(255, 255, 255, ${alpha})`,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderAlpha * 0.7})`
        : `rgba(217, 194, 154, ${borderAlpha})`,
      boxShadow,
      backdropFilter: `blur(${
        settings.blurIntensity === 'sm' ? 4 : settings.blurIntensity === 'md' ? 12 : settings.blurIntensity === 'lg' ? 20 : 32
      }px)`,
      WebkitBackdropFilter: `blur(${
        settings.blurIntensity === 'sm' ? 4 : settings.blurIntensity === 'md' ? 12 : settings.blurIntensity === 'lg' ? 20 : 32
      }px)`,
    };
  };

  // Helper generating dynamic background style for dashboard
  const getDashboardBgStyle = (): React.CSSProperties => {
    if (settings.backgroundPreset === 'custom' && settings.customBgUrl) {
      return {
        backgroundImage: `linear-gradient(rgba(246, 244, 239, 0.92), rgba(246, 244, 239, 0.94)), url(${settings.customBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

    const preset = BACKGROUND_PRESETS.find((p) => p.id === settings.backgroundPreset);
    if (preset) {
      return {
        background: preset.previewBg,
        minHeight: '100vh',
      };
    }

    return { backgroundColor: '#F6F4EF' };
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefaults,
        currentAccentHex,
        currentAccentGlow,
        blurTailwindClass,
        getGlassyCardStyle,
        getDashboardBgStyle,
        isCustomizingOpen,
        setIsCustomizingOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
