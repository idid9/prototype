import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { DataService } from '../services/dataService';
import { resolveCloudLanguageSync, shouldReloadForMapLanguage } from '../utils/languageSync';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, options?: { manualVisitorOverride?: boolean }) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.explore': 'Explore',
    'nav.destinations': 'Destinations',
    'nav.experiences': 'Experiences',
    'nav.about': 'About Us',
    'nav.quiz': 'Discover Match',
    'nav.bookCta': 'Book Experience',
    'nav.adminPortal': 'Admin Portal',

    // Hero & Search
    'hero.badge': 'The Saudi Arabia Tourism Platform',
    'hero.searchDestination': 'Where to?',
    'hero.allDestinations': 'All Destinations',
    'hero.category': 'Category',
    'hero.allCategories': 'All Categories',
    'hero.date': 'Travel Date',
    'hero.guests': 'Guests',
    'hero.searchBtn': 'Find Experiences',

    // Section Titles
    'section.destinations.title': 'Explore Extraordinary Destinations',
    'section.destinations.sub': 'From the ancient Nabataean sandstone canyons of AlUla to the historic coral alleyways of Jeddah and the untouched Red Sea.',
    'section.destinations.viewAll': 'All Saudi Destinations',

    'section.experiences.title': 'Curated Saudi Experiences',
    'section.experiences.sub': 'Handpicked journeys hosted by certified local Saudi guides, cultural storytellers, and adventure curators.',
    'section.experiences.all': 'All Experiences',
    'section.experiences.featured': 'Featured',
    'section.experiences.viewDetails': 'View Experience',
    'section.experiences.from': 'From',
    'section.experiences.sar': 'SAR',
    'section.experiences.duration': 'Duration',

    // Quiz & Mini-game
    'quiz.badge': 'Interactive Experience Matcher',
    'quiz.title': 'Discover Your Saudi Experience',
    'quiz.sub': 'Take our 30-second Saudi discovery quiz and let our recommendation engine find your ideal authentic adventure.',
    'quiz.start': 'Start Discovery Quiz',
    'quiz.question': 'Question',
    'quiz.score': 'Your Score',
    'quiz.congrats': 'Mabrook! Your Custom Match',
    'quiz.share': 'Share Result',
    'quiz.retake': 'Take Again',
    'quiz.recommended': 'Recommended Experience For You',

    // Details & Booking
    'details.overview': 'Overview',
    'details.highlights': 'Experience Highlights',
    'details.included': "What's Included",
    'details.notIncluded': "What's Not Included",
    'details.meetingPoint': 'Meeting Point & Location',
    'details.bookingCard.title': 'Request Your Experience',
    'details.bookingCard.sub': 'Direct request to certified local operators. No prepayment required.',
    'details.bookingCard.name': 'Full Name',
    'details.bookingCard.email': 'Email Address',
    'details.bookingCard.phone': 'Phone Number (with country code)',
    'details.bookingCard.country': 'Your Country',
    'details.bookingCard.guests': 'Number of Guests',
    'details.bookingCard.date': 'Preferred Date',
    'details.bookingCard.message': 'Special Requests / Dietary Notes',
    'details.bookingCard.submit': 'Submit Booking Inquiry',
    'details.bookingCard.submitting': 'Submitting to Operator...',
    'details.bookingCard.successTitle': 'Inquiry Submitted Successfully!',
    'details.bookingCard.successMsg': 'Your inquiry has been logged in real-time. A certified local concierge will contact you within 2 business hours.',
    'details.bookingCard.inquiryId': 'Inquiry Reference ID',
    'details.bookingCard.whatsapp': 'Chat on WhatsApp',
    'details.bookingCard.close': 'Done',

    // About & Stats
    'about.tagline': 'Turning Local Experiences Into Digital Growth',
    'about.statOperators': 'Local Operators',
    'about.statExperiences': 'Curated Journeys',
    'about.statTravelers': 'Travelers Welcomed',
    'about.statSatisfaction': 'Guest Satisfaction',

    // Footer
    'footer.rights': 'TourFlow Technologies. Built for Saudi Arabia Tourism Growth.',
    'footer.demoNotice': 'Prototype Demo Mode — Synced in Real-Time',
    'footer.adminLock': 'Admin Management Access',

    // Auth Modal
    'auth.title': 'TourFlow Admin Workspace',
    'auth.sub': 'Restricted access for licensed tour operators & management team.',
    'auth.password': 'Access Code / Password',
    'auth.passwordPlaceholder': 'Enter demo password (12341234)',
    'auth.demoHint': 'Demo Password: 12341234',
    'auth.loginBtn': 'Access Dashboard',
    'auth.cancel': 'Cancel',
    'auth.error': 'Invalid access credentials. Please enter 12341234.',

    // Admin Common
    'admin.backToSite': 'Visitor Website',
    'admin.logout': 'Sign Out',
    'admin.realtimeActive': 'Real-Time Sync Active',
  },
  ar: {
    // Navigation
    'nav.explore': 'استكشف',
    'nav.destinations': 'الوجهات',
    'nav.experiences': 'التجارب',
    'nav.about': 'عن تورفلو',
    'nav.quiz': 'طابق رحلتك',
    'nav.bookCta': 'احجز تجربة',
    'nav.adminPortal': 'لوحة الإدارة',

    // Hero & Search
    'hero.badge': 'منصة نمو السياحة في المملكة العربية السعودية',
    'hero.searchDestination': 'إلى أين وجهتك؟',
    'hero.allDestinations': 'جميع الوجهات',
    'hero.category': 'تصنيف التجربة',
    'hero.allCategories': 'جميع التصنيفات',
    'hero.date': 'تاريخ السفر',
    'hero.guests': 'عدد الضيوف',
    'hero.searchBtn': 'بحث عن تجارب',

    // Section Titles
    'section.destinations.title': 'استكشف وجهات استثنائية',
    'section.destinations.sub': 'من ممرات العلا الصخرية الشامخة إلى أزقة جدة التاريخية العريقة ومياه البحر الأحمر العذراء.',
    'section.destinations.viewAll': 'كافة وجهات المملكة',

    'section.experiences.title': 'تجارب سياحية سعودية أصيلة',
    'section.experiences.sub': 'جولات مختارة بعناية يقودها مرشدون ورواة محليون معتمدون في قلب المملكة.',
    'section.experiences.all': 'جميع التجارب',
    'section.experiences.featured': 'المميزة',
    'section.experiences.viewDetails': 'تفاصيل التجربة',
    'section.experiences.from': 'ابتداءً من',
    'section.experiences.sar': 'ريال',
    'section.experiences.duration': 'المدة',

    // Quiz & Mini-game
    'quiz.badge': 'مستكشف التجارب التفاعلي',
    'quiz.title': 'اكتشف تجربتك السعودية المثالية',
    'quiz.sub': 'أجب عن بضعة أسئلة في 30 ثانية لنوصلك بالتجربة التي تناسب ذوقك وتطلعاتك.',
    'quiz.start': 'ابدأ الاختبار التفاعلي',
    'quiz.question': 'السؤال',
    'quiz.score': 'نتيجتك',
    'quiz.congrats': 'مبروك! التجربة المثالية لك',
    'quiz.share': 'مشاركة النتيجة',
    'quiz.retake': 'إعادة المحاولة',
    'quiz.recommended': 'التجربة الموصى بها لك',

    // Details & Booking
    'details.overview': 'نبذة عامة',
    'details.highlights': 'أبرز مميزات الرحلة',
    'details.included': 'ما تشمله الرحلة',
    'details.notIncluded': 'ما لا تشمله الرحلة',
    'details.meetingPoint': 'نقطة الالتقاء والموقع',
    'details.bookingCard.title': 'طلب حجز التجربة',
    'details.bookingCard.sub': 'طلب مباشر للمشغل المحلي المرخص دون الحاجة للدفع المسبق.',
    'details.bookingCard.name': 'الاسم الكامل',
    'details.bookingCard.email': 'البريد الإلكتروني',
    'details.bookingCard.phone': 'رقم الجوال (مع مفتاح الدولة)',
    'details.bookingCard.country': 'بلد الإقامة',
    'details.bookingCard.guests': 'عدد الضيوف',
    'details.bookingCard.date': 'التاريخ المفضل',
    'details.bookingCard.message': 'طلبات خاصة أو ملاحظات غذائية',
    'details.bookingCard.submit': 'إرسال طلب الحجز',
    'details.bookingCard.submitting': 'جارٍ إرسال الطلب للمشغل...',
    'details.bookingCard.successTitle': 'تم إرسال طلبك بنجاح!',
    'details.bookingCard.successMsg': 'تم حفظ طلبك فورياً في النظام، وسيتواصل معك منسق الرحلات خلال ساعتي عمل.',
    'details.bookingCard.inquiryId': 'رقم مرجع الحجز',
    'details.bookingCard.whatsapp': 'تواصل عبر واتساب',
    'details.bookingCard.close': 'إغلاق',

    // About & Stats
    'about.tagline': 'تحويل التجارب المحلية إلى نمو رقمي مستدام',
    'about.statOperators': 'مشغل محلي مرخص',
    'about.statExperiences': 'رحلة وتجربة سياحية',
    'about.statTravelers': 'زائر ومسافر',
    'about.statSatisfaction': 'نسبة رضا الضيوف',

    // Footer
    'footer.rights': 'تورفلو للتقنيات السياحية. صُمم لدعم نمو السياحة السعودية.',
    'footer.demoNotice': 'نسخة العرض التجريبي — مزامنة لحظية فورية',
    'footer.adminLock': 'دخول إدارة المنصة',

    // Auth Modal
    'auth.title': 'بوابة إدارة تورفلو',
    'auth.sub': 'منطقة مخصصة للمرشدين ومشغلي الجولات السياحية وإدارة المنصة.',
    'auth.password': 'رمز الدخول / كلمة المرور',
    'auth.passwordPlaceholder': 'أدخل كلمة مرور العرض (12341234)',
    'auth.demoHint': 'كلمة المرور التجريبية: 12341234',
    'auth.loginBtn': 'دخول لوحة التحكم',
    'auth.cancel': 'إلغاء',
    'auth.error': 'كلمة المرور غير صحيحة. يرجى إدخال 12341234.',

    // Admin Common
    'admin.backToSite': 'موقع الزوار',
    'admin.logout': 'تسجيل الخروج',
    'admin.realtimeActive': 'المزامنة اللحظية نشطة',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRtl: false,
});

