import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Experience, Destination, ExperienceCategory, ExperienceStatus } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { ImageUploadField } from '../../common/ImageUploadField';
import { processImageFile } from '../../../utils/imageUpload';
import {
  localizeCategory,
  localizeCurrency,
  localizeDestinationName,
  localizeExperienceStatus,
} from '../../../utils/localization';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  AlertCircle,
  Search,
  ExternalLink,
  Upload,
} from 'lucide-react';

interface ExperiencesTabProps {
  experiences: Experience[];
  destinations: Destination[];
  onPreviewExperience?: (exp: Experience) => void;
}

export const ExperiencesTab: React.FC<ExperiencesTabProps> = ({
  experiences,
  destinations,
  onPreviewExperience,
}) => {
  const { language, isRtl } = useLanguage();
  const { currentAccentHex } = useTheme();
  const isArabic = language === 'ar';

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [slug, setSlug] = useState('');
  const [destinationId, setDestinationId] = useState(destinations[0]?.id || 'dest-alula');
  const [category, setCategory] = useState<ExperienceCategory>('Desert Adventure');
  const [price, setPrice] = useState(450);
  const [duration, setDuration] = useState('4 hours');
  const [durationAr, setDurationAr] = useState('4 ساعات');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [coverImage, setCoverImage] = useState(IMAGES.heroAlUla);
  const [gallery, setGallery] = useState<string[]>([]);
  const [highlightsInput, setHighlightsInput] = useState('');
  const [inclusionsInput, setInclusionsInput] = useState('');
  const [exclusionsInput, setExclusionsInput] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('AlUla Visitor Station');
  const [meetingPointAr, setMeetingPointAr] = useState('مركز زوار العلا');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<ExperienceStatus>('PUBLISHED');
  const [formError, setFormError] = useState('');

  // Sample predefined image options for convenience
  const imagePresets = [
    { label: 'AlUla Desert', labelAr: 'صحراء العلا', url: IMAGES.heroAlUla },
    { label: 'Hegra Heritage', labelAr: 'تراث الحجر', url: IMAGES.hegraHeritage },
    { label: 'Riyadh & Diriyah', labelAr: 'الرياض والدرعية', url: IMAGES.riyadhDiriyah },
    { label: 'Jeddah Al-Balad', labelAr: 'جدة التاريخية', url: IMAGES.jeddahAlBalad },
    { label: 'Red Sea Coast', labelAr: 'ساحل البحر الأحمر', url: IMAGES.redSeaCoastal },
  ];

  const categories: ExperienceCategory[] = [
    'Desert Adventure',
    'Cultural Experiences',
    'City Tours',
    'Nature & Outdoor',
    'Luxury Experiences',
    'Family Activities',
  ];

  const handleOpenCreate = () => {
    setEditingExperienceId(null);
    setTitle('');
    setTitleAr('');
    setSlug(`exp-${Date.now()}`);
    setDestinationId(destinations[0]?.id || 'dest-alula');
    setCategory('Desert Adventure');
    setPrice(450);
    setDuration('4 hours');
    setDurationAr('4 ساعات');
    setDescription('');
    setDescriptionAr('');
    setCoverImage(IMAGES.heroAlUla);
    setGallery([]);
    setHighlightsInput('Exclusive 4x4 canyon tour\nTraditional Saudi coffee majlis\nCertified local guide');
    setInclusionsInput('Licensed 4x4 & driver\nFresh Gahwa and medjool dates\nWater and snacks');
    setExclusionsInput('Personal souvenirs\nGratuities');
    setMeetingPoint('Winter Park AlUla Hub');
    setMeetingPointAr('مركز زوار وينتر بارك، العلا');
    setFeatured(false);
    setStatus('PUBLISHED');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExperienceId(exp.id);
    setTitle(exp.title);
    setTitleAr(exp.titleAr || exp.title);
    setSlug(exp.slug);
    setDestinationId(exp.destinationId);
    setCategory(exp.category);
    setPrice(exp.price);
    setDuration(exp.duration);
    setDurationAr(exp.durationAr || exp.duration);
    setDescription(exp.description);
    setDescriptionAr(exp.descriptionAr || exp.description);
    setCoverImage(exp.coverImage);
    setGallery(exp.gallery && exp.gallery.length > 0 ? exp.gallery : [exp.coverImage]);
    setHighlightsInput((exp.highlights || []).join('\n'));
    setInclusionsInput((exp.inclusions || []).join('\n'));
    setExclusionsInput((exp.exclusions || []).join('\n'));
    setMeetingPoint(exp.meetingPoint);
    setMeetingPointAr(exp.meetingPointAr || exp.meetingPoint);
    setFeatured(exp.featured);
    setStatus(exp.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setFormError(
        isArabic ? 'العنوان والمعرّف الفريد (Slug) مطلوبان.' : 'Title and unique slug are required.'
      );
      return;
    }

    const selectedDest = destinations.find((d) => d.id === destinationId);
    const destinationName = selectedDest ? selectedDest.name : 'Saudi Arabia';

    const highlights = highlightsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const inclusions = inclusionsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const exclusions = exclusionsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      titleAr: titleAr.trim() || title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      destinationId,
      destinationName,
      category,
      categoryAr: localizeCategory(category, 'ar'),
      price: Number(price),
      currency: 'SAR' as const,
      duration: duration.trim(),
      durationAr: durationAr.trim() || duration.trim(),
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || description.trim(),
      coverImage,
      gallery: gallery.length > 0 ? Array.from(new Set([coverImage, ...gallery])) : [coverImage],
      highlights,
      highlightsAr: highlights,
      inclusions,
      inclusionsAr: inclusions,
      exclusions,
      exclusionsAr: exclusions,
      meetingPoint: meetingPoint.trim(),
      meetingPointAr: meetingPointAr.trim() || meetingPoint.trim(),
      featured,
      status,
    };

    if (editingExperienceId) {
      DataService.updateExperience(editingExperienceId, payload);
    } else {
      DataService.createExperience(payload);
    }

    setIsModalOpen(false);
  };

  const handleDuplicate = (id: string) => {
    DataService.duplicateExperience(id);
  };

  const handleDelete = (id: string) => {
    DataService.deleteExperience(id);
    setDeleteConfirmationId(null);
  };

  // Filter list
  const filteredList = experiences.filter((exp) => {
    if (statusFilter !== 'all' && exp.status !== statusFilter) return false;
    if (destinationFilter !== 'all' && exp.destinationId !== destinationFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.titleAr.toLowerCase().includes(q) ||
        exp.destinationName.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic ? 'كتالوج التجارب والعروض السياحية' : 'Experience Catalog & Offerings'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'إدارة الباقات المنشورة، والمسودات، والأسعار، والظهور المباشر للجمهور.'
              : 'Manage published packages, draft itineraries, pricing, and live public visibility.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة تجربة جديدة' : 'Add New Experience'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <GlassContainer className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isArabic
                ? 'ابحث بالعنوان أو الوجهة أو الفئة...'
                : 'Search by title, destination, category...'
            }
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">
              {isArabic ? `جميع الحالات (${experiences.length})` : `All Statuses (${experiences.length})`}
            </option>
            <option value="PUBLISHED">{isArabic ? 'منشور' : 'Published'}</option>
            <option value="DRAFT">{isArabic ? 'مسودة' : 'Draft'}</option>
            <option value="ARCHIVED">{isArabic ? 'مؤرشف' : 'Archived'}</option>
          </select>

          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">{isArabic ? 'جميع الوجهات' : 'All Destinations'}</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {isArabic ? d.nameAr : d.name}
              </option>
            ))}
          </select>
        </div>
      </GlassContainer>

      {/* Experiences Table */}
      <GlassContainer delay={0.05} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[var(--tf-table-head)] border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'التجربة' : 'Experience'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الوجهة' : 'Destination'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الفئة' : 'Category'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'السعر (ريال)' : 'Price (SAR)'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'المدة' : 'Duration'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="py-3 px-4 font-semibold text-end">
                  {isArabic ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--tf-muted)]">
                    {isArabic
                      ? 'لم يتم العثور على تجارب مطابقة للتصفية الحالية.'
                      : 'No experiences found matching current filters.'}
                  </td>
                </tr>
              ) : (
                filteredList.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[var(--tf-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.coverImage}
                          alt={isArabic ? exp.titleAr : exp.title}
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-[var(--tf-border)]"
                        />
                        <div>
                          <div className="font-bold text-[var(--tf-heading)] line-clamp-1 max-w-xs">
                            {isArabic ? exp.titleAr : exp.title}
                          </div>
                          {exp.featured && (
                            <span className="text-[10px] font-bold" style={{ color: currentAccentHex }}>
                              ★ {isArabic ? 'باقة مميزة' : 'Featured Package'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-text)] font-medium">
                      {localizeDestinationName(
                        exp.destinationName,
                        language,
                        destinations,
                        exp.destinationId
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] whitespace-nowrap">
                      {localizeCategory(exp.category, language)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-heading)] tabular-nums whitespace-nowrap">
                      {exp.price} {localizeCurrency(exp.currency, language)}
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] whitespace-nowrap">
                      {isArabic ? exp.durationAr || exp.duration : exp.duration}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {exp.status === 'PUBLISHED' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/35">
                          {localizeExperienceStatus(exp.status, language)}
                        </span>
                      )}
                      {exp.status === 'DRAFT' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-400/35">
                          {localizeExperienceStatus(exp.status, language)}
                        </span>
                      )}
                      {exp.status === 'ARCHIVED' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-neutral-500/15 text-[var(--tf-muted)] border border-[var(--tf-border)]">
                          {localizeExperienceStatus(exp.status, language)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPreviewExperience && exp.status === 'PUBLISHED' && (
                          <button
                            onClick={() => onPreviewExperience(exp)}
                            className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                            title={isArabic ? 'معاينة على الموقع' : 'Preview On Website'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicate(exp.id)}
                          className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                          title={isArabic ? 'نسخ كمسودة' : 'Duplicate as Draft'}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                          title={isArabic ? 'تعديل التجربة' : 'Edit Experience'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(exp.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/15 transition-colors cursor-pointer"
                          title={isArabic ? 'حذف التجربة' : 'Delete Experience'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassContainer>

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmationId && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#D9C29A]/50 shadow-xl text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#123B32] mb-1">
              {isArabic ? 'تأكيد الحذف' : 'Confirm Removal'}
            </h3>
            <p className="text-xs text-[#777D75] mb-6">
              {isArabic
                ? 'هل أنت متأكد من حذف هذه التجربة؟ ستتم إزالتها فوراً من القوائم العامة للزوار.'
                : 'Are you sure you want to delete this experience? It will be removed immediately from public listings.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#777D75] bg-neutral-100 rounded-xl cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmationId)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {isArabic ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EXPERIENCE MODAL */}
      {isModalOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-3xl w-full my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#202923]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#123B32]">
                  {editingExperienceId
                    ? isArabic
                      ? 'تعديل التجربة السياحية'
                      : 'Edit Tourism Experience'
                    : isArabic
                    ? 'إنشاء تجربة سياحية جديدة'
                    : 'Create New Tourism Experience'}
                </h3>
                <p className="text-xs text-[#777D75]">
                  {isArabic
                    ? 'تتزامن التغييرات مباشرة مع موقع الزوار العام.'
                    : 'Changes synchronize live with the public visitor website.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#777D75] hover:text-[#123B32] rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title & Arabic Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'العنوان (بالإنجليزية) *' : 'Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AlUla Desert Stargazing"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'العنوان (بالعربية)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: جولة رصد النجوم بالعلا"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
              </div>

              {/* Destination & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'الوجهة *' : 'Destination *'}
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isArabic ? `${d.nameAr} (${d.regionAr})` : `${d.name} (${d.region})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'الفئة *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {localizeCategory(c, language)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Duration, Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'السعر (ريال) *' : 'Price (SAR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'المدة (مثلاً: 4 ساعات)' : 'Duration (e.g. 4 hours)'}
                  </label>
                  <input
                    type="text"
                    value={isArabic ? durationAr : duration}
                    onChange={(e) =>
                      isArabic ? setDurationAr(e.target.value) : setDuration(e.target.value)
                    }
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'رابط URL المختصر' : 'URL Slug'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
              </div>

              {/* Cover Image & Gallery Upload (From Device) */}
              <div className="space-y-3">
                <ImageUploadField
                  label={isArabic ? 'صورة الغلاف (رفع من الجهاز)' : 'Cover Image (Upload from Device)'}
                  value={coverImage}
                  onChange={setCoverImage}
                  variant="modal-light"
                  previewHeightClass="h-40"
                  maxDimension={1440}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#777D75]">
                    {isArabic ? 'صور نموذجية سريعة:' : 'Quick Sample Photos:'}
                  </span>
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer ${
                        coverImage === preset.url
                          ? 'bg-[#123B32] text-white border-[#123B32]'
                          : 'bg-[#FAF8F5] text-[#123B32] border-[#D9C29A]/50 hover:bg-[#D9C29A]/20'
                      }`}
                    >
                      {isArabic ? preset.labelAr : preset.label}
                    </button>
                  ))}
                </div>

                {/* Additional Gallery Photos from Device */}
                <div className="p-3 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#123B32]">
                      {isArabic
                        ? `صور معرض التجربة (${gallery.length})`
                        : `Experience Gallery Photos (${gallery.length})`}
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123B32] hover:bg-[#1D5546] text-white text-[11px] font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'إضافة صور من الجهاز' : 'Add Photos from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          const uploaded: string[] = [];
                          for (const file of Array.from(files)) {
                            try {
                              const res = await processImageFile(file, { maxDimension: 1280 });
                              uploaded.push(res.dataUrl);
                            } catch {}
                          }
                          if (uploaded.length > 0) {
                            setGallery((prev) => Array.from(new Set([...prev, ...uploaded])));
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                  {gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {gallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#D9C29A]/60 group"
                        >
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title={isArabic ? 'إزالة الصورة' : 'Remove photo'}
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
              </div>

              {/* Highlights & Inclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'أبرز المميزات (سطر لكل نقطة)' : 'Highlights (One per line)'}
                  </label>
                  <textarea
                    rows={2}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'ما تتضمنه التجربة (سطر لكل نقطة)' : "What's Included (One per line)"}
                  </label>
                  <textarea
                    rows={2}
                    value={inclusionsInput}
                    onChange={(e) => setInclusionsInput(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
              </div>

              {/* Meeting Point & Status / Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'نقطة التجمع' : 'Meeting Point'}
                  </label>
                  <input
                    type="text"
                    value={isArabic ? meetingPointAr : meetingPoint}
                    onChange={(e) =>
                      isArabic
                        ? setMeetingPointAr(e.target.value)
                        : setMeetingPoint(e.target.value)
                    }
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    {isArabic ? 'حالة النشر *' : 'Publication Status *'}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    <option value="PUBLISHED">
                      {isArabic ? 'منشور (مرئي للجمهور)' : 'PUBLISHED (Visible to Public)'}
                    </option>
                    <option value="DRAFT">
                      {isArabic ? 'مسودة (للمشرف فقط)' : 'DRAFT (Admin Only)'}
                    </option>
                    <option value="ARCHIVED">{isArabic ? 'مؤرشف' : 'ARCHIVED'}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#123B32] focus:ring-[#123B32]"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-[#123B32] cursor-pointer">
                    {isArabic ? 'مميزة في واجهة الصفحة الرئيسية' : 'Featured Homepage Carousel'}
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-[#D9C29A]/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-[#777D75] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 text-xs font-semibold text-white bg-[#123B32] hover:bg-[#1D5546] rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                  {editingExperienceId
                    ? isArabic
                      ? 'تحديث ومزامنة'
                      : 'Update & Synchronize'
                    : isArabic
                    ? 'حفظ ونشر'
                    : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
