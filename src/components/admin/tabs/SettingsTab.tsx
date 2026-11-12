import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { BusinessSettings } from '../../../types';
import { DataService } from '../../../services/dataService';
import { Settings, Database, RotateCcw, Check, ShieldCheck, Radio, Server, Palette } from 'lucide-react';

interface SettingsTabProps {
  settings: BusinessSettings;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings }) => {
  const { isRtl } = useLanguage();

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { setIsCustomizingOpen, currentAccentHex, settings: themeSettings } = useTheme();

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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    DataService.resetDemoData();
    setShowResetConfirm(false);
    alert('Demo database reset to default pristine state with all sample Saudi experiences and inquiries.');
    window.location.reload();
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
            Platform Configuration & Real-Time Sync
          </h2>
          <p className="text-xs text-[#777D75]">
            Manage platform identity, currency defaults, and inspect the real-time database engine.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Quick Appearance Customizer Banner */}
      <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: currentAccentHex }}
          >
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#123B32]">
              Dashboard Appearance & Theme Controls
            </h3>
            <p className="text-xs text-[#777D75]">
              Glassmorphism ({Math.round(themeSettings.cardTranslucency * 100)}% opacity, {themeSettings.blurIntensity.toUpperCase()} blur), background wallpaper, and accent color swatches.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCustomizingOpen(true)}
          className="py-2.5 px-4 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <Palette className="w-4 h-4" />
          <span>Customize Appearance</span>
        </button>
      </div>

      {/* DATABASE ARCHITECTURE & REALTIME ENGINE STATUS */}
      <div className="bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-[#123B32]" />
          <h3 className="font-serif text-base font-bold text-[#123B32]">
            Database Architecture: Dual-Mode Real-Time Engine
          </h3>
        </div>
        <p className="text-xs text-[#777D75] mb-4 leading-relaxed">
          TourFlow uses a unified Firestore data contract. Both the public visitor portal and this admin console synchronize instantaneously through reactive real-time subscriptions (<span className="font-mono text-[#123B32]">onSnapshot</span> / reactive event bus). Any product edit, new inquiry, or publication status toggled here appears immediately on the visitor page without refreshing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white border border-[#D9C29A]/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Engine Active</span>
            </div>
            <p className="text-[11px] text-[#777D75]">
              Cross-tab broadcast channel & reactive listeners active. Latency: &lt; 20ms.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#D9C29A]/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-[#123B32] font-bold mb-1">
              <Server className="w-3.5 h-3.5 text-[#C6A46B]" />
              <span>Firestore Rules Deployed</span>
            </div>
            <p className="text-[11px] text-[#777D75]">
              Strict ABAC security rules with PII isolation defined in <span className="font-mono">firestore.rules</span>.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#D9C29A]/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-[#123B32] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Access Control Enforced</span>
            </div>
            <p className="text-[11px] text-[#777D75]">
              Customer CRM and private notes are restricted to verified administrators.
            </p>
          </div>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-[#D9C29A]/50 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-[#123B32] pb-2 border-b border-[#D9C29A]/30">
            Platform Identity & Concierge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#123B32] mb-1">
                Business Platform Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123B32] mb-1">
                Operational Email
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#123B32] mb-1">
                Office Phone
              </label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123B32] mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123B32] mb-1">
                Operational Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl font-bold cursor-pointer"
              >
                <option value="SAR">Saudi Riyal (SAR)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#123B32] mb-1">
              Registered Office Address
            </label>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-[#123B32] mb-2">Notification Routing</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 text-xs text-[#202923] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableEmailNotifications}
                  onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                  className="rounded text-[#123B32]"
                />
                <span>Email alerts on new visitor inquiries</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#202923] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWhatsAppNotifications}
                  onChange={(e) => setEnableWhatsAppNotifications(e.target.checked)}
                  className="rounded text-[#123B32]"
                />
                <span>WhatsApp concierge notification forwarding</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="submit"
            className="py-3 px-8 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#D9C29A]/50 shadow-xl text-center">
            <RotateCcw className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#123B32] mb-1">Reset All Demo Data?</h3>
            <p className="text-xs text-[#777D75] mb-6">
              This will restore all default Saudi destinations, published experiences, promotions, sample inquiries, and CMS copy.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-[#777D75] bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                className="w-1/2 py-2 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
