import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Globe, Menu, X, Lock, Compass, Sparkles } from 'lucide-react';

interface VisitorNavbarProps {
  businessName?: string;
  onNavigateSection: (sectionId: string) => void;
  onOpenExperienceModal?: () => void;
  onGoToAdmin?: () => void;
}

export const VisitorNavbar: React.FC<VisitorNavbarProps> = ({
  businessName,
  onNavigateSection,
  onGoToAdmin,
}) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { isAdminAuthenticated, openLoginModal } = useAuth();
  const {
    getVisitorGlassyStyle,
    getGlassyIconStyle,
    isVisitorTargetGlassy,
    isDarkGlass,
    currentAccentHex,
  } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNavbarGlassy = isVisitorTargetGlassy('navbarGlassy');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { label: t('nav.explore'), id: 'explore' },
    { label: t('nav.destinations'), id: 'destinations' },
    { label: t('nav.experiences'), id: 'experiences' },
    { label: t('nav.quiz'), id: 'quiz' },
    { label: t('nav.about'), id: 'about' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  // When over the hero image (!isScrolled) or in Smoked Dark mode, keep navbar light-on-dark.
  // When scrolled in Crystal Light mode, transition smoothly to dark-on-light.
  const useLightText = !isScrolled || isDarkGlass;

  const headerGlassyStyle: React.CSSProperties = isNavbarGlassy
    ? getVisitorGlassyStyle('navbarGlassy', {
        isDark: useLightText,
        borderSides: 'bottom',
      })
    : isScrolled
    ? getVisitorGlassyStyle('navbarGlassy', {
        isDark: isDarkGlass,
        borderSides: 'bottom',
      })
    : {};

  const isArabic = language === 'ar';
  const isDefaultBrand =
    !businessName ||
    businessName === 'TourFlow' ||
    businessName === 'TourFlow Digital Tourism Platform';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isNavbarGlassy
          ? isScrolled
            ? 'shadow-sm py-3'
            : 'py-4'
          : isScrolled
          ? 'shadow-sm py-3'
          : 'bg-gradient-to-b from-[#102E29]/85 via-[#102E29]/40 to-transparent py-5'
      } ${useLightText ? 'text-white' : 'text-[var(--tf-heading)]'}`}
      style={{
        ...headerGlassyStyle,
        ...(useLightText
          ? { textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)' }
          : { textShadow: 'var(--tf-text-shadow)' }),
      }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('explore')}
            className="flex items-center gap-2 cursor-pointer group whitespace-nowrap shrink-0 text-start"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={getGlassyIconStyle({ forceDark: useLightText })}
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex items-baseline font-bold text-xl tracking-tight">
              {isDefaultBrand ? (
                isArabic ? (
                  <>
                    <span className={useLightText ? 'text-white' : 'text-[var(--tf-heading)]'}>تور</span>
                    <span style={{ color: currentAccentHex }}>فلو</span>
                  </>
                ) : (
                  <>
                    <span className={useLightText ? 'text-white' : 'text-[var(--tf-heading)]'}>Tour</span>
                    <span style={{ color: currentAccentHex }}>Flow</span>
                  </>
                )
              ) : (
                <span className={useLightText ? 'text-white' : 'text-[var(--tf-heading)]'}>
                  {businessName}
                </span>
              )}
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  useLightText
                    ? 'text-white/95 hover:text-white'
                    : 'text-[var(--tf-text)] hover:text-[var(--tf-heading)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Language toggle + Primary CTA + Admin lock) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                useLightText
                  ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                  : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)]'
              }`}
              title={isArabic ? 'تغيير اللغة' : 'Switch Language'}
            >
              <Globe className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Admin quick entry */}
            <button
              onClick={isAdminAuthenticated ? onGoToAdmin : openLoginModal}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                useLightText
                  ? 'text-white/85 hover:text-white hover:bg-white/15'
                  : 'text-[var(--tf-muted)] hover:text-[var(--tf-heading)] hover:bg-[var(--tf-surface-subtle)]'
              }`}
              title={
                isAdminAuthenticated
                  ? isArabic
                    ? 'الانتقال إلى لوحة التحكم'
                    : 'Go to Admin Dashboard'
                  : isArabic
                  ? 'بوابة المشغلين'
                  : 'Operator Portal'
              }
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick('experiences')}
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide shadow-sm transition-all whitespace-nowrap cursor-pointer hover:brightness-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.bookCta')}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${useLightText ? 'text-white' : 'text-[#123B32]'}`}
              aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={getVisitorGlassyStyle('navbarGlassy')}
          className="md:hidden mt-3 px-6 py-5 space-y-4 text-[var(--tf-text)] shadow-xl"
        >
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-start py-2 text-sm font-semibold text-[var(--tf-heading)] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-[var(--tf-border)] flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('experiences')}
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center"
            >
              {t('nav.bookCta')}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminAuthenticated && onGoToAdmin) {
                  onGoToAdmin();
                } else {
                  openLoginModal();
                }
              }}
              className="w-full py-2 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs font-semibold text-[var(--tf-heading)] flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav.adminPortal')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
