import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Destination } from '../../types';
import { ArrowUpRight, Compass } from 'lucide-react';

interface FeaturedDestinationsProps {
  destinations: Destination[];
  onSelectDestination: (destId: string) => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({
  destinations,
  onSelectDestination,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';

  const publishedDestinations = destinations.filter((d) => d.published);

  return (
    <section id="destinations" className="py-20 bg-[#F6F4EF]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold tracking-widest uppercase text-[#C6A46B] mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#123B32]" />
              <span>{t('section.destinations.viewAll')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B32] tracking-tight">
              {t('section.destinations.title')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#777D75] leading-relaxed">
              {t('section.destinations.sub')}
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-xs text-[#777D75]">
              {publishedDestinations.length} Key Tourism Hubs
            </span>
          </div>
        </div>

        {/* Dynamic Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {publishedDestinations.map((dest, idx) => {
            // First destination (AlUla) gets col-span-7, second (Riyadh) gets col-span-5
            // Next three share col-span-4 each
            let colSpan = 'lg:col-span-4';
            if (idx === 0) colSpan = 'lg:col-span-7';
            else if (idx === 1) colSpan = 'lg:col-span-5';

            const name = isArabic ? dest.nameAr : dest.name;
            const description = isArabic ? dest.descriptionAr : dest.description;
            const region = isArabic ? dest.regionAr : dest.region;

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className={`group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-[380px] ${colSpan}`}
              >
                {/* Image */}
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102E29]/95 via-[#102E29]/40 to-transparent transition-opacity" />

                {/* Region Tag */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-xs font-medium tracking-wide text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {region}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-white flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#D9C29A] transition-colors">
                      {name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-[#C6A46B] group-hover:text-[#123B32] flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4 rtl:rotate-90" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-3 leading-relaxed">
                    {description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#D9C29A] font-medium pt-2 border-t border-white/15">
                    <span>{dest.experienceCount} Curated Experiences</span>
                    <span aria-hidden="true">·</span>
                    <span>Explore Destination</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
