import React, { useState } from 'react';
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
