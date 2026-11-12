import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminTab } from './AdminSidebar';
import {
  Globe,
  Radio,
  ExternalLink,
  User,
  ShieldCheck,
  Palette,
} from 'lucide-react';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onGoToVisitorSite: () => void;
  collapsed: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onGoToVisitorSite,
  collapsed,
}) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const { adminUser } = useAuth();
  const { setIsCustomizingOpen, currentAccentHex } = useTheme();

  const tabTitles: Record<AdminTab, string> = {
    overview: 'Platform Performance Overview',
    experiences: 'Experience Catalog Management',
    destinations: 'Destination Destinations Hub',
    inquiries: 'Booking & Customer Inquiries',
    customers: 'Customer Relationship Management (CRM)',
    promotions: 'Campaigns & Promotional Offers',
    interactive: 'Interactive Quizzes & Saudi Discovery',
    analytics: 'Tourism Analytics & Funnel Insights',
    website: 'Visitor Website CMS & Copy',
    appearance: 'Dashboard Appearance & Theme Customization',
    settings: 'Platform Configuration & Database',
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header
      className={`h-16 bg-white border-b border-[#D9C29A]/40 flex items-center justify-between px-6 sticky top-0 z-20 transition-all ${
        isRtl
          ? collapsed
            ? 'mr-20'
            : 'mr-64'
          : collapsed
          ? 'ml-20'
          : 'ml-64'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#777D75]">TourFlow Admin /</span>
        <h1 className="text-sm sm:text-base font-bold text-[#123B32]">
          {tabTitles[currentTab] || 'Management'}
        </h1>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-3">
        {/* Real-Time Database Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>Real-Time Sync Active</span>
        </div>

        {/* Theme Customizer Quick Drawer Trigger */}
        <button
          onClick={() => setIsCustomizingOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D9C29A]/50 bg-[#FAF8F5] text-xs font-semibold text-[#123B32] hover:bg-[#D9C29A]/20 transition-all cursor-pointer shadow-xs"
          title="Open Theme & Appearance Customizer"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: currentAccentHex }}
          />
          <Palette className="w-3.5 h-3.5 text-[#123B32]" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D9C29A]/50 text-xs font-semibold text-[#123B32] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#C6A46B]" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* View Visitor Site */}
        <button
          onClick={onGoToVisitorSite}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9C29A]/60 text-xs font-semibold text-[#123B32] hover:bg-[#D9C29A]/20 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#123B32]" />
          <span>View Public Site</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-[#D9C29A]/40">
          <div className="w-8 h-8 rounded-full bg-[#123B32] text-[#D9C29A] flex items-center justify-center font-bold text-xs shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-start">
            <div className="text-xs font-bold text-[#123B32] leading-tight">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-[#777D75] flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              <span>{adminUser?.role || 'Super Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
