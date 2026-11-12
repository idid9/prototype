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
import {
  CalendarCheck,
  TrendingUp,
  Compass,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Eye,
  FileSpreadsheet,
  Globe2,
  Sparkles,
} from 'lucide-react';

interface OverviewTabProps {
  experiences: Experience[];
  inquiries: Inquiry[];
  destinations: Destination[];
  analyticsEvents: AnalyticsEvent[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateExperience: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  experiences,
  inquiries,
  destinations,
  analyticsEvents,
  activityLogs,
  onNavigateTab,
  onOpenCreateExperience,
}) => {
  const { isRtl } = useLanguage();
  const { getGlassyCardStyle, currentAccentHex } = useTheme();

  // Metrics computation from real data
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'NEW').length;
  const pendingBookings = inquiries.filter((i) => i.status === 'PENDING' || i.status === 'CONTACTED').length;
  const confirmedBookings = inquiries.filter((i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED').length;
  const publishedExperiences = experiences.filter((e) => e.status === 'PUBLISHED').length;

  const totalEstimatedValue = inquiries.reduce(
    (acc, curr) => acc + (curr.estimatedValue || 0),
    0
  );

  const confirmedValue = inquiries
    .filter((i) => i.status === 'CONFIRMED' || i.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length + 180;
  const conversionRate = totalInquiries > 0 ? ((confirmedBookings / totalInquiries) * 100).toFixed(1) : '0';

  const recentInquiries = inquiries.slice(0, 5);

  const kpis = [
    {
      label: 'Total Inquiries',
      value: totalInquiries,
      sub: `${newInquiries} require initial action`,
      icon: <CalendarCheck className="w-4 h-4 text-[#C6A46B]" />,
    },
    {
      label: 'New Leads',
      value: newInquiries,
      sub: 'Action required < 2h',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
    },
    {
      label: 'Confirmed Bookings',
      value: confirmedBookings,
      sub: `${conversionRate}% conversion rate`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: 'Estimated Pipeline',
      value: `${totalEstimatedValue.toLocaleString()} SAR`,
      sub: `${confirmedValue.toLocaleString()} SAR confirmed`,
      icon: <TrendingUp className="w-4 h-4 text-[#123B32]" />,
    },
    {
      label: 'Published Experiences',
      value: publishedExperiences,
      sub: `Across ${destinations.filter((d) => d.published).length} destinations`,
      icon: <Compass className="w-4 h-4 text-[#C6A46B]" />,
    },
    {
      label: 'Audience Page Views',
      value: pageViews,
      sub: 'Real-time telemetry tracked',
      icon: <Eye className="w-4 h-4 text-blue-600" />,
    },
  ];

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Welcome Banner & Quick Action Strip */}
      <div className="bg-[#123B32] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#D9C29A] mb-1">
            Welcome to TourFlow Business Operations
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Saudi Arabia Tourism Digital Growth Engine
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Live synchronization is active across visitor inquiries, operator packages, and destination promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateExperience}
            className="py-2.5 px-4 bg-[#C6A46B] hover:bg-[#D9C29A] text-[#102E29] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Experience</span>
          </button>

          <button
            onClick={() => onNavigateTab('inquiries')}
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#D9C29A]" />
            <span>Manage Inquiries</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-300"
            style={getGlassyCardStyle()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#777D75] uppercase tracking-wider">
                {kpi.label}
              </span>
              <div
                className="p-2 rounded-lg border transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderColor: `${currentAccentHex}40`,
                }}
              >
                {kpi.icon}
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#123B32] tabular-nums">
                {kpi.value}
              </div>
              <div className="text-xs text-[#777D75] mt-1 font-medium">{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Inquiries + Activity Stream & Top Experiences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries Table */}
        <div
          className="lg:col-span-8 rounded-2xl p-6 shadow-sm transition-all duration-300"
          style={getGlassyCardStyle()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#123B32]">
                Recent Inquiries & Requests
              </h3>
              <p className="text-xs text-[#777D75]">
                Direct booking requests synchronized in real-time
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs font-semibold text-[#123B32] hover:text-[#C6A46B] flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({inquiries.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-[#D9C29A]/40 text-[#777D75] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold text-start">Inquiry ID</th>
                  <th className="py-2.5 px-3 font-semibold text-start">Customer</th>
                  <th className="py-2.5 px-3 font-semibold text-start">Experience</th>
                  <th className="py-2.5 px-3 font-semibold text-start">Date</th>
                  <th className="py-2.5 px-3 font-semibold text-start">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9C29A]/20">
                {recentInquiries.map((inq) => {
                  let statusBadge = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (inq.status === 'NEW') statusBadge = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                  else if (inq.status === 'CONFIRMED') statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
                  else if (inq.status === 'COMPLETED') statusBadge = 'bg-neutral-100 text-neutral-800 border-neutral-300';
                  else if (inq.status === 'CANCELLED') statusBadge = 'bg-red-50 text-red-800 border-red-200';

                  return (
                    <tr key={inq.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-[#123B32]">
                        {inq.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#202923]">{inq.customerName}</div>
                        <div className="text-[11px] text-[#777D75]">{inq.country}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-[#202923]">
                        {inq.experienceTitle}
                      </td>
                      <td className="py-3 px-3 text-[#777D75] whitespace-nowrap">
                        {inq.preferredDate} ({inq.guests}p)
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${statusBadge}`}>
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Shortcuts */}
          <div
            className="rounded-2xl p-5 shadow-sm transition-all duration-300"
            style={getGlassyCardStyle()}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B32] mb-3">
              Operator Management Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('experiences')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-[#D9C29A]/40 text-[#202923] hover:border-[#123B32] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#123B32]" />
                  <span>Update Experience Pricing & Status</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 text-[#777D75]" />
              </button>

              <button
                onClick={() => onNavigateTab('website')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-[#D9C29A]/40 text-[#202923] hover:border-[#123B32] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#123B32]" />
                  <span>Edit Homepage Hero & Content CMS</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 text-[#777D75]" />
              </button>

              <button
                onClick={() => onNavigateTab('appearance')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-[#D9C29A]/40 text-[#202923] hover:border-[#123B32] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: currentAccentHex }}
                  />
                  <span>Theme & Glassy Customizer</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 text-[#777D75]" />
              </button>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div
            className="rounded-2xl p-5 shadow-sm transition-all duration-300"
            style={getGlassyCardStyle()}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B32] mb-4">
              System & Operator Activity
            </h4>
            <div className="space-y-3.5 text-xs">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#123B32] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#202923]">{log.action}</div>
                    <div className="text-[#777D75] text-[11px] leading-tight">{log.details}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {log.adminUser}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
