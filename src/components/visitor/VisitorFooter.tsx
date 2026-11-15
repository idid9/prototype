import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { WebsiteContent, Destination, BusinessSettings } from '../../types';
import { localizeCurrency } from '../../utils/localization';
import { getSiteText } from '../../utils/siteTexts';
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
  const { settings, isDarkGlass, blurPixels, currentAccentHex, currentAccentBtnTextHex } = useTheme();
  const isArabic = language === 'ar';

  const publishedDestinations = destinations.filter((d) => d.published);
  const currencyLabel = businessSettings?.currency || 'SAR';
  const brandTitle = businessSettings?.businessName || 'TourFlow';

  const sheen = settings.glassSheen ?? 0.72;
  const footerStyle: React.CSSProperties = settings.isGlassyEnabled
    ? {
        backgroundColor: isDarkGlass
          ? `rgba(10, 16, 14, ${Math.max(0.28, settings.cardTranslucency + 0.08)})`
          : `rgba(16, 46, 41, ${Math.max(0.48, settings.cardTranslucency + 0.24)})`,
        backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, ${(0.03 + sheen * 0.1).toFixed(3)}) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        backdropFilter:
          blurPixels > 0
            ? `blur(${blurPixels}px) saturate(${Math.round(145 + sheen * 60)}%)`
            : `saturate(${Math.round(145 + sheen * 60)}%)`,
        WebkitBackdropFilter:
          blurPixels > 0
            ? `blur(${blurPixels}px) saturate(${Math.round(145 + sheen * 60)}%)`
            : `saturate(${Math.round(145 + sheen * 60)}%)`,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: `rgba(255, 255, 255, ${settings.borderOpacity})`,
      }
    : {
        backgroundColor: isDarkGlass ? '#0B1613' : '#102E29',
        backgroundImage: 'none',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'rgba(255, 255, 255, 0.14)',
      };

  const customBrandWordmark = isArabic
    ? content?.componentTextsAr?.['nav.brandName']?.trim()
    : content?.componentTexts?.['nav.brandName']?.trim();
  const hasCustomCmsBrand =
    Boolean(customBrandWordmark) &&
    customBrandWordmark !== 'TourFlow' &&
    customBrandWordmark !== 'تورفلو';

  const isDefaultBrand =
    !hasCustomCmsBrand &&
    (!brandTitle ||
      brandTitle === 'TourFlow' ||
      brandTitle === 'TourFlow Digital Tourism Platform');
  const displayBrandName = hasCustomCmsBrand ? customBrandWordmark : brandTitle;
  const localizedBrandName = isDefaultBrand
    ? isArabic
      ? 'منصة تورفلو السياحية الرقمية'
      : brandTitle
    : displayBrandName;

  return (
    <footer
      style={footerStyle}
      className="text-[#FAF0DC] pt-16 pb-12 transition-all duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {isDefaultBrand ? (
                  isArabic ? (
                    <>
                      تور<span style={{ color: currentAccentHex }}>فلو</span>
                    </>
                  ) : (
                    <>
                      Tour<span style={{ color: currentAccentHex }}>Flow</span>
                    </>
                  )
                ) : (
                  displayBrandName
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#EDE0C6]/85 max-w-sm leading-relaxed">
              {getSiteText(content, 'footer.bio', language)}
            </p>

            <div className="flex items-center gap-3 text-xs pt-2" style={{ color: currentAccentHex }}>
              <ShieldCheck className="w-4 h-4" />
              <span>{getSiteText(content, 'footer.visionBadge', language)}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: currentAccentHex }}
            >
              {getSiteText(content, 'footer.destinationsCol', language)}
            </h4>
            <ul className="space-y-2 text-xs text-[#EDE0C6]/85">
              {publishedDestinations.length > 0 ? (
                publishedDestinations.map((dest) => (
                  <li key={dest.id}>
                    <button
                      onClick={() =>
                        onSelectDestination
                          ? onSelectDestination(dest.id)
                          : onNavigateSection('destinations')
                      }
                      className="hover:text-[#FAF0DC] transition-colors cursor-pointer text-start"
                    >
                      {isArabic ? dest.nameAr : dest.name} · {isArabic ? dest.regionAr : dest.region}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    onClick={() => onNavigateSection('destinations')}
                    className="hover:text-[#FAF0DC] transition-colors cursor-pointer"
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
              {getSiteText(content, 'footer.conciergeCol', language)}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EDE0C6]/85">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: currentAccentHex }} />
                <a href={`mailto:${content.contactEmail}`} className="hover:underline">
                  {content.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: currentAccentHex }} />
                <span dir="ltr">{content.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentAccentHex }} />
                <span>{isArabic ? content.officeAddressAr || content.officeAddress : content.officeAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FAF0DC]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE0C6]/75">
          <div>
            © 2026 {localizedBrandName}. {getSiteText(content, 'footer.rightsSuffix', language)}
          </div>
          <span className="text-[11px]" style={{ color: currentAccentHex }}>
            {isArabic ? 'العملة:' : 'Currency:'} {localizeCurrency(currencyLabel, language)}
          </span>
        </div>
      </div>
    </footer>
  );
};
