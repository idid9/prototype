import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Experience, Destination, WebsiteContent } from '../../types';
import {
  localizeCategory,
  localizeCurrency,
  localizeDestinationName,
} from '../../utils/localization';
import { getSiteText } from '../../utils/siteTexts';
import { Clock, Star, ArrowRight, Search, MapPin, Compass } from 'lucide-react';

interface ExperienceCatalogProps {
  experiences: Experience[];
  destinations: Destination[];
  content?: WebsiteContent;
  currency?: string;
  selectedDestination: string;
  onSelectDestination: (destId: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenExperienceDetail: (exp: Experience) => void;
}

export const ExperienceCatalog: React.FC<ExperienceCatalogProps> = ({
  experiences,
  destinations,
  content,
  currency,
  selectedDestination,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
  onOpenExperienceDetail,
}) => {
  const { language, isRtl } = useLanguage();
  const {
    getVisitorGlassyStyle,
    isVisitorTargetGlassy,
    isDarkGlass,
    currentAccentHex,
    currentAccentTextHex,
    currentAccentBtnTextHex,
  } = useTheme();
  const isArabic = language === 'ar';

  const isFilterGlassy = isVisitorTargetGlassy('filterBarGlassy');
  const filterGlassyStyle = getVisitorGlassyStyle('filterBarGlassy');
  const cardGlassyStyle = getVisitorGlassyStyle('experienceCardsGlassy');
  const cardBodyGlassyStyle = getVisitorGlassyStyle('experienceCardsGlassy', {
    borderSides: 'none',
  });

  const optionClass = isDarkGlass ? 'bg-[#102420] text-[#FAF0DC]' : 'bg-[#FFFDF8] text-[#0B3B30]';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { label: string; labelAr: string; value: string }[] = [
    {
      label: getSiteText(content, 'experiences.allTab', 'en'),
      labelAr: getSiteText(content, 'experiences.allTab', 'ar'),
      value: 'all',
    },
    { label: 'Desert Adventure', labelAr: 'مغامرات صحراوية', value: 'Desert Adventure' },
    { label: 'Cultural Experiences', labelAr: 'تجارب ثقافية', value: 'Cultural Experiences' },
    { label: 'City Tours', labelAr: 'جولات المدن', value: 'City Tours' },
    { label: 'Nature & Outdoor', labelAr: 'طبيعة ومغامرات', value: 'Nature & Outdoor' },
    { label: 'Luxury Experiences', labelAr: 'تجارب فاخرة', value: 'Luxury Experiences' },
    { label: 'Family Activities', labelAr: 'أنشطة عائلية', value: 'Family Activities' },
  ];

  // Filter ONLY published experiences whose destination is also published
  const publishedExperiences = useMemo(() => {
    const publishedDestIds = new Set(destinations.filter((d) => d.published).map((d) => d.id));
    return experiences.filter(
      (exp) =>
        exp.status === 'PUBLISHED' &&
        (destinations.length === 0 || publishedDestIds.has(exp.destinationId))
    );
  }, [experiences, destinations]);

  const filteredExperiences = useMemo(() => {
    return publishedExperiences
      .filter((exp) => {
        if (selectedDestination !== 'all' && exp.destinationId !== selectedDestination) {
          return false;
        }
        if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = exp.title.toLowerCase().includes(q) || exp.titleAr.includes(q);
          const matchDesc = exp.description.toLowerCase().includes(q) || exp.descriptionAr.includes(q);
          const matchDest = exp.destinationName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchDest) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [publishedExperiences, selectedDestination, selectedCategory, searchQuery, sortBy]);

  return (
    <section
      id="experiences"
      className="py-20 bg-transparent border-t border-[var(--tf-border)] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: currentAccentTextHex }}
            >
              {getSiteText(content, 'experiences.featuredBadge', language)}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--tf-heading)] tracking-tight">
              {getSiteText(content, 'experiences.title', language)}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--tf-muted)] max-w-2xl">
              {getSiteText(content, 'experiences.sub', language)}
            </p>
          </div>

