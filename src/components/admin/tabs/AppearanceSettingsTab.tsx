import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  useTheme,
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  BlurIntensity,
} from '../../../context/ThemeContext';
import {
  Layers,
  Palette,
  Image,
  SunMedium,
  Check,
  RotateCcw,
  Compass,
  TrendingUp,
  Flame,
  Sparkles,
} from 'lucide-react';

export const AppearanceSettingsTab: React.FC = () => {
  const { isRtl } = useLanguage();
  const {
    settings,
    updateSettings,
    resetToDefaults,
    currentAccentHex,
    currentAccentGlow,
    getGlassyCardStyle,
  } = useTheme();

  const [customHexInput, setCustomHexInput] = useState(settings.customAccentHex);
  const [customWallpaperInput, setCustomWallpaperInput] = useState(settings.customBgUrl);

  const blurOptions: { id: BlurIntensity; label: string; preview: string }[] = [
    { id: 'sm', label: 'Subtle (4px)', preview: 'backdrop-blur-sm' },
    { id: 'md', label: 'Balanced (12px)', preview: 'backdrop-blur-md' },
    { id: 'lg', label: 'Lush (20px)', preview: 'backdrop-blur-lg' },
    { id: 'xl', label: 'Deep Frost (32px)', preview: 'backdrop-blur-xl' },
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

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#C6A46B] mb-1 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#123B32]" />
            <span>Dashboard Visual Identity</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
            Dashboard Appearance & Theme Customization
          </h2>
          <p className="text-xs text-[#777D75]">
            Customize dynamic glassmorphism intensity, backdrop ambiance, and accent colors in real time.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="py-2.5 px-4 bg-white border border-[#D9C29A]/60 text-[#123B32] hover:bg-[#FAF8F5] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Saudi Aesthetic</span>
        </button>
      </div>

      {/* Real-Time Live Preview Sticky Billboard */}
      <div className="p-6 rounded-2xl transition-all duration-300" style={getGlassyCardStyle()}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentAccentHex }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B32]">
                Real-Time Live Theme Preview
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#123B32]">
              TourFlow Live Glassy Card Specimen
            </h3>
            <p className="text-xs text-[#777D75] max-w-xl">
              This specimen dynamically renders your current card translucency ({Math.round(settings.cardTranslucency * 100)}%), blur ({settings.blurIntensity.toUpperCase()}), border opacity ({Math.round(settings.borderOpacity * 100)}%), and accent color.
            </p>
          </div>

          {/* Interactive Specimen Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="p-3 rounded-xl border flex items-center gap-3 shadow-sm"
              style={{
                borderColor: `${currentAccentHex}40`,
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-all"
                style={{
                  backgroundColor: currentAccentHex,
                  boxShadow: settings.isGlowEnabled ? `0 0 16px ${currentAccentGlow}` : 'none',
                }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#777D75] font-semibold">Active Accent</div>
                <div className="text-xs font-bold font-mono text-[#123B32]">{currentAccentHex}</div>
              </div>
            </div>

            <div
              className="p-3 rounded-xl border flex items-center gap-3 shadow-sm"
              style={{
                borderColor: `${currentAccentHex}40`,
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-all"
                style={{
                  backgroundColor: currentAccentHex,
                  boxShadow: settings.isGlowEnabled ? `0 0 16px ${currentAccentGlow}` : 'none',
                }}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#777D75] font-semibold">Conversion KPI</div>
                <div className="text-xs font-bold font-mono text-[#123B32]">+28.4% SAR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: GLASSMORPHISM & TRANSLUCENCY CONTROLS */}
      <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/30">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: currentAccentHex }}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#123B32]">
                1. Glassmorphism & Translucency Controls
              </h3>
              <p className="text-xs text-[#777D75]">
                Configure frosted glass effects, depth blur, and surface opacity.
              </p>
            </div>
          </div>

          {/* Master Glass Toggle Switch */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#123B32]">
              {settings.isGlassyEnabled ? 'Glass Effect Enabled' : 'Solid Flat Surface'}
            </span>
            <button
              type="button"
              onClick={() => updateSettings({ isGlassyEnabled: !settings.isGlassyEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.isGlassyEnabled ? 'bg-[#123B32]' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.isGlassyEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card Translucency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#123B32]">Card Translucency</span>
              <span className="font-mono text-[#C6A46B]">
                {Math.round(settings.cardTranslucency * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              disabled={!settings.isGlassyEnabled}
              value={settings.cardTranslucency}
              onChange={(e) => updateSettings({ cardTranslucency: parseFloat(e.target.value) })}
              className="w-full accent-[#123B32] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#777D75]">
              <span>10% (Ultra Sheer)</span>
              <span>60% (Balanced)</span>
              <span>100% (Solid)</span>
            </div>
          </div>

          {/* Border Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#123B32]">Border Opacity & Hairline</span>
              <span className="font-mono text-[#C6A46B]">
                {Math.round(settings.borderOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              disabled={!settings.isGlassyEnabled}
              value={settings.borderOpacity}
              onChange={(e) => updateSettings({ borderOpacity: parseFloat(e.target.value) })}
              className="w-full accent-[#123B32] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#777D75]">
              <span>Subtle (10%)</span>
              <span>Defined (45%)</span>
              <span>Bold (80%)</span>
            </div>
          </div>

          {/* Accent Glow Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#123B32]">Accent Glow & Depth</span>
              <span className="text-[11px] text-[#777D75]">
                {settings.isGlowEnabled ? 'Active Aura' : 'Off'}
              </span>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => updateSettings({ isGlowEnabled: !settings.isGlowEnabled })}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  settings.isGlowEnabled
                    ? 'border-[#123B32] bg-[#FAF8F5] text-[#123B32] shadow-sm'
                    : 'border-neutral-200 bg-white text-[#777D75]'
                }`}
              >
                <Flame className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                <span>{settings.isGlowEnabled ? 'Card Glow Enabled' : 'Card Glow Disabled'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Blur Intensity Selector */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[#123B32]">
            Backdrop Blur Intensity Level:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      ? 'border-[#123B32] bg-[#FAF8F5] text-[#123B32] shadow-sm ring-1 ring-[#123B32]'
                      : 'border-[#D9C29A]/40 bg-white text-[#777D75] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="text-xs font-bold">{b.label}</div>
                  <div className="text-[10px] font-mono text-[#777D75] mt-0.5">{b.preview}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: DASHBOARD BACKGROUND ADJUSTER */}
      <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#D9C29A]/30">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: currentAccentHex }}
          >
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#123B32]">
              2. Dashboard Background Canvas Adjuster
            </h3>
            <p className="text-xs text-[#777D75]">
              Choose from ambient Saudi luxury presets or specify a custom high-resolution wallpaper.
            </p>
          </div>
        </div>

        {/* Preset Thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = settings.backgroundPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => updateSettings({ backgroundPreset: preset.id })}
                className={`relative h-28 rounded-xl border-2 p-3 flex flex-col justify-between text-start transition-all overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[#123B32] ring-2 ring-[#123B32]/30 shadow-md scale-102'
                    : 'border-[#D9C29A]/40 hover:border-[#123B32]/60'
                }`}
                style={{ background: preset.previewBg }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-xs ${
                    preset.id === 'deep_emerald' ? 'bg-black/50 text-white' : 'bg-white/80 text-[#123B32]'
                  }`}>
                    {isRtl ? preset.nameAr : preset.name}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#123B32] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] line-clamp-2 ${
                  preset.id === 'deep_emerald' ? 'text-white/80' : 'text-[#777D75]'
                }`}>
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Wallpaper URL Option */}
        <div className="p-4 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-[#123B32]" />
            <span className="text-xs font-bold text-[#123B32]">
              Or Custom Background Wallpaper URL
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://example.com/saudi_landscape_wallpaper.jpg"
              value={customWallpaperInput}
              onChange={(e) => setCustomWallpaperInput(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
            />
            <button
              type="button"
              onClick={handleApplyCustomWallpaper}
              className="py-2.5 px-5 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              Apply Wallpaper
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: DYNAMIC ICON & ACCENT COLOR PICKER */}
      <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#D9C29A]/30">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: currentAccentHex }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#123B32]">
              3. Dynamic Accent Color Swatches
            </h3>
            <p className="text-xs text-[#777D75]">
              Select a signature palette. Metric highlights, borders, and button elements bind to this accent.
            </p>
          </div>
        </div>

        {/* Color Swatch Tiles */}
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
                    ? 'border-[#123B32] bg-[#FAF8F5] ring-2 ring-[#123B32]/30 shadow-md'
                    : 'border-[#D9C29A]/40 bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#202923]">
                    {isRtl ? swatch.nameAr : swatch.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#777D75] mt-0.5">{swatch.hex}</div>
                </div>
              </button>
            );
          })}

          {/* Custom Hex Swatch Card */}
          <div
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
              settings.accentPreset === 'custom'
                ? 'border-[#123B32] bg-[#FAF8F5] ring-2 ring-[#123B32]/30'
                : 'border-[#D9C29A]/40 bg-white'
            }`}
          >
            <div className="relative">
              <input
                type="color"
                value={customHexInput}
                onChange={handleCustomHexChange}
                className="w-8 h-8 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                title="Pick Custom Color"
              />
            </div>
            <div className="w-full">
              <div className="text-xs font-bold text-[#202923]">Custom Hex</div>
              <input
                type="text"
                value={customHexInput}
                onChange={handleCustomHexChange}
                placeholder="#HEX"
                className="w-full text-[10px] font-mono uppercase text-center py-1 mt-1 border border-[#D9C29A]/50 rounded bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
