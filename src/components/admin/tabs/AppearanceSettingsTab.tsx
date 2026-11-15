import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  useTheme,
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  TEXT_COLOR_OPTIONS,
  ICON_THEME_OPTIONS,
  VisitorGlassyTarget,
  LOUNGE_INTERIOR_IMAGE,
} from '../../../context/ThemeContext';
import { GlassContainer } from '../../glass/GlassContainer';
import { ImageUploadField } from '../../common/ImageUploadField';
import {
  Layers,
  Palette,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Compass,
  Sparkles,
  Moon,
  Sun,
  Type,
  Users,
  Award,
  Shield,
  HeartHandshake,
  Globe,
  MapPin,
  Clock,
  Star,
  Search,
} from 'lucide-react';

export const AppearanceSettingsTab: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const {
    settings,
    isDarkGlass,
    updateSettings,
    updateVisitorGlassy,
    resetToDefaults,
    currentAccentHex,
    currentAccentRgb,
    blurPixels,
    getGlassyCardStyle,
    getGlassyIconStyle,
    getVisitorGlassyStyle,
  } = useTheme();

  const [customHexInput, setCustomHexInput] = useState(settings.customAccentHex);

  useEffect(() => {
    setCustomHexInput(settings.customAccentHex);
  }, [settings.customAccentHex]);

  const visitorTargetOptions: {
    key: VisitorGlassyTarget;
    label: string;
    labelAr: string;
  }[] = [
    { key: 'navbarGlassy', label: 'Navbar', labelAr: 'شريط التنقل' },
    { key: 'filterBarGlassy', label: 'Filter Bar', labelAr: 'شريط التصفية' },
    { key: 'experienceCardsGlassy', label: 'Experience Cards', labelAr: 'بطاقات التجارب' },
    { key: 'quizGlassy', label: 'Quiz Matcher', labelAr: 'الاختبار التفاعلي' },
    { key: 'reasonsCardsGlassy', label: 'Ratings & Reasons', labelAr: 'التقييمات والمزايا' },
    { key: 'aboutSectionGlassy', label: 'About Section', labelAr: 'قسم من نحن' },
  ];

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      updateSettings({
        accentPreset: 'custom',
        customAccentHex: val,
      });
    }
  };

  const vg = settings.visitorGlassy;
  const allVisitorTargetsActive = visitorTargetOptions.every((opt) => vg[opt.key]);

  const handleToggleAllVisitorTargets = () => {
    const nextVal = !allVisitorTargetsActive;
    updateVisitorGlassy({
      enabled: true,
      navbarGlassy: nextVal,
      filterBarGlassy: nextVal,
      experienceCardsGlassy: nextVal,
      quizGlassy: nextVal,
      reasonsCardsGlassy: nextVal,
      aboutSectionGlassy: nextVal,
    });
  };

  const activeBgPreset = BACKGROUND_PRESETS.find((p) => p.id === settings.backgroundPreset);
  const specimenStageBg: React.CSSProperties =
    settings.backgroundPreset === 'custom' && settings.customBgUrl
      ? {
          backgroundColor: '#181410',
          backgroundImage: `url(${settings.customBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : activeBgPreset?.imageUrl
      ? {
          backgroundColor: activeBgPreset.baseColor,
          backgroundImage: `url(${activeBgPreset.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {
          backgroundColor: activeBgPreset?.baseColor || '#1F1915',
          backgroundImage: activeBgPreset?.gradientImage || `url(${LOUNGE_INTERIOR_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };

  const glassyIconStyle = getGlassyIconStyle();

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"
            style={{ color: currentAccentHex }}
          >
            <Palette className="w-4 h-4" />
            <span>
              {isArabic
                ? 'استوديو المظهر الموحد للإدارة والزوار'
                : 'Unified Admin & Visitor Theme Studio'}
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'إعدادات الضبابية، أيقونات الزجاج، وخلفية الموقع'
              : 'Blur Intensity, Glassy Icon Theme & Website Wallpaper'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'يُطبق كل تغيير فوراً على لوحة الإدارة وبوابة الزوار مع ضمان تباين واضح للنصوص.'
              : 'All changes apply immediately across both Admin Console and Visitor Portal with adaptive high-contrast legibility.'}
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
          <span>{isArabic ? 'إعادة الضبط للافتراضي' : 'Reset Default Theme'}</span>
        </button>
      </div>

      {/* Live Realtime Visitor Panel Icon & Glassy Appearance Preview */}
      <div
        style={specimenStageBg}
        className="relative rounded-3xl overflow-hidden p-5 sm:p-6 border border-[var(--tf-border)] shadow-xl"
      >
        {/* Soft ambient light orbs behind the glass to reveal blur & refraction depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-8 w-52 h-52 rounded-full opacity-75"
          style={{
            backgroundImage: `radial-gradient(circle, ${currentAccentHex} 0%, rgba(${currentAccentRgb}, 0.14) 68%, transparent 100%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 right-10 w-60 h-60 rounded-full opacity-65"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(16, 185, 129, 0.65) 0%, rgba(217, 194, 154, 0.25) 65%, transparent 100%)',
          }}
        />

        <div
          style={getGlassyCardStyle()}
          className="relative z-10 rounded-2xl p-4 sm:p-5 space-y-4 transition-all duration-200"
        >
          {/* Preview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--tf-border)]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={glassyIconStyle}
              >
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: currentAccentHex, textShadow: 'var(--tf-text-shadow)' }}
                >
                  {isArabic
                    ? 'معاينة فورية لأيقونات ومظهر لوحة الزوار'
                    : 'Live Visitor Panel Icon & Glass Preview'}
                </div>
                <p
                  className="text-[11px] text-[var(--tf-muted)]"
                  style={{ textShadow: 'var(--tf-text-shadow)' }}
                >
                  {isArabic
                    ? 'تعرض هذه المعاينة شكل الأيقونات والألواح الزجاجية كما يراها الزائر مباشرة.'
                    : 'Updates instantaneously as you adjust blur, text contrast, icon theme, or wallpaper.'}
                </p>
              </div>
            </div>

            <div
              className="text-[11px] font-mono tabular-nums text-[var(--tf-heading)] bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] px-3 py-1.5 rounded-xl shrink-0"
              style={{ textShadow: 'var(--tf-text-shadow)' }}
              dir="ltr"
            >
              {`Blur ${blurPixels}px · ${Math.round(settings.cardTranslucency * 100)}% · Glow ${Math.round(
                settings.glowStrength * 100
              )}%`}
            </div>
          </div>

          {/* 1. Mini Visitor Navbar Preview */}
          <div
            style={getVisitorGlassyStyle('navbarGlassy', { borderSides: 'all' })}
            className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={glassyIconStyle}
              >
                <Compass className="w-4 h-4" />
              </div>
              <span
                className="font-bold text-sm tracking-tight text-[var(--tf-heading)] truncate"
                style={{ textShadow: 'var(--tf-text-shadow)' }}
              >
                {isArabic ? 'تور' : 'Tour'}
                <span style={{ color: currentAccentHex }}>{isArabic ? 'فلو' : 'Flow'}</span>
              </span>
            </div>

            <div
              className="hidden md:flex items-center gap-4 text-[11px] font-medium text-[var(--tf-text)]"
              style={{ textShadow: 'var(--tf-text-shadow)' }}
            >
              <span>{isArabic ? 'استكشف' : 'Explore'}</span>
              <span>{isArabic ? 'الوجهات' : 'Destinations'}</span>
              <span>{isArabic ? 'التجارب' : 'Experiences'}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)]">
                <Globe className="w-3 h-3" style={{ color: currentAccentHex }} />
                <span>{isArabic ? 'العربية' : 'EN'}</span>
              </span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              >
                <Sparkles className="w-3 h-3" />
                <span>{isArabic ? 'احجز الآن' : 'Explore'}</span>
              </span>
            </div>
          </div>

          {/* 2. Visitor Panel Icon Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Visitor Commitment Icons Preview */}
            <div
              style={getVisitorGlassyStyle('reasonsCardsGlassy')}
              className="rounded-xl p-3.5 space-y-2.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold text-[var(--tf-heading)]"
                  style={{ textShadow: 'var(--tf-text-shadow)' }}
                >
                  {isArabic ? 'أيقونات المزايا والثقة' : 'Visitor Commitment Icons'}
                </span>
                <span className="text-[10px] font-mono text-[var(--tf-muted)]">
                  {settings.iconThemeStyle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[Users, Award, Shield, HeartHandshake].map((IconComp, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={glassyIconStyle}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <p
                className="text-[11px] text-[var(--tf-muted)] leading-snug"
                style={{ textShadow: 'var(--tf-text-shadow)' }}
              >
                {isArabic
                  ? 'رواة سعوديون معتمدون وتسعير مباشر بالريال السعودي.'
                  : 'Certified Saudi guides & transparent direct SAR pricing.'}
              </p>
            </div>

            {/* Visitor Experience Card & Filter Icons Preview */}
            <div
              style={getVisitorGlassyStyle('experienceCardsGlassy')}
              className="rounded-xl p-3.5 space-y-2.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-bold text-[var(--tf-heading)] truncate"
                  style={{ textShadow: 'var(--tf-text-shadow)' }}
                >
                  {isArabic ? 'مغامرة وتراث العلا' : 'AlUla Hegra Heritage'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[var(--tf-heading)] shrink-0">
                  <Star
                    className="w-3.5 h-3.5"
                    style={{ color: currentAccentHex, fill: currentAccentHex }}
                  />
                  <span>4.9</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--tf-text)]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                  <span>{isArabic ? 'العلا' : 'AlUla'}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                  <span>{isArabic ? '4 ساعات' : '4 hours'}</span>
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--tf-border)] flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-[var(--tf-muted)]">
                  <Search className="w-3 h-3" style={{ color: currentAccentHex }} />
                  <span>{isArabic ? 'شريط البحث' : 'Filter Icon'}</span>
                </span>
                <span
                  className="font-mono font-bold text-[var(--tf-heading)] tabular-nums"
                  style={{ textShadow: 'var(--tf-text-shadow)' }}
                >
                  450 <span style={{ color: currentAccentHex }}>{isArabic ? 'ر.س' : 'SAR'}</span>
                </span>
              </div>
            </div>

            {/* Visitor Interactive Quiz & About Preview */}
            <div
              style={getVisitorGlassyStyle('quizGlassy')}
              className="rounded-xl p-3.5 space-y-2.5 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={glassyIconStyle}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[11px] font-bold text-[var(--tf-heading)] truncate"
                    style={{ textShadow: 'var(--tf-text-shadow)' }}
                  >
                    {isArabic ? 'تحدي المعرفة والمستكشف' : 'Interactive Matcher & Quiz'}
                  </div>
                  <div className="text-[10px] text-[var(--tf-muted)] truncate">
                    {isArabic ? 'قسم الاختبار التفاعلي للزوار' : 'Visitor Quiz Glass Container'}
                  </div>
                </div>
              </div>
              <div
                className="text-[11px] text-[var(--tf-text)] leading-snug"
                style={{ textShadow: 'var(--tf-text-shadow)' }}
              >
                {isArabic
                  ? 'نصوص وأيقونات عالية التباين فوق الخلفية المختارة.'
                  : 'High-contrast typography & icons synced over active wallpaper.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 1: UNIFIED BLUR INTENSITY & TEXT CONTRAST */}
      <GlassContainer delay={0.04} className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--tf-border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={glassyIconStyle}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
                {isArabic
                  ? '١. شدة الضبابية وتباين النصوص الزجاجية'
                  : '1. Blur Intensity & Glass Text Contrast'}
              </h3>
              <p className="text-xs text-[var(--tf-muted)]">
                {isArabic
                  ? 'تحكم موحد في درجة التغبيش والشفافية ولون النصوص لضمان وضوح القراءة دون تداخل.'
                  : 'Unified blur strength, glass transparency, and adaptive text contrast across both panels.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tone Switcher */}
            <div className="inline-flex p-1 rounded-xl border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)]">
              <button
                type="button"
                onClick={() => updateSettings({ glassSurfaceTone: 'dark' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  settings.glassSurfaceTone === 'dark'
                    ? 'shadow-sm text-[#102E29]'
                    : 'text-[var(--tf-muted)] hover:text-[var(--tf-heading)]'
                }`}
                style={
                  settings.glassSurfaceTone === 'dark'
                    ? { backgroundColor: currentAccentHex }
                    : undefined
                }
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{isArabic ? 'داكن مدخّن' : 'Smoked Dark'}</span>
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ glassSurfaceTone: 'light' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  settings.glassSurfaceTone === 'light'
                    ? 'shadow-sm text-[#102E29]'
                    : 'text-[var(--tf-muted)] hover:text-[var(--tf-heading)]'
                }`}
                style={
                  settings.glassSurfaceTone === 'light'
                    ? { backgroundColor: currentAccentHex }
                    : undefined
                }
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{isArabic ? 'نهاري كريستالي' : 'Crystal Light'}</span>
              </button>
            </div>

            {/* Single Glass Enable Toggle */}
            <button
              type="button"
              onClick={() => updateSettings({ isGlassyEnabled: !settings.isGlassyEnabled })}
              aria-label={isArabic ? 'تبديل الوضع الزجاجي' : 'Toggle Glassmorphism'}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xs font-semibold text-[var(--tf-heading)]">
                {settings.isGlassyEnabled
                  ? isArabic
                    ? 'الزجاج مفعّل'
                    : 'Glassy On'
                  : isArabic
                  ? 'صلب'
                  : 'Solid'}
              </span>
              <div
                className="w-11 h-6 flex items-center rounded-full p-1 transition-colors"
                style={{
                  backgroundColor: settings.isGlassyEnabled
                    ? currentAccentHex
                    : 'rgba(128, 128, 128, 0.35)',
                }}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.isGlassyEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* 1 Unified Blur + Transparency Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--tf-heading)]">
                {isArabic ? 'مستوى شدة الضبابية (Blur)' : 'Blur Intensity'}
              </span>
              <span className="font-mono tabular-nums font-bold" style={{ color: currentAccentHex }} dir="ltr">
                {blurPixels}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="2"
              disabled={!settings.isGlassyEnabled}
              value={blurPixels}
              onChange={(e) => updateSettings({ blurRadius: parseInt(e.target.value, 10) })}
              style={{ accentColor: currentAccentHex }}
              className="w-full cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[11px] text-[var(--tf-muted)]">
              <span>{isArabic ? '٠px (صافي)' : '0px (Clear)'}</span>
              <span>{isArabic ? '٢٤px (متوازن)' : '24px (Balanced)'}</span>
              <span>{isArabic ? '٦٤px (أقصى تغبيش)' : '64px (Deep Blur)'}</span>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--tf-heading)]">
                {isArabic ? 'شفافية الطبقة الزجاجية' : 'Glass Transparency'}
              </span>
              <span className="font-mono tabular-nums font-bold" style={{ color: currentAccentHex }}>
                {Math.round(settings.cardTranslucency * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.86"
              step="0.02"
              disabled={!settings.isGlassyEnabled}
              value={settings.cardTranslucency}
              onChange={(e) => updateSettings({ cardTranslucency: parseFloat(e.target.value) })}
              style={{ accentColor: currentAccentHex }}
              className="w-full cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[11px] text-[var(--tf-muted)]">
              <span>{isArabic ? '١٠٪ (شفاف)' : '10% (Sheer)'}</span>
              <span>{isArabic ? '٣٤٪ (مثالي)' : '34% (Ideal)'}</span>
              <span>{isArabic ? '٨٦٪ (كثيف)' : '86% (Opaque)'}</span>
            </div>
          </div>
        </div>

        {/* Text Color Contrast Selector so text never blends into glassy backgrounds */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--tf-heading)]">
            <Type className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
            <span>
              {isArabic
                ? 'لون النصوص على الزجاج (لتفادي الاندماج مع الخلفية):'
                : 'Text Color & Contrast on Glass:'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {TEXT_COLOR_OPTIONS.map((opt) => {
              const isSelected = settings.textColorMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSettings({ textColorMode: opt.id })}
                  className={`p-3 rounded-xl border text-start flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--tf-surface-hover)] shadow-sm'
                      : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)]'
                  }`}
                  style={isSelected ? { borderColor: currentAccentHex } : undefined}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-[var(--tf-border)] shrink-0"
                    style={{ backgroundColor: opt.swatchHex }}
                  />
                  <span className="text-xs font-semibold text-[var(--tf-heading)] leading-tight">
                    {isArabic ? opt.nameAr : opt.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Visitor Glassy Section Scope (no redundant preview or second toggle) */}
        <div className="pt-4 border-t border-[var(--tf-border)] space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[var(--tf-heading)]">
              {isArabic
                ? 'الأقسام المطبّق عليها تأثير الزجاج في موقع الزوار:'
                : 'Visitor Portal Sections Using Glassy Surface:'}
            </span>
            <button
              type="button"
              disabled={!settings.isGlassyEnabled}
              onClick={handleToggleAllVisitorTargets}
              className="text-xs font-semibold hover:underline cursor-pointer disabled:opacity-40"
              style={{ color: currentAccentHex }}
            >
              {allVisitorTargetsActive
                ? isArabic
                  ? 'إلغاء تحديد الكل'
                  : 'Clear All'
                : isArabic
                ? 'تطبيق على الكل'
                : 'Apply to All'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {visitorTargetOptions.map((opt) => {
              const checked = vg.enabled && vg[opt.key] && settings.isGlassyEnabled;
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={!settings.isGlassyEnabled}
                  onClick={() =>
                    updateVisitorGlassy({
                      enabled: true,
                      [opt.key]: !vg[opt.key],
                    })
                  }
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer disabled:opacity-40 ${
                    checked
                      ? 'bg-[var(--tf-surface-hover)] text-[var(--tf-heading)]'
                      : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)]'
                  }`}
                  style={checked ? { borderColor: currentAccentHex } : undefined}
                >
                  <span className="truncate">{isArabic ? opt.labelAr : opt.label}</span>
                  {checked && (
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: currentAccentHex }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </GlassContainer>

      {/* FEATURE 2: GLASSY ICON & ACCENT THEME */}
      <GlassContainer delay={0.08} className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--tf-border)]">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={glassyIconStyle}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
              {isArabic
                ? '٢. إعدادات ثيم الأيقونات الزجاجية واللون المميز'
                : '2. Glassy Icon Theme & Accent Styling'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              {isArabic
                ? 'تخصيص نمط حاوية الأيقونات ولون التمييز وهالة التوهج عبر جميع بطاقات الإدارة والزوار.'
                : 'Customize icon glass framing, shared accent colors, and luminous icon glow across Admin & Visitor views.'}
            </p>
          </div>
        </div>

        {/* Icon Style Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ICON_THEME_OPTIONS.map((styleOpt) => {
            const isSelected = settings.iconThemeStyle === styleOpt.id;
            return (
              <button
                key={styleOpt.id}
                type="button"
                onClick={() => updateSettings({ iconThemeStyle: styleOpt.id })}
                className={`p-4 rounded-xl border text-start flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--tf-surface-hover)] shadow-sm'
                    : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)]'
                }`}
                style={isSelected ? { borderColor: currentAccentHex } : undefined}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={
                    styleOpt.id === 'solid'
                      ? {
                          backgroundColor: currentAccentHex,
                          color: '#0D2620',
                        }
                      : styleOpt.id === 'glow_outline'
                      ? {
                          backgroundColor: `rgba(${currentAccentRgb}, 0.16)`,
                          color: isDarkGlass ? currentAccentHex : '#0B2D24',
                          border: `1.5px solid ${currentAccentHex}`,
                        }
                      : {
                          backgroundColor: isDarkGlass
                            ? 'rgba(255,255,255,0.12)'
                            : 'rgba(255,255,255,0.8)',
                          color: isDarkGlass ? currentAccentHex : '#0D2F27',
                          border: `1px solid rgba(${currentAccentRgb}, 0.6)`,
                        }
                  }
                >
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--tf-heading)]">
                    {isArabic ? styleOpt.nameAr : styleOpt.name}
                  </div>
                  <div className="text-[11px] text-[var(--tf-muted)] mt-0.5 leading-snug">
                    {isArabic ? styleOpt.descAr : styleOpt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Accent & Icon Color Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {ACCENT_PRESETS.map((swatch) => {
            const isSelected = settings.accentPreset === swatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => updateSettings({ accentPreset: swatch.id })}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--tf-surface-hover)] shadow-md'
                    : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)]'
                }`}
                style={isSelected ? { borderColor: swatch.hex } : undefined}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-[#102E29] transition-transform hover:scale-110"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--tf-heading)]">
                    {isArabic ? swatch.nameAr : swatch.name}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--tf-muted)] mt-0.5" dir="ltr">
                    {swatch.hex}
                  </div>
                </div>
              </button>
            );
          })}

          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
              settings.accentPreset === 'custom'
                ? 'bg-[var(--tf-surface-hover)]'
                : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)]'
            }`}
            style={
              settings.accentPreset === 'custom'
                ? { borderColor: settings.customAccentHex }
                : undefined
            }
          >
            <input
              type="color"
              value={customHexInput}
              onChange={handleCustomHexChange}
              className="w-8 h-8 rounded-full border-0 cursor-pointer p-0 bg-transparent"
              title={isArabic ? 'اختيار لون مخصص' : 'Pick Custom Color'}
            />
            <div className="w-full">
              <div className="text-xs font-bold text-[var(--tf-heading)]">
                {isArabic ? 'لون مخصص' : 'Custom Hex'}
              </div>
              <input
                type="text"
                dir="ltr"
                value={customHexInput}
                onChange={handleCustomHexChange}
                placeholder="#HEX"
                className="w-full text-[10px] font-mono uppercase text-center py-1 mt-1 border border-[var(--tf-border)] rounded bg-[var(--tf-input-bg)] text-[var(--tf-text)]"
              />
            </div>
          </div>
        </div>

        {/* Icon Glow & Border Highlight Slider */}
        <div className="p-4 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--tf-heading)]">
              {isArabic ? 'شدة توهج الأيقونات وإطار الزجاج' : 'Icon & Glass Border Glow'}
            </span>
            <span className="font-mono tabular-nums font-bold" style={{ color: currentAccentHex }}>
              {Math.round(settings.glowStrength * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.glowStrength}
            onChange={(e) => {
              const g = parseFloat(e.target.value);
              updateSettings({
                glowStrength: g,
                borderOpacity: Number((0.18 + g * 0.32).toFixed(2)),
              });
            }}
            style={{ accentColor: currentAccentHex }}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[var(--tf-muted)]">
            <span>{isArabic ? '٠٪ (هادئ)' : '0% (Subtle)'}</span>
            <span>{isArabic ? '٤٥٪ (متوازن)' : '45% (Balanced)'}</span>
            <span>{isArabic ? '١٠٠٪ (متوهج)' : '100% (Luminous)'}</span>
          </div>
        </div>
      </GlassContainer>

      {/* FEATURE 3: WEBSITE WALLPAPER & BACKDROP */}
      <GlassContainer delay={0.12} className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--tf-border)]">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={glassyIconStyle}
          >
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
              {isArabic
                ? '٣. إعدادات خلفية الموقع (Wallpaper)'
                : '3. Website Wallpaper & Backdrop'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              {isArabic
                ? 'اختر من الخلفيات الجاهزة أو ارفع صورة خلفية من جهازك ليتم تطبيقها على كامل المنصة.'
                : 'Select a curated backdrop or upload a custom wallpaper from your device for both Admin and Visitor portals.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = settings.backgroundPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  updateSettings({
                    backgroundPreset: preset.id,
                    glassSurfaceTone: preset.recommendedTone,
                  })
                }
                className={`relative h-32 rounded-xl border-2 p-3 flex flex-col justify-between text-start transition-all overflow-hidden cursor-pointer ${
                  isSelected ? 'shadow-md' : 'border-[var(--tf-border)] hover:opacity-95'
                }`}
                style={{
                  borderColor: isSelected ? currentAccentHex : undefined,
                  backgroundColor: preset.baseColor,
                  backgroundImage: preset.imageUrl
                    ? `linear-gradient(to top, rgba(12,16,15,0.78), rgba(12,16,15,0.2)), url(${preset.imageUrl})`
                    : preset.gradientImage || 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-xs ${
                      preset.recommendedTone === 'dark'
                        ? 'bg-black/65 text-white backdrop-blur-sm'
                        : 'bg-white/90 text-[#0A241E]'
                    }`}
                  >
                    {isArabic ? preset.nameAr : preset.name}
                  </span>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] line-clamp-2 ${
                    preset.recommendedTone === 'dark' ? 'text-white/90' : 'text-[#0A241E]/85'
                  }`}
                >
                  {isArabic ? preset.descriptionAr : preset.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl">
          <ImageUploadField
            label={
              isArabic
                ? 'خلفية مخصصة (رفع صورة من الجهاز)'
                : 'Custom Website Wallpaper (Upload from Device)'
            }
            value={settings.backgroundPreset === 'custom' ? settings.customBgUrl : ''}
            onChange={(dataUrl) =>
              updateSettings({
                backgroundPreset: 'custom',
                customBgUrl: dataUrl,
              })
            }
            onClear={() =>
              updateSettings({
                backgroundPreset: 'lounge_interior',
                customBgUrl: '',
              })
            }
            previewHeightClass="h-40"
            maxDimension={1600}
            emptyPlaceholder={
              isArabic
                ? 'انقر أو اسحب وأفلت صورة خلفية من جهازك'
                : 'Click or drag & drop a wallpaper photo from your device'
            }
            helperText={
              isArabic
                ? 'تُطبق الخلفية المرفوعة فوراً كخلفية موحدة لكل من لوحة الإدارة وموقع الزوار.'
                : 'Uploaded wallpaper applies simultaneously across both the Admin Console and Public Visitor website.'
            }
          />
        </div>
      </GlassContainer>
    </div>
  );
};
