import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Inquiry, InquiryStatus } from '../../../types';
import { DataService } from '../../../services/dataService';
import {
  Search,
  Download,
  Filter,
  Eye,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Send,
  User,
} from 'lucide-react';

interface InquiriesTabProps {
  inquiries: Inquiry[];
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({ inquiries }) => {
  const { isRtl } = useLanguage();
  const { getGlassyCardStyle } = useTheme();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInquiryModal, setActiveInquiryModal] = useState<Inquiry | null>(null);
  const [newNote, setNewNote] = useState('');

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
    const updated = DataService.updateInquiryStatus(inquiryId, newStatus);
    if (activeInquiryModal && activeInquiryModal.id === inquiryId && updated) {
      setActiveInquiryModal(updated);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryModal || !newNote.trim()) return;
    const updated = DataService.addInquiryNote(activeInquiryModal.id, newNote.trim());
    if (updated) {
      setActiveInquiryModal(updated);
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

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'CONTACTED':
        return 'bg-blue-50 text-blue-800 border-blue-300 font-semibold';
      case 'PENDING':
        return 'bg-purple-50 text-purple-800 border-purple-300 font-semibold';
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'COMPLETED':
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-300';
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
            Bookings & Customer Inquiries
          </h2>
          <p className="text-xs text-[#777D75]">
            Real-time pipeline of traveler requests, operator coordination, and booking confirmations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2.5 px-4 bg-white border border-[#D9C29A]/60 text-[#123B32] hover:bg-[#FAF8F5] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#C6A46B]" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 transition-all duration-300"
        style={getGlassyCardStyle()}
      >
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#777D75] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, ID, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
          />
        </div>

        {/* Filter by Status Tabs (Zero-pill segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
              statusFilter === 'all'
                ? 'bg-[#123B32] text-white border-[#123B32]'
                : 'bg-[#FAF8F5] text-[#777D75] border-[#D9C29A]/30 hover:bg-[#D9C29A]/20'
            }`}
          >
            All ({inquiries.length})
          </button>
          {statusOptions.map((st) => {
            const count = inquiries.filter((i) => i.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                  statusFilter === st
                    ? 'bg-[#123B32] text-white border-[#123B32]'
                    : 'bg-[#FAF8F5] text-[#777D75] border-[#D9C29A]/30 hover:bg-[#D9C29A]/20'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries Table */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
        style={getGlassyCardStyle()}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#D9C29A]/40 text-[#777D75] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-start">Inquiry ID</th>
                <th className="py-3 px-4 font-semibold text-start">Customer Details</th>
                <th className="py-3 px-4 font-semibold text-start">Selected Experience</th>
                <th className="py-3 px-4 font-semibold text-start">Travel Date</th>
                <th className="py-3 px-4 font-semibold text-start">Est. Value</th>
                <th className="py-3 px-4 font-semibold text-start">Status (Real-Time)</th>
                <th className="py-3 px-4 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9C29A]/20">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777D75]">
                    No inquiries found matching current filters. New visitor requests appear automatically here.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#123B32] whitespace-nowrap">
                      {inq.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#202923]">{inq.customerName}</div>
                      <div className="text-[11px] text-[#777D75]">{inq.email} · {inq.country}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-semibold text-[#123B32] truncate">{inq.experienceTitle}</div>
                      <div className="text-[11px] text-[#777D75]">{inq.guests} {inq.guests > 1 ? 'Guests' : 'Guest'}</div>
                    </td>
                    <td className="py-3 px-4 text-[#202923] whitespace-nowrap">
                      {inq.preferredDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#123B32] whitespace-nowrap tabular-nums">
                      {inq.estimatedValue ? `${inq.estimatedValue.toLocaleString()} SAR` : '—'}
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
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-end whitespace-nowrap">
                      <button
                        onClick={() => setActiveInquiryModal(inq)}
                        className="py-1 px-2.5 text-xs font-semibold text-[#123B32] bg-[#FAF8F5] hover:bg-[#D9C29A]/20 border border-[#D9C29A]/50 rounded-lg cursor-pointer"
                      >
                        Details & Notes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INQUIRY DETAIL & NOTES MODAL */}
      {activeInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded text-[#123B32]">
                    {activeInquiryModal.id}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(activeInquiryModal.status)}`}>
                    {activeInquiryModal.status}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#123B32] mt-1">
                  Inquiry: {activeInquiryModal.customerName}
                </h3>
              </div>
              <button
                onClick={() => setActiveInquiryModal(null)}
                className="p-1.5 text-[#777D75] hover:text-[#123B32] rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-xl text-xs mb-6">
              <div>
                <span className="text-[#777D75] block">Customer Name:</span>
                <span className="font-bold text-[#202923] text-sm">{activeInquiryModal.customerName}</span>
              </div>
              <div>
                <span className="text-[#777D75] block">Email:</span>
                <a href={`mailto:${activeInquiryModal.email}`} className="font-semibold text-[#123B32] hover:underline">
                  {activeInquiryModal.email}
                </a>
              </div>
              <div>
                <span className="text-[#777D75] block">Phone:</span>
                <span className="font-mono font-semibold text-[#202923]">{activeInquiryModal.phone}</span>
              </div>
              <div>
                <span className="text-[#777D75] block">Origin Country:</span>
                <span className="font-semibold text-[#202923]">{activeInquiryModal.country}</span>
              </div>
              <div>
                <span className="text-[#777D75] block">Selected Tour:</span>
                <span className="font-bold text-[#123B32]">{activeInquiryModal.experienceTitle}</span>
              </div>
              <div>
                <span className="text-[#777D75] block">Date & Guests:</span>
                <span className="font-semibold text-[#202923]">
                  {activeInquiryModal.preferredDate} ({activeInquiryModal.guests} guests)
                </span>
              </div>
            </div>

            {/* Special Requests / Message */}
            {activeInquiryModal.message && (
              <div className="mb-6">
                <span className="text-xs font-bold text-[#123B32] uppercase tracking-wider block mb-1.5">
                  Traveler Message / Special Requests:
                </span>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-[#202923] italic">
                  "{activeInquiryModal.message}"
                </div>
              </div>
            )}

            {/* Status Change Selector */}
            <div className="mb-6 p-4 bg-white border border-[#D9C29A]/50 rounded-xl">
              <label className="block text-xs font-bold text-[#123B32] mb-1.5">
                Update Status (Saves to Firestore Immediately):
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeInquiryModal.id, st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      activeInquiryModal.status === st
                        ? 'bg-[#123B32] text-white border-[#123B32] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#777D75] border-[#D9C29A]/40 hover:bg-[#D9C29A]/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Admin Notes (Private from visitors §6.D) */}
            <div className="border-t border-[#D9C29A]/40 pt-4">
              <span className="text-xs font-bold text-[#123B32] uppercase tracking-wider block mb-2">
                Internal Operator Notes (Private):
              </span>

              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {activeInquiryModal.internalNotes && activeInquiryModal.internalNotes.length > 0 ? (
                  activeInquiryModal.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/40 rounded-lg text-xs text-[#202923]">
                      {note}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#777D75] italic">No internal notes yet.</div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add private note (e.g. VIP driver assigned, spoke on WhatsApp)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123B32]"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="py-2 px-4 bg-[#123B32] hover:bg-[#1D5546] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
