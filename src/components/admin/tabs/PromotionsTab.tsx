import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Promotion, Experience, Destination } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { Plus, Megaphone, Edit2, Tag, Check, X, Eye, EyeOff } from 'lucide-react';

interface PromotionsTabProps {
  promotions: Promotion[];
  experiences: Experience[];
  destinations: Destination[];
}

export const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  experiences,
  destinations,
}) => {
  const { isRtl } = useLanguage();

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

  // Sample Coupon management state
  const [coupons, setCoupons] = useState([
    { code: 'FOUNDING2026', discount: '15% Off', expiry: '2026-12-31', uses: 42, active: true },
    { code: 'ALULA_WINTER', discount: '200 SAR Off', expiry: '2026-04-30', uses: 88, active: true },
    { code: 'REDSEA_VIP', discount: '20% Off', expiry: '2026-08-31', uses: 19, active: false },
  ]);

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

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
            Marketing & Promotional Campaigns
          </h2>
          <p className="text-xs text-[#777D75]">
            Create and broadcast seasonal campaigns that immediately appear on the visitor homepage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign Banner</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white border border-[#D9C29A]/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 overflow-hidden bg-neutral-900">
                <img src={promo.bannerImage} alt={promo.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {promo.badge && (
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded bg-[#D9C29A] text-[#123B32] text-[10px] font-bold">
                    {promo.badge}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-white">
                  <h3 className="font-serif text-lg font-bold">{promo.title}</h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-[#777D75] line-clamp-2 leading-relaxed mb-4">
                  {promo.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[#202923] pt-2 border-t border-[#D9C29A]/30">
                  <span className="font-semibold text-[#123B32]">CTA: {promo.ctaText}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      promo.active
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                    }`}
                  >
                    {promo.active ? 'ACTIVE ON HOMEPAGE' : 'PAUSED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border-t border-[#D9C29A]/40 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(promo)}
                className="text-xs font-semibold text-[#123B32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {promo.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{promo.active ? 'Pause Campaign' : 'Publish to Site'}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(promo)}
                className="p-1.5 text-[#123B32] hover:bg-[#D9C29A]/20 rounded-lg cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Management Section (§6.F) */}
      <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#123B32]">
              Promotional Codes & Operator Vouchers
            </h3>
            <p className="text-xs text-[#777D75]">
              Informational promo discounts applicable for concierge bookings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-[#D9C29A]/40 text-[#777D75] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold text-start">Code</th>
                <th className="py-2.5 px-3 font-semibold text-start">Discount</th>
                <th className="py-2.5 px-3 font-semibold text-start">Expiry Date</th>
                <th className="py-2.5 px-3 font-semibold text-start">Redemptions</th>
                <th className="py-2.5 px-3 font-semibold text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9C29A]/20">
              {coupons.map((c, i) => (
                <tr key={i} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 font-mono font-bold text-[#123B32]">
                    {c.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#202923]">
                    {c.discount}
                  </td>
                  <td className="py-3 px-3 text-[#777D75]">{c.expiry}</td>
                  <td className="py-3 px-3 font-mono tabular-nums">{c.uses} redeemed</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.active ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {c.active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <h3 className="font-serif text-xl font-bold text-[#123B32]">
                {editingPromoId ? 'Edit Campaign' : 'Create Promotional Campaign'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#777D75] hover:text-[#123B32]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Campaign Title *
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
                    Badge Tag (e.g. Winter Special)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Campaign Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    CTA Target Section Link
                  </label>
                  <input
                    type="text"
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
                  <span>Active & Live on Visitor Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D9C29A]/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-[#777D75]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
