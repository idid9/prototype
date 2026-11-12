import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Experience, WebsiteContent } from '../../types';
import { DataService } from '../../services/dataService';
import {
  Clock,
  MapPin,
  Check,
  X,
  ArrowLeft,
  Calendar,
  Users,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Share2,
  AlertCircle,
} from 'lucide-react';

interface ExperienceDetailPageProps {
  experience: Experience;
  websiteContent: WebsiteContent;
  onBack: () => void;
  onExperienceBooked?: (inquiryId: string) => void;
}

export const ExperienceDetailPage: React.FC<ExperienceDetailPageProps> = ({
  experience,
  websiteContent,
  onBack,
  onExperienceBooked,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !preferredDate) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedValue = experience.price * guests;
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
        estimatedValue,
      });

      setIsSubmitting(false);
      setSubmittedInquiryId(newInquiry.id);
      if (onExperienceBooked) {
        onExperienceBooked(newInquiry.id);
      }
    } catch (err) {
      setIsSubmitting(false);
      setFormError('Failed to record inquiry. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Experience link copied to clipboard!');
    }
  };

  const cleanWhatsappNumber = (websiteContent.whatsappNumber || '+966508887766').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hello TourFlow, I am inquiring about reference ${submittedInquiryId || experience.title}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F6F4EF] pt-24 pb-20 text-[#202923]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#123B32] hover:text-[#C6A46B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>Back to Experiences</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-[#777D75] hover:text-[#123B32] px-3 py-1.5 rounded-lg border border-[#D9C29A]/50 bg-white cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Title & Metadata Zone */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#777D75] mb-2 font-medium">
            <span className="text-[#123B32] font-bold">{experience.destinationName}</span>
            <span aria-hidden="true">/</span>
            <span>{isArabic ? experience.categoryAr : experience.category}</span>
            <span aria-hidden="true">/</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#123B32]" />
              <span>{duration}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#123B32] tracking-tight mb-4">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777D75]">
            <MapPin className="w-4 h-4 text-[#C6A46B]" />
            <span>{meetingPoint}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
          {/* Main Large Image */}
          <div className="lg:col-span-9 h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-md bg-neutral-900">
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
                className={`relative h-24 sm:h-28 lg:h-[114px] w-36 lg:w-full shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedGalleryIdx === idx ? 'border-[#123B32] ring-2 ring-[#123B32]/30' : 'border-transparent opacity-75 hover:opacity-100'
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
          <div className="lg:col-span-7 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#123B32] mb-4">
                {t('details.overview')}
              </h2>
              <p className="text-sm sm:text-base text-[#202923] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="p-6 bg-white border border-[#D9C29A]/50 rounded-2xl shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#123B32] mb-4">
                  {t('details.highlights')}
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#202923]">
                      <div className="w-5 h-5 rounded-full bg-[#123B32]/10 text-[#123B32] flex items-center justify-center shrink-0 mt-0.5">
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
              <div className="p-6 bg-white border border-[#D9C29A]/40 rounded-2xl">
                <h4 className="text-sm font-bold text-[#123B32] uppercase tracking-wider mb-3">
                  {t('details.included')}
                </h4>
                <ul className="space-y-2 text-xs text-[#202923]">
                  {inclusions?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-6 bg-white border border-[#D9C29A]/40 rounded-2xl">
                <h4 className="text-sm font-bold text-[#123B32] uppercase tracking-wider mb-3">
                  {t('details.notIncluded')}
                </h4>
                <ul className="space-y-2 text-xs text-[#777D75]">
                  {exclusions?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Location & Meeting Point */}
            <div className="p-6 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-[#123B32] mb-2">
                {t('details.meetingPoint')}
              </h3>
              <p className="text-xs sm:text-sm text-[#777D75] mb-2">{meetingPoint}</p>
              <div className="inline-flex items-center gap-2 text-xs text-[#123B32] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#C6A46B]" />
                <span>Verified Saudi Ministry of Tourism Operator</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking / Inquiry Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="glass-panel text-[#202923] border border-[#D9C29A]/60 rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* Card Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
                <div>
                  <div className="text-[11px] font-semibold text-[#777D75] uppercase tracking-wider">
                    Official Rate
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#123B32]">
                      {experience.price}
                    </span>
                    <span className="text-sm font-bold text-[#C6A46B]">SAR</span>
                    <span className="text-xs text-[#777D75]">/ guest</span>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Instant Operator Direct
                  </div>
                </div>
              </div>

              {/* SUCCESS CONFIRMATION STATE */}
              {submittedInquiryId ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#123B32] text-[#D9C29A] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#123B32]">
                    {t('details.bookingCard.successTitle')}
                  </h3>
                  <p className="text-xs text-[#777D75] leading-relaxed">
                    {t('details.bookingCard.successMsg')}
                  </p>

                  <div className="p-3 bg-white border border-[#D9C29A]/50 rounded-xl text-xs font-mono">
                    <span className="text-[#777D75] block mb-0.5">{t('details.bookingCard.inquiryId')}</span>
                    <span className="font-bold text-[#123B32] text-sm">{submittedInquiryId}</span>
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
                    className="w-full py-2 text-xs font-semibold text-[#123B32] hover:underline cursor-pointer"
                  >
                    {t('details.bookingCard.close')}
                  </button>
                </div>
              ) : (
                /* INQUIRY FORM */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#123B32]">
                    {t('details.bookingCard.title')}
                  </h3>
                  <p className="text-xs text-[#777D75]">
                    {t('details.bookingCard.sub')}
                  </p>

                  {formError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#123B32] mb-1">
                      {t('details.bookingCard.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faisal Al-Harbi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#123B32] mb-1">
                        {t('details.bookingCard.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="faisal@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#123B32] mb-1">
                        {t('details.bookingCard.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+966 50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                      />
                    </div>
                  </div>

                  {/* Date & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#123B32] mb-1">
                        {t('details.bookingCard.date')} *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#123B32] mb-1">
                        {t('details.bookingCard.guests')}
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#123B32] mb-1">
                      {t('details.bookingCard.message')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any anniversary celebration, private driver preference, or dietary requirements?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-[#D9C29A]/60 rounded-xl text-[#202923] focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                    />
                  </div>

                  {/* Total Estimate */}
                  <div className="p-3 bg-white/70 border border-[#D9C29A]/40 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-[#777D75]">Estimated Package Value:</span>
                    <span className="font-mono font-bold text-sm text-[#123B32]">
                      {(experience.price * guests).toLocaleString()} SAR
                    </span>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#123B32] hover:bg-[#1D5546] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all cursor-pointer"
                  >
                    {isSubmitting
                      ? t('details.bookingCard.submitting')
                      : t('details.bookingCard.submit')}
                  </button>

                  <div className="text-[11px] text-center text-[#777D75] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#123B32]" />
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
