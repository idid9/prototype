import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Experience,
  Destination,
  Inquiry,
  Customer,
  Promotion,
  Coupon,
  QuizQuestion,
  WebsiteContent,
  BusinessSettings,
  AnalyticsEvent,
  ActivityLog,
} from '../../types';
import { DataService } from '../../services/dataService';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { OverviewTab } from '../../components/admin/tabs/OverviewTab';
import { ExperiencesTab } from '../../components/admin/tabs/ExperiencesTab';
import { DestinationsTab } from '../../components/admin/tabs/DestinationsTab';
import { InquiriesTab } from '../../components/admin/tabs/InquiriesTab';
import { CustomersTab } from '../../components/admin/tabs/CustomersTab';
import { PromotionsTab } from '../../components/admin/tabs/PromotionsTab';
import { InteractiveTab } from '../../components/admin/tabs/InteractiveTab';
import { AnalyticsTab } from '../../components/admin/tabs/AnalyticsTab';
import { WebsiteContentTab } from '../../components/admin/tabs/WebsiteContentTab';
import { AppearanceSettingsTab } from '../../components/admin/tabs/AppearanceSettingsTab';
import { SettingsTab } from '../../components/admin/tabs/SettingsTab';
import { isFirebaseConfigured } from '../../services/firebase/firestore';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

