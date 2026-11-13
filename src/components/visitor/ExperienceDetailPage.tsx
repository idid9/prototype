import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Experience, WebsiteContent, Coupon } from '../../types';
import { DataService } from '../../services/dataService';
import {
  Clock,
  MapPin,
  Check,
  X,
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Share2,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface ExperienceDetailPageProps {
  experience: Experience;
  websiteContent: WebsiteContent;
  coupons?: Coupon[];
  currency?: string;
  onBack: () => void;
  onExperienceBooked?: (inquiryId: string) => void;
}

export const ExperienceDetailPage: React.FC<ExperienceDetailPageProps> = ({
  experience,
  websiteContent,
  coupons = [],
  currency = 'SAR',
  onBack,
  onExperienceBooked,
}) => {
  const { language, t, isRtl } = useLanguage();
  const { getGlassyCardStyle, currentAccentHex, isDarkGlass } = useTheme();
  const isArabic = language === 'ar';

  const cardStyle = getGlassyCardStyle();
  const optionClass = isDarkGlass ? 'bg-[#102420] text-white' : 'bg-white text-[#202923]';

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState('');

  // Promo code & share state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const appliedCoupon = appliedCouponCode
    ? coupons.find((c) => c.code.toUpperCase() === appliedCouponCode && c.active) || null
    : null;

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const title = isArabic ? experience.titleAr : experience.title;
  const description = isArabic ? experience.descriptionAr : experience.description;
  const duration = isArabic ? experience.durationAr : experience.duration;
  const highlights = isArabic ? experience.highlightsAr : experience.highlights;
  const inclusions = isArabic ? experience.inclusionsAr : experience.inclusions;
  const exclusions = isArabic ? experience.exclusionsAr : experience.exclusions;
  const meetingPoint = isArabic ? experience.meetingPointAr : experience.meetingPoint;

  const galleryImages = experience.gallery && experience.gallery.length > 0
    ? experience.gallery
    : [experience.coverImage];

  const baseTotal = experience.price * guests;
  const discountValue = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((baseTotal * appliedCoupon.discountAmount) / 100)
      : Math.min(baseTotal, appliedCoupon.discountAmount)
    : 0;
  const finalEstimatedValue = Math.max(0, baseTotal - discountValue);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setAppliedCouponCode(null);
      setPromoFeedback('');
      return;
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setAppliedCouponCode(null);
      setPromoFeedback('Invalid or inactive promo code.');
      return;
    }
    setAppliedCouponCode(found.code.toUpperCase());
    setPromoFeedback(
      `Applied ${found.code}: ${
        found.discountType === 'percentage'
          ? `${found.discountAmount}% off`
          : `${found.discountAmount} ${currency} off`
      }`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !preferredDate) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newInquiry = DataService.createInquiry({
        customerName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        experienceId: experience.id,
        experienceTitle: experience.title,
        preferredDate,
        guests,
        message: message.trim(),
        estimatedValue: finalEstimatedValue,
        appliedCouponCode: appliedCoupon?.code,
      });

      setIsSubmitting(false);
      setSubmittedInquiryId(newInquiry.id);
      if (onExperienceBooked) {
        onExperienceBooked(newInquiry.id);
      }
    } catch {
      setIsSubmitting(false);
      setFormError('Failed to record inquiry. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const cleanWhatsappNumber = (websiteContent.whatsappNumber || '+966508887766').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hello TourFlow, I am inquiring about reference ${submittedInquiryId || experience.title}.`
  )}`;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 text-[var(--tf-text)]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--tf-heading)] hover:opacity-80 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" style={{ color: currentAccentHex }} />
            <span>Back to Experiences</span>
          </button>

          <button
            onClick={handleShare}
            style={cardStyle}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--tf-heading)] px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            {copiedShare ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Share2 className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
            )}
            <span>{copiedShare ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Title & Metadata Zone */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--tf-muted)] mb-2 font-medium">
            <span className="font-bold" style={{ color: currentAccentHex }}>
              {experience.destinationName}
            </span>
            <span aria-hidden="true">/</span>
            <span>{isArabic ? experience.categoryAr : experience.category}</span>
            <span aria-hidden="true">/</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: currentAccentHex }} />
              <span>{duration}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--tf-heading)] tracking-tight mb-4">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--tf-muted)]">
            <MapPin className="w-4 h-4" style={{ color: currentAccentHex }} />
            <span>{meetingPoint}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
          {/* Main Large Image */}
          <div className="lg:col-span-9 h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-md bg-neutral-900 border border-[var(--tf-border)]">
            <img
              src={galleryImages[selectedGalleryIdx] || experience.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGalleryIdx(idx)}
                style={
                  selectedGalleryIdx === idx
                    ? { borderColor: currentAccentHex }
                    : undefined
                }
                className={`relative h-24 sm:h-28 lg:h-[114px] w-36 lg:w-full shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedGalleryIdx === idx ? 'opacity-100 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Gallery preview" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content & Sticky Booking Card Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overview */}
            <div style={cardStyle} className="p-6 sm:p-7 rounded-2xl">
              <h2 className="font-serif text-2xl font-bold text-[var(--tf-heading)] mb-4">
                {t('details.overview')}
              </h2>
              <p className="text-sm sm:text-base text-[var(--tf-text)] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div style={cardStyle} className="p-6 rounded-2xl">
                <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)] mb-4">
                  {t('details.highlights')}
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--tf-text)]">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included / Not Included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div style={cardStyle} className="p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-[var(--tf-heading)] uppercase tracking-wider mb-3">
                  {t('details.included')}
                </h4>
                <ul className="space-y-2 text-xs text-[var(--tf-text)]">
                  {inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div style={cardStyle} className="p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-[var(--tf-heading)] uppercase tracking-wider mb-3">
                  {t('details.notIncluded')}
                </h4>
                <ul className="space-y-2 text-xs text-[var(--tf-muted)]">
                  {exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-[var(--tf-muted)] shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Location & Meeting Point */}
            <div style={cardStyle} className="p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] mb-2">
                {t('details.meetingPoint')}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--tf-muted)] mb-2">{meetingPoint}</p>
              <div className="inline-flex items-center gap-2 text-xs text-[var(--tf-heading)] font-semibold">
                <ShieldCheck className="w-4 h-4" style={{ color: currentAccentHex }} />
                <span>Verified Saudi Ministry of Tourism Operator</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking / Inquiry Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div style={cardStyle} className="text-[var(--tf-text)] rounded-2xl p-6 sm:p-8">
              {/* Card Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-[var(--tf-border)] mb-6">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--tf-muted)] uppercase tracking-wider">
                    Official Rate
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--tf-heading)] tabular-nums">
                      {experience.price}
                    </span>
                    <span className="text-sm font-bold" style={{ color: currentAccentHex }}>
                      {currency}
                    </span>
                    <span className="text-xs text-[var(--tf-muted)]">/ guest</span>
                  </div>
                </div>

                <div className="text-end">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: currentAccentHex }}
                  >
                    Instant Operator Direct
                  </span>
                </div>
              </div>

              {/* SUCCESS CONFIRMATION STATE */}
              {submittedInquiryId ? (
                <div className="text-center py-4 space-y-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)]">
                    {t('details.bookingCard.successTitle')}
                  </h3>
                  <p className="text-xs text-[var(--tf-muted)] leading-relaxed">
                    {t('details.bookingCard.successMsg')}
                  </p>

                  <div className="p-3 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs font-mono">
                    <span className="text-[var(--tf-muted)] block mb-0.5">
                      {t('details.bookingCard.inquiryId')}
                    </span>
                    <span className="font-bold text-[var(--tf-heading)] text-sm">{submittedInquiryId}</span>
                  </div>

                  {/* WhatsApp Direct Option */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('details.bookingCard.whatsapp')}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmittedInquiryId(null);
                      onBack();
                    }}
                    className="w-full py-2 text-xs font-semibold text-[var(--tf-heading)] hover:underline cursor-pointer"
                  >
                    {t('details.bookingCard.close')}
                  </button>
                </div>
              ) : (
                /* INQUIRY FORM */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)]">
                    {t('details.bookingCard.title')}
                  </h3>
                  <p className="text-xs text-[var(--tf-muted)]">
                    {t('details.bookingCard.sub')}
                  </p>

                  {formError && (
                    <div className="p-2.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                      {t('details.bookingCard.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faisal Al-Harbi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder-[var(--tf-muted)] focus:outline-none"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                        {t('details.bookingCard.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="faisal@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder-[var(--tf-muted)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                        {t('details.bookingCard.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+966 50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder-[var(--tf-muted)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                        {t('details.bookingCard.date')} *
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        style={{ colorScheme: isDarkGlass ? 'dark' : 'light' }}
                        className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                        {t('details.bookingCard.guests')}
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                          <option key={num} value={num} className={optionClass}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                      {t('details.bookingCard.message')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any anniversary celebration, private driver preference, or dietary requirements?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder-[var(--tf-muted)] focus:outline-none"
                    />
                  </div>

                  {/* Promo Code (Live Synced with Admin Promotions) */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                      Promo Voucher Code (Optional)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          className="w-3.5 h-3.5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2"
                          style={{ color: currentAccentHex }}
                        />
                        <input
                          type="text"
                          placeholder="e.g. FOUNDING2026"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="w-full text-xs py-2 pl-8 pr-3 rtl:pl-3 rtl:pr-8 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder-[var(--tf-muted)] font-mono uppercase focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 py-2 bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] border border-[var(--tf-border)] text-[var(--tf-heading)] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoFeedback && (
                      <p
                        className={`text-[11px] mt-1 font-semibold ${
                          appliedCoupon ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {promoFeedback}
                      </p>
                    )}
                  </div>

                  {/* Total Estimate */}
                  <div className="p-3 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl space-y-1 text-xs">
                    {discountValue > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-500 font-semibold">
                        <span>Promo Discount ({appliedCoupon?.code})</span>
                        <span className="tabular-nums">-{discountValue.toLocaleString()} {currency}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--tf-muted)]">Estimated Package Value:</span>
                      <span
                        className="font-mono font-bold text-sm tabular-nums"
                        style={{ color: currentAccentHex }}
                      >
                        {finalEstimatedValue.toLocaleString()} {currency}
                      </span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                    className="w-full py-3 px-4 disabled:opacity-50 rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-md hover:brightness-105 transition-all cursor-pointer"
                  >
                    {isSubmitting
                      ? t('details.bookingCard.submitting')
                      : t('details.bookingCard.submit')}
                  </button>

                  <div className="text-[11px] text-center text-[var(--tf-muted)] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                    <span>Free inquiry · No upfront payment required</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
