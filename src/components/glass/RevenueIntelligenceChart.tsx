import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { Inquiry, AnalyticsEvent, Experience } from '../../types';
import { GlassContainer } from './GlassContainer';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface RevenueIntelligenceChartProps {
  inquiries: Inquiry[];
  experiences: Experience[];
  analyticsEvents: AnalyticsEvent[];
  currency?: string;
}

const STAGE_WEIGHTS: Record<string, number> = {
  NEW: 0.25,
  CONTACTED: 0.45,
  PENDING: 0.7,
  CONFIRMED: 1.0,
  COMPLETED: 1.0,
};

export const RevenueIntelligenceChart: React.FC<RevenueIntelligenceChartProps> = ({
  inquiries,
  experiences,
  analyticsEvents,
  currency = 'SAR',
}) => {
  const { currentAccentHex, isDarkGlass } = useTheme();

  const pipelineData = useMemo(() => {
    const stages = [
      { key: 'NEW', label: 'New Leads', weight: 0.25, color: '#F59E0B' },
      { key: 'CONTACTED', label: 'Contacted', weight: 0.45, color: '#38BDF8' },
      { key: 'PENDING', label: 'Proposal Pending', weight: 0.7, color: '#A78BFA' },
      { key: 'CONFIRMED', label: 'Confirmed', weight: 1.0, color: '#10B981' },
      { key: 'COMPLETED', label: 'Completed', weight: 1.0, color: currentAccentHex },
    ];

    return stages.map((st) => {
      const items = inquiries.filter((i) => i.status === st.key);
      const rawValue = items.reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
      const weightedForecast = Math.round(rawValue * st.weight);
      return {
        ...st,
        count: items.length,
        rawValue,
        weightedForecast,
      };
    });
  }, [inquiries, currentAccentHex]);

  const maxStageValue = Math.max(1, ...pipelineData.map((s) => s.rawValue));
  const totalPipelineSar = inquiries
    .filter((i) => i.status !== 'CANCELLED')
    .reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
  const weightedForecastSar = inquiries.reduce(
    (sum, i) => sum + Math.round((i.estimatedValue || 0) * (STAGE_WEIGHTS[i.status] || 0)),
    0
  );
  const confirmedSar = inquiries
    .filter((i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED')
    .reduce((sum, i) => sum + (i.estimatedValue || 0), 0);

  // Category revenue mix derived directly from inquiries & experiences
  const categoryPerformance = useMemo(() => {
    const map: Record<string, { revenue: number; bookings: number }> = {};
    inquiries
      .filter((i) => i.status !== 'CANCELLED')
      .forEach((inq) => {
        const exp = experiences.find((e) => e.id === inq.experienceId);
        const cat = exp?.category || 'Custom Package';
        if (!map[cat]) map[cat] = { revenue: 0, bookings: 0 };
        map[cat].revenue += inq.estimatedValue || 0;
        map[cat].bookings += 1;
      });
    return Object.entries(map)
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [inquiries, experiences]);

  const maxCategoryRevenue = Math.max(1, ...categoryPerformance.map((c) => c.revenue));

  // Real-time event breakdown
  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length;
  const experienceViews = analyticsEvents.filter((e) => e.type === 'experience_view').length;
  const searchEvents = analyticsEvents.filter((e) => e.type === 'search').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: CRM Revenue Intelligence & Pipeline Forecasting */}
      <GlassContainer delay={0.05} className="lg:col-span-7 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--tf-border)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--tf-muted)]">
              <TrendingUp className="w-4 h-4" style={{ color: currentAccentHex }} />
              <span>CRM Revenue Intelligence</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--tf-heading)] mt-0.5">
              Pipeline Forecasting & Stage Velocity
            </h3>
          </div>

          <div className="flex items-center gap-5 text-end">
            <div>
              <span className="text-[11px] text-[var(--tf-muted)] block">Weighted Forecast</span>
              <span className="font-mono text-base sm:text-lg font-bold tabular-nums text-[var(--tf-heading)]">
                {weightedForecastSar.toLocaleString()} {currency}
              </span>
            </div>
            <div className="pl-5 rtl:pl-0 rtl:pr-5 border-l rtl:border-l-0 rtl:border-r border-[var(--tf-border)]">
              <span className="text-[11px] text-[var(--tf-muted)] block">Realized Revenue</span>
              <span
                className="font-mono text-base sm:text-lg font-bold tabular-nums"
                style={{ color: currentAccentHex }}
              >
                {confirmedSar.toLocaleString()} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Stage Bars */}
        <div className="space-y-4">
          {pipelineData.map((stage, idx) => {
            const widthPct = Math.max(6, Math.round((stage.rawValue / maxStageValue) * 100));
            return (
              <div key={stage.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[var(--tf-heading)]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span>{stage.label}</span>
                    <span className="text-[var(--tf-muted)] font-normal">
                      · {stage.count} {stage.count === 1 ? 'deal' : 'deals'} ({Math.round(stage.weight * 100)}% prob.)
                    </span>
                  </div>
                  <div className="font-mono tabular-nums text-[var(--tf-heading)] font-semibold">
                    {stage.rawValue.toLocaleString()} {currency}
                  </div>
                </div>

                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: isDarkGlass
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(18, 59, 50, 0.08)',
                  }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: `${widthPct}%`,
                      transformOrigin: 'left',
                      backgroundColor: stage.color,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Pipeline Summary Footer */}
        <div className="pt-4 border-t border-[var(--tf-border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--tf-muted)]">
          <span>
            Active Gross Pipeline:{' '}
            <strong className="font-mono text-[var(--tf-heading)] tabular-nums">
              {totalPipelineSar.toLocaleString()} {currency}
            </strong>
          </span>
          <span>
            Forecast Confidence:{' '}
            <strong className="font-mono text-[var(--tf-heading)] tabular-nums">
              {totalPipelineSar > 0
                ? `${Math.round((weightedForecastSar / totalPipelineSar) * 100)}%`
                : '0%'}
            </strong>
          </span>
        </div>
      </GlassContainer>

      {/* Right: Category Revenue Mix & Live Visitor Activity Metrics */}
      <GlassContainer delay={0.12} className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--tf-muted)]">
            <BarChart3 className="w-4 h-4" style={{ color: currentAccentHex }} />
            <span>Category Mix & Telemetry</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--tf-heading)] mt-0.5 mb-5">
            Demand by Experience Category
          </h3>

          <div className="space-y-4">
            {categoryPerformance.length === 0 ? (
              <div className="text-xs text-[var(--tf-muted)] py-6 text-center">
                No active category revenue recorded yet.
              </div>
            ) : (
              categoryPerformance.map((cat, idx) => {
                const pct = Math.max(8, Math.round((cat.revenue / maxCategoryRevenue) * 100));
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--tf-heading)] truncate max-w-[180px]">
                        {cat.name}
                      </span>
                      <span className="font-mono text-[var(--tf-muted)] tabular-nums">
                        {cat.bookings}x · {cat.revenue.toLocaleString()} {currency}
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: isDarkGlass
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(18, 59, 50, 0.08)',
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.07 * idx, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          width: `${pct}%`,
                          transformOrigin: 'left',
                          backgroundColor: currentAccentHex,
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* User Activity Metrics Strip (Single Clean Divider, Zero Nested Boxes) */}
        <div className="pt-5 border-t border-[var(--tf-border)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--tf-muted)] mb-3">
            <Activity className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
            <span>Live Visitor Activity Signals</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-lg font-bold text-[var(--tf-heading)] tabular-nums">
                {pageViews}
              </div>
              <div className="text-[11px] text-[var(--tf-muted)]">Portal Visits</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--tf-heading)] tabular-nums">
                {experienceViews}
              </div>
              <div className="text-[11px] text-[var(--tf-muted)]">Package Views</div>
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--tf-heading)] tabular-nums">
                {searchEvents}
              </div>
              <div className="text-[11px] text-[var(--tf-muted)]">Filter Searches</div>
            </div>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};
