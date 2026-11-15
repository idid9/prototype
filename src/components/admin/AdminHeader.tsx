import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminTab } from './AdminSidebar';
import { DataService } from '../../services/dataService';
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
  const { settings, isDarkGlass, blurPixels, currentAccentTextHex, getGlassyIconStyle } = useTheme();

  const isArabic = language === 'ar';

  const tabTitles: Record<AdminTab, string> = {
    overview: 'Platform Performance Overview',
    experiences: 'Experience Catalog Management',
    destinations: 'Saudi Destinations Hub',
    inquiries: 'Booking & Customer Inquiries',
    customers: 'Customer Relationship Management',
    subscribers: 'Newsletter Email Database & Outreach',
    promotions: 'Campaigns & Promotional Offers',
    interactive: 'Interactive Quizzes & Discovery',
    analytics: 'Tourism Analytics & Funnel Insights',
    website: 'Visitor Website CMS & Copy',
    appearance: 'Glassy Appearance & Theme Studio',
    settings: 'Platform Configuration & Database',
  };

  const tabTitlesAr: Record<AdminTab, string> = {
    overview: 'نظرة عامة على أداء المنصة',
    experiences: 'إدارة كتالوج التجارب السياحية',
    destinations: 'مركز الوجهات السعودية',
    inquiries: 'الحجوزات واستفسارات العملاء',
    customers: 'إدارة علاقات العملاء (CRM)',
    subscribers: 'قاعدة بيانات البريد الإلكتروني والتواصل',
    promotions: 'الحملات والعروض الترويجية',
    interactive: 'الاختبارات التفاعلية والاستكشاف',
    analytics: 'تحليلات السياحة ومسار التحويل',
    website: 'إدارة محتوى ونصوص موقع الزوار',
    appearance: 'استوديو المظهر والزجاجي',
    settings: 'إعدادات المنصة وقاعدة البيانات',
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
    DataService.updateSettings({ defaultLanguage: nextLang });
  };

  const sheen = settings.glassSheen ?? 0.72;
  const headerStyle: React.CSSProperties = settings.isGlassyEnabled
    ? {
        backgroundColor: isDarkGlass
          ? `rgba(11, 20, 18, ${Math.min(0.76, Math.max(0.46, settings.cardTranslucency + 0.08))})`
          : `rgba(255, 253, 248, ${Math.min(0.88, Math.max(0.72, settings.cardTranslucency + 0.18))})`,
        backgroundImage: isDarkGlass
          ? `linear-gradient(90deg, rgba(250, 240, 220, ${(0.03 + sheen * 0.10).toFixed(3)}) 0%, rgba(250, 240, 220, 0.01) 100%)`
          : `linear-gradient(90deg, rgba(255, 255, 255, ${(0.25 + sheen * 0.35).toFixed(3)}) 0%, rgba(255, 255, 255, 0.08) 100%)`,
        backdropFilter:
          blurPixels > 0
            ? `blur(${blurPixels}px) saturate(${Math.round(145 + sheen * 60)}%)`
            : `saturate(${Math.round(145 + sheen * 60)}%)`,
        WebkitBackdropFilter:
          blurPixels > 0
            ? `blur(${blurPixels}px) saturate(${Math.round(145 + sheen * 60)}%)`
            : `saturate(${Math.round(145 + sheen * 60)}%)`,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--tf-border)',
      }
    : {
        backgroundColor: isDarkGlass ? '#102420' : '#FFFDF8',
        backgroundImage: 'none',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--tf-border)',
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
        <span className="text-xs text-[var(--tf-muted)] whitespace-nowrap">
          {isArabic ? 'إدارة تورفلو /' : 'TourFlow Admin /'}
        </span>
        <h1 className="text-sm sm:text-base font-bold text-[var(--tf-heading)] truncate">
          {isArabic
            ? tabTitlesAr[currentTab] || 'الإدارة'
            : tabTitles[currentTab] || 'Management'}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-xs font-semibold text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 rtl:pl-0 rtl:pr-3 border-l rtl:border-l-0 rtl:border-r border-[var(--tf-border)]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all"
            style={getGlassyIconStyle()}
          >
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-start">
            <div className="text-xs font-bold text-[var(--tf-heading)] leading-tight">
              {isArabic
                ? adminUser?.nameAr || 'المسؤول'
                : adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-[var(--tf-muted)] flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-[var(--tf-info-text)]" />
              <span>
                {isArabic
                  ? adminUser?.roleAr || 'المسؤول العام'
                  : adminUser?.role || 'Super Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
