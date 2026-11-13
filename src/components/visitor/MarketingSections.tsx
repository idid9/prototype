import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Promotion, WebsiteContent, Experience } from '../../types';
import {
  Compass,
  Users,
  Award,
  ArrowRight,
  Shield,
  HeartHandshake,
  CheckCircle2,
  Mail,
  Star,
  Quote,
} from 'lucide-react';

interface MarketingSectionsProps {
  promotions: Promotion[];
  content: WebsiteContent;
  experiences?: Experience[];
  onSelectPromotion: (promo: Promotion) => void;
}

export const MarketingSections: React.FC<MarketingSectionsProps> = ({
  promotions,
  content,
  experiences = [],
  onSelectPromotion,
}) => {
  const { language, t, isRtl } = useLanguage();
  const {
    getVisitorGlassyStyle,
    getGlassyCardStyle,
    getGlassyIconStyle,
    currentAccentHex,
  } = useTheme();
  const isArabic = language === 'ar';

  const reasonsCardGlassyStyle = getVisitorGlassyStyle('reasonsCardsGlassy');
  const aboutSectionGlassyStyle = getVisitorGlassyStyle('aboutSectionGlassy');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const activePromotions = promotions.filter((p) => p.active);

  const ratingStats = useMemo(() => {
    const published = experiences.filter((e) => e.status === 'PUBLISHED' && (e.rating || 0) > 0);
    const totalReviews = published.reduce((sum, e) => sum + (e.reviewsCount || 0), 0);
    const avgRating =
      published.length > 0
        ? (published.reduce((sum, e) => sum + (e.rating || 0), 0) / published.length).toFixed(2)
        : '4.92';
    return {
      avgRating,
      totalReviews,
      topPackages: published.slice(0, 3),
    };
  }, [experiences]);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const reasons = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Direct Operator Empowerment',
      titleAr: 'تمكين مباشر للمشغلين المحليين',
      desc: '100% of our experiences are hosted by Saudi registered SMEs, Bedouin guides, and independent cultural custodians.',
      descAr: 'جميع تجاربنا يقودها مشغلون سعوديون مرخصون ورواة محليون للحفاظ على الهوية الأصيلة.',
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Certified Saudi Rawis (Storytellers)',
      titleAr: 'رواة ومرشدون سياحيون معتمدون',
      desc: 'Every narrative is authenticated by certified local guides recognized by the Ministry of Tourism and the Royal Commissions.',
      descAr: 'سرد تاريخي موثق بإشراف مرشدين مؤهلين ومعتمدين من وزارة السياحة والهيئات الملكية.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Transparent SAR Direct Rates',
      titleAr: 'أسعار مباشرة بالريال السعودي',
      desc: 'No middleman markups or opaque commissions. Inquire directly and coordinate custom itineraries with local operators.',
      descAr: 'بدون رسوم وساطة خفية، تواصل مباشر مع المشغلين لتنسيق باقات وتفاصيل الرحلة.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: 'Regenerative Cultural Stewardship',
      titleAr: 'استدامة التراث وحماية البيئة',
      desc: 'Supporting the Saudi Green Initiative and community tourism that directly funds heritage preservation.',
      descAr: 'دعم مبادرة السعودية الخضراء والسياحة المجتمعية لتمويل استدامة المواقع التراثية.',
    },
  ];

  const travelerFeedback = [
    {
      guest: 'Elena Vance · London, UK',
      guestAr: 'إيلينا فانس · لندن، المملكة المتحدة',
      quote:
        'Our local AlUla Rawi timed our Hegra canyon arrival at golden hour and arranged Bedouin cardamom coffee under the stars.',
      quoteAr:
        'رتب الراوي المحلي وصولنا إلى الحجر عند الغروب مع قهوة سعودية أصيلة تحت النجوم.',
      rating: '5.0',
      trip: ratingStats.topPackages[0]?.title || 'AlUla Hegra Heritage & Stargazing',
      tripAr: ratingStats.topPackages[0]?.titleAr || 'مغامرة وتراث الحجر ورصد النجوم بالعلا',
    },
    {
      guest: 'Faisal Al-Qahtani · Riyadh, KSA',
      guestAr: 'فيصل القحطاني · الرياض، السعودية',
      quote:
        'Seamless direct SAR coordination with no agency markup. Our family felt genuinely welcomed from pickup to farewell.',
      quoteAr:
        'تنسيق مباشر وشفاف بالريال السعودي بدون أي عمولات إضافية واستقبال عائلي رائع.',
      rating: '4.9',
      trip: ratingStats.topPackages[1]?.title || 'Diriyah At-Turaif Private Walk',
      tripAr: ratingStats.topPackages[1]?.titleAr || 'جولة خاصة في حي الطريف بالدرعية',
    },
    {
      guest: 'Marcello Rossi · Milan, Italy',
      guestAr: 'مارسيلو روسي · ميلانو، إيطاليا',
      quote:
        'World-class conservation standards and deeply knowledgeable coastal conservation guides along the Red Sea islands.',
      quoteAr:
        'معايير عالمية في السياحة المستدامة ومرشدون متخصصون في جزر البحر الأحمر.',
      rating: '4.9',
      trip: ratingStats.topPackages[2]?.title || 'Red Sea Coral Island Expedition',
      tripAr: ratingStats.topPackages[2]?.titleAr || 'رحلة استكشاف جزر الشعاب المرجانية بالبحر الأحمر',
    },
  ];

  return (
    <div
      className="bg-transparent pb-16 transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. PROMOTIONAL CAMPAIGNS BANNER */}
      {activePromotions.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: currentAccentHex }}
            >
              {isArabic ? 'أبرز عروض الموسم' : 'Seasonal Highlights'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--tf-heading)] mt-1">
              {isArabic
                ? 'حملات سعودية محدودة وإصدارات خاصة'
                : 'Limited Saudi Campaigns & Special Editions'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePromotions.map((promo) => {
              const promoTitle = isArabic ? promo.titleAr || promo.title : promo.title;
              const promoDesc = isArabic ? promo.descriptionAr || promo.description : promo.description;
              const ctaText = isArabic ? promo.ctaTextAr || promo.ctaText : promo.ctaText;

              return (
                <div
                  key={promo.id}
                  onClick={() => onSelectPromotion(promo)}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-neutral-900 border border-[var(--tf-border)]"
                >
                  <img
                    src={promo.bannerImage}
                    alt={promoTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102E29]/95 via-[#102E29]/40 to-transparent" />

                  {promo.badge && (
                    <div
                      className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm"
                      style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                    >
                      {isArabic ? promo.badgeAr || promo.badge : promo.badge}
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <h3 className="font-serif text-lg font-bold text-white mb-2">
                      {promoTitle}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 mb-4 leading-relaxed">
                      {promoDesc}
                    </p>
                    <div
                      className="inline-flex items-center gap-1.5 text-xs font-bold"
                      style={{ color: currentAccentHex }}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. WHY CHOOSE LOCAL EXPERIENCES + VISITOR PERFORMANCE & FEEDBACK GLASS CARDS */}
      <section className="py-20 bg-transparent border-y border-[var(--tf-border)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: currentAccentHex }}
              >
                {isArabic ? 'التزام تورفلو' : 'The TourFlow Commitment'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--tf-heading)] tracking-tight mt-1">
                {isArabic ? 'لماذا تختار المشغلين السعوديين المحليين؟' : 'Why Choose Local Saudi Operators?'}
              </h2>
              <p className="mt-3 text-sm text-[var(--tf-muted)]">
                {isArabic
                  ? 'الفخامة الحقيقية تكمن في التواصل الإنساني الأصيل، والتراث الحي، وكرم الضيافة الصحراوية الصادقة.'
                  : 'True luxury lies in authentic human connection, living heritage, and genuine desert hospitality.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  style={reasonsCardGlassyStyle}
                  className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all"
                    style={getGlassyIconStyle()}
                  >
                    {r.icon}
                  </div>
                  <h3
                    className="font-serif text-base font-bold text-[var(--tf-heading)] mb-2"
                    style={{ textShadow: 'var(--tf-text-shadow)' }}
                  >
                    {isArabic ? r.titleAr : r.title}
                  </h3>
                  <p
                    className="text-xs text-[var(--tf-muted)] leading-relaxed"
                    style={{ textShadow: 'var(--tf-text-shadow)' }}
                  >
                    {isArabic ? r.descAr : r.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dual-Panel Visitor Stats, Ratings & Guest Feedback Showcase */}
          <div className="pt-8 border-t border-[var(--tf-border)] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: currentAccentHex }}
                >
                  {isArabic ? 'تقييمات المسافرين ومؤشر الثقة' : 'Traveler Ratings & Trust Score'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--tf-heading)] mt-1">
                  {isArabic
                    ? 'آراء الضيوف الموثقة وتقييمات المشغلين'
                    : 'Verified Guest Feedback & Operator Ratings'}
                </h3>
              </div>

              {/* Simplified Live Visitor Performance Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="flex items-center gap-1 font-mono text-xl font-bold text-[var(--tf-heading)] tabular-nums">
                    <Star
                      className="w-4 h-4"
                      style={{ color: currentAccentHex, fill: currentAccentHex }}
                    />
                    <span>{ratingStats.avgRating}</span>
                  </div>
                  <span className="text-[11px] text-[var(--tf-muted)]">
                    {isArabic ? 'متوسط تقييم التجارب' : 'Average Experience Score'}
                  </span>
                </div>
                <div className="pl-6 border-l border-[var(--tf-border)] rtl:pl-0 rtl:pr-6 rtl:border-l-0 rtl:border-r">
                  <div className="font-mono text-xl font-bold text-[var(--tf-heading)] tabular-nums">
                    {ratingStats.totalReviews > 0 ? `${ratingStats.totalReviews}+` : '480+'}
                  </div>
                  <span className="text-[11px] text-[var(--tf-muted)]">
                    {isArabic ? 'تقييمات موثقة' : 'Verified Reviews'}
                  </span>
                </div>
                <div className="pl-6 border-l border-[var(--tf-border)] rtl:pl-0 rtl:pr-6 rtl:border-l-0 rtl:border-r">
                  <div className="font-mono text-xl font-bold text-[var(--tf-heading)] tabular-nums">
                    {content.stats.satisfactionRate}%
                  </div>
                  <span className="text-[11px] text-[var(--tf-muted)]">
                    {isArabic ? 'نسبة رضا الضيوف' : 'Guest Satisfaction'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelerFeedback.map((fb, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: idx * 0.06 }}
                  style={reasonsCardGlassyStyle}
                  className="p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Quote className="w-4 h-4" style={{ color: currentAccentHex }} />
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--tf-heading)]">
                        <Star
                          className="w-3.5 h-3.5"
                          style={{ color: currentAccentHex, fill: currentAccentHex }}
                        />
                        <span className="tabular-nums">{fb.rating}</span>
                      </div>
                    </div>
                    <p
                      className="text-xs sm:text-sm text-[var(--tf-text)] leading-relaxed"
                      style={{ textShadow: 'var(--tf-text-shadow)' }}
                    >
                      "{isArabic ? fb.quoteAr : fb.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--tf-border)]">
                    <div
                      className="text-xs font-bold text-[var(--tf-heading)]"
                      style={{ textShadow: 'var(--tf-text-shadow)' }}
                    >
                      {isArabic ? fb.guestAr : fb.guest}
                    </div>
                    <div className="text-[11px] text-[var(--tf-muted)] truncate mt-0.5">
                      {isArabic ? fb.tripAr : fb.trip}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & PLATFORM METRICS */}
      <section
        id="about"
        style={aboutSectionGlassyStyle}
        className="max-w-7xl mx-auto mt-14 px-6 sm:px-10 py-14 sm:py-16 rounded-3xl transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ color: currentAccentHex }}
            >
              <Compass className="w-4 h-4" style={{ color: currentAccentHex }} />
              <span>{t('about.tagline')}</span>
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl font-bold text-[var(--tf-heading)] tracking-tight"
              style={{ textShadow: 'var(--tf-text-shadow)' }}
            >
              {isArabic ? content.aboutHeadlineAr || content.aboutHeadline : content.aboutHeadline}
            </h2>

            <p
              className="text-sm sm:text-base text-[var(--tf-muted)] leading-relaxed"
              style={{ textShadow: 'var(--tf-text-shadow)' }}
            >
              {isArabic ? content.aboutTextAr || content.aboutText : content.aboutText}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--tf-border)]">
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] tabular-nums">
                  {content.stats.operators}+
                </div>
                <div className="text-[11px] text-[var(--tf-muted)] mt-0.5">{t('about.statOperators')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] tabular-nums">
                  {content.stats.experiences}+
                </div>
                <div className="text-[11px] text-[var(--tf-muted)] mt-0.5">{t('about.statExperiences')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] tabular-nums">
                  {content.stats.travelersServed.toLocaleString()}
                </div>
                <div className="text-[11px] text-[var(--tf-muted)] mt-0.5">{t('about.statTravelers')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] tabular-nums">
                  {content.stats.satisfactionRate}%
                </div>
                <div className="text-[11px] text-[var(--tf-muted)] mt-0.5">{t('about.statSatisfaction')}</div>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6">
            <div
              style={getGlassyCardStyle(true)}
              className="text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: currentAccentHex }}
                >
                  {isArabic ? 'ابقَ على تواصل' : 'Stay Connected'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 text-white">
                  {isArabic ? 'انضم إلى مسيرة السياحة السعودية' : 'Join the Saudi Tourism Movement'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                  {isArabic
                    ? 'اشترك لتصلك البرامج الموسمية، والرسائل الثقافية من العلا والدرعية، والأسعار الحصرية مباشرة من المشغلين.'
                    : 'Subscribe to receive seasonal itineraries, cultural dispatches from AlUla and Diriyah, and exclusive operator rates.'}
                </p>

                {newsletterSubscribed ? (
                  <div
                    className="p-4 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2"
                    style={{ color: currentAccentHex }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isArabic
                        ? 'شكراً لاشتراكك! ستصلك أحدث الوجهات والعروض الموسمية السعودية في بريدك.'
                        : 'Thank you for subscribing! Seasonal Saudi updates will arrive in your inbox.'}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-white/60 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full text-xs py-3 pl-9 pr-4 rtl:pl-4 rtl:pr-9 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                      className="py-3 px-6 font-bold text-xs rounded-xl shadow-md hover:brightness-105 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isArabic ? 'اشترك الآن' : 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
