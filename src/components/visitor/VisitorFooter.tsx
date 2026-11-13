import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { WebsiteContent, Destination, BusinessSettings } from '../../types';
import { Compass, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface VisitorFooterProps {
  content: WebsiteContent;
  destinations?: Destination[];
  businessSettings?: BusinessSettings;
  onSelectDestination?: (destId: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const VisitorFooter: React.FC<VisitorFooterProps> = ({
  content,
  destinations = [],
  businessSettings,
  onSelectDestination,
  onNavigateSection,
}) => {
  const { language, t, isRtl } = useLanguage();
  const { settings, isDarkGlass, blurPixels, currentAccentHex } = useTheme();
  const isArabic = language === 'ar';

  const publishedDestinations = destinations.filter((d) => d.published);
  const currencyLabel = businessSettings?.currency || 'SAR';
  const brandTitle = businessSettings?.businessName || 'TourFlow';

  const footerStyle: React.CSSProperties = settings.isGlassyEnabled
    ? {
        backgroundColor: isDarkGlass
          ? `rgba(10, 16, 14, ${Math.max(0.55, settings.cardTranslucency)})`
          : `rgba(16, 46, 41, ${Math.max(0.84, settings.cardTranslucency)})`,
        backdropFilter: `blur(${blurPixels}px) saturate(155%)`,
        WebkitBackdropFilter: `blur(${blurPixels}px) saturate(155%)`,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: `rgba(255, 255, 255, ${settings.borderOpacity})`,
      }
    : {
        backgroundColor: isDarkGlass ? '#0B1613' : '#102E29',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'rgba(255, 255, 255, 0.14)',
      };

  return (
    <footer
      style={footerStyle}
      className="text-white pt-16 pb-12 transition-all duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {brandTitle === 'TourFlow Digital Tourism Platform' || brandTitle === 'TourFlow' ? (
                  <>
                    Tour<span style={{ color: currentAccentHex }}>Flow</span>
                  </>
                ) : (
                  brandTitle
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              "Turning Local Experiences Into Digital Growth." Saudi Arabia’s premier digital platform connecting licensed tour operators with global and domestic travelers.
            </p>

            <div className="flex items-center gap-3 text-xs pt-2" style={{ color: currentAccentHex }}>
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with Saudi Vision 2030 Tourism Ecosystem</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: currentAccentHex }}
            >
              Explore Destinations
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              {publishedDestinations.length > 0 ? (
                publishedDestinations.map((dest) => (
                  <li key={dest.id}>
                    <button
                      onClick={() =>
                        onSelectDestination
                          ? onSelectDestination(dest.id)
                          : onNavigateSection('destinations')
                      }
                      className="hover:text-white transition-colors cursor-pointer text-start"
                    >
                      {isArabic ? dest.nameAr : dest.name} · {isArabic ? dest.regionAr : dest.region}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    onClick={() => onNavigateSection('destinations')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {t('section.destinations.viewAll')}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: currentAccentHex }}
            >
              Platform Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: currentAccentHex }} />
                <a href={`mailto:${content.contactEmail}`} className="hover:underline">
                  {content.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: currentAccentHex }} />
                <span>{content.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentAccentHex }} />
                <span>{isArabic ? content.officeAddressAr : content.officeAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>© 2026 {brandTitle}. All rights reserved.</div>
          <span className="text-[11px]" style={{ color: currentAccentHex }}>
            Currency: {currencyLabel}
          </span>
        </div>
      </div>
    </footer>
  );
};
