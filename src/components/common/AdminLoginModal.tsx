import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Lock, Eye, EyeOff, X, Compass, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccessRedirect?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccessRedirect }) => {
  const { loginModalOpen, closeLoginModal, loginWithPassword } = useAuth();
  const { language, t, isRtl } = useLanguage();
  const { isDarkGlass, currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex, getGlassyIconStyle } = useTheme();
  const isArabic = language === 'ar';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithPassword(password);
    if (success) {
      setError(false);
      setPassword('');
      if (onSuccessRedirect) {
        onSuccessRedirect();
      }
    } else {
      setError(true);
    }
  };

  const handleDemoFill = () => {
    setPassword('12341234');
    setError(false);
  };

  return (
    <div
      data-glass-tone={isDarkGlass ? 'dark' : 'light'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="relative w-full max-w-md bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-[var(--tf-text)]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Subtle decorative ambient glow */}
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: currentAccentHex }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-15"
          style={{ backgroundColor: currentAccentHex }}
        />

        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] transition-colors rounded-lg hover:bg-[var(--tf-surface-subtle)] cursor-pointer"
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-3"
            style={getGlassyIconStyle()}
          >
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[var(--tf-heading)]">
            {isArabic ? (
              <>
                <span>تور</span>
                <span style={{ color: currentAccentTextHex }}>فلو</span>
              </>
            ) : (
              <>
                <span>Tour</span>
                <span style={{ color: currentAccentTextHex }}>Flow</span>
              </>
            )}
          </div>
          <h2 className="text-lg font-semibold text-[var(--tf-heading)] mt-1">{t('auth.title')}</h2>
          <p className="text-xs text-[var(--tf-muted)] mt-1 max-w-xs">{t('auth.sub')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-[var(--tf-muted)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={t('auth.passwordPlaceholder')}
                className={`w-full text-sm py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 bg-[var(--tf-input-bg)] border ${
                  error ? 'border-[var(--tf-danger-border)] ring-1 ring-[var(--tf-danger-border)]' : 'border-[var(--tf-border)]'
                } rounded-xl text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--tourflow-accent)] transition-all`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-[var(--tf-muted)] hover:text-[var(--tf-heading)] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--tf-danger-text)] font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{t('auth.error')}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Credential Helper */}
          <div className="flex items-center justify-between p-2.5 bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl text-xs text-[var(--tf-text)]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: currentAccentTextHex }} />
              <span className="font-mono font-medium">{t('auth.demoHint')}</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-semibold hover:underline cursor-pointer"
              style={{ color: currentAccentTextHex }}
            >
              {isArabic ? 'تعبئة الرمز التجريبي' : 'Fill Demo Code'}
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeLoginModal}
              className="w-1/2 py-2.5 px-4 text-xs font-medium text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] rounded-xl hover:opacity-90 transition-colors cursor-pointer"
            >
              {t('auth.cancel')}
            </button>
            <button
              type="submit"
              style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
              className="w-1/2 py-2.5 px-4 text-xs font-bold rounded-xl shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              {t('auth.loginBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