          {/* Search bar & Sort inside catalog */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 z-10" />
              <input
                type="text"
                placeholder={getSiteText(content, 'experiences.searchPlaceholder', language)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={filterGlassyStyle}
                className="w-full text-xs sm:text-sm pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl text-[var(--tf-heading)] placeholder:text-[var(--tf-muted)] focus:outline-none transition-all"
              />
            </div>
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
              style={filterGlassyStyle}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl text-[var(--tf-heading)] font-medium focus:outline-none cursor-pointer transition-all"
            >
              <option value="featured" className={optionClass}>
                {getSiteText(content, 'experiences.sortFeatured', language)}
              </option>
              <option value="price-asc" className={optionClass}>
                {getSiteText(content, 'experiences.sortPriceAsc', language)}
              </option>
              <option value="price-desc" className={optionClass}>
                {getSiteText(content, 'experiences.sortPriceDesc', language)}
              </option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          style={filterGlassyStyle}
          className={`flex items-center gap-2 overflow-x-auto scrollbar-none transition-all duration-300 ${
            isFilterGlassy ? 'p-2.5 rounded-2xl mb-8' : 'p-2.5 rounded-2xl mb-8'
          }`}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const label = isArabic ? cat.labelAr : cat.label;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                style={
                  isActive
                    ? {
                        backgroundColor: currentAccentHex,
                        color: currentAccentBtnTextHex,
                        borderColor: currentAccentHex,
                      }
                    : undefined
                }
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'shadow-sm font-bold'
                    : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)] hover:bg-[var(--tf-surface-hover)] hover:text-[var(--tf-heading)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Active Destination Filter */}
        {selectedDestination !== 'all' && (
          <div className="flex items-center gap-2 mb-6 text-xs text-[var(--tf-muted)]">
            <span>{getSiteText(content, 'experiences.filteredBy', language)}</span>
            <span className="font-bold text-[var(--tf-heading)]">
              {(() => {
                const matched = destinations.find((d) => d.id === selectedDestination);
                return matched ? (isArabic ? matched.nameAr : matched.name) : selectedDestination;
              })()}
            </span>
            <button
              onClick={() => onSelectDestination('all')}
              style={{ color: currentAccentTextHex }}
              className="hover:underline cursor-pointer ml-2 rtl:ml-0 rtl:mr-2 font-semibold"
            >
              {getSiteText(content, 'experiences.clearFilter', language)}
            </button>
          </div>
        )}

        {/* Catalog Grid */}
        {filteredExperiences.length === 0 ? (
          <div
            style={cardGlassyStyle}
            className="text-center py-20 rounded-2xl transition-all"
          >
            <Compass className="w-10 h-10 mx-auto mb-3" style={{ color: currentAccentTextHex }} />
            <h3 className="text-base font-bold text-[var(--tf-heading)]">
              {getSiteText(content, 'experiences.emptyTitle', language)}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mt-1">
              {getSiteText(content, 'experiences.emptySub', language)}
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectDestination('all');
                setSearchQuery('');
              }}
              style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
              className="mt-4 px-4 py-2 text-xs font-bold rounded-xl cursor-pointer hover:brightness-105 transition-all"
            >
              {getSiteText(content, 'experiences.resetFilters', language)}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp) => {
              const title = isArabic ? exp.titleAr : exp.title;
              const description = isArabic ? exp.descriptionAr : exp.description;
              const duration = isArabic ? exp.durationAr : exp.duration;

              return (
                <div
                  key={exp.id}
                  onClick={() => onOpenExperienceDetail(exp)}
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: cardGlassyStyle.borderColor || 'var(--tf-border)',
                    boxShadow: cardGlassyStyle.boxShadow,
                  }}
                  className="group flex flex-col rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative h-56 overflow-hidden bg-neutral-900">
                    <img
                      src={exp.coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                    {/* Category Label */}
                    <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 text-[11px] font-semibold tracking-wide text-[#FAF0DC] bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#FAF0DC]/20">
                      {localizeCategory(exp.category, language)}
                    </div>

                    {/* Rating if available */}
                    {exp.rating && exp.rating > 0 && (
                      <div className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 flex items-center gap-1 text-[11px] font-bold text-[#FAF0DC] bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-[#FAF0DC]/20">
                        <Star className="w-3 h-3" style={{ color: currentAccentHex, fill: currentAccentHex }} />
                        <span className="tabular-nums">{exp.rating.toFixed(1)}</span>
                        {exp.reviewsCount && (
                          <span className="text-[#EDE0C6]/80 tabular-nums">({exp.reviewsCount})</span>
                        )}
                      </div>
                    )}

                    {/* Destination Banner */}
                    <div className="absolute bottom-3 left-3.5 rtl:left-auto rtl:right-3.5 flex items-center gap-1 text-xs font-medium text-[#FAF0DC]">
                      <MapPin className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                      <span>
                        {localizeDestinationName(exp.destinationName, language, destinations, exp.destinationId)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div
                    style={cardBodyGlassyStyle}
                    className="p-5 flex-1 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] transition-colors line-clamp-1 mb-2">
                        {title}
                      </h3>
                      <p className="text-xs text-[var(--tf-muted)] line-clamp-2 leading-relaxed mb-4">
                        {description}
                      </p>
                    </div>

                    {/* Meta & Price Footer */}
                    <div className="pt-3 border-t border-[var(--tf-border)] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[var(--tf-muted)]">
                        <Clock className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                        <span>{duration}</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-[var(--tf-muted)]">
                          {getSiteText(content, 'experiences.from', language)}
                        </span>
                        <span className="text-base font-bold text-[var(--tf-heading)] font-mono tabular-nums">
                          {exp.price}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: currentAccentTextHex }}>
                          {localizeCurrency(currency, language)}
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-[var(--tf-heading)] transition-colors">
                      <span className="group-hover:underline">
                        {getSiteText(content, 'experiences.viewDetails', language)}
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform"
                        style={{ color: currentAccentTextHex }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
