import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Promotion, Coupon, Experience, Destination } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { ImageUploadField } from '../../common/ImageUploadField';
import { localizeCurrency } from '../../../utils/localization';
import { Plus, Edit2, X, Eye, EyeOff } from 'lucide-react';

interface PromotionsTabProps {
  promotions: Promotion[];
  coupons: Coupon[];
  experiences: Experience[];
  destinations: Destination[];
}

export const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  coupons,
}) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

  // Campaign fields
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [bannerImage, setBannerImage] = useState(IMAGES.heroAlUla);
  const [ctaText, setCtaText] = useState('Explore Offer');
  const [ctaTextAr, setCtaTextAr] = useState('استكشف العرض');
  const [ctaLink, setCtaLink] = useState('#experiences');
  const [badge, setBadge] = useState('Seasonal Offer');
  const [badgeAr, setBadgeAr] = useState('عرض الموسم');
  const [active, setActive] = useState(true);

  // Coupon creator fields
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponAmount, setNewCouponAmount] = useState(15);

  const handleOpenCreate = () => {
    setEditingPromoId(null);
    setTitle('');
    setTitleAr('');
    setDescription('');
    setDescriptionAr('');
    setBannerImage(IMAGES.heroAlUla);
    setCtaText('Explore Campaign');
    setCtaTextAr('استكشف الحملة');
    setCtaLink('#experiences');
    setBadge('Special Edition');
    setBadgeAr('نسخة خاصة');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Promotion) => {
    setEditingPromoId(p.id);
    setTitle(p.title);
    setTitleAr(p.titleAr || p.title);
    setDescription(p.description);
    setDescriptionAr(p.descriptionAr || p.description);
    setBannerImage(p.bannerImage);
    setCtaText(p.ctaText);
    setCtaTextAr(p.ctaTextAr || p.ctaText);
    setCtaLink(p.ctaLink);
    setBadge(p.badge || '');
    setBadgeAr(p.badgeAr || '');
    setActive(p.active);
    setIsModalOpen(true);
  };

  const handleToggleActive = (p: Promotion) => {
    DataService.updatePromotion(p.id, { active: !p.active });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      titleAr: titleAr.trim() || title.trim(),
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || description.trim(),
      bannerImage,
      ctaText: ctaText.trim(),
      ctaTextAr: ctaTextAr.trim() || ctaText.trim(),
      ctaLink: ctaLink.trim(),
      badge: badge.trim(),
      badgeAr: badgeAr.trim() || badge.trim(),
      active,
    };

    if (editingPromoId) {
      DataService.updatePromotion(editingPromoId, payload);
    } else {
      DataService.createPromotion(payload);
    }

    setIsModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    DataService.createCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountAmount: Number(newCouponAmount) || 10,
      expiryDate: '2026-12-31',
      usageLimit: 100,
      active: true,
    });
    setNewCouponCode('');
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic ? 'الحملات التسويقية والعروض الترويجية' : 'Marketing & Promotional Campaigns'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'أنشئ وانشر الحملات الموسمية وأكواد الخصم المتزامنة فورياً مع بوابة الزوار.'
              : 'Create and broadcast seasonal campaigns and voucher codes synced in real time with the visitor portal.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'حملة ترويجية جديدة' : 'New Campaign Banner'}</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo, idx) => (
          <GlassContainer
            key={promo.id}
            delay={idx * 0.04}
            hoverLift
            className="overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 overflow-hidden bg-neutral-900">
                <img
                  src={promo.bannerImage}
                  alt={isArabic ? promo.titleAr || promo.title : promo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {(promo.badge || promo.badgeAr) && (
                  <div
                    className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded text-[#102E29] text-[10px] font-bold"
                    style={{ backgroundColor: currentAccentHex }}
                  >
                    {isArabic ? promo.badgeAr || promo.badge : promo.badge}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-white">
                  <h3 className="font-serif text-lg font-bold">
                    {isArabic ? promo.titleAr || promo.title : promo.title}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-[var(--tf-muted)] line-clamp-2 leading-relaxed mb-4">
                  {isArabic ? promo.descriptionAr || promo.description : promo.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--tf-text)] pt-2 border-t border-[var(--tf-border)]">
                  <span className="font-semibold text-[var(--tf-heading)]">
                    {isArabic ? 'الزر: ' : 'CTA: '}
                    {isArabic ? promo.ctaTextAr || promo.ctaText : promo.ctaText}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      promo.active
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/35'
                        : 'bg-neutral-500/15 text-[var(--tf-muted)] border-[var(--tf-border)]'
                    }`}
                  >
                    {promo.active
                      ? isArabic
                        ? 'نشط'
                        : 'ACTIVE'
                      : isArabic
                      ? 'متوقف'
                      : 'PAUSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[var(--tf-surface-subtle)] border-t border-[var(--tf-border)] flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(promo)}
                className="text-xs font-semibold text-[var(--tf-heading)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {promo.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>
                  {promo.active
                    ? isArabic
                      ? 'إيقاف الحملة'
                      : 'Pause Campaign'
                    : isArabic
                    ? 'نشر على الموقع'
                    : 'Publish to Site'}
                </span>
              </button>

              <button
                onClick={() => handleOpenEdit(promo)}
                className="p-1.5 text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-lg cursor-pointer"
                title={isArabic ? 'تعديل الحملة' : 'Edit Campaign'}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassContainer>
        ))}
      </div>

      {/* Coupon Management Section */}
      <GlassContainer delay={0.1} className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)]">
              {isArabic
                ? 'أكواد الخصم وقسائم المشغلين'
                : 'Promotional Codes & Operator Vouchers'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)]">
              {isArabic
                ? 'الأكواد النشطة متاحة للاستخدام الفوري في بطاقات حجز التجارب للزوار.'
                : 'Active promo codes are immediately redeemable on visitor experience booking cards.'}
            </p>
          </div>

          <form onSubmit={handleCreateCoupon} className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="NEWCODE2026"
              dir="ltr"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              className="text-xs px-3 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-mono uppercase w-36"
            />
            <select
              value={newCouponType}
              onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
              className="text-xs px-2.5 py-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl font-semibold text-[var(--tf-heading)]"
            >
              <option value="percentage">{isArabic ? 'خصم %' : '% Off'}</option>
              <option value="fixed">{isArabic ? 'خصم بالريال' : 'SAR Off'}</option>
            </select>
            <input
              type="number"
              min={1}
              value={newCouponAmount}
              onChange={(e) => setNewCouponAmount(Number(e.target.value))}
              className="text-xs px-2.5 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-mono w-20"
            />
            <button
              type="submit"
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
              className="py-2 px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-opacity hover:opacity-90"
            >
              {isArabic ? 'إضافة قسيمة' : 'Add Voucher'}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold text-start">
                  {isArabic ? 'الكود' : 'Code'}
                </th>
                <th className="py-2.5 px-3 font-semibold text-start">
                  {isArabic ? 'الخصم' : 'Discount'}
                </th>
                <th className="py-2.5 px-3 font-semibold text-start">
                  {isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}
                </th>
                <th className="py-2.5 px-3 font-semibold text-start">
                  {isArabic ? 'مرات الاستخدام' : 'Redemptions'}
                </th>
                <th className="py-2.5 px-3 font-semibold text-start">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="py-2.5 px-3 font-semibold text-end">
                  {isArabic ? 'إجراء' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--tf-surface-hover)]">
                  <td className="py-3 px-3 font-mono font-bold text-[var(--tf-heading)]">
                    {c.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--tf-text)]">
                    {c.discountType === 'percentage'
                      ? isArabic
                        ? `خصم ${c.discountAmount}%`
                        : `${c.discountAmount}% Off`
                      : isArabic
                      ? `خصم ${c.discountAmount} ${localizeCurrency('SAR', language)}`
                      : `${c.discountAmount} SAR Off`}
                  </td>
                  <td className="py-3 px-3 text-[var(--tf-muted)] font-mono">{c.expiryDate}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-[var(--tf-text)]">
                    {isArabic ? `${c.usedCount} مستخدمة` : `${c.usedCount} redeemed`}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.active
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-neutral-500/15 text-[var(--tf-muted)]'
                      }`}
                    >
                      {c.active
                        ? isArabic
                          ? 'نشط'
                          : 'ACTIVE'
                        : isArabic
                        ? 'متوقف'
                        : 'PAUSED'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-end">
                    <button
                      type="button"
                      onClick={() => DataService.updateCoupon(c.id, { active: !c.active })}
                      className="text-xs font-semibold hover:underline cursor-pointer"
                      style={{ color: currentAccentHex }}
                    >
                      {c.active
                        ? isArabic
                          ? 'إيقاف'
                          : 'Pause'
                        : isArabic
                        ? 'تفعيل'
                        : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassContainer>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#202923]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <h3 className="font-serif text-xl font-bold text-[#123B32]">
                {editingPromoId
                  ? isArabic
                    ? 'تعديل الحملة الترويجية'
                    : 'Edit Campaign'
                  : isArabic
                  ? 'إنشاء حملة ترويجية جديدة'
                  : 'Create Promotional Campaign'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#777D75] hover:text-[#123B32]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'عنوان الحملة (بالإنجليزية) *' : 'Campaign Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'عنوان الحملة (بالعربية)' : 'Campaign Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'وسم الشارة (بالإنجليزية)' : 'Badge Tag (English)'}
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'وسم الشارة (بالعربية)' : 'Badge Tag (Arabic)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={badgeAr}
                    onChange={(e) => setBadgeAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <ImageUploadField
                label={isArabic ? 'صورة البانر (رفع من الجهاز)' : 'Banner Image (Upload from Device)'}
                value={bannerImage}
                onChange={setBannerImage}
                variant="modal-light"
                previewHeightClass="h-36"
                maxDimension={1440}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'وصف الحملة (بالإنجليزية)' : 'Campaign Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'وصف الحملة (بالعربية)' : 'Campaign Description (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'نص زر الإجراء' : 'CTA Button Label'}
                  </label>
                  <input
                    type="text"
                    value={isArabic ? ctaTextAr : ctaText}
                    onChange={(e) =>
                      isArabic ? setCtaTextAr(e.target.value) : setCtaText(e.target.value)
                    }
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'رابط القسم المستهدف' : 'CTA Target Section Link'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#123B32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#123B32]"
                  />
                  <span>
                    {isArabic
                      ? 'نشطة ومباشرة على الصفحة الرئيسية للزوار'
                      : 'Active & Live on Visitor Homepage'}
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D9C29A]/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-[#777D75] cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isArabic ? 'حفظ الحملة' : 'Save Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
