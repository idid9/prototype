import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { BusinessSettings } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { Database, RotateCcw, Check, ShieldCheck, Radio, Server } from 'lucide-react';

interface SettingsTabProps {
  settings: BusinessSettings;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings }) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex } = useTheme();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress);
  const [currency, setCurrency] = useState(settings.currency);
  const [defaultLanguage, setDefaultLanguage] = useState(settings.defaultLanguage);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(settings.enableEmailNotifications);
  const [enableWhatsAppNotifications, setEnableWhatsAppNotifications] = useState(settings.enableWhatsAppNotifications);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setBusinessName(settings.businessName);
    setBusinessEmail(settings.businessEmail);
    setBusinessPhone(settings.businessPhone);
    setWhatsappNumber(settings.whatsappNumber);
    setBusinessAddress(settings.businessAddress);
    setCurrency(settings.currency);
    setDefaultLanguage(settings.defaultLanguage);
    setEnableEmailNotifications(settings.enableEmailNotifications);
    setEnableWhatsAppNotifications(settings.enableWhatsAppNotifications);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.updateSettings({
      businessName,
      businessEmail,
      businessPhone,
      whatsappNumber,
      businessAddress,
      currency,
      defaultLanguage,
      enableEmailNotifications,
      enableWhatsAppNotifications,
    });
    setLanguage(defaultLanguage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    DataService.resetDemoData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'إعدادات المنصة والمزامنة الفورية'
              : 'Platform Configuration & Real-Time Sync'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'إدارة هوية المنصة، والعملة الافتراضية، ومراقبة محرك قاعدة البيانات الفوري.'
              : 'Manage platform identity, currency defaults, and inspect the real-time database engine.'}
          </p>
        </div>

        {(savedSuccess || resetSuccess) && (
          <div className="px-3 py-1.5 bg-[var(--tf-success-bg)] border border-[var(--tf-success-border)] text-[var(--tf-success-text)] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              {resetSuccess
                ? isArabic
                  ? 'تمت استعادة البيانات التجريبية ومزامنتها عبر اللوحتين في الوقت الفعلي!'
                  : 'Demo database restored & synced across both panels in real time!'
                : isArabic
                ? 'تم حفظ الإعدادات ومزامنتها عبر اللوحتين!'
                : 'Settings saved & synced across both panels!'}
            </span>
          </div>
        )}
      </div>

      {/* DATABASE ARCHITECTURE & REALTIME ENGINE STATUS */}
      <GlassContainer className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5" style={{ color: currentAccentTextHex }} />
          <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'بنية قاعدة البيانات: محرك المزامنة الفورية الثنائي'
              : 'Database Architecture: Dual-Mode Real-Time Engine'}
          </h3>
        </div>
        <p className="text-xs text-[var(--tf-muted)] mb-4 leading-relaxed">
          {isArabic
            ? 'تستخدم تورفلو بنية بيانات موحدة. تتزامن بوابة الزوار العامة ولوحة الإدارة هذه فورياً عبر اشتراكات تفاعلية مباشرة؛ فأي تعديل للمنتجات أو استفسار جديد أو تغيير في حالة النشر يظهر فوراً في صفحة الزوار دون تحديث.'
            : 'TourFlow uses a unified Firestore data contract. Both the public visitor portal and this admin console synchronize instantaneously through reactive real-time subscriptions. Any product edit, new inquiry, or publication status toggled here appears immediately on the visitor page without refreshing.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl">
            <div className="flex items-center gap-1.5 text-[var(--tf-info-text)] font-bold mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isArabic ? 'محرك الوقت الفعلي نشط' : 'Real-Time Engine Active'}</span>
            </div>
            <p className="text-[11px] text-[var(--tf-muted)]">
              {isArabic
                ? 'قناة البث بين النوافذ والمستمعات التفاعلية نشطة. زمن الاستجابة < ٢٠ مللي ثانية.'
                : 'Cross-tab broadcast channel & reactive listeners active. Latency: < 20ms.'}
            </p>
          </div>

          <div className="p-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl">
            <div className="flex items-center gap-1.5 text-[var(--tf-heading)] font-bold mb-1">
              <Server className="w-3.5 h-3.5" style={{ color: currentAccentTextHex }} />
              <span>{isArabic ? 'قواعد الأمان مفعّلة' : 'Firestore Rules Deployed'}</span>
            </div>
            <p className="text-[11px] text-[var(--tf-muted)]">
              {isArabic
                ? 'قواعد أمان صارمة مع عزل بيانات الهوية الشخصية والوصول المصرح.'
                : 'Strict ABAC security rules with PII isolation defined in firestore.rules.'}
            </p>
          </div>

          <div className="p-3.5 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl">
            <div className="flex items-center gap-1.5 text-[var(--tf-heading)] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--tf-info-text)]" />
              <span>{isArabic ? 'التحكم بالصلاحيات مفعل' : 'Access Control Enforced'}</span>
            </div>
            <p className="text-[11px] text-[var(--tf-muted)]">
              {isArabic
                ? 'بيانات إدارة علاقات العملاء والملاحظات الخاصة مقصورة على المسؤولين المعتمدين.'
                : 'Customer CRM and private notes are restricted to verified administrators.'}
            </p>
          </div>
        </div>
      </GlassContainer>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        <GlassContainer delay={0.05} className="p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-[var(--tf-heading)] pb-2 border-b border-[var(--tf-border)]">
            {isArabic ? 'هوية المنصة وخدمة العملاء' : 'Platform Identity & Concierge'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'اسم منصة الأعمال' : 'Business Platform Name'}
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'البريد التشغيلي' : 'Operational Email'}
              </label>
              <input
                type="email"
                dir="ltr"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'هاتف المكتب' : 'Office Phone'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'الخط الساخن للواتساب' : 'WhatsApp Hotline'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'العملة التشغيلية' : 'Operational Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'SAR')}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-bold cursor-pointer focus:outline-none"
              >
                <option value="SAR">
                  {isArabic ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'عنوان المكتب المسجل' : 'Registered Office Address'}
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                {isArabic ? 'لغة المنصة الافتراضية (متزامنة لجميع الأجهزة)' : 'Platform Default Language (Synced Across Devices)'}
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value as 'en' | 'ar')}
                className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl font-bold cursor-pointer focus:outline-none"
              >
                <option value="en">{isArabic ? 'الإنجليزية (English)' : 'English (LTR)'}</option>
                <option value="ar">{isArabic ? 'العربية (RTL)' : 'Arabic / العربية (RTL)'}</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-[var(--tf-heading)] mb-2">
              {isArabic ? 'توجيه الإشعارات' : 'Notification Routing'}
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 text-xs text-[var(--tf-text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableEmailNotifications}
                  onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                  style={{ accentColor: currentAccentHex }}
                  className="rounded"
                />
                <span>
                  {isArabic
                    ? 'تنبيهات البريد الإلكتروني عند استلام طلبات جديدة'
                    : 'Email alerts on new visitor inquiries'}
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[var(--tf-text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWhatsAppNotifications}
                  onChange={(e) => setEnableWhatsAppNotifications(e.target.checked)}
                  style={{ accentColor: currentAccentHex }}
                  className="rounded"
                />
                <span>
                  {isArabic
                    ? 'إعادة توجيه إشعارات خدمة العملاء عبر واتساب'
                    : 'WhatsApp concierge notification forwarding'}
                </span>
              </label>
            </div>
          </div>
        </GlassContainer>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-danger-border)] text-[var(--tf-danger-text)] hover:bg-[var(--tf-danger-bg)] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة البيانات التجريبية' : 'Reset Demo Seed Data'}</span>
          </button>

          <button
            type="submit"
            style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
            className="py-3 px-8 rounded-xl text-xs font-bold shadow-md transition-opacity hover:opacity-90 cursor-pointer"
          >
            {isArabic ? 'حفظ الإعدادات' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] rounded-2xl p-6 max-w-sm w-full border border-[var(--tf-border)] shadow-xl text-center text-[var(--tf-text)]">
            <RotateCcw className="w-10 h-10 text-[var(--tf-danger-text)] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[var(--tf-heading)] mb-1">
              {isArabic ? 'إعادة تعيين كافة البيانات التجريبية؟' : 'Reset All Demo Data?'}
            </h3>
            <p className="text-xs text-[var(--tf-muted)] mb-6">
              {isArabic
                ? 'سيؤدي ذلك إلى استعادة جميع الوجهات السعودية الافتراضية والتجارب المنشورة والعروض والاستفسارات النموذجية ومحتوى الموقع.'
                : 'This will restore all default Saudi destinations, published experiences, promotions, sample inquiries, and CMS copy.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl cursor-pointer hover:bg-[var(--tf-surface-hover)]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleResetDemoData}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#FAF0DC] bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                {isArabic ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
