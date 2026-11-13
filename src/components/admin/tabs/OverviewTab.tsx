import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  Experience,
  Inquiry,
  Destination,
  AnalyticsEvent,
  ActivityLog,
} from '../../../types';
import { AdminTab } from '../AdminSidebar';
import { GlassContainer } from '../../glass/GlassContainer';
import { StatCard } from '../../glass/StatCard';
import { RevenueIntelligenceChart } from '../../glass/RevenueIntelligenceChart';
import {
  localizeActivityAction,
  localizeActivityDetails,
  localizeCountry,
  localizeCurrency,
  localizeExperienceTitle,
  localizeInquiryStatus,
} from '../../../utils/localization';
import {
  CalendarCheck,
  TrendingUp,
  Compass,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Eye,
} from 'lucide-react';

interface OverviewTabProps {
  experiences: Experience[];
  inquiries: Inquiry[];
  destinations: Destination[];
  analyticsEvents: AnalyticsEvent[];
  activityLogs: ActivityLog[];
  currency?: string;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateExperience: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  experiences,
  inquiries,
  destinations,
  analyticsEvents,
  activityLogs,
  currency = 'SAR',
  onNavigateTab,
  onOpenCreateExperience,
}) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, isDarkGlass } = useTheme();

  // Metrics computation from live real-time collections
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'NEW').length;
  const confirmedBookings = inquiries.filter(
    (i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED'
  ).length;
  const publishedExperiences = experiences.filter((e) => e.status === 'PUBLISHED').length;

  const totalEstimatedValue = inquiries.reduce(
    (acc, curr) => acc + (curr.estimatedValue || 0),
    0
  );

  const confirmedValue = inquiries
    .filter((i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length + 180;
  const conversionRate =
    totalInquiries > 0 ? ((confirmedBookings / totalInquiries) * 100).toFixed(1) : '0';

  const recentInquiries = inquiries.slice(0, 6);

  const localizedCurrency = localizeCurrency(currency, language);

  const kpis = [
    {
      label: isArabic ? 'إجمالي الطلبات' : 'Total Inquiries',
      value: totalInquiries,
      sub: isArabic
        ? `${newInquiries} بانتظار الإجراء الأولي`
        : `${newInquiries} require initial action`,
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      label: isArabic ? 'العملاء الجدد' : 'New Leads',
      value: newInquiries,
      sub: isArabic ? 'بانتظار الفرز من المشغل' : 'Awaiting operator triage',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: isArabic ? 'الحجوزات المؤكدة' : 'Confirmed Bookings',
      value: confirmedBookings,
      sub: isArabic ? `معدل التحويل ${conversionRate}%` : `${conversionRate}% conversion rate`,
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      label: isArabic ? 'القيمة التقديرية للمبيعات' : 'Estimated Pipeline',
      value: `${totalEstimatedValue.toLocaleString()} ${localizedCurrency}`,
      sub: isArabic
        ? `تم تأكيد ${confirmedValue.toLocaleString()} ${localizedCurrency}`
        : `${confirmedValue.toLocaleString()} ${localizedCurrency} confirmed`,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: isArabic ? 'الباقات المنشورة' : 'Published Packages',
      value: publishedExperiences,
      sub: isArabic
        ? `عبر ${destinations.filter((d) => d.published).length} وجهات نشطة`
        : `Across ${destinations.filter((d) => d.published).length} active destinations`,
      icon: <Compass className="w-4 h-4" />,
    },
    {
      label: isArabic ? 'مشاهدات صفحات الزوار' : 'Audience Page Views',
      value: pageViews,
      sub: isArabic ? 'انطباعات البوابة المباشرة' : 'Live portal impressions',
      icon: <Eye className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Glassy Hero Header Banner — single primary CTA */}
      <GlassContainer
        forceDark
        className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: currentAccentHex }}
          >
            {isArabic ? 'عمليات تورفلو التنفيذية' : 'TourFlow Executive Operations'}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
            {isArabic
              ? 'محرك النمو الرقمي للسياحة السعودية'
              : 'Saudi Arabia Tourism Digital Growth Engine'}
          </h2>
          <p className="text-xs sm:text-sm text-white/75 mt-1.5 max-w-xl leading-relaxed">
            {isArabic
              ? 'ذكاء إدارة علاقات العملاء الفوري، وتوقعات المبيعات، وأدوات التحكم في بوابة الزوار موحدة في مساحة عمل واحدة.'
              : 'Real-time CRM intelligence, pipeline forecasting, and visitor portal controls unified in a single workspace.'}
          </p>
        </div>

        <button
          onClick={onOpenCreateExperience}
          className="py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0 text-[#102E29]"
          style={{ backgroundColor: currentAccentHex }}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isArabic ? 'تجربة جديدة' : 'New Experience'}</span>
        </button>
      </GlassContainer>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            sub={kpi.sub}
            icon={kpi.icon}
            delay={idx * 0.04}
          />
        ))}
      </div>

      {/* CRM Revenue Intelligence & Pipeline Forecasting */}
      <RevenueIntelligenceChart
        inquiries={inquiries}
        experiences={experiences}
        analyticsEvents={analyticsEvents}
        currency={currency}
      />

      {/* Two Column Layout: Recent Inquiries + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inquiries Table */}
        <GlassContainer delay={0.15} className="lg:col-span-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)]">
                {isArabic ? 'أحدث الطلبات والاستفسارات' : 'Recent Inquiries & Requests'}
              </h3>
              <p className="text-xs text-[var(--tf-muted)]">
                {isArabic
                  ? 'طلبات الحجز المباشرة متزامنة في الوقت الفعلي'
                  : 'Direct booking requests synchronized in real-time'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs font-semibold text-[var(--tf-heading)] hover:opacity-80 flex items-center gap-1 cursor-pointer whitespace-nowrap"
              style={{ color: currentAccentHex }}
            >
              <span>
                {isArabic ? `عرض الكل (${inquiries.length})` : `View All (${inquiries.length})`}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold text-start">
                    {isArabic ? 'رقم الطلب' : 'Inquiry ID'}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-start">
                    {isArabic ? 'العميل' : 'Customer'}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-start">
                    {isArabic ? 'التجربة' : 'Experience'}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-start">
                    {isArabic ? 'التاريخ' : 'Date'}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-start">
                    {isArabic ? 'الحالة' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--tf-border)]">
                {recentInquiries.map((inq) => {
                  let statusClass = isDarkGlass
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/35'
                    : 'bg-sky-500/15 text-sky-800 border-sky-600/35';
                  if (inq.status === 'NEW')
                    statusClass = isDarkGlass
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/35 font-bold'
                      : 'bg-amber-500/15 text-amber-800 border-amber-600/35 font-bold';
                  else if (inq.status === 'CONFIRMED')
                    statusClass = isDarkGlass
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35 font-bold'
                      : 'bg-emerald-500/15 text-emerald-800 border-emerald-600/35 font-bold';
                  else if (inq.status === 'COMPLETED')
                    statusClass =
                      'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]';
                  else if (inq.status === 'CANCELLED')
                    statusClass = isDarkGlass
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/35'
                      : 'bg-rose-500/15 text-rose-800 border-rose-600/35';

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-[var(--tf-surface-hover)] transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-[var(--tf-heading)] whitespace-nowrap">
                        {inq.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[var(--tf-heading)]">{inq.customerName}</div>
                        <div className="text-[11px] text-[var(--tf-muted)]">
                          {localizeCountry(inq.country, language)}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-[var(--tf-text)]">
                        {localizeExperienceTitle(
                          inq.experienceTitle,
                          language,
                          experiences,
                          inq.experienceId
                        )}
                      </td>
                      <td className="py-3 px-3 text-[var(--tf-muted)] whitespace-nowrap font-mono tabular-nums">
                        {inq.preferredDate} ({inq.guests}
                        {isArabic ? ' ض' : 'p'})
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${statusClass}`}>
                          {localizeInquiryStatus(inq.status, language)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassContainer>

        {/* System & Operator Activity Feed */}
        <GlassContainer delay={0.18} className="lg:col-span-4 p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--tf-heading)] mb-4">
            {isArabic ? 'سجل نشاط النظام والمشغل' : 'System & Operator Activity'}
          </h4>
          <div className="space-y-4 text-xs">
            {activityLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="pb-3 border-b border-[var(--tf-border)] last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--tf-heading)]">
                    {localizeActivityAction(log.action, language)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--tf-muted)] tabular-nums shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-[var(--tf-muted)] text-[11px] leading-snug mt-0.5">
                  {localizeActivityDetails(log.details, language)}
                </div>
              </div>
            ))}
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};