const LANG_STORAGE_KEY = 'tourflow_lang';
const LANG_MANUAL_OVERRIDE_KEY = 'tourflow_lang_manual';
const LANG_RELOAD_SCROLL_KEY = 'tourflow_restore_scroll_y';
const LANG_RELOAD_FLAG_KEY = 'tourflow_restore_after_lang_reload';
const LANG_BROADCAST_CHANNEL = 'tourflow_lang_sync';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved === 'ar' || saved === 'en') return saved;
      const cloudDefault = DataService.getSettings().defaultLanguage;
      return cloudDefault === 'ar' || cloudDefault === 'en' ? cloudDefault : 'en';
    }
    return 'en';
  });

  const lastCloudDefaultLangRef = useRef<Language | null>(null);
  const manualVisitorOverrideRef = useRef<boolean>(
    typeof window !== 'undefined' &&
      localStorage.getItem(LANG_MANUAL_OVERRIDE_KEY) === '1' &&
      (localStorage.getItem(LANG_STORAGE_KEY) === 'en' ||
        localStorage.getItem(LANG_STORAGE_KEY) === 'ar')
  );

  const isRtl = language === 'ar';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, language);
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRtl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LANG_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'ar')) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(LANG_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (event.data === 'en' || event.data === 'ar') {
          setLanguageState(event.data);
        }
      };
    }

    // Real-time cloud default language synchronization across all devices
    const unsubSettings = DataService.subscribeSettings((settings) => {
      const syncResult = resolveCloudLanguageSync({
        lastCloudDefault: lastCloudDefaultLangRef.current,
        incomingCloudDefault: settings?.defaultLanguage,
        hasManualOverride: manualVisitorOverrideRef.current,
      });

      lastCloudDefaultLangRef.current = syncResult.nextCloudDefault;
      manualVisitorOverrideRef.current = syncResult.nextHasManualOverride;

      if (!syncResult.nextHasManualOverride) {
        localStorage.removeItem(LANG_MANUAL_OVERRIDE_KEY);
      }

      if (syncResult.languageToApply) {
        localStorage.setItem(LANG_STORAGE_KEY, syncResult.languageToApply);
        setLanguageState(syncResult.languageToApply);
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorage);
      bc?.close();
      unsubSettings();
    };
  }, []);

  const setLanguage = (lang: Language, options?: { manualVisitorOverride?: boolean }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      if (options?.manualVisitorOverride) {
        manualVisitorOverrideRef.current = true;
        localStorage.setItem(LANG_MANUAL_OVERRIDE_KEY, '1');
      } else {
        manualVisitorOverrideRef.current = false;
        lastCloudDefaultLangRef.current = lang;
        localStorage.removeItem(LANG_MANUAL_OVERRIDE_KEY);
      }
    } else if (options?.manualVisitorOverride) {
      manualVisitorOverrideRef.current = true;
    } else {
      manualVisitorOverrideRef.current = false;
      lastCloudDefaultLangRef.current = lang;
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(LANG_BROADCAST_CHANNEL);
        bc.postMessage(lang);
        bc.close();
      } catch {}
    }

    if (typeof window !== 'undefined') {
      const win = window as Window & {
        google?: { maps?: unknown };
        __tfMapsLoadedLanguage?: Language;
      };
      if (
        shouldReloadForMapLanguage({
          manualVisitorOverride: options?.manualVisitorOverride,
          currentLanguage: language,
          nextLanguage: lang,
          hasGoogleMapsLoaded: Boolean(win.google?.maps),
          loadedMapLanguage: win.__tfMapsLoadedLanguage || null,
        })
      ) {
        try {
          sessionStorage.setItem(LANG_RELOAD_SCROLL_KEY, String(window.scrollY));
          sessionStorage.setItem(LANG_RELOAD_FLAG_KEY, '1');
        } catch {}
        window.location.reload();
        return;
      }
    }

    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
