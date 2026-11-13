import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Destination, ExperienceCategory, WebsiteContent } from '../../types';
import { Search, MapPin, Calendar, Users, Compass, ChevronDown } from 'lucide-react';

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
  const { language, t, isRtl } = useLanguage();
  const { getGlassyCardStyle, currentAccentHex, isDarkGlass } = useTheme();

  const isArabic = language === 'ar';
  const headline = isArabic ? content.heroHeadlineAr || content.heroHeadline : content.heroHeadline;
  const description = isArabic ? content.heroDescriptionAr || content.heroDescription : content.heroDescription;

  const categories: ExperienceCategory[] = [
    'Desert Adventure',
    'Cultural Experiences',
    'City Tours',
    'Nature & Outdoor',
    'Luxury Experiences',
    'Family Activities',
  ];

  const optionClass = isDarkGlass ? 'bg-[#102420] text-white' : 'bg-white text-[#202923]';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.heroImage}
          alt="AlUla Saudi Arabia Desert Landscape"
          className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102E29] via-[#123B32]/60 to-[#123B32]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,46,41,0.5)_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Trust metadata with separators */}
        <div
          className="inline-flex items-center gap-2 mb-6 text-xs sm:text-sm font-medium tracking-widest uppercase"
          style={{ color: currentAccentHex }}
        >
          <span>Kingdom of Saudi Arabia</span>
          <span aria-hidden="true">·</span>
          <span>Vision 2030 Tourism Ecosystem</span>
          <span aria-hidden="true">·</span>
          <span>B2B Growth Platform</span>
        </div>

        {/* Marquee Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight mb-6 text-balance">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-10 font-normal leading-relaxed text-balance">
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
                <MapPin className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                <span>{t('hero.searchDestination')}</span>
              </label>
              <div className="relative mt-0.5">
                <select
                  value={selectedDestination}
                  onChange={(e) => onSelectDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[var(--tf-heading)] focus:outline-none appearance-none cursor-pointer pr-5 rtl:pr-0 rtl:pl-5 truncate"
                >
                  <option value="all" className={optionClass}>{t('hero.allDestinations')}</option>
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
                <Compass className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                <span>{t('hero.category')}</span>
              </label>
              <div className="relative mt-0.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => onSelectCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[var(--tf-heading)] focus:outline-none appearance-none cursor-pointer pr-5 rtl:pr-0 rtl:pl-5 truncate"
                >
                  <option value="all" className={optionClass}>{t('hero.allCategories')}</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className={optionClass}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--tf-muted)] absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Travel Date */}
            <div className="bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl px-3.5 py-2.5 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[var(--tf-muted)]">
                <Calendar className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                <span>{t('hero.date')}</span>
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
                <Users className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                <span>{t('hero.guests')}</span>
              </label>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs sm:text-sm font-semibold text-[var(--tf-heading)] tabular-nums">
                  {guestsCount} {guestsCount > 1 ? 'Guests' : 'Guest'}
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
                style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                className="w-full h-full min-h-[50px] py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t('hero.searchBtn')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
