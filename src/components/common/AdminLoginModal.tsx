import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { isFirebaseConfigured } from '../../services/firebase/firestore';
import { Lock, Eye, EyeOff, X, Compass, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccessRedirect?: () => void;
}

function formatAuthErrorMessage(errorCode: string | null, isArabic: boolean): string | null {
  if (!errorCode) return null;
  if (errorCode.startsWith('UNAUTHORIZED:')) {
    const email = errorCode.replace('UNAUTHORIZED:', '');
    return isArabic
      ? `الحساب (${email}) غير مخول للوصول إلى لوحة الإدارة. يرجى تسجيل الدخول بحساب المسؤول المعتمد.`
      : `Account (${email}) is not authorized for Admin Console access. Please sign in with an authorized operator account.`;
  }
  if (errorCode === 'POPUP_BLOCKED') {
    return isArabic
      ? 'تم حظر نافذة تسجيل الدخول المنبثقة. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.'
      : 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
  }
  return isArabic
    ? 'تعذر إتمام تسجيل الدخول بحساب جوجل. يرجى المحاولة مرة أخرى.'
    : 'Unable to complete Google sign-in. Please try again.';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccessRedirect }) => {
  const {
    loginModalOpen,
    closeLoginModal,
    loginWithGoogle,
    loginWithPassword,
    authLoading,
    authError,
    clearAuthError,
  } = useAuth();
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const firebaseEnabled = isFirebaseConfigured();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(false);

  if (!loginModalOpen) return null;

  const handleGoogleSignIn = async () => {
    const success = await loginWithGoogle();
    if (success && onSuccessRedirect) {
      onSuccessRedirect();
    }
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithPassword(password);
    if (success) {
      setLocalError(false);
      setPassword('');
      if (onSuccessRedirect) {
        onSuccessRedirect();
      }
    } else {
      setLocalError(true);
    }
  };

  const handleDemoFill = () => {
    setPassword('12341234');
    setLocalError(false);
  };

  const formattedCloudError = formatAuthErrorMessage(authError, isArabic);

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
          onClick={() => {
            clearAuthError();
            closeLoginModal();
          }}
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

        {firebaseEnabled ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#D9C29A]/15 border border-[#D9C29A]/45 rounded-xl text-xs text-[#123B32] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#123B32] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isArabic
                  ? 'تتم مزامنة كافة التغييرات في الوقت الفعلي عبر جميع الأجهزة. سجّل الدخول بحساب جوجل المصرح به للمسؤول لإدارة المنصة.'
                  : 'All edits sync instantaneously across all devices via Firestore. Sign in with your verified Google operator account to manage the platform.'}
              </p>
            </div>

            {formattedCloudError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formattedCloudError}</span>
              </div>
            )}

            <div className="pt-1 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full py-3 px-4 bg-[#123B32] hover:bg-[#1D5546] disabled:opacity-70 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2.5"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
                    />
                  </svg>
                )}
                <span>
                  {authLoading
                    ? isArabic
                      ? 'جارٍ التحقق من الحساب...'
                      : 'Verifying Account...'
                    : isArabic
                    ? 'تسجيل الدخول بحساب جوجل'
                    : 'Sign in with Google'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  closeLoginModal();
                }}
                className="w-full py-2.5 px-4 text-xs font-medium text-[#777D75] bg-white border border-[#D9C29A]/50 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                {t('auth.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPassword} className="space-y-4">
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
                    if (localError) setLocalError(false);
                  }}
                  placeholder={t('auth.passwordPlaceholder')}
                  className={`w-full text-sm py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 bg-white border ${
                    localError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D9C29A]/60'
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
              {localError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('auth.error')}</span>
                </div>
              )}
            </div>

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
                className="w-1/2 py-2.5 px-4 text-xs font-medium text-[#777D75] bg-white border border-[#D9C29A]/50 rounded-xl hover:bg-neutral-50 transition-colors"
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
        )}
      </div>
    </div>
  );
};
