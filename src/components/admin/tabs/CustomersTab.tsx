import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Customer, Experience, Inquiry } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  formatGuestsCount,
  localizeCountry,
  localizeExperienceTitle,
  localizeInquiryStatus,
} from '../../../utils/localization';
import { Search, Download, User, X, Check } from 'lucide-react';

interface CustomersTabProps {
  customers: Customer[];
  inquiries: Inquiry[];
  experiences?: Experience[];
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  inquiries,
  experiences = [],
}) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const selectedCustomer = selectedCustomerId
    ? customers.find((c) => c.id === selectedCustomerId) || null
    : null;

  useEffect(() => {
    if (selectedCustomer) {
      setNotesInput(selectedCustomer.notes || '');
    }
  }, [selectedCustomer?.id, selectedCustomer?.notes]);

  const countries = Array.from(new Set(customers.map((c) => c.country).filter(Boolean)));

  const filteredCustomers = customers.filter((c) => {
    if (countryFilter !== 'all' && c.country !== countryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  const handleOpenProfile = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setNotesInput(c.notes || '');
    setNotesSaved(false);
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    const updated = DataService.updateCustomerNotes(selectedCustomer.id, notesInput);
    if (updated) {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Full Name', 'Email', 'Phone', 'Country', 'Inquiries Count', 'Confirmed Bookings', 'Last Interaction', 'Notes'];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      `"${c.phone || ''}"`,
      `"${c.country || ''}"`,
      c.totalInquiries,
      c.confirmedBookings,
      c.lastInteraction,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tourflow_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'إدارة علاقات العملاء (CRM)'
              : 'Customer Relationship Management (CRM)'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'ملفات العملاء الخاصة، سجل الطلبات، بلدان الإقامة، وملاحظات الخدمة الشخصية.'
              : 'Private client profiles, inquiry histories, country origins, and concierge notes.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" style={{ color: currentAccentTextHex }} />
          <span>{isArabic ? 'تصدير دليل العملاء' : 'Export Customer Directory'}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <GlassContainer className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isArabic
                ? 'ابحث باسم العميل أو البريد أو الدولة...'
                : 'Search by customer name, email, country...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">
              {isArabic
                ? `جميع الدول (${customers.length})`
                : `All Countries (${customers.length})`}
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {localizeCountry(c, language)}
              </option>
            ))}
          </select>
        </div>
      </GlassContainer>

      {/* Customers Table */}
      <GlassContainer delay={0.05} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[var(--tf-table-head)] border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'العميل' : 'Customer'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الدولة' : 'Country'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الطلبات' : 'Inquiries'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الحجوزات' : 'Bookings'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'آخر تفاعل' : 'Last Interaction'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الملاحظات' : 'Notes'}
                </th>
                <th className="py-3 px-4 font-semibold text-end">
                  {isArabic ? 'إجراء' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--tf-muted)]">
                    {isArabic ? 'لم يتم العثور على سجلات عملاء.' : 'No customer records found.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[var(--tf-surface-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--tf-heading)]">{cust.name}</div>
                      <div className="text-[11px] text-[var(--tf-muted)]">{cust.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-text)] font-medium whitespace-nowrap">
                      {localizeCountry(cust.country || 'International', language)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-heading)] tabular-nums">
                      {cust.totalInquiries}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--tf-success-text)] tabular-nums">
                      {cust.confirmedBookings}
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] whitespace-nowrap font-mono">
                      {new Date(cust.lastInteraction).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-[var(--tf-muted)] max-w-xs truncate">
                      {cust.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-end whitespace-nowrap">
                      <button
                        onClick={() => handleOpenProfile(cust)}
                        className="py-1 px-3 text-xs font-semibold text-[var(--tf-heading)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] border border-[var(--tf-border)] rounded-lg cursor-pointer"
                      >
                        {isArabic ? 'الملف الشخصي' : 'Profile'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassContainer>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[var(--tf-text)]">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--tf-border)] mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)]">
                    {selectedCustomer.name}
                  </h3>
                  <div className="text-xs text-[var(--tf-muted)]">
                    {selectedCustomer.email} · <span dir="ltr">{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded-lg hover:bg-[var(--tf-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl text-center mb-6">
              <div>
                <span className="text-[11px] text-[var(--tf-muted)] block">
                  {isArabic ? 'إجمالي الطلبات' : 'Total Inquiries'}
                </span>
                <span className="font-mono text-lg font-bold text-[var(--tf-heading)]">
                  {selectedCustomer.totalInquiries}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[var(--tf-muted)] block">
                  {isArabic ? 'الحجوزات المؤكدة' : 'Confirmed Bookings'}
                </span>
                <span className="font-mono text-lg font-bold text-[var(--tf-success-text)]">
                  {selectedCustomer.confirmedBookings}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[var(--tf-muted)] block">
                  {isArabic ? 'الدولة' : 'Origin'}
                </span>
                <span className="text-xs font-bold text-[var(--tf-heading)] mt-1 block">
                  {localizeCountry(selectedCustomer.country, language)}
                </span>
              </div>
            </div>

            {/* Associated Inquiries */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--tf-heading)] mb-3">
                {isArabic ? 'سجل الطلبات' : 'Inquiry History'}
              </h4>
              <div className="space-y-2">
                {inquiries
                  .filter((i) => i.email.toLowerCase() === selectedCustomer.email.toLowerCase())
                  .map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-[var(--tf-heading)]">
                          {localizeExperienceTitle(
                            inq.experienceTitle,
                            language,
                            experiences,
                            inq.experienceId
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--tf-muted)]">
                          {isArabic ? 'التاريخ:' : 'Date:'} {inq.preferredDate} ·{' '}
                          {formatGuestsCount(inq.guests, language)} ·{' '}
                          {isArabic ? 'المرجع:' : 'Ref:'} {inq.id}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)] border border-[var(--tf-border)] shrink-0">
                        {localizeInquiryStatus(inq.status, language)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Concierge Notes */}
            <div className="border-t border-[var(--tf-border)] pt-4">
              <label className="block text-xs font-bold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'ملاحظات ملف الخدمة الخاصة:' : 'Concierge Profile Notes:'}
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder={
                  isArabic
                    ? 'أضف تفضيلات العميل الخاصة (مثل حالة VIP، القيود الغذائية، اللغة المفضلة)...'
                    : 'Add private client preferences (e.g. VIP status, dietary restrictions, preferred language)...'
                }
                className="w-full text-xs p-3 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none mb-3"
              />
              <div className="flex items-center justify-between gap-3">
                {notesSaved ? (
                  <span className="text-xs font-semibold text-[var(--tf-success-text)] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {isArabic ? 'تم حفظ الملاحظات مباشرة' : 'Notes saved in real time'}
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                  className="py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-opacity hover:opacity-90"
                >
                  {isArabic ? 'حفظ الملاحظات' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
