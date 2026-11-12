import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { WebsiteContent } from '../../types';
import { Compass, Lock, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface VisitorFooterProps {
  content: WebsiteContent;
  onNavigateSection: (sectionId: string) => void;
  onGoToAdmin?: () => void;
}

export const VisitorFooter: React.FC<VisitorFooterProps> = ({
  content,
  onNavigateSection,
  onGoToAdmin,
}) => {
  const { language, t, isRtl } = useLanguage();
  const { isAdminAuthenticated, openLoginModal } = useAuth();
  const isArabic = language === 'ar';

  const handleAdminClick = () => {
    if (isAdminAuthenticated && onGoToAdmin) {
      onGoToAdmin();
    } else {
      openLoginModal();
    }
  };

  return (
    <footer className="bg-[#102E29] text-white pt-16 pb-12 border-t border-[#D9C29A]/20" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D9C29A] text-[#123B32] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Tour<span className="text-[#C6A46B]">Flow</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              "Turning Local Experiences Into Digital Growth." Saudi Arabia’s premier digital platform connecting licensed tour operators with global and domestic travelers.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#D9C29A] pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with Saudi Vision 2030 Tourism Ecosystem</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D9C29A]">
              Explore Destinations
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button
                  onClick={() => onNavigateSection('destinations')}
                  className="hover:text-[#D9C29A] transition-colors cursor-pointer"
                >
                  AlUla & Hegra Monuments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('destinations')}
                  className="hover:text-[#D9C29A] transition-colors cursor-pointer"
                >
                  Riyadh & Historic Diriyah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('destinations')}
                  className="hover:text-[#D9C29A] transition-colors cursor-pointer"
                >
                  Jeddah Historic Al-Balad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('destinations')}
                  className="hover:text-[#D9C29A] transition-colors cursor-pointer"
                >
                  Red Sea Coastal Archipelago
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D9C29A]">
              Platform Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6A46B] shrink-0" />
                <a href={`mailto:${content.contactEmail}`} className="hover:underline">
                  {content.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C6A46B] shrink-0" />
                <span>{content.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C6A46B] shrink-0 mt-0.5" />
                <span>{isArabic ? content.officeAddressAr : content.officeAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright + Discreet Lock Icon */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © 2026 TourFlow Technologies. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#D9C29A]/80">Currency: Saudi Riyal (SAR)</span>

            {/* Prompt Requirement §4: "Place the lock icon discreetly in the footer or bottom-right corner. When clicked: Open a minimalist admin login modal." */}
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
              title="Operator & Admin Workspace Access"
            >
              <Lock className="w-3.5 h-3.5 text-[#C6A46B]" />
              <span className="text-[11px]">{t('footer.adminLock')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
