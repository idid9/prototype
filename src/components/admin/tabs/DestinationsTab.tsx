import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Destination, Experience } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { ImageUploadField } from '../../common/ImageUploadField';
import {
  buildDestinationSearchQuery,
  buildGoogleMapsPlaceUrl,
} from '../../../utils/mapGuideUtils';
import { Plus, Edit2, Eye, EyeOff, X, ExternalLink } from 'lucide-react';

interface DestinationsTabProps {
  destinations: Destination[];
  experiences?: Experience[];
}

export const DestinationsTab: React.FC<DestinationsTabProps> = ({
  destinations,
  experiences = [],
}) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentBtnTextHex } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [region, setRegion] = useState('');
  const [regionAr, setRegionAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [coverImage, setCoverImage] = useState(IMAGES.heroAlUla);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(true);

  const handleOpenCreate = () => {
    setEditingDestId(null);
    setName('');
    setNameAr('');
    setSlug(`dest-${Date.now()}`);
    setRegion('Kingdom of Saudi Arabia');
    setRegionAr('المملكة العربية السعودية');
    setDescription('');
    setDescriptionAr('');
    setCoverImage(IMAGES.heroAlUla);
    setPublished(true);
    setFeatured(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Destination) => {
    setEditingDestId(d.id);
    setName(d.name);
    setNameAr(d.nameAr);
    setSlug(d.slug);
    setRegion(d.region);
    setRegionAr(d.regionAr);
    setDescription(d.description);
    setDescriptionAr(d.descriptionAr);
    setCoverImage(d.coverImage);
    setPublished(d.published);
    setFeatured(d.featured);
    setIsModalOpen(true);
  };

  const handleTogglePublish = (d: Destination) => {
    DataService.updateDestination(d.id, { published: !d.published });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      nameAr: nameAr.trim() || name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      region: region.trim(),
      regionAr: regionAr.trim() || region.trim(),
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || description.trim(),
      coverImage,
      experienceCount: editingDestId
        ? destinations.find((d) => d.id === editingDestId)?.experienceCount || 1
        : 1,
      featured,
      published,
    };

    if (editingDestId) {
      DataService.updateDestination(editingDestId, payload);
    } else {
      DataService.createDestination(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic ? 'الوجهات السياحية السعودية' : 'Saudi Tourism Destinations'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'إدارة المناطق السعودية المميزة، والصور، والملخصات التحريرية، والظهور للزوار.'
              : 'Manage featured Saudi regions, photography, editorial summaries, and public discoverability.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة وجهة جديدة' : 'Add New Destination'}</span>
        </button>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, idx) => (
          <GlassContainer
            key={dest.id}
            delay={idx * 0.04}
            hoverLift
            className="overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-neutral-900">
                <img
                  src={dest.coverImage}
                  alt={isArabic ? dest.nameAr : dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#FAF0DC] text-[11px]">
                  {isArabic ? dest.regionAr : dest.region}
                </div>
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-[#FAF0DC]">
                  <h3 className="font-serif text-xl font-bold tf-photo-text">
                    {isArabic ? dest.nameAr : dest.name}
                  </h3>
                  <span className="text-xs text-[#EDE0C6] tf-photo-text">
                    {isArabic ? dest.name : dest.nameAr}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[var(--tf-muted)] line-clamp-2 leading-relaxed mb-4">
                  {isArabic ? dest.descriptionAr : dest.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--tf-text)] pt-2 border-t border-[var(--tf-border)]">
                  <span className="font-semibold">
                    {experiences.length > 0
                      ? experiences.filter(
                          (e) => e.destinationId === dest.id && e.status === 'PUBLISHED'
                        ).length
                      : dest.experienceCount}{' '}
                    {isArabic ? 'تجارب منشورة' : 'Published Experiences'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      dest.published
                        ? 'bg-[var(--tf-success-bg)] text-[var(--tf-success-text)] border-[var(--tf-success-border)]'
                        : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]'
                    }`}
                  >
                    {dest.published
                      ? isArabic
                        ? 'منشورة'
                        : 'PUBLISHED'
                      : isArabic
                      ? 'مخفية'
                      : 'HIDDEN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-[var(--tf-surface-subtle)] border-t border-[var(--tf-border)] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(dest)}
                className="text-xs font-semibold text-[var(--tf-heading)] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                {dest.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>
                  {dest.published
                    ? isArabic
                      ? 'إلغاء النشر'
                      : 'Unpublish'
                    : isArabic
                    ? 'نشر'
                    : 'Publish'}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <a
                  href={buildGoogleMapsPlaceUrl({
                    query: buildDestinationSearchQuery(dest),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-lg transition-colors cursor-pointer"
                  title={isArabic ? 'معاينة في خرائط جوجل' : 'Preview on Google Maps'}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleOpenEdit(dest)}
                  className="p-1.5 text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-lg transition-colors cursor-pointer"
                  title={isArabic ? 'تعديل الوجهة' : 'Edit Destination'}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </GlassContainer>
        ))}
      </div>

      {/* CREATE / EDIT DESTINATION MODAL */}
      {isModalOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[var(--tf-text)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--tf-border)] mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)]">
                {editingDestId
                  ? isArabic
                    ? 'تعديل الوجهة'
                    : 'Edit Destination'
                  : isArabic
                  ? 'إضافة وجهة جديدة'
                  : 'Add New Destination'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded-lg hover:bg-[var(--tf-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'الاسم (بالإنجليزية) *' : 'Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'الاسم (بالعربية)' : 'Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'المنطقة (بالإنجليزية)' : 'Region Province (English)'}
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'المنطقة (بالعربية)' : 'Region Province (Arabic)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={regionAr}
                    onChange={(e) => setRegionAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploadField
                label={isArabic ? 'صورة الغلاف (رفع من الجهاز)' : 'Cover Image (Upload from Device)'}
                value={coverImage}
                onChange={setCoverImage}
                variant="modal-light"
                previewHeightClass="h-36"
                maxDimension={1440}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'الوصف التحريري (بالإنجليزية)' : 'Editorial Description (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'الوصف التحريري (بالعربية)' : 'Editorial Description (Arabic)'}
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--tf-heading)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{ accentColor: currentAccentHex }}
                    className="w-4 h-4 rounded"
                  />
                  <span>{isArabic ? 'منشورة على الموقع' : 'Published on Website'}</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--tf-border)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] hover:bg-[var(--tf-surface-hover)] rounded-xl cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                  className="py-2 px-5 rounded-xl text-xs font-bold cursor-pointer transition-opacity hover:opacity-90"
                >
                  {isArabic ? 'حفظ الوجهة' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
