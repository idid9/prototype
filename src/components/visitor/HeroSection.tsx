import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Destination, ExperienceCategory, WebsiteContent } from '../../types';
import { formatGuestsCount, localizeCategory } from '../../utils/localization';
import { getSiteText } from '../../utils/siteTexts';
import { Search, MapPin, Calendar, Users, Compass, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  content: WebsiteContent;
  destinations: Destination[];
  selectedDestination: string;
  onSelectDestination: (destId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchDate: string;
  onSetSearchDate: (date: string) => void;
  guestsCount: number;
  onSetGuestsCount: (guests: number) => void;
  onExecuteSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  content,
  destinations,
  selectedDestination,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
  searchDate,
  onSetSearchDate,
  guestsCount,
  onSetGuestsCount,
  onExecuteSearch,
}) => {
  const { language, isRtl } = useLanguage();
  const { getGlassyCardStyle, currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex, isDarkGlass } = useTheme();

  const isArabic = language === 'ar';
  const headline = isArabic ? content.heroHeadlineAr || content.heroHeadline : content.heroHeadline;
  const description = isArabic ? content.heroDescriptionAr || content.heroDescription : content.heroDescription;

  const slides = useMemo(() => {
    const raw = Array.isArray(content.heroImages) && content.heroImages.length > 0
      ? content.heroImages.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
    if (raw.length > 0) return raw;
    return content.heroImage ? [content.heroImage] : [];
  }, [content.heroImages, content.heroImage]);

  const slideshowEnabled = slides.length > 1 && content.heroSlideshowEnabled !== false;
  const slideIntervalMs = Math.max(2000, Math.min(30000, (content.heroSlideIntervalSec ?? 5) * 1000));

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [timerResetTick, setTimerResetTick] = useState(0);

  const slidesSignature = slides.join('|');
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [slidesSignature]);

  useEffect(() => {
    if (!slideshowEnabled) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [slideshowEnabled, slideIntervalMs, slides.length, timerResetTick]);

  const safeSlideIndex = slides.length > 0 ? activeSlideIndex % slides.length : 0;

  const handleStepSlide = (delta: number) => {
    if (slides.length <= 1) return;
    setActiveSlideIndex((prev) => (prev + delta + slides.length) % slides.length);
    setTimerResetTick((t) => t + 1);
  };

  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index);
    setTimerResetTick((t) => t + 1);
  };

  const categories: ExperienceCategory[] = [
    'Desert Adventure',
    'Cultural Experiences',
    'City Tours',
    'Nature & Outdoor',
    'Luxury Experiences',
    'Family Activities',
  ];

  const optionClass = isDarkGlass ? 'bg-[#102420] text-[#FAF0DC]' : 'bg-[#FFFDF8] text-[#0B3B30]';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image / Auto-Slideshow with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        {slides.map((src, idx) => {
          const isActive = idx === safeSlideIndex;
          return (
            <img
              key={`${idx}-${src.slice(0, 48)}`}
              src={src}
              alt={
                isArabic
                  ? `مشهد سياحي في المملكة العربية السعودية (${idx + 1})`
                  : `Saudi Arabia Curated Destination Scene ${idx + 1}`
              }
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
              }`}
              referrerPolicy="no-referrer"
            />
          );
        })}
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102E29] via-[#123B32]/60 to-[#123B32]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,46,41,0.5)_100%)]" />
      </div>

      {/* Subtle Slideshow Navigation Indicators */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#102E29]/60 backdrop-blur-md border border-[#FAF0DC]/20 shadow-md"
          aria-label={isArabic ? 'عناصر التحكم في عرض الشرائح' : 'Hero slideshow controls'}
        >
          <button
            type="button"
            onClick={() => handleStepSlide(isRtl ? 1 : -1)}
            aria-label={isArabic ? 'الصورة السابقة' : 'Previous hero photo'}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#FAF0DC]/80 hover:text-[#FAF0DC] hover:bg-[#FAF0DC]/15 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {slides.map((_, idx) => {
              const isActive = idx === safeSlideIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  aria-label={
                    isArabic ? `الانتقال إلى الصورة ${idx + 1}` : `Go to slide ${idx + 1}`
                  }
                  aria-current={isActive ? 'true' : undefined}
                  style={isActive ? { backgroundColor: currentAccentHex } : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? 'w-6' : 'w-2 bg-[#FAF0DC]/45 hover:bg-[#FAF0DC]/75'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleStepSlide(isRtl ? -1 : 1)}
            aria-label={isArabic ? 'الصورة التالية' : 'Next hero photo'}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#FAF0DC]/80 hover:text-[#FAF0DC] hover:bg-[#FAF0DC]/15 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#FAF0DC]" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Trust metadata with separators */}
        <div
          className="inline-flex flex-wrap items-center justify-center gap-2 mb-6 text-xs sm:text-sm font-medium tracking-widest uppercase tf-photo-text"
          style={{ color: currentAccentHex }}
        >
          <span>{getSiteText(content, 'hero.taglineLeft', language)}</span>
          <span aria-hidden="true">·</span>
          <span>{getSiteText(content, 'hero.taglineMid', language)}</span>
          <span aria-hidden="true">·</span>
          <span>{getSiteText(content, 'hero.taglineRight', language)}</span>
        </div>

        {/* Marquee Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF0DC] tf-photo-text max-w-4xl mx-auto leading-tight sm:leading-tight mb-6 text-balance">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#EDE0C6] tf-photo-text max-w-2xl mx-auto mb-10 font-normal leading-relaxed text-balance">
          {description}
        </p>

        {/* Glassmorphism Interactive Search Console synced with Admin Glass V4 */}
        <div
          style={getGlassyCardStyle()}
          className="text-[var(--tf-text)] rounded-2xl p-4 sm:p-5 max-w-5xl mx-auto transition-all duration-300"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onExecuteSearch();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center text-start"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Destination Selection */}
            <div className="bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl px-3.5 py-2.5 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[var(--tf-muted)]">
                <MapPin className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                <span>{getSiteText(content, 'hero.searchDestination', language)}</span>
              </label>
              <div className="relative mt-0.5">
                <select
                  value={selectedDestination}
                  onChange={(e) => onSelectDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[var(--tf-heading)] focus:outline-none appearance-none cursor-pointer pr-5 rtl:pr-0 rtl:pl-5 truncate"
                >
                  <option value="all" className={optionClass}>{getSiteText(content, 'hero.allDestinations', language)}</option>
                  {destinations
                    .filter((d) => d.published)
                    .map((d) => (
                      <option key={d.id} value={d.id} className={optionClass}>
                        {isArabic ? d.nameAr : d.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--tf-muted)] absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Experience Category */}
            <div className="bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl px-3.5 py-2.5 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[var(--tf-muted)]">
                <Compass className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                <span>{getSiteText(content, 'hero.category', language)}</span>
              </label>
              <div className="relative mt-0.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => onSelectCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[var(--tf-heading)] focus:outline-none appearance-none cursor-pointer pr-5 rtl:pr-0 rtl:pl-5 truncate"
                >
                  <option value="all" className={optionClass}>{getSiteText(content, 'hero.allCategories', language)}</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className={optionClass}>
                      {localizeCategory(c, language)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--tf-muted)] absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Travel Date */}
            <div className="bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl px-3.5 py-2.5 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[var(--tf-muted)]">
                <Calendar className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                <span>{getSiteText(content, 'hero.date', language)}</span>
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => onSetSearchDate(e.target.value)}
                style={{ colorScheme: isDarkGlass ? 'dark' : 'light' }}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[var(--tf-heading)] focus:outline-none cursor-pointer mt-0.5"
              />
            </div>

            {/* Guests Count */}
            <div className="bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl px-3.5 py-2.5 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[var(--tf-muted)]">
                <Users className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                <span>{getSiteText(content, 'hero.guests', language)}</span>
              </label>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs sm:text-sm font-semibold text-[var(--tf-heading)] tabular-nums">
                  {formatGuestsCount(guestsCount, language)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSetGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] text-xs font-bold hover:bg-[var(--tf-surface-hover)] cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetGuestsCount(Math.min(20, guestsCount + 1))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] text-xs font-bold hover:bg-[var(--tf-surface-hover)] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Execute Search CTA */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
                className="w-full h-full min-h-[50px] py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{getSiteText(content, 'hero.searchBtn', language)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
