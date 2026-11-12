import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Experience, ExperienceCategory, Destination } from '../../types';
import { Clock, Star, ArrowRight, Search, SlidersHorizontal, MapPin, Compass } from 'lucide-react';

interface ExperienceCatalogProps {
  experiences: Experience[];
  destinations: Destination[];
  selectedDestination: string;
  onSelectDestination: (destId: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenExperienceDetail: (exp: Experience) => void;
}

export const ExperienceCatalog: React.FC<ExperienceCatalogProps> = ({
  experiences,
  destinations,
  selectedDestination,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
  onOpenExperienceDetail,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { label: string; labelAr: string; value: string }[] = [
    { label: 'All Experiences', labelAr: 'جميع التجارب', value: 'all' },
    { label: 'Desert Adventure', labelAr: 'مغامرات صحراوية', value: 'Desert Adventure' },
    { label: 'Cultural Experiences', labelAr: 'تجارب ثقافية', value: 'Cultural Experiences' },
    { label: 'City Tours', labelAr: 'جولات المدن', value: 'City Tours' },
    { label: 'Nature & Outdoor', labelAr: 'طبيعة ومغامرات', value: 'Nature & Outdoor' },
    { label: 'Luxury Experiences', labelAr: 'تجارب فاخرة', value: 'Luxury Experiences' },
    { label: 'Family Activities', labelAr: 'أنشطة عائلية', value: 'Family Activities' },
  ];

  // Filter ONLY published experiences (§5.D)
  const publishedExperiences = useMemo(() => {
    return experiences.filter((exp) => exp.status === 'PUBLISHED');
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    return publishedExperiences
      .filter((exp) => {
        // Destination filter
        if (selectedDestination !== 'all' && exp.destinationId !== selectedDestination) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
          return false;
        }
        // Search text
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
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [publishedExperiences, selectedDestination, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="experiences" className="py-20 bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-[#C6A46B] mb-2">
              {t('section.experiences.featured')}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B32] tracking-tight">
              {t('section.experiences.title')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#777D75] max-w-2xl">
              {t('section.experiences.sub')}
            </p>
          </div>

          {/* Search bar inside catalog */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#777D75] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isArabic ? 'ابحث في التجارب...' : 'Search experiences...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#F6F4EF] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
              />
            </div>
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm py-2 px-3 bg-[#F6F4EF] border border-[#D9C29A]/50 rounded-xl text-[#123B32] font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill discipline: segmented interactive controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const label = isArabic ? cat.labelAr : cat.label;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#123B32] text-white border-[#123B32] shadow-sm'
                    : 'bg-[#F6F4EF] text-[#777D75] border-[#D9C29A]/40 hover:bg-[#D9C29A]/20 hover:text-[#123B32]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Destination Pills / Active Filters */}
        {selectedDestination !== 'all' && (
          <div className="flex items-center gap-2 mb-6 text-xs text-[#777D75]">
            <span>Filtered by destination:</span>
            <span className="font-bold text-[#123B32]">
              {destinations.find((d) => d.id === selectedDestination)?.name}
            </span>
            <button
              onClick={() => onSelectDestination('all')}
              className="text-[#C6A46B] hover:underline cursor-pointer ml-2"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Catalog Grid */}
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-20 bg-[#F6F4EF] rounded-2xl border border-dashed border-[#D9C29A]">
            <Compass className="w-10 h-10 text-[#C6A46B] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#123B32]">No published experiences match your filter</h3>
            <p className="text-xs text-[#777D75] mt-1">
              Try adjusting your category or destination selection.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectDestination('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-[#123B32] text-white rounded-xl"
            >
              Reset All Filters
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
                  className="group flex flex-col bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative h-56 overflow-hidden bg-neutral-200">
                    <img
                      src={exp.coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Label (clean unboxed tag) */}
                    <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 text-[11px] font-semibold tracking-wide text-white bg-[#123B32]/90 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      {isArabic ? exp.categoryAr : exp.category}
                    </div>

                    {/* Rating if available */}
                    {exp.rating && exp.rating > 0 && (
                      <div className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 fill-[#C6A46B] text-[#C6A46B]" />
                        <span>{exp.rating.toFixed(1)}</span>
                        {exp.reviewsCount && (
                          <span className="text-white/70">({exp.reviewsCount})</span>
                        )}
                      </div>
                    )}

                    {/* Destination Banner */}
                    <div className="absolute bottom-3 left-3.5 rtl:left-auto rtl:right-3.5 flex items-center gap-1 text-xs font-medium text-white/95">
                      <MapPin className="w-3.5 h-3.5 text-[#D9C29A]" />
                      <span>{exp.destinationName}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#123B32] group-hover:text-[#1D5546] transition-colors line-clamp-1 mb-2">
                        {title}
                      </h3>
                      <p className="text-xs text-[#777D75] line-clamp-2 leading-relaxed mb-4">
                        {description}
                      </p>
                    </div>

                    {/* Meta & Price Footer */}
                    <div className="pt-3 border-t border-[#D9C29A]/30 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[#777D75]">
                        <Clock className="w-3.5 h-3.5 text-[#123B32]" />
                        <span>{duration}</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-[#777D75]">{t('section.experiences.from')}</span>
                        <span className="text-base font-bold text-[#123B32] font-mono tabular-nums">
                          {exp.price}
                        </span>
                        <span className="text-xs font-semibold text-[#C6A46B]">
                          {t('section.experiences.sar')}
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-[#123B32] group-hover:text-[#C6A46B] transition-colors">
                      <span>{t('section.experiences.viewDetails')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
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
