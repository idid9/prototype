import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { WebsiteContent } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { Check } from 'lucide-react';

interface WebsiteContentTabProps {
  content: WebsiteContent;
}

export const WebsiteContentTab: React.FC<WebsiteContentTabProps> = ({ content }) => {
  const { isRtl } = useLanguage();
  const { currentAccentHex } = useTheme();

  const [heroHeadline, setHeroHeadline] = useState(content.heroHeadline);
  const [heroHeadlineAr, setHeroHeadlineAr] = useState(content.heroHeadlineAr);
  const [heroDescription, setHeroDescription] = useState(content.heroDescription);
  const [heroDescriptionAr, setHeroDescriptionAr] = useState(content.heroDescriptionAr);
  const [heroImage, setHeroImage] = useState(content.heroImage);

  const [aboutHeadline, setAboutHeadline] = useState(content.aboutHeadline);
  const [aboutHeadlineAr, setAboutHeadlineAr] = useState(content.aboutHeadlineAr);
  const [aboutText, setAboutText] = useState(content.aboutText);
  const [aboutTextAr, setAboutTextAr] = useState(content.aboutTextAr);

  const [operators, setOperators] = useState(content.stats.operators);
  const [experiencesCount, setExperiencesCount] = useState(content.stats.experiences);
  const [travelersServed, setTravelersServed] = useState(content.stats.travelersServed);
  const [satisfactionRate, setSatisfactionRate] = useState(content.stats.satisfactionRate);

  const [contactEmail, setContactEmail] = useState(content.contactEmail);
  const [contactPhone, setContactPhone] = useState(content.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(content.whatsappNumber);
  const [officeAddress, setOfficeAddress] = useState(content.officeAddress);

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setHeroHeadline(content.heroHeadline);
    setHeroHeadlineAr(content.heroHeadlineAr);
    setHeroDescription(content.heroDescription);
    setHeroDescriptionAr(content.heroDescriptionAr);
    setHeroImage(content.heroImage);
    setAboutHeadline(content.aboutHeadline);
    setAboutHeadlineAr(content.aboutHeadlineAr);
    setAboutText(content.aboutText);
    setAboutTextAr(content.aboutTextAr);
    setOperators(content.stats.operators);
    setExperiencesCount(content.stats.experiences);
    setTravelersServed(content.stats.travelersServed);
    setSatisfactionRate(content.stats.satisfactionRate);
    setContactEmail(content.contactEmail);
    setContactPhone(content.contactPhone);
    setWhatsappNumber(content.whatsappNumber);
    setOfficeAddress(content.officeAddress);
  }, [content]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.updateWebsiteContent({
      heroHeadline,
      heroHeadlineAr,
      heroDescription,
      heroDescriptionAr,
      heroImage,
      aboutHeadline,
      aboutHeadlineAr,
      aboutText,
      aboutTextAr,
      stats: {
        operators: Number(operators),
        experiences: Number(experiencesCount),
        travelersServed: Number(travelersServed),
        satisfactionRate: Number(satisfactionRate),
      },
      contactEmail,
      contactPhone,
      whatsappNumber,
      officeAddress,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            Website Content & CMS Management
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            Edit public headlines, hero banner imagery, about copy, and live operator statistics.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Changes published to visitor website in real-time!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* HERO SECTION CMS */}
        <GlassContainer className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            Homepage Hero Section
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Hero Headline (English) *
              </label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Hero Headline (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={heroHeadlineAr}
                onChange={(e) => setHeroHeadlineAr(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Hero Description (English)
              </label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Hero Description (Arabic)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={heroDescriptionAr}
                onChange={(e) => setHeroDescriptionAr(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
              Hero Backdrop Image URL
            </label>
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
            />
          </div>
        </GlassContainer>

        {/* ABOUT & PLATFORM PROOF */}
        <GlassContainer delay={0.05} className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            About Section & Brand Proof
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                About Headline (English)
              </label>
              <input
                type="text"
                value={aboutHeadline}
                onChange={(e) => setAboutHeadline(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                About Headline (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={aboutHeadlineAr}
                onChange={(e) => setAboutHeadlineAr(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                About Description (English)
              </label>
              <textarea
                rows={3}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                About Description (Arabic)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={aboutTextAr}
                onChange={(e) => setAboutTextAr(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                Operators Count
              </label>
              <input
                type="number"
                value={operators}
                onChange={(e) => setOperators(Number(e.target.value))}
                className="w-full text-xs p-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-lg font-mono font-bold text-[var(--tf-heading)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                Experiences Count
              </label>
              <input
                type="number"
                value={experiencesCount}
                onChange={(e) => setExperiencesCount(Number(e.target.value))}
                className="w-full text-xs p-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-lg font-mono font-bold text-[var(--tf-heading)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                Travelers Welcomed
              </label>
              <input
                type="number"
                value={travelersServed}
                onChange={(e) => setTravelersServed(Number(e.target.value))}
                className="w-full text-xs p-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-lg font-mono font-bold text-[var(--tf-heading)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                Satisfaction Rate (%)
              </label>
              <input
                type="number"
                max={100}
                value={satisfactionRate}
                onChange={(e) => setSatisfactionRate(Number(e.target.value))}
                className="w-full text-xs p-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-lg font-mono font-bold text-[var(--tf-heading)]"
              />
            </div>
          </div>
        </GlassContainer>

        {/* CONTACT & WHATSAPP CHANNELS */}
        <GlassContainer delay={0.1} className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            Contact Channels & WhatsApp Concierge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
              Riyadh Office Address
            </label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
            />
          </div>
        </GlassContainer>

        <div className="flex justify-end">
          <button
            type="submit"
            style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
            className="py-3 px-8 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-opacity hover:opacity-90 cursor-pointer"
          >
            Publish Website Updates
          </button>
        </div>
      </form>
    </div>
  );
};
