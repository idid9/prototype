import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Experience, Destination, ExperienceCategory, ExperienceStatus } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Compass,
  AlertCircle,
  Search,
  ExternalLink,
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
    { label: 'AlUla Desert', url: IMAGES.heroAlUla },
    { label: 'Hegra Heritage', url: IMAGES.hegraHeritage },
    { label: 'Riyadh & Diriyah', url: IMAGES.riyadhDiriyah },
    { label: 'Jeddah Al-Balad', url: IMAGES.jeddahAlBalad },
    { label: 'Red Sea Coast', url: IMAGES.redSeaCoastal },
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
      setFormError('Title and unique slug are required.');
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
      categoryAr: category,
      price: Number(price),
      currency: 'SAR' as const,
      duration: duration.trim(),
      durationAr: durationAr.trim() || duration.trim(),
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || description.trim(),
      coverImage,
      gallery: [coverImage],
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
            Experience Catalog & Offerings
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            Manage published packages, draft itineraries, pricing, and live public visibility.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Experience</span>
        </button>
      </div>

      {/* Filter Bar */}
      <GlassContainer className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, destination, category..."
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
            <option value="all">All Statuses ({experiences.length})</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">All Destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
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
                <th className="py-3 px-4 font-semibold text-start">Experience</th>
                <th className="py-3 px-4 font-semibold text-start">Destination</th>
                <th className="py-3 px-4 font-semibold text-start">Category</th>
                <th className="py-3 px-4 font-semibold text-start">Price (SAR)</th>
                <th className="py-3 px-4 font-semibold text-start">Duration</th>
                <th className="py-3 px-4 font-semibold text-start">Status</th>
                <th className="py-3 px-4 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--tf-muted)]">
                    No experiences found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[var(--tf-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.coverImage}
                          alt={exp.title}
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-[var(--tf-border)]"
                        />
                        <div>
                          <div className="font-bold text-[var(--tf-heading)] line-clamp-1 max-w-xs">
                            {exp.title}
                          </div>
                          {exp.featured && (
                            <span className="text-[10px] font-bold" style={{ color: currentAccentHex }}>
                              ★ Featured Package
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-text)] font-medium">
                      {exp.destinationName}
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] whitespace-nowrap">
                      {exp.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-heading)] tabular-nums">
                      {exp.price} SAR
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] whitespace-nowrap">
                      {exp.duration}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {exp.status === 'PUBLISHED' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/35">
                          PUBLISHED
                        </span>
                      )}
                      {exp.status === 'DRAFT' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-400/35">
                          DRAFT (Hidden)
                        </span>
                      )}
                      {exp.status === 'ARCHIVED' && (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-neutral-500/15 text-[var(--tf-muted)] border border-[var(--tf-border)]">
                          ARCHIVED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onPreviewExperience && exp.status === 'PUBLISHED' && (
                          <button
                            onClick={() => onPreviewExperience(exp)}
                            className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                            title="Preview On Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicate(exp.id)}
                          className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                          title="Duplicate as Draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 text-[var(--tf-heading)] rounded hover:bg-[var(--tf-surface-subtle)] transition-colors cursor-pointer"
                          title="Edit Experience"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(exp.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/15 transition-colors cursor-pointer"
                          title="Delete Experience"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#D9C29A]/50 shadow-xl text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#123B32] mb-1">Confirm Removal</h3>
            <p className="text-xs text-[#777D75] mb-6">
              Are you sure you want to delete this experience? It will be removed immediately from public listings.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#777D75] bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmationId)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EXPERIENCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-3xl w-full my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#123B32]">
                  {editingExperienceId ? 'Edit Tourism Experience' : 'Create New Tourism Experience'}
                </h3>
                <p className="text-xs text-[#777D75]">
                  Changes synchronize live with the public visitor website.
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
                    Title (English) *
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
                    Title (Arabic)
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
                    Destination *
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.region})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Duration, Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Price (SAR) *
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
                    Duration (e.g. 4 hours)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#777D75]">Quick Assets:</span>
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
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Description (English)
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
                    Description (Arabic)
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
                    Highlights (One per line)
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
                    What's Included (One per line)
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
                    Meeting Point
                  </label>
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-[#123B32] cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                    <option value="DRAFT">DRAFT (Admin Only)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
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
                    Featured Homepage Carousel
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-[#D9C29A]/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-[#777D75] hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 text-xs font-semibold text-white bg-[#123B32] hover:bg-[#1D5546] rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                  {editingExperienceId ? 'Update & Synchronize' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
