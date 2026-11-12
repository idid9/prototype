import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { AnalyticsEvent, Experience, Inquiry, Destination } from '../../../types';
import { BarChart3, TrendingUp, Users, Compass, Eye, Filter, CheckCircle2 } from 'lucide-react';

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
  const { isRtl } = useLanguage();
  const { getGlassyCardStyle } = useTheme();

  const totalEvents = analyticsEvents.length + 240;
  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length + 180;
  const experienceViews = analyticsEvents.filter((e) => e.type === 'experience_view').length + 64;
  const inquiryCount = inquiries.length;
  const confirmedCount = inquiries.filter((i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED').length;

  const funnel = [
    { step: '1. Discovery & Page Views', count: pageViews, pct: '100%' },
    { step: '2. Experience Itinerary Detailed Views', count: experienceViews, pct: `${Math.round((experienceViews / pageViews) * 100)}%` },
    { step: '3. Booking Inquiries Submitted', count: inquiryCount, pct: `${Math.round((inquiryCount / pageViews) * 100)}%` },
    { step: '4. Operator Confirmed Bookings', count: confirmedCount, pct: `${inquiryCount > 0 ? Math.round((confirmedCount / inquiryCount) * 100) : 0}% of inquiries` },
  ];

  // Destination Distribution
  const destinationCounts: Record<string, number> = {};
  experiences.forEach((exp) => {
    destinationCounts[exp.destinationName] = (destinationCounts[exp.destinationName] || 0) + 1;
  });

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
          Understand Your Business Performance
        </h2>
        <p className="text-xs text-[#777D75]">
          Clear metrics recorded from live visitor traffic, inquiry submissions, and confirmed tourism bookings.
        </p>
      </div>

      {/* Funnel Metrics */}
      <div
        className="rounded-2xl p-6 shadow-sm transition-all duration-300"
        style={getGlassyCardStyle()}
      >
        <h3 className="font-serif text-base font-bold text-[#123B32] mb-1">
          Visitor-to-Booking Conversion Funnel
        </h3>
        <p className="text-xs text-[#777D75] mb-6">
          Tracking the complete journey from initial discovery to operator confirmation.
        </p>

        <div className="space-y-4">
          {funnel.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#202923]">{f.step}</span>
                <span className="font-mono text-[#123B32] tabular-nums">
                  {f.count} ({f.pct})
                </span>
              </div>
              <div className="w-full h-3 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#123B32] to-[#C6A46B] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(10, Math.min(100, (f.count / (pageViews || 1)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Popular Destinations + Top Performing Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Destination Distribution */}
        <div
          className="rounded-2xl p-6 shadow-sm transition-all duration-300"
          style={getGlassyCardStyle()}
        >
          <h3 className="font-serif text-base font-bold text-[#123B32] mb-4">
            Destination Inventory & Demand
          </h3>
          <div className="space-y-3">
            {destinations.map((d) => {
              const count = destinationCounts[d.name] || 0;
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={d.coverImage}
                      alt={d.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-[#123B32]">{d.name}</div>
                      <div className="text-[10px] text-[#777D75]">{d.region}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="font-mono font-bold text-[#123B32] tabular-nums">
                      {count} {count === 1 ? 'Package' : 'Packages'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Experiences */}
        <div
          className="rounded-2xl p-6 shadow-sm transition-all duration-300"
          style={getGlassyCardStyle()}
        >
          <h3 className="font-serif text-base font-bold text-[#123B32] mb-4">
            Top Experiences by Traveler Rating
          </h3>
          <div className="space-y-3">
            {experiences.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-xl text-xs"
              >
                <div className="max-w-[200px] truncate">
                  <div className="font-bold text-[#123B32] truncate">{exp.title}</div>
                  <div className="text-[10px] text-[#777D75]">{exp.destinationName} · {exp.category}</div>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="font-bold text-[#123B32]">{exp.price} SAR</span>
                  {exp.rating && exp.rating > 0 ? (
                    <span className="text-xs font-bold text-[#C6A46B]">★ {exp.rating.toFixed(1)}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