interface AdminDashboardPageProps {
  onGoToVisitorSite: () => void;
  onPreviewExperienceOnSite?: (exp: Experience) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onGoToVisitorSite,
  onPreviewExperienceOnSite,
}) => {
  const {
    isAdminAuthenticated,
    authReady,
    authLoading,
    authError,
    loginWithGoogle,
    logout,
    openLoginModal,
  } = useAuth();
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { getDashboardBgStyle, isDarkGlass } = useTheme();
  const firebaseEnabled = isFirebaseConfigured();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Live real-time synced state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(DataService.getWebsiteContent());
  const [settings, setSettings] = useState<BusinessSettings>(DataService.getSettings());
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Subscribe to real-time collections
  useEffect(() => {
    const unsubExp = DataService.subscribeExperiences(setExperiences);
    const unsubDest = DataService.subscribeDestinations(setDestinations);
    const unsubInq = DataService.subscribeInquiries(setInquiries);
    const unsubCust = DataService.subscribeCustomers(setCustomers);
    const unsubPromo = DataService.subscribePromotions(setPromotions);
    const unsubCoupons = DataService.subscribeCoupons(setCoupons);
    const unsubQuiz = DataService.subscribeQuizzes(setQuizzes);
    const unsubContent = DataService.subscribeWebsiteContent(setWebsiteContent);
    const unsubSettings = DataService.subscribeSettings(setSettings);
    const unsubAnalytics = DataService.subscribeAnalyticsEvents(setAnalyticsEvents);
    const unsubLogs = DataService.subscribeActivityLogs(setActivityLogs);

    return () => {
      unsubExp();
      unsubDest();
      unsubInq();
      unsubCust();
      unsubPromo();
      unsubCoupons();
      unsubQuiz();
      unsubContent();
      unsubSettings();
      unsubAnalytics();
      unsubLogs();
    };
  }, []);

  if (!authReady) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#F6F4EF] flex items-center justify-center p-4 text-[#123B32]"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-[#777D75]">
            {isArabic ? 'جارٍ التحقق من الجلسة السحابية...' : 'Verifying cloud session...'}
          </p>
        </div>
      </div>
    );
  }

  // Protected Admin Route Check (§8)
  if (!isAdminAuthenticated) {
    const unauthorizedEmail =
      authError && authError.startsWith('UNAUTHORIZED:')
        ? authError.replace('UNAUTHORIZED:', '')
        : null;

    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#F6F4EF] flex items-center justify-center p-4 text-[#202923]"
      >
        <div className="max-w-md w-full bg-white border border-[#D9C29A]/60 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#123B32] text-[#D9C29A] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#123B32] mb-2">
            {isArabic ? 'دخول مقيد للمشغلين' : 'Restricted Operator Access'}
          </h2>
          <p className="text-xs text-[#777D75] mb-6 leading-relaxed">
            {isArabic
              ? 'تتطلب مساحة عمل إدارة تورفلو مصادقة مصرح بها لمزامنة التحديثات عبر جميع الأجهزة. يرجى تسجيل الدخول بحساب المسؤول للمتابعة.'
              : 'The TourFlow Admin Workspace requires authorized Google authentication so changes synchronize live across all devices.'}
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 text-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {unauthorizedEmail
                  ? isArabic
                    ? `الحساب (${unauthorizedEmail}) غير مخول للوصول إلى لوحة الإدارة.`
                    : `Account (${unauthorizedEmail}) is not authorized for Admin access.`
                  : isArabic
                  ? 'تعذر تسجيل الدخول عبر جوجل. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.'
                  : 'Google sign-in could not be completed. Please allow popups and try again.'}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={firebaseEnabled ? loginWithGoogle : openLoginModal}
              disabled={authLoading}
              className="w-full py-2.5 px-4 bg-[#123B32] hover:bg-[#1D5546] disabled:opacity-70 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {firebaseEnabled
                  ? isArabic
                    ? 'تسجيل الدخول بحساب جوجل'
                    : 'Sign in with Google'
                  : isArabic
                  ? 'إدخال كلمة المرور (تجريبي: 12341234)'
                  : 'Enter Password (Demo: 12341234)'}
              </span>
            </button>
            <button
              onClick={onGoToVisitorSite}
              className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#D9C29A]/50 text-[#123B32] rounded-xl text-xs font-semibold cursor-pointer"
            >
              {isArabic ? 'العودة إلى موقع الزوار العام' : 'Return to Public Visitor Website'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;

  return (
    <div
      data-glass-tone={isDarkGlass ? 'dark' : 'light'}
      className="min-h-screen text-[var(--tf-text)] transition-all duration-500"
      style={getDashboardBgStyle()}
    >
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onGoToVisitorSite={onGoToVisitorSite}
        onLogout={logout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        newInquiriesCount={newInquiriesCount}
      />

      {/* Header */}
      <AdminHeader
        currentTab={currentTab}
        collapsed={sidebarCollapsed}
      />

      {/* Main Workspace */}
      <main
        className={`p-6 sm:p-8 transition-all ${
          isRtl
            ? sidebarCollapsed
              ? 'mr-20'
              : 'mr-64'
            : sidebarCollapsed
            ? 'ml-20'
            : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {currentTab === 'overview' && (
            <OverviewTab
              experiences={experiences}
              inquiries={inquiries}
              destinations={destinations}
              analyticsEvents={analyticsEvents}
              activityLogs={activityLogs}
              currency={settings.currency}
              onNavigateTab={setCurrentTab}
              onOpenCreateExperience={() => setCurrentTab('experiences')}
            />
          )}

          {currentTab === 'experiences' && (
            <ExperiencesTab
              experiences={experiences}
              destinations={destinations}
              onPreviewExperience={onPreviewExperienceOnSite}
            />
          )}

          {currentTab === 'destinations' && (
            <DestinationsTab destinations={destinations} experiences={experiences} />
          )}

          {currentTab === 'inquiries' && (
            <InquiriesTab inquiries={inquiries} experiences={experiences} />
          )}

          {currentTab === 'customers' && (
            <CustomersTab customers={customers} inquiries={inquiries} experiences={experiences} />
          )}

          {currentTab === 'promotions' && (
            <PromotionsTab
              promotions={promotions}
              coupons={coupons}
              experiences={experiences}
              destinations={destinations}
            />
          )}

          {currentTab === 'interactive' && (
            <InteractiveTab quizzes={quizzes} />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsTab
              analyticsEvents={analyticsEvents}
              experiences={experiences}
              inquiries={inquiries}
              destinations={destinations}
            />
          )}

          {currentTab === 'website' && (
            <WebsiteContentTab content={websiteContent} />
          )}

          {currentTab === 'appearance' && (
            <AppearanceSettingsTab />
          )}

          {currentTab === 'settings' && (
            <SettingsTab settings={settings} />
          )}
        </div>
      </main>
    </div>
  );
};
