import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { AnalyticsEvent, Experience, Inquiry, Destination } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  localizeCategory,
  localizeCurrency,
  localizeDestinationName,
} from '../../../utils/localization';
import { RotateCcw, Check } from 'lucide-react';

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

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length;
  const experienceViews = analyticsEvents.filter((e) => e.type === 'experience_view').length;
  const searchEvents = analyticsEvents.filter((e) => e.type === 'search').length;
  const inquiryCount = inquiries.length;
  const confirmedCount = inquiries.filter(
    (i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED'
  ).length;

  const pctOfViews = (val: number) =>
    pageViews > 0 ? `${Math.round((val / pageViews) * 100)}%` : '0%';

  const funnel = [
    {
      step: isArabic ? '١. الاستكشاف ومشاهدات الصفحات' : '1. Discovery & Page Views',
      count: pageViews,
      pct: pageViews > 0 ? '100%' : '0%',
    },
    {
      step: isArabic
        ? '٢. عمليات البحث وتصفية العروض'
        : '2. Interactive Search & Filters',
      count: searchEvents,
      pct: pctOfViews(searchEvents),
    },
    {
      step: isArabic
        ? '٣. المشاهدات التفصيلية لبرامج التجارب'
        : '3. Experience Itinerary Detailed Views',
      count: experienceViews,
      pct: pctOfViews(experienceViews),
    },
    {
      step: isArabic ? '٤. طلبات الحجز المرسلة' : '4. Booking Inquiries Submitted',
      count: inquiryCount,
      pct: pctOfViews(inquiryCount),
    },
    {
      step: isArabic ? '٥. الحجوزات المؤكدة من المشغل' : '5. Operator Confirmed Bookings',
      count: confirmedCount,
      pct: isArabic
        ? `${inquiryCount > 0 ? Math.round((confirmedCount / inquiryCount) * 100) : 0}% من الطلبات`
        : `${inquiryCount > 0 ? Math.round((confirmedCount / inquiryCount) * 100) : 0}% of inquiries`,
    },
  ];

  const handleConfirmResetAnalytics = () => {
    DataService.resetAnalyticsData();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3500);
  };

  const destinationCounts: Record<string, number> = {};
  experiences.forEach((exp) => {
    destinationCounts[exp.destinationName] = (destinationCounts[exp.destinationName] || 0) + 1;
  });

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {resetDone && (
            <div className="px-3 py-1.5 bg-[var(--tf-success-bg)] border border-[var(--tf-success-border)] text-[var(--tf-success-text)] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                {isArabic
                  ? 'تم تصفير بيانات التحليلات على جميع الأجهزة!'
                  : 'Analytics data reset to zero across all devices!'}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-danger-border)] text-[var(--tf-danger-text)] hover:bg-[var(--tf-danger-bg)] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إعادة تعيين بيانات التحليلات' : 'Reset Data Analytics'}</span>
          </button>
        </div>
      </div>

      {/* Funnel Metrics */}
      <GlassContainer className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--tf-heading)] mb-1">
              {isArabic ? 'مسار تحويل الزائر إلى حجز مؤكد' : 'Visitor-to-Booking Conversion Funnel'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              {isArabic
                ? 'تتبع الرحلة الكاملة من الاستكشاف الأولي حتى تأكيد الحجز من المشغل.'
                : 'Tracking the complete journey from initial discovery to operator confirmation.'}
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-muted)] self-start">
            {isArabic
              ? `إجمالي الأحداث المسجلة: ${analyticsEvents.length}`
              : `Total Tracked Events: ${analyticsEvents.length}`}
          </span>
        </div>

        <div className="space-y-4">
          {funnel.map((f, i) => {
            const barWidth =
              f.count <= 0
                ? 0
                : pageViews > 0
                ? Math.max(8, Math.min(100, (f.count / pageViews) * 100))
                : 100;
            return (
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
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${currentAccentHex}, #10B981)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassContainer>

      {/* RESET ANALYTICS CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--tf-border)] shadow-xl text-center text-[var(--tf-text)]">
            <RotateCcw className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--tf-heading)] mb-1">
              {isArabic ? 'إعادة تعيين بيانات التحليلات؟' : 'Reset Analytics Data to Zero?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {isArabic
                ? 'سيتم مسح جميع سجلات مشاهدات الصفحات ومشاهدات التجارب وعمليات البحث إلى صفر فورياً عبر جميع الأجهزة المتصلة.'
                : 'This will clear all recorded page views, experience views, and search telemetry back to 0 across all connected devices in real time.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl cursor-pointer hover:bg-[var(--tf-surface-hover)]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmResetAnalytics}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#FAF0DC] bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {isArabic ? 'تأكيد التصفير' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

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
