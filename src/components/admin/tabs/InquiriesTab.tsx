import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Experience, Inquiry, InquiryStatus } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  formatGuestsCount,
  localizeCountry,
  localizeCurrency,
  localizeExperienceTitle,
  localizeInquiryStatus,
} from '../../../utils/localization';
import {
  Search,
  Download,
  X,
  Send,
  Trash2,
  RotateCcw,
  AlertCircle,
  Check,
} from 'lucide-react';

interface InquiriesTabProps {
  inquiries: Inquiry[];
  experiences?: Experience[];
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({ inquiries, experiences = [] }) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex, isDarkGlass } = useTheme();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [confirmListAction, setConfirmListAction] = useState<'clear' | 'reset' | null>(null);
  const [actionFeedback, setActionFeedback] = useState('');

  const activeInquiryModal = activeInquiryId
    ? inquiries.find((i) => i.id === activeInquiryId) || null
    : null;

  const deleteTargetInquiry = deleteConfirmId
    ? inquiries.find((i) => i.id === deleteConfirmId) || null
    : null;

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 3500);
  };

  const handleConfirmDeleteSingle = () => {
    if (!deleteConfirmId) return;
    DataService.deleteInquiry(deleteConfirmId);
    if (activeInquiryId === deleteConfirmId) {
      setActiveInquiryId(null);
    }
    setDeleteConfirmId(null);
    showFeedback(isArabic ? 'تم حذف الطلب بنجاح.' : 'Inquiry deleted successfully.');
  };

  const handleConfirmListAction = () => {
    if (confirmListAction === 'clear') {
      DataService.clearInquiries();
      setActiveInquiryId(null);
      setDeleteConfirmId(null);
      showFeedback(isArabic ? 'تم حذف جميع بيانات قائمة الطلبات.' : 'All booking inquiries deleted.');
    } else if (confirmListAction === 'reset') {
      DataService.resetInquiries();
      setActiveInquiryId(null);
      setDeleteConfirmId(null);
      setStatusFilter('all');
      setSearchQuery('');
      showFeedback(
        isArabic ? 'تمت استعادة قائمة الطلبات الافتراضية بنجاح.' : 'Booking inquiries list reset to default data.'
      );
    }
    setConfirmListAction(null);
  };

  const statusOptions: InquiryStatus[] = [
    'NEW',
    'CONTACTED',
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
  ];

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inq.customerName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.id.toLowerCase().includes(q) ||
        inq.experienceTitle.toLowerCase().includes(q) ||
        inq.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (inquiryId: string, newStatus: InquiryStatus) => {
    DataService.updateInquiryStatus(inquiryId, newStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryModal || !newNote.trim()) return;
    const updated = DataService.addInquiryNote(activeInquiryModal.id, newNote.trim());
    if (updated) {
      setNewNote('');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Inquiry ID', 'Customer Name', 'Email', 'Phone', 'Country', 'Experience', 'Date', 'Guests', 'Status', 'Estimated SAR', 'Created At'];
    const rows = filteredInquiries.map((i) => [
      i.id,
      `"${i.customerName.replace(/"/g, '""')}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.country}"`,
      `"${i.experienceTitle.replace(/"/g, '""')}"`,
      i.preferredDate,
      i.guests,
      i.status,
      i.estimatedValue || 0,
      i.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tourflow_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: InquiryStatus, forceLightModal = false) => {
    const dark = !forceLightModal && isDarkGlass;
    switch (status) {
      case 'NEW':
        return dark
          ? 'bg-amber-500/20 text-amber-300 border-amber-400/35 font-bold'
          : 'bg-amber-500/15 text-amber-800 border-amber-600/35 font-bold';
      case 'CONTACTED':
        return dark
          ? 'bg-sky-500/20 text-sky-300 border-sky-400/35 font-semibold'
          : 'bg-sky-500/15 text-sky-800 border-sky-600/35 font-semibold';
      case 'PENDING':
        return dark
          ? 'bg-purple-500/20 text-purple-300 border-purple-400/35 font-semibold'
          : 'bg-purple-500/15 text-purple-800 border-purple-600/35 font-semibold';
      case 'CONFIRMED':
        return dark
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35 font-bold'
          : 'bg-emerald-500/15 text-emerald-800 border-emerald-600/35 font-bold';
      case 'COMPLETED':
        return forceLightModal
          ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
          : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]';
      case 'CANCELLED':
        return dark
          ? 'bg-rose-500/20 text-rose-300 border-rose-400/35'
          : 'bg-rose-500/15 text-rose-800 border-rose-600/35';
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic ? 'الحجوزات واستفسارات العملاء' : 'Bookings & Customer Inquiries'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'متابعة فورية لطلبات المسافرين وتنسيق المشغلين وتأكيد الحجوزات.'
              : 'Real-time pipeline of traveler requests, operator coordination, and booking confirmations.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {actionFeedback && (
            <div className="px-3 py-1.5 bg-[var(--tf-success-bg)] border border-[var(--tf-success-border)] text-[var(--tf-success-text)] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirmListAction('reset')}
            className="py-2.5 px-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
            <span>{isArabic ? 'إعادة تعيين القائمة' : 'Reset List'}</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmListAction('clear')}
            disabled={inquiries.length === 0}
            className="py-2.5 px-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-danger-border)] text-[var(--tf-danger-text)] hover:bg-[var(--tf-danger-bg)] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حذف الكل' : 'Delete All'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredInquiries.length === 0}
            className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" style={{ color: currentAccentTextHex }} />
            <span>{isArabic ? 'تصدير تقرير CSV' : 'Export CSV Report'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassContainer className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isArabic
                ? 'ابحث باسم العميل أو البريد أو الرقم أو الدولة...'
                : 'Search by customer name, email, ID, or country...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
          />
        </div>

        {/* Filter by Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
              statusFilter === 'all'
                ? ''
                : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)] hover:text-[var(--tf-heading)]'
            }`}
            style={
              statusFilter === 'all'
                ? {
                    backgroundColor: currentAccentHex,
                    borderColor: currentAccentHex,
                    color: currentAccentBtnTextHex,
                  }
                : undefined
            }
          >
            {isArabic ? `الكل (${inquiries.length})` : `All (${inquiries.length})`}
          </button>
          {statusOptions.map((st) => {
            const count = inquiries.filter((i) => i.status === st).length;
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                  active
                    ? ''
                    : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)] hover:text-[var(--tf-heading)]'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: currentAccentHex,
                        borderColor: currentAccentHex,
                        color: currentAccentBtnTextHex,
                      }
                    : undefined
                }
              >
                {localizeInquiryStatus(st, language)} ({count})
              </button>
            );
          })}
        </div>
      </GlassContainer>

      {/* Inquiries Table */}
      <GlassContainer delay={0.05} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[var(--tf-table-head)] border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'رقم الطلب' : 'Inquiry ID'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'بيانات العميل' : 'Customer Details'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'التجربة المختارة' : 'Selected Experience'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'تاريخ السفر' : 'Travel Date'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'القيمة التقديرية' : 'Est. Value'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الحالة (تحديث فوري)' : 'Status (Real-Time)'}
                </th>
                <th className="py-3 px-4 font-semibold text-end">
                  {isArabic ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--tf-muted)]">
                    {isArabic
                      ? 'لا توجد طلبات مطابقة للتصفية الحالية. تظهر طلبات الزوار الجديدة هنا تلقائياً.'
                      : 'No inquiries found matching current filters. New visitor requests appear automatically here.'}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[var(--tf-surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-heading)] whitespace-nowrap">
                      {inq.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--tf-heading)]">{inq.customerName}</div>
                      <div className="text-[11px] text-[var(--tf-muted)]">
                        {inq.email} · {localizeCountry(inq.country, language)}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-semibold text-[var(--tf-heading)] truncate">
                        {localizeExperienceTitle(
                          inq.experienceTitle,
                          language,
                          experiences,
                          inq.experienceId
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--tf-muted)]">
                        {formatGuestsCount(inq.guests, language)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-text)] whitespace-nowrap font-mono">
                      {inq.preferredDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-heading)] whitespace-nowrap tabular-nums">
                      {inq.estimatedValue
                        ? `${inq.estimatedValue.toLocaleString()} ${localizeCurrency('SAR', language)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {localizeInquiryStatus(st, language)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveInquiryId(inq.id)}
                          className="py-1 px-2.5 text-xs font-semibold text-[var(--tf-heading)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] border border-[var(--tf-border)] rounded-lg cursor-pointer"
                        >
                          {isArabic ? 'التفاصيل والملاحظات' : 'Details & Notes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(inq.id)}
                          title={isArabic ? 'حذف الطلب' : 'Delete inquiry'}
                          aria-label={isArabic ? 'حذف الطلب' : 'Delete inquiry'}
                          className={`p-1.5 rounded-lg hover:bg-rose-500/15 transition-colors cursor-pointer ${
                            isDarkGlass
                              ? 'text-rose-400 hover:text-rose-300'
                              : 'text-rose-600 hover:text-rose-700'
                          }`}
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

      {/* INQUIRY DETAIL & NOTES MODAL */}
      {activeInquiryModal && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[var(--tf-text)]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--tf-border)] mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded text-[var(--tf-heading)]">
                    {activeInquiryModal.id}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(activeInquiryModal.status, false)}`}>
                    {localizeInquiryStatus(activeInquiryModal.status, language)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)] mt-1">
                  {isArabic ? 'طلب حجز: ' : 'Inquiry: '}
                  {activeInquiryModal.customerName}
                </h3>
              </div>
              <button
                onClick={() => setActiveInquiryId(null)}
                className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded-lg hover:bg-[var(--tf-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl text-xs mb-6">
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'اسم العميل:' : 'Customer Name:'}
                </span>
                <span className="font-bold text-[var(--tf-heading)] text-sm">{activeInquiryModal.customerName}</span>
              </div>
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'البريد الإلكتروني:' : 'Email:'}
                </span>
                <a
                  href={`mailto:${activeInquiryModal.email}`}
                  className="font-semibold hover:underline"
                  style={{ color: currentAccentTextHex }}
                >
                  {activeInquiryModal.email}
                </a>
              </div>
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'رقم الهاتف:' : 'Phone:'}
                </span>
                <span className="font-mono font-semibold text-[var(--tf-heading)]" dir="ltr">
                  {activeInquiryModal.phone}
                </span>
              </div>
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'دولة الإقامة / الجنسية:' : 'Origin Country:'}
                </span>
                <span className="font-semibold text-[var(--tf-text)]">
                  {localizeCountry(activeInquiryModal.country, language)}
                </span>
              </div>
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'الجولة المختارة:' : 'Selected Tour:'}
                </span>
                <span className="font-bold text-[var(--tf-heading)]">
                  {localizeExperienceTitle(
                    activeInquiryModal.experienceTitle,
                    language,
                    experiences,
                    activeInquiryModal.experienceId
                  )}
                </span>
              </div>
              <div>
                <span className="text-[var(--tf-muted)] block">
                  {isArabic ? 'التاريخ وعدد الضيوف:' : 'Date & Guests:'}
                </span>
                <span className="font-semibold text-[var(--tf-text)]">
                  {activeInquiryModal.preferredDate} ({formatGuestsCount(activeInquiryModal.guests, language)})
                </span>
              </div>
            </div>

            {/* Special Requests / Message */}
            {activeInquiryModal.message && (
              <div className="mb-6">
                <span className="text-xs font-bold text-[var(--tf-heading)] uppercase tracking-wider block mb-1.5">
                  {isArabic ? 'رسالة المسافر / الطلبات الخاصة:' : 'Traveler Message / Special Requests:'}
                </span>
                <div className="p-3 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl text-xs text-[var(--tf-text)] italic">
                  "{activeInquiryModal.message}"
                </div>
              </div>
            )}

            {/* Status Change Selector */}
            <div className="mb-6 p-4 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl">
              <label className="block text-xs font-bold text-[var(--tf-heading)] mb-1.5">
                {isArabic ? 'تحديث الحالة (يُحفظ فورياً):' : 'Update Status (Saves Immediately):'}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((st) => {
                  const selected = activeInquiryModal.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeInquiryModal.id, st)}
                      style={
                        selected
                          ? {
                              backgroundColor: currentAccentHex,
                              borderColor: currentAccentHex,
                              color: currentAccentBtnTextHex,
                            }
                          : undefined
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selected
                          ? 'shadow-sm font-bold'
                          : 'bg-[var(--tf-input-bg)] text-[var(--tf-muted)] border-[var(--tf-border)] hover:text-[var(--tf-heading)]'
                      }`}
                    >
                      {localizeInquiryStatus(st, language)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Internal Admin Notes (Private from visitors §6.D) */}
            <div className="border-t border-[var(--tf-border)] pt-4">
              <span className="text-xs font-bold text-[var(--tf-heading)] uppercase tracking-wider block mb-2">
                {isArabic ? 'ملاحظات المشغل الداخلية (خاصة):' : 'Internal Operator Notes (Private):'}
              </span>

              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {activeInquiryModal.internalNotes && activeInquiryModal.internalNotes.length > 0 ? (
                  activeInquiryModal.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-lg text-xs text-[var(--tf-text)]">
                      {note}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[var(--tf-muted)] italic">
                    {isArabic ? 'لا توجد ملاحظات داخلية بعد.' : 'No internal notes yet.'}
                  </div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? 'أضف ملاحظة خاصة (مثلاً: تم تعيين سائق VIP، تم التواصل عبر واتساب)...'
                      : 'Add private note (e.g. VIP driver assigned, spoke on WhatsApp)...'
                  }
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                  className="py-2 px-4 disabled:opacity-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إضافة ملاحظة' : 'Add Note'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE INQUIRY DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--tf-border)] shadow-xl text-center text-[var(--tf-text)]">
            <AlertCircle className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--tf-heading)] mb-1">
              {isArabic ? 'حذف طلب الحجز؟' : 'Delete Booking Inquiry?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {isArabic
                ? `سيتم حذف الطلب (${deleteTargetInquiry?.id || deleteConfirmId}) من قاعدة البيانات على جميع الأجهزة فوراً.`
                : `Inquiry ${deleteTargetInquiry?.id || deleteConfirmId}${
                    deleteTargetInquiry ? ` (${deleteTargetInquiry.customerName})` : ''
                  } will be permanently removed across all devices.`}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl cursor-pointer hover:bg-[var(--tf-surface-hover)]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#FAF0DC] bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {isArabic ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CLEAR / RESET INQUIRIES CONFIRMATION */}
      {confirmListAction && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--tf-border)] shadow-xl text-center text-[var(--tf-text)]">
            {confirmListAction === 'clear' ? (
              <Trash2 className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            ) : (
              <RotateCcw className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            )}
            <h3 className="text-base font-bold text-[var(--tf-heading)] mb-1">
              {confirmListAction === 'clear'
                ? isArabic
                  ? 'حذف جميع طلبات الحجز؟'
                  : 'Delete All Inquiries?'
                : isArabic
                ? 'إعادة تعيين قائمة الطلبات؟'
                : 'Reset Inquiries List?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {confirmListAction === 'clear'
                ? isArabic
                  ? 'سيتم مسح جميع الاستفسارات وطلبات الحجز من القائمة وقاعدة البيانات عبر جميع الأجهزة المتصلة.'
                  : 'This will permanently delete all booking inquiries from the list and cloud database across all connected devices.'
                : isArabic
                ? 'سيتم استبدال القائمة الحالية ببيانات الطلبات الافتراضية النموذجية ومزامنتها عبر جميع الأجهزة.'
                : 'This will replace the current inquiry list with the default sample inquiries and sync across all connected devices.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmListAction(null)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl cursor-pointer hover:bg-[var(--tf-surface-hover)]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmListAction}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#FAF0DC] bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {confirmListAction === 'clear'
                  ? isArabic
                    ? 'تأكيد الحذف'
                    : 'Delete All'
                  : isArabic
                  ? 'تأكيد الاستعادة'
                  : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
