import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { NewsletterSubscriber, SubscriberStatus } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import {
  Mail,
  Search,
  Download,
  Send,
  Copy,
  Check,
  X,
  Trash2,
  ExternalLink,
  AlertCircle,
  MessageSquare,
  Globe,
  CheckCircle2,
  Users,
  RotateCcw,
} from 'lucide-react';

interface SubscribersTabProps {
  subscribers: NewsletterSubscriber[];
}

export const SubscribersTab: React.FC<SubscribersTabProps> = ({ subscribers }) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex, isDarkGlass } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriberStatus>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'ar'>('all');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [confirmListAction, setConfirmListAction] = useState<'clear' | 'reset' | null>(null);
  const [actionFeedback, setActionFeedback] = useState('');

  // Connect / Contact Modal state (supports single subscriber OR bulk active outreach)
  const [connectTarget, setConnectTarget] = useState<
    { mode: 'single'; subscriber: NewsletterSubscriber } | { mode: 'bulk'; list: NewsletterSubscriber[] } | null
  >(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [subscriberNotes, setSubscriberNotes] = useState('');
  const [outreachFeedback, setOutreachFeedback] = useState('');

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 3500);
  };

  const handleConfirmListAction = () => {
    if (confirmListAction === 'clear') {
      DataService.clearSubscribers();
      setConnectTarget(null);
      setDeleteConfirmId(null);
      showFeedback(
        isArabic ? 'تم حذف جميع بيانات المشتركين.' : 'All email subscriber records deleted.'
      );
    } else if (confirmListAction === 'reset') {
      DataService.resetSubscribers();
      setConnectTarget(null);
      setDeleteConfirmId(null);
      setStatusFilter('all');
      setLanguageFilter('all');
      setSearchQuery('');
      showFeedback(
        isArabic
          ? 'تمت استعادة قائمة المشتركين الافتراضية بنجاح.'
          : 'Email subscribers list reset to default data.'
      );
    }
    setConfirmListAction(null);
  };

  const stats = useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.status === 'ACTIVE').length;
    const contacted = subscribers.filter((s) => s.status === 'CONTACTED').length;
    return { total, active, contacted };
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      if (languageFilter !== 'all' && sub.language !== languageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          sub.email.toLowerCase().includes(q) ||
          (sub.source || '').toLowerCase().includes(q) ||
          (sub.notes || '').toLowerCase().includes(q) ||
          (sub.lastSubject || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subscribers, statusFilter, languageFilter, searchQuery]);

  const activeList = useMemo(
    () => subscribers.filter((s) => s.status !== 'UNSUBSCRIBED'),
    [subscribers]
  );

  const handleCopyEmail = (id: string, email: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const applyTemplate = (templateId: 'welcome' | 'offers' | 'vip', targetLang: 'en' | 'ar') => {
    if (templateId === 'welcome') {
      if (targetLang === 'ar') {
        setEmailSubject('مرحباً بك في حركة السياحة السعودية عبر تورفلو');
        setEmailBody(
          'مرحباً،\n\nشكراً لانضمامك إلى النشرة البريدية في تورفلو السعودية. يسعد فريق الكونسيرج لدينا بمشاركتك أحدث الباقات المصممة خصيصاً في العلا والدرعية والبحر الأحمر.\n\nأخبرنا بالوجهات التي تهمك لنرسل لك خطة رحلة خاصة.\n\nمع أطيب التحيات،\nفريق تورفلو السعودية'
        );
      } else {
        setEmailSubject('Welcome to TourFlow Saudi Arabia — Curated Desert & Heritage Passes');
        setEmailBody(
          'Hello,\n\nThank you for joining the Saudi Tourism Movement with TourFlow. Our concierge team would love to share seasonal access to private AlUla canyons, Diriyah heritage walks, and Red Sea eco-retreats.\n\nReply anytime with your preferred travel window and group size so we can craft a bespoke itinerary.\n\nWarm regards,\nTourFlow Saudi Concierge'
        );
      }
    } else if (templateId === 'offers') {
      if (targetLang === 'ar') {
        setEmailSubject('عروض موسمية حصرية: رحلات العلا والبحر الأحمر من تورفلو');
        setEmailBody(
          'مرحباً،\n\nيسرنا إطلاعك على أحدث العروض الموسمية والخصومات الحصرية لمشتركي تورفلو على جولات الحجر وسفاري الصحراء وإقامات البحر الأحمر.\n\nتواصل معنا عبر البريد أو الواتساب لتأكيد مقعدك بأفضل الأسعار.\n\nفريق تورفلو'
        );
      } else {
        setEmailSubject('Exclusive Seasonal Offers: AlUla & Red Sea Private Packages');
        setEmailBody(
          'Hello,\n\nAs a member of the TourFlow community, you have priority access to our seasonal Saudi desert adventures, UNESCO Hegra guided tours, and Red Sea coastal retreats.\n\nLet us know if you would like our latest availability calendar and subscriber promo code.\n\nBest regards,\nTourFlow Concierge'
        );
      }
    } else {
      if (targetLang === 'ar') {
        setEmailSubject('دعوة استشارة سياحية خاصة — تورفلو السعودية');
        setEmailBody(
          'مرحباً،\n\nنود دعوتك لجلسة تخطيط مجانية لرحلتك القادمة إلى المملكة العربية السعودية بالتنسيق المباشر مع مشغلين محليين معتمدين.\n\nيسعدنا الرد على استفساراتك في أي وقت.\n\nتورفلو السعودية'
        );
      } else {
        setEmailSubject('Personal Saudi Travel Consultation — TourFlow Concierge');
        setEmailBody(
          'Hello,\n\nWould you like a tailored consultation for your upcoming visit to Saudi Arabia? We partner directly with certified Saudi operators to arrange seamless private itineraries.\n\nReply to connect directly with our travel specialist.\n\nWarmly,\nTourFlow Team'
        );
      }
    }
  };

  const handleOpenSingleConnect = (sub: NewsletterSubscriber) => {
    setConnectTarget({ mode: 'single', subscriber: sub });
    setSubscriberNotes(sub.notes || '');
    setOutreachFeedback('');
    applyTemplate('welcome', sub.language || (isArabic ? 'ar' : 'en'));
  };

  const handleOpenBulkConnect = () => {
    const targets = filteredSubscribers.length > 0 ? filteredSubscribers : activeList;
    if (targets.length === 0) return;
    setConnectTarget({ mode: 'bulk', list: targets });
    setSubscriberNotes('');
    setOutreachFeedback('');
    applyTemplate('offers', isArabic ? 'ar' : 'en');
  };

  const markTargetContacted = (copyText?: string) => {
    if (!connectTarget) return;
    const subj = emailSubject.trim() || 'TourFlow Saudi Arabia Update';

    if (connectTarget.mode === 'single') {
      DataService.recordSubscriberOutreach(
        connectTarget.subscriber.id,
        subj,
        subscriberNotes
      );
    } else {
      connectTarget.list.forEach((item) => {
        DataService.recordSubscriberOutreach(item.id, subj);
      });
    }

    if (copyText && navigator.clipboard) {
      navigator.clipboard.writeText(copyText);
    }

    setOutreachFeedback(
      isArabic
        ? 'تم تسجيل التواصل وتحديث الحالة في قاعدة البيانات بالوقت الفعلي!'
        : 'Outreach logged & subscriber status updated in real time!'
    );
  };

  const handleSaveNotesOnly = () => {
    if (!connectTarget || connectTarget.mode !== 'single') return;
    DataService.updateSubscriberNotes(connectTarget.subscriber.id, subscriberNotes);
    setOutreachFeedback(
      isArabic ? 'تم حفظ الملاحظات بنجاح.' : 'Subscriber notes saved.'
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Subscriber ID',
      'Email',
      'Language',
      'Source',
      'Status',
      'Last Contacted',
      'Last Subject',
      'Joined At',
      'Notes',
    ];
    const rows = filteredSubscribers.map((s) => [
      s.id,
      s.email,
      s.language,
      `"${(s.source || '').replace(/"/g, '""')}"`,
      s.status,
      s.lastContactedAt || '',
      `"${(s.lastSubject || '').replace(/"/g, '""')}"`,
      s.createdAt,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `tourflow_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const localizeStatusBadge = (status: SubscriberStatus) => {
    if (status === 'ACTIVE') {
      return {
        label: isArabic ? 'جديد / بانتظار التواصل' : 'New / Ready to Connect',
        cls: isDarkGlass
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35'
          : 'bg-emerald-500/15 text-emerald-800 border-emerald-600/35',
      };
    }
    if (status === 'CONTACTED') {
      return {
        label: isArabic ? 'تم التواصل' : 'Contacted',
        cls: isDarkGlass
          ? 'bg-sky-500/20 text-sky-300 border-sky-400/35'
          : 'bg-sky-500/15 text-sky-800 border-sky-600/35',
      };
    }
    return {
      label: isArabic ? 'ملغي الاشتراك' : 'Unsubscribed',
      cls: 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]',
    };
  };

  // Build mailto & Gmail compose links safely
  const targetEmails =
    connectTarget?.mode === 'single'
      ? [connectTarget.subscriber.email]
      : connectTarget?.mode === 'bulk'
      ? connectTarget.list.map((s) => s.email)
      : [];

  const mailtoHref =
    connectTarget?.mode === 'single'
      ? `mailto:${encodeURIComponent(targetEmails[0] || '')}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`
      : `mailto:?bcc=${encodeURIComponent(targetEmails.join(','))}&subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`;

  const gmailHref =
    connectTarget?.mode === 'single'
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          targetEmails[0] || ''
        )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      : `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(
          targetEmails.join(',')
        )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'قاعدة بيانات البريد الإلكتروني (Join the Movement)'
              : 'Newsletter Email Database & Direct Outreach'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'جميع عناوين البريد المسجلة من قسم (انضم لحركة السياحة السعودية) مع إمكانية التواصل المباشر والفوري.'
              : 'Real-time recap of visitor emails submitted in "Join the Saudi Tourism Movement" with direct admin outreach.'}
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
            disabled={subscribers.length === 0}
            className="py-2.5 px-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-danger-border)] text-[var(--tf-danger-text)] hover:bg-[var(--tf-danger-bg)] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حذف الكل' : 'Delete All'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredSubscribers.length === 0}
            className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" style={{ color: currentAccentTextHex }} />
            <span>{isArabic ? 'تصدير CSV' : 'Export Emails'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenBulkConnect}
            disabled={activeList.length === 0}
            style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
            className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isArabic
                ? `تواصل جماعي (${filteredSubscribers.length || activeList.length})`
                : `Connect All (${filteredSubscribers.length || activeList.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Live Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassContainer className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--tf-muted)] uppercase tracking-wider">
              {isArabic ? 'إجمالي الإيميلات المسجلة' : 'Total Captured Emails'}
            </span>
            <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] mt-1 tabular-nums">
              {stats.total}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] flex items-center justify-center">
            <Users className="w-5 h-5" style={{ color: currentAccentTextHex }} />
          </div>
        </GlassContainer>

        <GlassContainer delay={0.04} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--tf-muted)] uppercase tracking-wider">
              {isArabic ? 'بانتظار التواصل' : 'Ready to Connect'}
            </span>
            <div className="font-mono text-2xl font-bold text-[var(--tf-success-text)] mt-1 tabular-nums">
              {stats.active}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] flex items-center justify-center">
            <Mail className="w-5 h-5 text-[var(--tf-success-text)]" />
          </div>
        </GlassContainer>

        <GlassContainer delay={0.08} className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--tf-muted)] uppercase tracking-wider">
              {isArabic ? 'تم التواصل معهم' : 'Contacted'}
            </span>
            <div className="font-mono text-2xl font-bold text-[var(--tf-heading)] mt-1 tabular-nums">
              {stats.contacted}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" style={{ color: currentAccentTextHex }} />
          </div>
        </GlassContainer>
      </div>

      {/* Filters */}
      <GlassContainer className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isArabic
                ? 'ابحث بالبريد الإلكتروني أو الملاحظات...'
                : 'Search by email address or notes...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | SubscriberStatus)}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">
              {isArabic ? `كل الحالات (${subscribers.length})` : `All Statuses (${subscribers.length})`}
            </option>
            <option value="ACTIVE">{isArabic ? 'جديد / بانتظار التواصل' : 'New / Ready to Connect'}</option>
            <option value="CONTACTED">{isArabic ? 'تم التواصل' : 'Contacted'}</option>
            <option value="UNSUBSCRIBED">{isArabic ? 'ملغي الاشتراك' : 'Unsubscribed'}</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value as 'all' | 'en' | 'ar')}
            className="text-xs py-2 px-3 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] font-semibold cursor-pointer"
          >
            <option value="all">{isArabic ? 'كل اللغات' : 'All Languages'}</option>
            <option value="en">English (EN)</option>
            <option value="ar">العربية (AR)</option>
          </select>
        </div>
      </GlassContainer>

      {/* Subscribers Table */}
      <GlassContainer delay={0.05} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[var(--tf-table-head)] border-b border-[var(--tf-border)] text-[var(--tf-muted)] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'البريد الإلكتروني' : 'Visitor Email'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'المصدر واللغة' : 'Source & Language'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'تاريخ التسجيل' : 'Joined Date'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="py-3 px-4 font-semibold text-start">
                  {isArabic ? 'آخر تواصل / ملاحظات' : 'Outreach & Notes'}
                </th>
                <th className="py-3 px-4 font-semibold text-end">
                  {isArabic ? 'تواصل وإدارة' : 'Connect & Manage'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--tf-border)]">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--tf-muted)]">
                    {isArabic
                      ? 'لا توجد عناوين بريد إلكتروني مطابقة حالياً.'
                      : 'No visitor newsletter emails recorded matching current filters.'}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => {
                  const badge = localizeStatusBadge(sub.status);
                  return (
                    <tr key={sub.id} className="hover:bg-[var(--tf-surface-hover)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span dir="ltr" className="font-bold text-[var(--tf-heading)] select-all">
                            {sub.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(sub.id, sub.email)}
                            title={isArabic ? 'نسخ البريد' : 'Copy email'}
                            className="p-1 rounded-md text-[var(--tf-muted)] hover:text-[var(--tf-heading)] hover:bg-[var(--tf-surface-subtle)] cursor-pointer"
                          >
                            {copiedId === sub.id ? (
                              <Check className="w-3.5 h-3.5 text-[var(--tf-success-text)]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[var(--tf-text)] font-medium">{sub.source}</div>
                        <div className="inline-flex items-center gap-1 text-[10px] text-[var(--tf-muted)] mt-0.5">
                          <Globe className="w-3 h-3" />
                          <span>{sub.language === 'ar' ? 'العربية (AR)' : 'English (EN)'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[var(--tf-muted)] whitespace-nowrap">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        {sub.lastContactedAt && (
                          <div className="text-[10px] font-semibold text-[var(--tf-info-text)] mb-0.5">
                            {isArabic ? 'آخر تواصل:' : 'Last contacted:'}{' '}
                            {new Date(sub.lastContactedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className="text-[var(--tf-muted)] truncate">
                          {sub.lastSubject || sub.notes || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenSingleConnect(sub)}
                            style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                            className="py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isArabic ? 'تواصل' : 'Connect'}</span>
                          </button>

                          <select
                            value={sub.status}
                            onChange={(e) =>
                              DataService.updateSubscriberStatus(
                                sub.id,
                                e.target.value as SubscriberStatus
                              )
                            }
                            aria-label={isArabic ? 'تغيير الحالة' : 'Change status'}
                            className="text-[11px] py-1.5 px-2 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-lg text-[var(--tf-heading)] font-semibold cursor-pointer"
                          >
                            <option value="ACTIVE">{isArabic ? 'جديد' : 'Active'}</option>
                            <option value="CONTACTED">{isArabic ? 'تم التواصل' : 'Contacted'}</option>
                            <option value="UNSUBSCRIBED">{isArabic ? 'ملغي' : 'Unsubscribed'}</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(sub.id)}
                            title={isArabic ? 'حذف السجل' : 'Delete subscriber'}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassContainer>

      {/* CONNECT / OUTREACH MODAL */}
      {connectTarget && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl max-w-2xl w-full my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[var(--tf-text)] space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--tf-border)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--tf-heading)]">
                    {connectTarget.mode === 'single'
                      ? isArabic
                        ? 'التواصل المباشر مع الزائر'
                        : 'Connect & Reach Out via Email'
                      : isArabic
                      ? `إرسال رسالة جماعية (${connectTarget.list.length} مشترك)`
                      : `Bulk Outreach (${connectTarget.list.length} Subscribers)`}
                  </h3>
                  <p className="text-xs text-[var(--tf-muted)]" dir="ltr">
                    {connectTarget.mode === 'single'
                      ? connectTarget.subscriber.email
                      : targetEmails.slice(0, 3).join(', ') +
                        (targetEmails.length > 3 ? ` +${targetEmails.length - 3} more` : '')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConnectTarget(null)}
                className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded-lg hover:bg-[var(--tf-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {outreachFeedback && (
              <div className="px-3.5 py-2.5 bg-[var(--tf-success-bg)] border border-[var(--tf-success-border)] text-[var(--tf-success-text)] text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{outreachFeedback}</span>
              </div>
            )}

            {/* Quick Templates */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-[var(--tf-muted)]">
                {isArabic ? 'قوالب رسائل جاهزة:' : 'Quick Message Templates:'}
              </span>
              {[
                { id: 'welcome' as const, label: 'Welcome Greeting', labelAr: 'ترحيب وانضمام' },
                { id: 'offers' as const, label: 'Seasonal Offers', labelAr: 'العروض الموسمية' },
                { id: 'vip' as const, label: 'VIP Consultation', labelAr: 'استشارة خاصة' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      tpl.id,
                      connectTarget.mode === 'single'
                        ? connectTarget.subscriber.language
                        : isArabic
                        ? 'ar'
                        : 'en'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] cursor-pointer"
                >
                  {isArabic ? tpl.labelAr : tpl.label}
                </button>
              ))}
            </div>

            {/* Subject & Message */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                  {isArabic ? 'عنوان الرسالة (Subject)' : 'Email Subject'}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                  {isArabic ? 'نص الرسالة' : 'Message Body'}
                </label>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Single Subscriber Notes */}
            {connectTarget.mode === 'single' && (
              <div className="p-3.5 rounded-xl bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--tf-heading)]">
                    <MessageSquare className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                    <span>{isArabic ? 'ملاحظات المشرف الخاصة:' : 'Admin Outreach Notes:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotesOnly}
                    className="text-[11px] font-semibold text-[var(--tf-heading)] hover:opacity-80 px-2.5 py-1 rounded-lg bg-[var(--tf-input-bg)] border border-[var(--tf-border)] cursor-pointer"
                  >
                    {isArabic ? 'حفظ الملاحظات' : 'Save Note'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={subscriberNotes}
                  onChange={(e) => setSubscriberNotes(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'اكتب تفاصيل الاهتمامات أو المتابعة...'
                      : 'Record follow-up details, travel interests, or response status...'
                  }
                  className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                />
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="pt-3 border-t border-[var(--tf-border)] flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() =>
                  markTargetContacted(
                    `${targetEmails.join(', ')}\n\nSubject: ${emailSubject}\n\n${emailBody}`
                  )
                }
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                <span>
                  {isArabic ? 'نسخ الرسالة وتسجيل التواصل' : 'Copy Message & Mark Contacted'}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={gmailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markTargetContacted()}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
                  <span>{isArabic ? 'فتح في Gmail' : 'Open in Gmail'}</span>
                </a>

                <a
                  href={mailtoHref}
                  onClick={() => markTargetContacted()}
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إرسال عبر تطبيق البريد' : 'Send via Email App'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--tf-border)] shadow-xl text-center text-[var(--tf-text)]">
            <AlertCircle className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--tf-heading)] mb-1">
              {isArabic ? 'حذف المشترك؟' : 'Remove Subscriber Email?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {isArabic
                ? 'سيتم حذف هذا البريد من قاعدة بيانات النشرة البريدية على جميع الأجهزة فوراً.'
                : 'This email address will be removed immediately from the newsletter database across all devices.'}
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
                onClick={() => {
                  DataService.deleteSubscriber(deleteConfirmId);
                  if (
                    connectTarget?.mode === 'single' &&
                    connectTarget.subscriber.id === deleteConfirmId
                  ) {
                    setConnectTarget(null);
                  }
                  setDeleteConfirmId(null);
                  showFeedback(
                    isArabic ? 'تم حذف البريد الإلكتروني.' : 'Subscriber removed.'
                  );
                }}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#FAF0DC] bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {isArabic ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CLEAR / RESET SUBSCRIBERS CONFIRMATION */}
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
                  ? 'حذف جميع المشتركين؟'
                  : 'Delete All Subscribers?'
                : isArabic
                ? 'إعادة تعيين قائمة المشتركين؟'
                : 'Reset Subscribers List?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {confirmListAction === 'clear'
                ? isArabic
                  ? 'سيتم مسح جميع عناوين البريد الإلكتروني من قائمة النشرة البريدية وقاعدة البيانات عبر جميع الأجهزة.'
                  : 'This will permanently delete all email subscribers from the list and cloud database across all connected devices.'
                : isArabic
                ? 'سيتم استبدال القائمة الحالية ببيانات المشتركين الافتراضية النموذجية ومزامنتها عبر جميع الأجهزة.'
                : 'This will replace the current subscriber list with the default sample records and sync across all connected devices.'}
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
