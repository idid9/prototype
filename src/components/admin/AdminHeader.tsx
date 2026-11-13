import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminTab } from './AdminSidebar';
import { Globe, User, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  currentTab: AdminTab;
  collapsed: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  collapsed,
}) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const { adminUser } = useAuth();
  const { settings, isDarkGlass, blurPixels, currentAccentHex } = useTheme();

  const tabTitles: Record<AdminTab, string> = {
    overview: 'Platform Performance Overview',
    experiences: 'Experience Catalog Management',
    destinations: 'Saudi Destinations Hub',
    inquiries: 'Booking & Customer Inquiries',
    customers: 'Customer Relationship Management',
    promotions: 'Campaigns & Promotional Offers',
    interactive: 'Interactive Quizzes & Discovery',
    analytics: 'Tourism Analytics & Funnel Insights',
    website: 'Visitor Website CMS & Copy',
    appearance: 'Glassy Appearance & Theme Studio',
    settings: 'Platform Configuration & Database',
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const headerStyle: React.CSSProperties = settings.isGlassyEnabled
    ? {
        backgroundColor: isDarkGlass
          ? `rgba(14, 20, 18, ${Math.min(0.75, settings.cardTranslucency + 0.15)})`
          : `rgba(255, 255, 255, ${Math.max(0.55, settings.cardTranslucency)})`,
        backdropFilter: `blur(${blurPixels}px) saturate(150%)`,
        WebkitBackdropFilter: `blur(${blurPixels}px) saturate(150%)`,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: isDarkGlass
          ? `rgba(255, 255, 255, ${settings.borderOpacity})`
          : `rgba(217, 194, 154, ${settings.borderOpacity})`,
      }
    : {
        backgroundColor: isDarkGlass ? '#102420' : '#FFFFFF',
        borderBottom: '1px solid var(--tf-border)',
      };

  return (
    <header
      style={headerStyle}
      className={`h-16 flex items-center justify-between px-6 sticky top-0 z-20 transition-all duration-300 ${
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
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-[var(--tf-muted)] whitespace-nowrap">TourFlow Admin /</span>
        <h1 className="text-sm sm:text-base font-bold text-[var(--tf-heading)] truncate">
          {tabTitles[currentTab] || 'Management'}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-xs font-semibold text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 rtl:pl-0 rtl:pr-3 border-l rtl:border-l-0 rtl:border-r border-[var(--tf-border)]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm"
            style={{
              backgroundColor: currentAccentHex,
              color: '#102E29',
            }}
          >
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-start">
            <div className="text-xs font-bold text-[var(--tf-heading)] leading-tight">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-[var(--tf-muted)] flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
              <span>{adminUser?.role || 'Super Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
