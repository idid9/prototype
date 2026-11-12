import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Promotion, WebsiteContent } from '../../types';
import {
  Compass,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  Shield,
  HeartHandshake,
  CheckCircle2,
  Mail,
} from 'lucide-react';

interface MarketingSectionsProps {
  promotions: Promotion[];
  content: WebsiteContent;
  onSelectPromotion: (promo: Promotion) => void;
}

export const MarketingSections: React.FC<MarketingSectionsProps> = ({
  promotions,
  content,
  onSelectPromotion,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const activePromotions = promotions.filter((p) => p.active);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const reasons = [
    {
      icon: <Users className="w-5 h-5 text-[#C6A46B]" />,
      title: 'Direct Operator Empowerment',
      titleAr: 'تمكين مباشر للمشغلين المحليين',
      desc: '100% of our experiences are hosted by Saudi registered SMEs, Bedouin guides, and independent cultural custodians.',
      descAr: 'جميع تجاربنا يقودها مشغلون سعوديون مرخصون ورواة محليون للحفاظ على الهوية الأصيلة.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#C6A46B]" />,
      title: 'Certified Saudi Rawis (Storytellers)',
      titleAr: 'رواة ومرشدون سياحيون معتمدون',
      desc: 'Every narrative is authenticated by certified local guides recognized by the Ministry of Tourism and the Royal Commissions.',
      descAr: 'سرد تاريخي موثق بإشراف مرشدين مؤهلين ومعتمدين من وزارة السياحة والهيئات الملكية.',
    },
    {
      icon: <Shield className="w-5 h-5 text-[#C6A46B]" />,
      title: 'Transparent SAR Direct Rates',
      titleAr: 'أسعار مباشرة بالريال السعودي',
      desc: 'No middleman markups or opaque commissions. Inquire directly and coordinate custom itineraries with local operators.',
      descAr: 'بدون رسوم وساطة خفية، تواصل مباشر مع المشغلين لتنسيق باقات وتفاصيل الرحلة.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#C6A46B]" />,
      title: 'Regenerative Cultural Stewardship',
      titleAr: 'استدامة التراث وحماية البيئة',
      desc: 'Supporting the Saudi Green Initiative and community tourism that directly funds heritage preservation.',
      descAr: 'دعم مبادرة السعودية الخضراء والسياحة المجتمعية لتمويل استدامة المواقع التراثية.',
    },
  ];

  return (
    <div className="bg-[#F6F4EF]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. PROMOTIONAL CAMPAIGNS BANNER */}
      {activePromotions.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A46B]">
              Seasonal Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B32]">
              Limited Saudi Campaigns & Special Editions
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
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
                >
                  <img
                    src={promo.bannerImage}
                    alt={promoTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102E29]/95 via-[#102E29]/40 to-transparent" />

                  {/* Badge */}
                  {promo.badge && (
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-[11px] font-bold text-[#123B32] bg-[#D9C29A] px-2.5 py-1 rounded-md shadow-sm">
                      {isArabic ? promo.badgeAr || promo.badge : promo.badge}
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D9C29A] transition-colors mb-2">
                      {promoTitle}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 mb-4 leading-relaxed">
                      {promoDesc}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9C29A]">
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

      {/* 2. WHY CHOOSE LOCAL EXPERIENCES */}
      <section className="py-20 bg-white border-y border-[#D9C29A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A46B]">
              The TourFlow Commitment
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B32] tracking-tight mt-1">
              Why Choose Local Saudi Operators?
            </h2>
            <p className="mt-3 text-sm text-[#777D75]">
              True luxury lies in authentic human connection, living heritage, and genuine desert hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="p-6 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-2xl hover:border-[#123B32] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#123B32] flex items-center justify-center mb-4 shadow-sm">
                  {r.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#123B32] mb-2">
                  {isArabic ? r.titleAr : r.title}
                </h3>
                <p className="text-xs text-[#777D75] leading-relaxed">
                  {isArabic ? r.descAr : r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & PLATFORM METRICS */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C6A46B]">
              <Compass className="w-4 h-4 text-[#123B32]" />
              <span>{t('about.tagline')}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B32] tracking-tight">
              {isArabic ? content.aboutHeadlineAr || content.aboutHeadline : content.aboutHeadline}
            </h2>

            <p className="text-sm sm:text-base text-[#777D75] leading-relaxed">
              {isArabic ? content.aboutTextAr || content.aboutText : content.aboutText}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#D9C29A]/40">
              <div>
                <div className="font-mono text-2xl font-bold text-[#123B32] tabular-nums">
                  {content.stats.operators}+
                </div>
                <div className="text-[11px] text-[#777D75] mt-0.5">{t('about.statOperators')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#123B32] tabular-nums">
                  {content.stats.experiences}+
                </div>
                <div className="text-[11px] text-[#777D75] mt-0.5">{t('about.statExperiences')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#123B32] tabular-nums">
                  {content.stats.travelersServed.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#777D75] mt-0.5">{t('about.statTravelers')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#123B32] tabular-nums">
                  {content.stats.satisfactionRate}%
                </div>
                <div className="text-[11px] text-[#777D75] mt-0.5">{t('about.statSatisfaction')}</div>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#123B32] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D9C29A] mb-2 block">
                  Stay Connected
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 text-white">
                  Join the Saudi Tourism Movement
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                  Subscribe to receive seasonal itineraries, cultural dispatches from AlUla and Diriyah, and exclusive operator rates.
                </p>

                {newsletterSubscribed ? (
                  <div className="p-4 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-[#D9C29A]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Thank you for subscribing! Seasonal Saudi updates will arrive in your inbox.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-white/60 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full text-xs py-3 pl-9 pr-4 rtl:pl-4 rtl:pr-9 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#D9C29A]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-3 px-6 bg-[#C6A46B] hover:bg-[#D9C29A] text-[#102E29] font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Subscribe
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
