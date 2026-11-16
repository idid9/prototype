import React, { createContext, useContext, useEffect } from 'react';
import {
  APIProvider,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

interface MapsContextValue {
  hasApiKey: boolean;
  isAvailable: boolean;
  status: APILoadingStatus | 'NO_KEY';
}

const MapsAvailabilityContext = createContext<MapsContextValue>({
  hasApiKey: false,
  isAvailable: false,
  status: 'NO_KEY',
});

export function useMapsAvailability(): MapsContextValue {
  return useContext(MapsAvailabilityContext);
}

const GOOGLE_MAPS_API_KEY = (
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
).trim();

const MapsStatusBridge: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const status = useApiLoadingStatus();
  const isAvailable =
    status !== APILoadingStatus.FAILED &&
    status !== APILoadingStatus.AUTH_FAILURE;

  return (
    <MapsAvailabilityContext.Provider
      value={{ hasApiKey: true, isAvailable, status }}
    >
      {children}
    </MapsAvailabilityContext.Provider>
  );
};

export const MapsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { language } = useLanguage();
  const hasApiKey = GOOGLE_MAPS_API_KEY.length > 0;

  const win =
    typeof window !== 'undefined'
      ? (window as Window & {
          google?: { maps?: unknown };
          __tfMapsLoadedLanguage?: Language;
        })
      : null;

  const loadedLanguage = win?.__tfMapsLoadedLanguage;
  const needsLanguageReload = Boolean(
    hasApiKey &&
      win?.google?.maps &&
      loadedLanguage &&
      loadedLanguage !== language
  );

  useEffect(() => {
    if (!hasApiKey || !win) return;
    if (!win.__tfMapsLoadedLanguage) {
      win.__tfMapsLoadedLanguage = language;
    } else if (win.google?.maps && win.__tfMapsLoadedLanguage !== language) {
      window.location.reload();
    }
  }, [hasApiKey, language, win]);

  if (!hasApiKey) {
    return (
      <MapsAvailabilityContext.Provider
        value={{ hasApiKey: false, isAvailable: false, status: 'NO_KEY' }}
      >
        {children}
      </MapsAvailabilityContext.Provider>
    );
  }

  // Keep the first-render language prop stable while a language reload is pending
  const providerLanguage = needsLanguageReload && loadedLanguage ? loadedLanguage : language;

  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      language={providerLanguage}
      region="SA"
      libraries={['places', 'marker', 'routes']}
    >
      <MapsStatusBridge>{children}</MapsStatusBridge>
    </APIProvider>
  );
};
