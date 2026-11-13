import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  useTheme,
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  BlurIntensity,
  VisitorGlassyTarget,
  getBlurPixels,
} from '../../../context/ThemeContext';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  Layers,
  Palette,
  Image,
  SunMedium,
  Check,
  RotateCcw,
  Compass,
  TrendingUp,
  Sparkles,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';

export const AppearanceSettingsTab: React.FC = () => {
  const { isRtl } = useLanguage();
  const {
    settings,
    isDarkGlass,
    updateSettings,
    updateVisitorGlassy,
    resetToDefaults,
    currentAccentHex,
    currentAccentGlow,
    getVisitorGlassyStyle,
  } = useTheme();

  const [customHexInput, setCustomHexInput] = useState(settings.customAccentHex);
  const [customWallpaperInput, setCustomWallpaperInput] = useState(settings.customBgUrl);

  const blurOptions: { id: BlurIntensity; label: string; pxLabel: string }[] = [
    { id: 'sm', label: 'SM', pxLabel: '6px' },
    { id: 'md', label: 'MD', pxLabel: '12px' },
    { id: 'lg', label: 'LG', pxLabel: '20px' },
    { id: 'xl', label: 'XL', pxLabel: '28px' },
    { id: '2xl', label: '2XL', pxLabel: '40px' },
  ];

  const visitorTargetOptions: { key: VisitorGlassyTarget; label: string; desc: string }[] = [
    {
      key: 'navbarGlassy',
      label: 'Header Navigation Bar',
      desc: 'Floating top visitor navbar & mobile drawer',
    },
    {
      key: 'filterBarGlassy',
      label: 'Experience Filter Bar',
      desc: 'Category tabs, search input & sort controls',
    },
    {
      key: 'experienceCardsGlassy',
      label: 'Experience Catalog Cards',
      desc: 'All experience card bodies & itinerary tiles',
    },
    {
      key: 'quizGlassy',
      label: 'Interactive Quiz & Matcher',
      desc: 'Experience Matcher & Knowledge Game boxes',
    },
    {
      key: 'reasonsCardsGlassy',
      label: 'Why Local & Ratings Cards',
      desc: 'Value proposition & guest feedback glass cards',
    },
    {
      key: 'aboutSectionGlassy',
      label: 'About & Metrics Container',
      desc: 'About TourFlow editorial glass container',
    },
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

  const handleApplyCustomWallpaper = () => {
    if (customWallpaperInput.trim()) {
      updateSettings({
        backgroundPreset: 'custom',
        customBgUrl: customWallpaperInput.trim(),
      });
    }
  };

  const vg = settings.visitorGlassy;
  const allVisitorTargetsActive = visitorTargetOptions.every((opt) => vg[opt.key]);

  const handleToggleAllVisitorTargets = () => {
    const nextVal = !allVisitorTargetsActive;
    updateVisitorGlassy({
      navbarGlassy: nextVal,
      filterBarGlassy: nextVal,
      experienceCardsGlassy: nextVal,
      quizGlassy: nextVal,
      reasonsCardsGlassy: nextVal,
      aboutSectionGlassy: nextVal,
    });
  };

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
            <span>Unified Admin & Visitor Theme Studio</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            Glassy V4 Intensity, Backdrop & Dual-Panel Sync
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            Every visual adjustment here—blur, transparency, surface tone, backdrop, and accent color—is applied seamlessly to both the Admin Console and Public Visitor Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
          <span>Reset Glassy V4 Preset</span>
        </button>
      </div>

      {/* Live Preview Specimen Billboard */}
      <GlassContainer className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--tf-heading)]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentAccentHex }} />
              <span>Unified Admin & Visitor Specimen</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)]">
              {isDarkGlass ? 'Smoked Obsidian Frosted Glass' : 'Crystal Daylight Frosted Glass'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] max-w-xl font-mono tabular-nums">
              Blur: {getBlurPixels(settings.blurIntensity)}px ({settings.blurIntensity.toUpperCase()}) · Opacity: {Math.round(settings.cardTranslucency * 100)}% · Border: {Math.round(settings.borderOpacity * 100)}% · Glow: {Math.round(settings.glowStrength * 100)}%
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all"
                style={{
                  backgroundColor: currentAccentHex,
                  color: '#102E29',
                  boxShadow:
                    settings.glowStrength > 0
                      ? `0 0 ${Math.round(10 + settings.glowStrength * 18)}px ${currentAccentGlow}`
                      : 'none',
                }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--tf-muted)] font-semibold">Shared Accent</div>
                <div className="text-xs font-bold font-mono text-[var(--tf-heading)]">
                  {currentAccentHex}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all"
                style={{
                  backgroundColor: currentAccentHex,
                  color: '#102E29',
                  boxShadow:
                    settings.glowStrength > 0
                      ? `0 0 ${Math.round(10 + settings.glowStrength * 18)}px ${currentAccentGlow}`
                      : 'none',
                }}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--tf-muted)] font-semibold">Sync Status</div>
                <div className="text-xs font-bold font-mono tabular-nums text-[var(--tf-heading)]">
                  Admin + Visitor
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* SECTION 1: UNIFIED BLUR & GLASS INTENSITY CONTROLLER */}
      <GlassContainer delay={0.04} className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--tf-border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
                1. Global Blur & Glass Intensity Controller
              </h3>
              <p className="text-xs text-[var(--tf-muted)]">
                Controls <span className="font-mono">--glass-blur</span>, <span className="font-mono">--glass-bg-opacity</span>, and <span className="font-mono">--glass-border-opacity</span> simultaneously for Admin & Visitor views.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Glass Tone Switcher */}
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
                <span>Smoked Dark</span>
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
                <span>Crystal Light</span>
              </button>
            </div>

            {/* Master Glass Toggle */}
            <button
              type="button"
              onClick={() => updateSettings({ isGlassyEnabled: !settings.isGlassyEnabled })}
              aria-label="Toggle Glassmorphism"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xs font-semibold text-[var(--tf-heading)]">
                {settings.isGlassyEnabled ? 'Glass On' : 'Solid'}
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

        {/* Sliders Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--tf-heading)]">Background Opacity</span>
              <span className="font-mono tabular-nums" style={{ color: currentAccentHex }}>
                {Math.round(settings.cardTranslucency * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.92"
              step="0.02"
              disabled={!settings.isGlassyEnabled}
              value={settings.cardTranslucency}
              onChange={(e) => updateSettings({ cardTranslucency: parseFloat(e.target.value) })}
              style={{ accentColor: currentAccentHex }}
              className="w-full cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[var(--tf-muted)]">
              <span>10% (Sheer)</span>
              <span>46% (V4 Ideal)</span>
              <span>92% (Dense)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--tf-heading)]">Border Rim Opacity</span>
              <span className="font-mono tabular-nums" style={{ color: currentAccentHex }}>
                {Math.round(settings.borderOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.08"
              max="0.75"
              step="0.02"
              disabled={!settings.isGlassyEnabled}
              value={settings.borderOpacity}
              onChange={(e) => updateSettings({ borderOpacity: parseFloat(e.target.value) })}
              style={{ accentColor: currentAccentHex }}
              className="w-full cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[var(--tf-muted)]">
              <span>8% (Hairline)</span>
              <span>22% (V4 Frost)</span>
              <span>75% (Framed)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--tf-heading)]">Accent Glow Aura</span>
              <span className="font-mono tabular-nums" style={{ color: currentAccentHex }}>
                {Math.round(settings.glowStrength * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!settings.isGlassyEnabled}
              value={settings.glowStrength}
              onChange={(e) => updateSettings({ glowStrength: parseFloat(e.target.value) })}
              style={{ accentColor: currentAccentHex }}
              className="w-full cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[var(--tf-muted)]">
              <span>0% (Clean)</span>
              <span>40% (Ambient)</span>
              <span>100% (Luminous)</span>
            </div>
          </div>
        </div>

        {/* 5-Step Backdrop Blur Level */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[var(--tf-heading)]">
            Backdrop Blur Intensity (sm to 2xl):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {blurOptions.map((b) => {
              const isSelected = settings.blurIntensity === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  disabled={!settings.isGlassyEnabled}
                  onClick={() => updateSettings({ blurIntensity: b.id })}
                  className={`p-3 text-start rounded-xl border transition-all cursor-pointer disabled:opacity-40 ${
                    isSelected
                      ? 'bg-[var(--tf-surface-hover)] shadow-sm'
                      : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)]'
                  }`}
                  style={isSelected ? { borderColor: currentAccentHex } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--tf-heading)]">
                      backdrop-blur-{b.id}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--tf-muted)]">{b.pxLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </GlassContainer>

      {/* SECTION 2: BACKDROP CANVAS */}
      <GlassContainer delay={0.08} className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--tf-border)]">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          >
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
              2. Shared Interior & Ambient Backdrop Switcher
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              Applied as the living backdrop canvas behind both Admin panels and Visitor Portal sections.
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
                  background: preset.imageUrl
                    ? `linear-gradient(to top, rgba(12,16,15,0.78), rgba(12,16,15,0.2)), url(${preset.imageUrl}) center/cover`
                    : preset.previewBg,
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-xs ${
                      preset.recommendedTone === 'dark'
                        ? 'bg-black/60 text-white backdrop-blur-sm'
                        : 'bg-white/85 text-[#123B32]'
                    }`}
                  >
                    {isRtl ? preset.nameAr : preset.name}
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
                    preset.recommendedTone === 'dark' ? 'text-white/85' : 'text-[#202923]/80'
                  }`}
                >
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4" style={{ color: currentAccentHex }} />
            <span className="text-xs font-bold text-[var(--tf-heading)]">
              Custom Backdrop Wallpaper URL
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={customWallpaperInput}
              onChange={(e) => setCustomWallpaperInput(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCustomWallpaper}
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              className="py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
            >
              Apply Wallpaper
            </button>
          </div>
        </div>
      </GlassContainer>

      {/* SECTION 3: DYNAMIC ACCENT COLOR SWATCHES */}
      <GlassContainer delay={0.12} className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--tf-border)]">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
              3. Shared Accent Color Swatches (Admin & Visitor)
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              Updates icons, active filter buttons, CTA highlights, prices, and glass glows across both panels immediately.
            </p>
          </div>
        </div>

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
                    {isRtl ? swatch.nameAr : swatch.name}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--tf-muted)] mt-0.5">
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
              title="Pick Custom Color"
            />
            <div className="w-full">
              <div className="text-xs font-bold text-[var(--tf-heading)]">Custom Hex</div>
              <input
                type="text"
                value={customHexInput}
                onChange={handleCustomHexChange}
                placeholder="#HEX"
                className="w-full text-[10px] font-mono uppercase text-center py-1 mt-1 border border-[var(--tf-border)] rounded bg-[var(--tf-input-bg)] text-[var(--tf-text)]"
              />
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* SECTION 4: PUBLIC VISITOR SECTIONS USING GLASSY SURFACES */}
      <GlassContainer delay={0.16} className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--tf-border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
            >
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
                4. Visitor Portal Glass Section Mapping
              </h3>
              <p className="text-xs text-[var(--tf-muted)]">
                Choose which public sections inherit your active Glassy V4 blur, opacity, tone, and accent settings.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!settings.isGlassyEnabled}
            onClick={() => updateVisitorGlassy({ enabled: !vg.enabled })}
            className="flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <span className="text-xs font-semibold text-[var(--tf-heading)]">
              {vg.enabled && settings.isGlassyEnabled ? 'Visitor Glass Active' : 'Visitor Solid'}
            </span>
            <div
              className="w-11 h-6 flex items-center rounded-full p-1 transition-colors"
              style={{
                backgroundColor:
                  vg.enabled && settings.isGlassyEnabled
                    ? currentAccentHex
                    : 'rgba(128, 128, 128, 0.35)',
              }}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  vg.enabled && settings.isGlassyEnabled
                    ? 'translate-x-5 rtl:-translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Live Visitor Preview Strip showing unified settings */}
        <div className="relative rounded-2xl overflow-hidden p-5 border border-[var(--tf-border)] bg-[radial-gradient(circle_at_20%_20%,_#123B32_0%,_#1D5546_45%,_#C6A46B_100%)]">
          <div
            style={getVisitorGlassyStyle('experienceCardsGlassy')}
            className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300"
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--tf-heading)]">
                Public Visitor Card Sync Preview ({isDarkGlass ? 'Smoked Dark' : 'Crystal Light'})
              </div>
              <div className="text-xs text-[var(--tf-muted)] mt-0.5 font-mono tabular-nums">
                Opacity: {Math.round(settings.cardTranslucency * 100)}% · Blur:{' '}
                {getBlurPixels(settings.blurIntensity)}px ({settings.blurIntensity.toUpperCase()}) · Accent: {currentAccentHex}
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-lg text-[#102E29] shrink-0"
              style={{ backgroundColor: currentAccentHex }}
            >
              Harmonized Live
            </span>
          </div>
        </div>

        {/* Visitor Section Toggle Grid */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--tf-heading)]">
              Public Visitor Sections Using Glassy Surface:
            </label>
            <button
              type="button"
              disabled={!vg.enabled || !settings.isGlassyEnabled}
              onClick={handleToggleAllVisitorTargets}
              className="text-xs font-semibold hover:underline cursor-pointer disabled:opacity-40"
              style={{ color: currentAccentHex }}
            >
              {allVisitorTargetsActive ? 'Disable All Sections' : 'Enable All Sections'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visitorTargetOptions.map((opt) => {
              const checked = vg[opt.key];
              const isEnabled = vg.enabled && settings.isGlassyEnabled;
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={!isEnabled}
                  onClick={() => updateVisitorGlassy({ [opt.key]: !checked })}
                  className={`p-3.5 rounded-xl border text-start flex items-start justify-between gap-3 transition-all cursor-pointer disabled:opacity-40 ${
                    checked && isEnabled
                      ? 'bg-[var(--tf-surface-hover)]'
                      : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)]'
                  }`}
                  style={checked && isEnabled ? { borderColor: currentAccentHex } : undefined}
                >
                  <div>
                    <div className="text-xs font-bold text-[var(--tf-heading)]">{opt.label}</div>
                    <div className="text-[11px] text-[var(--tf-muted)] mt-0.5 leading-snug">
                      {opt.desc}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                    style={
                      checked && isEnabled
                        ? {
                            backgroundColor: currentAccentHex,
                            borderColor: currentAccentHex,
                            color: '#102E29',
                          }
                        : { borderColor: 'var(--tf-border)' }
                    }
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};
