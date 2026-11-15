import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { WebsiteContent } from '../../../types';
import { DataService } from '../../../services/dataService';
import {
  SITE_TEXT_GROUPS,
  SITE_TEXT_DEFINITIONS,
  SiteTextGroupId,
} from '../../../utils/siteTexts';
import { GlassContainer } from '../../glass/GlassContainer';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Check, Search, RotateCcw, Globe, Type, Sparkles } from 'lucide-react';

interface WebsiteContentTabProps {
  content: WebsiteContent;
}

export const WebsiteContentTab: React.FC<WebsiteContentTabProps> = ({ content }) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex, currentAccentRgb } = useTheme();

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
  const [officeAddressAr, setOfficeAddressAr] = useState(content.officeAddressAr || '');

  const [componentTexts, setComponentTexts] = useState<Record<string, string>>(
    content.componentTexts || {}
  );
  const [componentTextsAr, setComponentTextsAr] = useState<Record<string, string>>(
    content.componentTextsAr || {}
  );

  const [activeTextGroup, setActiveTextGroup] = useState<SiteTextGroupId>('nav');
  const [textSearchQuery, setTextSearchQuery] = useState('');
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
    setOfficeAddressAr(content.officeAddressAr || '');
    setComponentTexts(content.componentTexts || {});
    setComponentTextsAr(content.componentTextsAr || {});
  }, [content]);

  const getDraftEn = (key: string, defaultEn: string) =>
    Object.prototype.hasOwnProperty.call(componentTexts, key)
      ? componentTexts[key]
      : defaultEn;

  const getDraftAr = (key: string, defaultAr: string) =>
    Object.prototype.hasOwnProperty.call(componentTextsAr, key)
      ? componentTextsAr[key]
      : defaultAr;

  const isFieldModified = (key: string, defaultEn: string, defaultAr: string) => {
    const enVal = getDraftEn(key, defaultEn).trim();
    const arVal = getDraftAr(key, defaultAr).trim();
    return enVal !== defaultEn.trim() || arVal !== defaultAr.trim();
  };

  const handleUpdateComponentText = (lang: 'en' | 'ar', key: string, value: string) => {
    if (lang === 'en') {
      setComponentTexts((prev) => ({ ...prev, [key]: value }));
    } else {
      setComponentTextsAr((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleResetField = (key: string) => {
    setComponentTexts((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setComponentTextsAr((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleResetGroup = (groupId: SiteTextGroupId) => {
    const keysInGroup = new Set(
      SITE_TEXT_DEFINITIONS.filter((d) => d.group === groupId).map((d) => d.key)
    );
    setComponentTexts((prev) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (!keysInGroup.has(k)) next[k] = v;
      }
      return next;
    });
    setComponentTextsAr((prev) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (!keysInGroup.has(k)) next[k] = v;
      }
      return next;
    });
  };

  const customizedCountByGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const def of SITE_TEXT_DEFINITIONS) {
      if (isFieldModified(def.key, def.defaultEn, def.defaultAr)) {
        counts[def.group] = (counts[def.group] || 0) + 1;
      }
    }
    return counts;
  }, [componentTexts, componentTextsAr]);

  const totalCustomizedCount = useMemo(
    () =>
      Object.values(customizedCountByGroup).reduce((sum, count) => sum + count, 0),
    [customizedCountByGroup]
  );

  const visibleTextDefs = useMemo(() => {
    const q = textSearchQuery.trim().toLowerCase();
    if (!q) {
      return SITE_TEXT_DEFINITIONS.filter((d) => d.group === activeTextGroup);
    }
    return SITE_TEXT_DEFINITIONS.filter((d) => {
      const currentEn = getDraftEn(d.key, d.defaultEn).toLowerCase();
      const currentAr = getDraftAr(d.key, d.defaultAr).toLowerCase();
      return (
        d.key.toLowerCase().includes(q) ||
        d.label.toLowerCase().includes(q) ||
        d.labelAr.toLowerCase().includes(q) ||
        currentEn.includes(q) ||
        currentAr.includes(q)
      );
    });
  }, [textSearchQuery, activeTextGroup, componentTexts, componentTextsAr]);

  const activeGroupMeta = useMemo(
    () => SITE_TEXT_GROUPS.find((g) => g.id === activeTextGroup) || SITE_TEXT_GROUPS[0],
    [activeTextGroup]
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist clean minimal maps storing only non-empty values customized away from defaults
    const cleanComponentTexts: Record<string, string> = {};
    const cleanComponentTextsAr: Record<string, string> = {};

    for (const def of SITE_TEXT_DEFINITIONS) {
      if (Object.prototype.hasOwnProperty.call(componentTexts, def.key)) {
        const trimmed = componentTexts[def.key].trim();
        if (trimmed.length > 0 && trimmed !== def.defaultEn.trim()) {
          cleanComponentTexts[def.key] = trimmed;
        }
      }
      if (Object.prototype.hasOwnProperty.call(componentTextsAr, def.key)) {
        const trimmedAr = componentTextsAr[def.key].trim();
        if (trimmedAr.length > 0 && trimmedAr !== def.defaultAr.trim()) {
          cleanComponentTextsAr[def.key] = trimmedAr;
        }
      }
    }

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
      officeAddressAr,
      componentTexts: cleanComponentTexts,
      componentTextsAr: cleanComponentTextsAr,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3200);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic ? 'إدارة محتوى ونصوص الموقع (CMS)' : 'Website Content & CMS Management'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'تحكم في العناوين والصور وجميع نصوص مكونات وأزرار موقع الزوار بكلتا اللغتين مع تحديث فوري عبر الأجهزة.'
              : 'Customize headlines, imagery, contact info, and every UI component label across the visitor website in real time.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {savedSuccess && (
            <div className="px-3 py-1.5 bg-[var(--tf-success-bg)] border border-[var(--tf-success-border)] text-[var(--tf-success-text)] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                {isArabic
                  ? 'تم نشر التغييرات على جميع الأجهزة!'
                  : 'Published live across all devices!'}
              </span>
            </div>
          )}
          <button
            type="submit"
            form="website-cms-form"
            style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
            className="py-2.5 px-5 rounded-xl text-xs font-bold shadow-md transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
          >
            {isArabic ? 'نشر تحديثات الموقع' : 'Publish Website Updates'}
          </button>
        </div>
      </div>

      <form id="website-cms-form" onSubmit={handleSave} className="space-y-8">
        {/* HERO SECTION CMS */}
        <GlassContainer className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            {isArabic ? 'القسم الرئيسي للصفحة (Hero)' : 'Homepage Hero Section'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'العنوان الرئيسي (بالإنجليزية) *' : 'Hero Headline (English) *'}
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'العنوان الرئيسي (بالعربية)' : 'Hero Headline (Arabic)'}
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
                {isArabic ? 'الوصف الرئيسي (بالإنجليزية)' : 'Hero Description (English)'}
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'الوصف الرئيسي (بالعربية)' : 'Hero Description (Arabic)'}
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

          <ImageUploadField
            label={
              isArabic
                ? 'صورة خلفية القسم الرئيسي (رفع من الجهاز)'
                : 'Hero Backdrop Image (Upload from Device)'
            }
            value={heroImage}
            onChange={setHeroImage}
            previewHeightClass="h-44"
            maxDimension={1600}
            helperText={
              isArabic
                ? 'تُعرض بملء الشاشة في القسم الرئيسي من صفحة الزوار.'
                : 'Displayed full-bleed on the Visitor homepage Hero section.'
            }
          />
        </GlassContainer>

        {/* ABOUT & PLATFORM PROOF */}
        <GlassContainer delay={0.04} className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            {isArabic ? 'قسم من نحن وإحصائيات المنصة' : 'About Section & Brand Proof'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'عنوان من نحن (بالإنجليزية)' : 'About Headline (English)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={aboutHeadline}
                onChange={(e) => setAboutHeadline(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'عنوان من نحن (بالعربية)' : 'About Headline (Arabic)'}
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
                {isArabic ? 'وصف من نحن (بالإنجليزية)' : 'About Description (English)'}
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'وصف من نحن (بالعربية)' : 'About Description (Arabic)'}
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
                {isArabic ? 'عدد المشغلين' : 'Operators Count'}
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
                {isArabic ? 'عدد التجارب' : 'Experiences Count'}
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
                {isArabic ? 'المسافرون المخدومون' : 'Travelers Welcomed'}
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
                {isArabic ? 'معدل الرضا (%)' : 'Satisfaction Rate (%)'}
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
        <GlassContainer delay={0.08} className="p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            {isArabic ? 'قنوات التواصل والخدمة عبر واتساب' : 'Contact Channels & WhatsApp Concierge'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'بريد خدمة العملاء' : 'Concierge Email'}
              </label>
              <input
                type="email"
                dir="ltr"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'رقم الواتساب' : 'WhatsApp Number'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'عنوان مكتب الرياض (بالإنجليزية)' : 'Riyadh Office Address (English)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'عنوان مكتب الرياض (بالعربية)' : 'Riyadh Office Address (Arabic)'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={officeAddressAr}
                onChange={(e) => setOfficeAddressAr(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </GlassContainer>

        {/* ALL WEBSITE COMPONENTS & UI TEXTS EDITOR */}
        <GlassContainer delay={0.12} className="p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[var(--tf-border)]">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[var(--tf-border)]"
                style={{
                  backgroundColor: `rgba(${currentAccentRgb}, 0.16)`,
                  color: currentAccentTextHex,
                }}
              >
                <Type className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)]">
                    {isArabic
                      ? 'تحرير نصوص جميع مكونات وأقسام الموقع'
                      : 'All Website Components & UI Copy Editor'}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-muted)]">
                    {totalCustomizedCount} / {SITE_TEXT_DEFINITIONS.length}{' '}
                    {isArabic ? 'معدل' : 'customized'}
                  </span>
                </div>
                <p className="text-xs text-[var(--tf-muted)] mt-0.5">
                  {isArabic
                    ? 'عدّل نصوص الشريط العلوي، والبحث، والوجهات، والتجارب، والاختبار، والتقييمات، وصفحة التفاصيل، والتذييل في أي وقت.'
                    : 'Edit labels, section headings, placeholders, cards, testimonials, booking forms, and footer copy across every section.'}
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search
                className={`w-3.5 h-3.5 text-[var(--tf-muted)] absolute top-1/2 -translate-y-1/2 ${
                  isRtl ? 'right-3' : 'left-3'
                }`}
              />
              <input
                type="text"
                value={textSearchQuery}
                onChange={(e) => setTextSearchQuery(e.target.value)}
                placeholder={
                  isArabic ? 'ابحث في نصوص المكونات...' : 'Search component labels or text...'
                }
                className={`w-full text-xs py-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none ${
                  isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
            </div>
          </div>

          {/* Section Switcher Tabs */}
          {!textSearchQuery.trim() && (
            <div className="flex flex-wrap gap-2">
              {SITE_TEXT_GROUPS.map((group) => {
                const isActive = group.id === activeTextGroup;
                const modCount = customizedCountByGroup[group.id] || 0;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveTextGroup(group.id)}
                    style={
                      isActive
                        ? {
                            backgroundColor: currentAccentHex,
                            color: currentAccentBtnTextHex,
                          }
                        : undefined
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                      isActive
                        ? 'border-transparent shadow-sm font-bold'
                        : 'bg-[var(--tf-surface-subtle)] border-[var(--tf-border)] text-[var(--tf-text)] hover:bg-[var(--tf-surface-hover)]'
                    }`}
                  >
                    <span>{isArabic ? group.titleAr : group.title}</span>
                    {modCount > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-black/15'
                            : 'bg-[var(--tf-input-bg)] text-[var(--tf-muted)]'
                        }`}
                      >
                        {modCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Group Info & Reset Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--tf-muted)]">
              <Globe className="w-4 h-4 shrink-0" style={{ color: currentAccentTextHex }} />
              <span>
                {textSearchQuery.trim()
                  ? isArabic
                    ? `نتائج البحث: ${visibleTextDefs.length} عنصر`
                    : `Search results: ${visibleTextDefs.length} matching text fields`
                  : isArabic
                  ? activeGroupMeta.descriptionAr
                  : activeGroupMeta.description}
              </span>
            </div>

            {!textSearchQuery.trim() && (customizedCountByGroup[activeTextGroup] || 0) > 0 && (
              <button
                type="button"
                onClick={() => handleResetGroup(activeTextGroup)}
                className="text-xs font-semibold text-[var(--tf-heading)] hover:opacity-80 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--tf-input-bg)] border border-[var(--tf-border)] cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {isArabic ? 'استعادة الافتراضي للقسم' : 'Reset Section to Defaults'}
                </span>
              </button>
            )}
          </div>

          {/* Bilingual Inputs Grid */}
          {visibleTextDefs.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--tf-muted)]">
              {isArabic
                ? 'لا توجد نصوص مطابقة لعبارة البحث.'
                : 'No website text fields match your search query.'}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleTextDefs.map((def) => {
                const modified = isFieldModified(def.key, def.defaultEn, def.defaultAr);
                const valEn = getDraftEn(def.key, def.defaultEn);
                const valAr = getDraftAr(def.key, def.defaultAr);

                return (
                  <div
                    key={def.key}
                    className="p-4 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[var(--tf-heading)]">
                          {isArabic ? def.labelAr : def.label}
                        </span>
                        <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--tf-input-bg)] border border-[var(--tf-border)] text-[var(--tf-muted)]">
                          {def.key}
                        </code>
                        {modified && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border border-[var(--tf-border)]"
                            style={{ color: currentAccentTextHex }}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {isArabic ? 'نص مخصص' : 'Customized'}
                          </span>
                        )}
                      </div>

                      {modified && (
                        <button
                          type="button"
                          onClick={() => handleResetField(def.key)}
                          className="text-[11px] font-semibold text-[var(--tf-muted)] hover:text-[var(--tf-heading)] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isArabic ? 'استعادة' : 'Reset'}</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                          {isArabic ? 'النص بالإنجليزية (EN)' : 'English Text (EN)'}
                        </label>
                        {def.multiline ? (
                          <textarea
                            rows={2}
                            dir="ltr"
                            value={valEn}
                            onChange={(e) =>
                              handleUpdateComponentText('en', def.key, e.target.value)
                            }
                            className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            dir="ltr"
                            value={valEn}
                            onChange={(e) =>
                              handleUpdateComponentText('en', def.key, e.target.value)
                            }
                            className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--tf-muted)] mb-1">
                          {isArabic ? 'النص بالعربية (AR)' : 'Arabic Text (AR)'}
                        </label>
                        {def.multiline ? (
                          <textarea
                            rows={2}
                            dir="rtl"
                            value={valAr}
                            onChange={(e) =>
                              handleUpdateComponentText('ar', def.key, e.target.value)
                            }
                            className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            dir="rtl"
                            value={valAr}
                            onChange={(e) =>
                              handleUpdateComponentText('ar', def.key, e.target.value)
                            }
                            className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassContainer>

        <div className="flex justify-end">
          <button
            type="submit"
            style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
            className="py-3 px-8 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-opacity hover:opacity-90 cursor-pointer"
          >
            {isArabic ? 'نشر تحديثات الموقع' : 'Publish Website Updates'}
          </button>
        </div>
      </form>
    </div>
  );
};

