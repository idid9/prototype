import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Destination, Experience } from '../../../types';
import { DataService, IMAGES } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { Plus, Edit2, Eye, EyeOff, X } from 'lucide-react';

interface DestinationsTabProps {
  destinations: Destination[];
  experiences?: Experience[];
}

export const DestinationsTab: React.FC<DestinationsTabProps> = ({
  destinations,
  experiences = [],
}) => {
  const { isRtl } = useLanguage();
  const { currentAccentHex } = useTheme();

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
            Saudi Tourism Destinations
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            Manage featured Saudi regions, photography, editorial summaries, and public discoverability.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
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
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[11px]">
                  {dest.region}
                </div>
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-white">
                  <h3 className="font-serif text-xl font-bold">{dest.name}</h3>
                  <span className="text-xs text-white/80">{dest.nameAr}</span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[var(--tf-muted)] line-clamp-2 leading-relaxed mb-4">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--tf-text)] pt-2 border-t border-[var(--tf-border)]">
                  <span className="font-semibold">
                    {experiences.length > 0
                      ? experiences.filter(
                          (e) => e.destinationId === dest.id && e.status === 'PUBLISHED'
                        ).length
                      : dest.experienceCount}{' '}
                    Published Experiences
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      dest.published
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/35'
                        : 'bg-neutral-500/15 text-[var(--tf-muted)] border-[var(--tf-border)]'
                    }`}
                  >
                    {dest.published ? 'PUBLISHED' : 'HIDDEN'}
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
                <span>{dest.published ? 'Unpublish' : 'Publish'}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(dest)}
                className="p-1.5 text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-lg transition-colors cursor-pointer"
                title="Edit Destination"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassContainer>
        ))}
      </div>

      {/* CREATE / EDIT DESTINATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <h3 className="font-serif text-xl font-bold text-[#123B32]">
                {editingDestId ? 'Edit Destination' : 'Add New Destination'}
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
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123B32] mb-1">
                    Name (Arabic)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Region Province
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#123B32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#123B32]"
                  />
                  <span>Published on Website</span>
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
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
