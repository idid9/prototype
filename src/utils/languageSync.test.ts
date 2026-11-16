import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCloudLanguageSync,
  shouldReloadForMapLanguage,
} from './languageSync';

test('resolveCloudLanguageSync preserves manual visitor override across page reloads', () => {
  const result = resolveCloudLanguageSync({
    lastCloudDefault: null,
    incomingCloudDefault: 'ar',
    hasManualOverride: true,
  });

  assert.equal(result.nextCloudDefault, 'ar');
  assert.equal(result.languageToApply, null);
  assert.equal(result.nextHasManualOverride, true);
});

test('resolveCloudLanguageSync applies initial cloud default when visitor has no manual override', () => {
  const result = resolveCloudLanguageSync({
    lastCloudDefault: null,
    incomingCloudDefault: 'ar',
    hasManualOverride: false,
  });

  assert.equal(result.nextCloudDefault, 'ar');
  assert.equal(result.languageToApply, 'ar');
  assert.equal(result.nextHasManualOverride, false);
});

test('resolveCloudLanguageSync applies live admin default change even after manual override', () => {
  const result = resolveCloudLanguageSync({
    lastCloudDefault: 'ar',
    incomingCloudDefault: 'en',
    hasManualOverride: true,
  });

  assert.equal(result.nextCloudDefault, 'en');
  assert.equal(result.languageToApply, 'en');
  assert.equal(result.nextHasManualOverride, false);
});

test('shouldReloadForMapLanguage triggers reload only for visitor language switches when Maps is already loaded', () => {
  assert.equal(
    shouldReloadForMapLanguage({
      manualVisitorOverride: true,
      currentLanguage: 'ar',
      nextLanguage: 'en',
      hasGoogleMapsLoaded: true,
      loadedMapLanguage: 'ar',
    }),
    true
  );

  assert.equal(
    shouldReloadForMapLanguage({
      manualVisitorOverride: false,
      currentLanguage: 'ar',
      nextLanguage: 'en',
      hasGoogleMapsLoaded: true,
      loadedMapLanguage: 'ar',
    }),
    false
  );

  assert.equal(
    shouldReloadForMapLanguage({
      manualVisitorOverride: true,
      currentLanguage: 'ar',
      nextLanguage: 'ar',
      hasGoogleMapsLoaded: true,
      loadedMapLanguage: 'ar',
    }),
    false
  );

  assert.equal(
    shouldReloadForMapLanguage({
      manualVisitorOverride: true,
      currentLanguage: 'ar',
      nextLanguage: 'en',
      hasGoogleMapsLoaded: false,
      loadedMapLanguage: null,
    }),
    false
  );
});
