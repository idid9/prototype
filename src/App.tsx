import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { initializeRepository } from './services/dataService';
import { VisitorPortalPage } from './pages/visitor/VisitorPortalPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { Experience } from './types';

// Seed repository on initial boot
initializeRepository();

const MainRouter: React.FC = () => {
  const { isAdminAuthenticated, openLoginModal } = useAuth();

  // Determine initial route based on window pathname or hash
  const [currentRoute, setCurrentRoute] = useState<'visitor' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        return 'admin';
      }
    }
    return 'visitor';
  });

  const [previewExperience, setPreviewExperience] = useState<Experience | null>(null);

  // Sync route on popstate or hashchange
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('visitor');
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateToAdmin = () => {
    if (!isAdminAuthenticated) {
      openLoginModal();
    }
    setCurrentRoute('admin');
    window.history.pushState({}, '', '/admin');
  };

  const navigateToVisitor = () => {
    setCurrentRoute('visitor');
    window.history.pushState({}, '', '/');
  };

  const handlePreviewExperience = (exp: Experience) => {
    setPreviewExperience(exp);
    setCurrentRoute('visitor');
    window.history.pushState({}, '', `/`);
  };

  return (
    <div className="min-h-screen selection:bg-[#D9C29A]/40 selection:text-[#123B32]">
      {/* Route Render */}
      {currentRoute === 'admin' ? (
        <AdminDashboardPage
          onGoToVisitorSite={navigateToVisitor}
          onPreviewExperienceOnSite={handlePreviewExperience}
        />
      ) : (
        <VisitorPortalPage
          onGoToAdmin={navigateToAdmin}
          initialSelectedExperience={previewExperience}
        />
      )}

      {/* Admin Login Modal (global modal accessible from lock icons) */}
      <AdminLoginModal
        onSuccessRedirect={() => {
          setCurrentRoute('admin');
          window.history.pushState({}, '', '/admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <MainRouter />
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
