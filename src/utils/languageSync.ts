import { Language } from '../types';

export interface CloudLanguageSyncInput {
  lastCloudDefault: Language | null;
  incomingCloudDefault: Language | undefined | null;
  hasManualOverride: boolean;
}

export interface CloudLanguageSyncResult {
  nextCloudDefault: Language | null;
  languageToApply: Language | null;
  nextHasManualOverride: boolean;
}

/**
 * Resolves how incoming Firestore settings.defaultLanguage interacts with
 * a visitor's persisted manual language choice.
 */
export function resolveCloudLanguageSync(
  input: CloudLanguageSyncInput
): CloudLanguageSyncResult {
  const { lastCloudDefault, incomingCloudDefault, hasManualOverride } = input;
  if (incomingCloudDefault !== 'en' && incomingCloudDefault !== 'ar') {
    return {
      nextCloudDefault: lastCloudDefault,
      languageToApply: null,
      nextHasManualOverride: hasManualOverride,
    };
  }

  const cloudChanged =
    lastCloudDefault !== null && lastCloudDefault !== incomingCloudDefault;
  const initialCloudFollow =
    lastCloudDefault === null && !hasManualOverride;

  if (cloudChanged || initialCloudFollow) {
    return {
      nextCloudDefault: incomingCloudDefault,
      languageToApply: incomingCloudDefault,
      nextHasManualOverride: false,
    };
  }

  return {
    nextCloudDefault: incomingCloudDefault,
    languageToApply: null,
    nextHasManualOverride: hasManualOverride,
  };
}

/**
 * Google Maps JavaScript API locks its tile/place-label language at script bootstrap.
 * Determines whether switching language requires a page reload to re-initialize Maps tiles.
 */
export function shouldReloadForMapLanguage(params: {
  manualVisitorOverride?: boolean;
  currentLanguage: Language;
  nextLanguage: Language;
  hasGoogleMapsLoaded: boolean;
  loadedMapLanguage?: Language | null;
}): boolean {
  const {
    manualVisitorOverride,
    currentLanguage,
    nextLanguage,
    hasGoogleMapsLoaded,
    loadedMapLanguage,
  } = params;

  if (!manualVisitorOverride) return false;
  if (nextLanguage === currentLanguage) return false;
  if (!hasGoogleMapsLoaded) return false;
  if (loadedMapLanguage && loadedMapLanguage === nextLanguage) return false;
  return true;
}
