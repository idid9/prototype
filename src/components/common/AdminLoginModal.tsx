import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Eye, EyeOff, X, Compass, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccessRedirect?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccessRedirect }) => {
  const { loginModalOpen, closeLoginModal, loginWithPassword } = useAuth();
  const { language, t, isRtl } = useLanguage();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-[#202923]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Subtle decorative Saudi palm motif background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D9C29A]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#123B32]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-[#777D75] hover:text-[#123B32] transition-colors rounded-lg hover:bg-[#D9C29A]/20 cursor-pointer"
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#123B32] flex items-center justify-center text-[#D9C29A] shadow-md mb-3">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#123B32]">
            {isArabic ? (
              <>
                <span>تور</span>
                <span className="text-[#C6A46B]">فلو</span>
              </>
            ) : (
              <>
                <span>Tour</span>
                <span className="text-[#C6A46B]">Flow</span>
              </>
            )}
          </div>
          <h2 className="text-lg font-semibold text-[#123B32] mt-1">{t('auth.title')}</h2>
          <p className="text-xs text-[#777D75] mt-1 max-w-xs">{t('auth.sub')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#123B32] mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-[#777D75]">
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
                className={`w-full text-sm py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 bg-white border ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D9C29A]/60'
                } rounded-xl text-[#202923] focus:outline-none focus:ring-2 focus:ring-[#123B32] transition-all`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-[#777D75] hover:text-[#123B32]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{t('auth.error')}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Credential Helper */}
          <div className="flex items-center justify-between p-2.5 bg-[#D9C29A]/15 border border-[#D9C29A]/40 rounded-xl text-xs text-[#123B32]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#123B32]" />
              <span className="font-mono font-medium">{t('auth.demoHint')}</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-semibold text-[#123B32] hover:text-[#1D5546] underline cursor-pointer"
            >
              {isArabic ? 'تعبئة الرمز التجريبي' : 'Fill Demo Code'}
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeLoginModal}
              className="w-1/2 py-2.5 px-4 text-xs font-medium text-[#777D75] bg-white border border-[#D9C29A]/50 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              {t('auth.cancel')}
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 text-xs font-semibold text-white bg-[#123B32] hover:bg-[#1D5546] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {t('auth.loginBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
