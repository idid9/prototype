import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Globe, Menu, X, Lock, Compass, Sparkles } from 'lucide-react';

interface VisitorNavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenExperienceModal?: () => void;
  onGoToAdmin?: () => void;
}

export const VisitorNavbar: React.FC<VisitorNavbarProps> = ({
  onNavigateSection,
  onGoToAdmin,
}) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { isAdminAuthenticated, openLoginModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-sm py-3'
          : 'bg-gradient-to-b from-[#123B32]/70 via-[#123B32]/30 to-transparent py-5 text-white'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('explore')}
            className="flex items-center gap-2 cursor-pointer group whitespace-nowrap shrink-0 text-left"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isScrolled
                  ? 'bg-[#123B32] text-[#D9C29A]'
                  : 'bg-white/15 text-white border border-white/20'
              }`}
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex items-baseline font-bold text-xl tracking-tight">
              <span className={isScrolled ? 'text-[#123B32]' : 'text-white'}>Tour</span>
              <span className="text-[#C6A46B]">Flow</span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors hover:text-[#C6A46B] whitespace-nowrap shrink-0 cursor-pointer ${
                  isScrolled ? 'text-[#202923]' : 'text-white/90'
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
                isScrolled
                  ? 'border-[#D9C29A]/60 text-[#123B32] hover:bg-[#D9C29A]/15'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Admin quick entry (if authenticated or modal) */}
            <button
              onClick={isAdminAuthenticated ? onGoToAdmin : openLoginModal}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-[#777D75] hover:text-[#123B32] hover:bg-[#D9C29A]/15'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              title={isAdminAuthenticated ? 'Go to Admin Dashboard' : 'Operator Portal'}
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick('experiences')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all whitespace-nowrap cursor-pointer ${
                isScrolled
                  ? 'bg-[#123B32] text-white hover:bg-[#1D5546]'
                  : 'bg-[#C6A46B] text-[#102E29] hover:bg-[#D9C29A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.bookCta')}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                isScrolled ? 'text-[#123B32]' : 'text-white'
              }`}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-[#D9C29A]/30 mt-3 px-6 py-5 space-y-4 text-[#202923] animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-start py-2 text-sm font-semibold text-[#123B32] hover:text-[#C6A46B] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#D9C29A]/30 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('experiences')}
              className="w-full py-2.5 px-4 bg-[#123B32] text-white rounded-xl text-xs font-semibold text-center"
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
              className="w-full py-2 px-4 bg-white border border-[#D9C29A]/50 rounded-xl text-xs font-semibold text-[#123B32] flex items-center justify-center gap-2"
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
