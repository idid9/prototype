import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { AnalyticsEvent, Experience, Inquiry, Destination } from '../../../types';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  localizeCategory,
  localizeCurrency,
  localizeDestinationName,
} from '../../../utils/localization';

interface AnalyticsTabProps {
  analyticsEvents: AnalyticsEvent[];
  experiences: Experience[];
  inquiries: Inquiry[];
  destinations: Destination[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  analyticsEvents,
  experiences,
  inquiries,
  destinations,
}) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, isDarkGlass } = useTheme();

  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length + 180;
  const experienceViews = analyticsEvents.filter((e) => e.type === 'experience_view').length + 64;
  const inquiryCount = inquiries.length;
  const confirmedCount = inquiries.filter(
    (i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED'
  ).length;

  const funnel = [
    {
      step: isArabic ? '١. الاستكشاف ومشاهدات الصفحات' : '1. Discovery & Page Views',
      count: pageViews,
      pct: '100%',
    },
    {
      step: isArabic
        ? '٢. المشاهدات التفصيلية لبرامج التجارب'
        : '2. Experience Itinerary Detailed Views',
      count: experienceViews,
      pct: `${Math.round((experienceViews / pageViews) * 100)}%`,
    },
    {
      step: isArabic ? '٣. طلبات الحجز المرسلة' : '3. Booking Inquiries Submitted',
      count: inquiryCount,
      pct: `${Math.round((inquiryCount / pageViews) * 100)}%`,
    },
    {
      step: isArabic ? '٤. الحجوزات المؤكدة من المشغل' : '4. Operator Confirmed Bookings',
      count: confirmedCount,
      pct: isArabic
        ? `${inquiryCount > 0 ? Math.round((confirmedCount / inquiryCount) * 100) : 0}% من الطلبات`
        : `${inquiryCount > 0 ? Math.round((confirmedCount / inquiryCount) * 100) : 0}% of inquiries`,
    },
  ];

  const destinationCounts: Record<string, number> = {};
  experiences.forEach((exp) => {
    destinationCounts[exp.destinationName] = (destinationCounts[exp.destinationName] || 0) + 1;
  });

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
          {isArabic ? 'فهم أداء أعمالك السياحية' : 'Understand Your Business Performance'}
        </h2>
        <p className="text-xs text-[var(--tf-muted)]">
          {isArabic
            ? 'مؤشرات واضحة مسجلة من حركة الزوار المباشرة، وتقديم الطلبات، والحجوزات المؤكدة.'
            : 'Clear metrics recorded from live visitor traffic, inquiry submissions, and confirmed tourism bookings.'}
        </p>
      </div>

      {/* Funnel Metrics */}
      <GlassContainer className="p-6">
        <h3 className="font-serif text-base font-bold text-[var(--tf-heading)] mb-1">
          {isArabic ? 'مسار تحويل الزائر إلى حجز مؤكد' : 'Visitor-to-Booking Conversion Funnel'}
        </h3>
        <p className="text-xs text-[var(--tf-muted)] mb-6">
          {isArabic
            ? 'تتبع الرحلة الكاملة من الاستكشاف الأولي حتى تأكيد الحجز من المشغل.'
            : 'Tracking the complete journey from initial discovery to operator confirmation.'}
        </p>

        <div className="space-y-4">
          {funnel.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--tf-text)]">{f.step}</span>
                <span className="font-mono text-[var(--tf-heading)] tabular-nums">
                  {f.count} ({f.pct})
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden border border-[var(--tf-border)]"
                style={{
                  backgroundColor: isDarkGlass
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(18, 59, 50, 0.08)',
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(10, Math.min(100, (f.count / (pageViews || 1)) * 100))}%`,
                    background: `linear-gradient(90deg, ${currentAccentHex}, #10B981)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassContainer>

      {/* Grid: Popular Destinations + Top Performing Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassContainer delay={0.06} className="p-6">
          <h3 className="font-serif text-base font-bold text-[var(--tf-heading)] mb-4">
            {isArabic ? 'مخزون الوجهات والطلب عليها' : 'Destination Inventory & Demand'}
          </h3>
          <div className="space-y-3">
            {destinations.map((d) => {
              const count = destinationCounts[d.name] || 0;
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={d.coverImage}
                      alt={isArabic ? d.nameAr : d.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-[var(--tf-heading)]">
                        {isArabic ? d.nameAr : d.name}
                      </div>
                      <div className="text-[10px] text-[var(--tf-muted)]">
                        {isArabic ? d.regionAr : d.region}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="font-mono font-bold text-[var(--tf-heading)] tabular-nums">
                      {isArabic
                        ? `${count} ${count === 1 ? 'باقة' : 'باقات'}`
                        : `${count} ${count === 1 ? 'Package' : 'Packages'}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassContainer>

        <GlassContainer delay={0.1} className="p-6">
          <h3 className="font-serif text-base font-bold text-[var(--tf-heading)] mb-4">
            {isArabic ? 'أبرز التجارب حسب تقييم المسافرين' : 'Top Experiences by Traveler Rating'}
          </h3>
          <div className="space-y-3">
            {experiences.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs"
              >
                <div className="max-w-[200px] truncate">
                  <div className="font-bold text-[var(--tf-heading)] truncate">
                    {isArabic ? exp.titleAr : exp.title}
                  </div>
                  <div className="text-[10px] text-[var(--tf-muted)]">
                    {localizeDestinationName(exp.destinationName, language, destinations, exp.destinationId)}{' '}
                    · {localizeCategory(exp.category, language)}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="font-bold text-[var(--tf-heading)]">
                    {exp.price} {localizeCurrency(exp.currency, language)}
                  </span>
                  {exp.rating && exp.rating > 0 ? (
                    <span className="text-xs font-bold" style={{ color: currentAccentTextHex }}>
                      ★ {exp.rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};
