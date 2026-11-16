import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { VisitorPortalPage } from './pages/visitor/VisitorPortalPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { Experience } from './types';

function AppShell() {
  const { isAdminAuthenticated, openLoginModal } = useAuth();
  const [viewMode, setViewMode] = useState<'visitor' | 'admin'>('visitor');
  const [previewExperience, setPreviewExperience] = useState<Experience | null>(null);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const handleGoToAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      openLoginModal();
    }
  };

  const handlePreviewExperience = (exp: Experience) => {
    setPreviewExperience(exp);
    setViewMode('visitor');
  };

  return (
    <>
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {viewMode === 'admin' ? (
        <AdminDashboardPage
          onGoToVisitorSite={() => setViewMode('visitor')}
          onPreviewExperienceOnSite={handlePreviewExperience}
        />
      ) : (
        <VisitorPortalPage
          onGoToAdmin={handleGoToAdmin}
          initialSelectedExperience={previewExperience}
        />
      )}
      <AdminLoginModal onSuccessRedirect={() => setViewMode('admin')} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
