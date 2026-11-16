import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Destination, Experience, WebsiteContent } from '../../types';
import { getSiteText } from '../../utils/siteTexts';
import {
  localizeCurrency,
  localizeCategory,
} from '../../utils/localization';
import {
  buildDestinationSearchQuery,
  buildGoogleMapsPlaceUrl,
  buildGoogleMapsDirectionsUrl,
  summarizeDestinationGuides,
  filterDestinationSummaries,
  formatRouteMetrics,
  isMapsQuotaError,
  DestinationGuideSummary,
} from '../../utils/mapGuideUtils';
import { useMapsAvailability } from './MapsProvider';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Search,
  Users,
  Star,
  Compass,
  Route as RouteIcon,
  LocateFixed,
  X,
  ArrowRight,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface ResolvedDestinationPlace {
  destinationId: string;
  placeId: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  googleMapsURI?: string | null;
  rating?: number | null;
  userRatingCount?: number | null;
}

interface OriginLocation {
  label: string;
  location: google.maps.LatLngLiteral;
}

interface RouteSummaryInfo {
  distanceText: string;
  durationText: string;
}

interface DestinationMapExplorerProps {
  destinations: Destination[];
  experiences: Experience[];
  content?: WebsiteContent;
  currency?: string;
  focusedDestinationId?: string | null;
  onSelectDestinationForCatalog: (destId: string) => void;
  onOpenExperienceDetail: (exp: Experience) => void;
}

const SAUDI_DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: 23.8859,
  lng: 45.0792,
};

interface MarkerWithInfoWindowProps {
  summary: DestinationGuideSummary;
  resolved: ResolvedDestinationPlace;
  isSelected: boolean;
  isInfoOpen: boolean;
  accentHex: string;
  accentTextHex: string;
  accentBtnTextHex: string;
  currency?: string;
  content?: WebsiteContent;
  language: 'en' | 'ar';
  originLabel?: string;
  onSelectMarker: (destId: string) => void;
  onCloseInfoWindow: () => void;
  onFindGuides: (destId: string) => void;
}

const DestinationMarkerItem: React.FC<MarkerWithInfoWindowProps> = ({
  summary,
  resolved,
  isSelected,
  isInfoOpen,
  accentHex,
  accentTextHex,
  accentBtnTextHex,
  currency,
  content,
  language,
  originLabel,
  onSelectMarker,
  onCloseInfoWindow,
  onFindGuides,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const isArabic = language === 'ar';
  const destName = isArabic
    ? summary.destination.nameAr
    : summary.destination.name;
  const gmapsUrl = buildGoogleMapsPlaceUrl({
    googleMapsURI: resolved.googleMapsURI,
    placeId: resolved.placeId,
    query: buildDestinationSearchQuery(summary.destination),
  });
  const directionsUrl = buildGoogleMapsDirectionsUrl({
    destinationQuery:
      resolved.formattedAddress ||
      buildDestinationSearchQuery(summary.destination),
    destinationPlaceId: resolved.placeId,
    originQuery: originLabel,
  });

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={resolved.location}
        title={destName}
        zIndex={isSelected ? 50 : 10}
        onClick={() => onSelectMarker(summary.destination.id)}
      >
        <Pin
          background={isSelected ? accentHex : '#123B32'}
          borderColor={isSelected ? '#FFFFFF' : accentHex}
          glyphColor={isSelected ? '#0D2B24' : '#FAF0DC'}
          scale={isSelected ? 1.25 : 1.05}
        >
          <span className="text-[11px] font-extrabold leading-none">
            {summary.guideCount}
          </span>
        </Pin>
      </AdvancedMarker>

      {isInfoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={290}
          onCloseClick={onCloseInfoWindow}
        >
          <div
            className="p-1 text-[#0B3B30] space-y-2"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#846121]">
                  {isArabic
                    ? summary.destination.regionAr
                    : summary.destination.region}
                </span>
                {resolved.rating && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0B3B30]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {resolved.rating.toFixed(1)}
                    {resolved.userRatingCount
                      ? ` (${resolved.userRatingCount.toLocaleString()})`
                      : ''}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-base font-bold text-[#0B3B30] leading-snug">
                {destName}
              </h4>
              <p className="text-[11px] text-[#42685E] leading-snug mt-0.5">
                {resolved.formattedAddress || resolved.displayName}
              </p>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-[#F6F4EF] border border-[#0B3B30]/15 text-[11px] flex items-center justify-between gap-2">
              <span className="font-semibold text-[#0B3B30] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#846121]" />
                {summary.guideCount > 0
                  ? isArabic
                    ? `${summary.guideCount} جولات بمرشد محلي`
                    : `${summary.guideCount} Local UMKM ${
                        summary.guideCount === 1 ? 'Guide' : 'Guides'
                      }`
                  : isArabic
                  ? 'قريباً مرشدون محليون'
                  : 'Guides joining soon'}
              </span>
              {summary.minPrice !== null && (
                <span className="font-mono font-bold text-[#0B3B30]">
                  {isArabic ? 'من ' : 'From '}
                  {summary.minPrice} {localizeCurrency(currency, language)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onFindGuides(summary.destination.id)}
                style={{
                  backgroundColor: accentHex,
                  color: accentBtnTextHex,
                }}
                className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer hover:brightness-105 transition-all"
              >
                <span>
                  {getSiteText(content, 'map.findGuidesCta', language)}
                </span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#0B3B30]/20 text-[11px] font-semibold text-[#0B3B30] hover:bg-[#F6F4EF] flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" style={{ color: accentTextHex }} />
                  <span>{isArabic ? 'خرائط جوجل' : 'Google Maps'}</span>
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#0B3B30]/20 text-[11px] font-semibold text-[#0B3B30] hover:bg-[#F6F4EF] flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3" style={{ color: accentTextHex }} />
                  <span>{isArabic ? 'الاتجاهات' : 'Directions'}</span>
                </a>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

interface RouteOverlayControllerProps {
  origin: OriginLocation | null;
  destination: google.maps.LatLngLiteral | null;
  language: 'en' | 'ar';
  strokeColor: string;
  onRouteComputed: (info: RouteSummaryInfo | null) => void;
  onRouteError: (msg: string | null) => void;
}

const RouteOverlayController: React.FC<RouteOverlayControllerProps> = ({
  origin,
  destination,
  language,
  strokeColor,
  onRouteComputed,
  onRouteError,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    // Cleanup previous polylines cleanly
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    onRouteError(null);

    if (!map || !routesLib || !origin || !destination) {
      onRouteComputed(null);
      return;
    }

    let cancelled = false;

    const request = {
      origin: origin.location,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    };

    (routesLib.Route as any)
      .computeRoutes(request)
      .then((res: { routes?: any[] }) => {
        if (cancelled) return;
        const primaryRoute = res?.routes?.[0];
        if (!primaryRoute) {
          onRouteComputed(null);
          onRouteError(
            language === 'ar'
              ? 'تعذر العثور على مسار قيادة بين النقطتين.'
              : 'No driving route found between your stay and this destination.'
          );
          return;
        }

        if (typeof primaryRoute.createPolylines === 'function') {
          const newPolylines = primaryRoute.createPolylines();
          newPolylines.forEach((polyline: google.maps.Polyline) => {
            polyline.setOptions({
              strokeColor,
              strokeWeight: 5,
              strokeOpacity: 0.9,
            });
            polyline.setMap(map);
          });
          polylinesRef.current = newPolylines;
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const formatted = formatRouteMetrics(
          primaryRoute.distanceMeters,
          primaryRoute.durationMillis,
          language
        );
        onRouteComputed(formatted);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        onRouteComputed(null);
        if (isMapsQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteError(
          language === 'ar'
            ? 'تعذر حساب المسار حالياً، استخدم زر الاتجاهات في خرائط جوجل.'
            : 'Unable to calculate live route right now. You can launch Directions in Google Maps.'
        );
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [
    map,
    routesLib,
    origin,
    destination,
    language,
    strokeColor,
    onRouteComputed,
    onRouteError,
  ]);

  return null;
};

interface InteractiveMapCanvasProps {
  summaries: DestinationGuideSummary[];
  resolvedPlaces: Record<string, ResolvedDestinationPlace>;
  selectedDestId: string | null;
  panTargetDestId: string | null;
  infoWindowDestId: string | null;
  origin: OriginLocation | null;
  fitAllSignal: number;
  accentHex: string;
  accentTextHex: string;
  accentBtnTextHex: string;
  currency?: string;
  content?: WebsiteContent;
  language: 'en' | 'ar';
  onResolvedPlaces: (places: Record<string, ResolvedDestinationPlace>) => void;
  onSelectMarker: (destId: string) => void;
  onCloseInfoWindow: () => void;
  onFindGuides: (destId: string) => void;
  onRouteComputed: (info: RouteSummaryInfo | null) => void;
  onRouteError: (msg: string | null) => void;
}

const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  summaries,
  resolvedPlaces,
  selectedDestId,
  panTargetDestId,
  infoWindowDestId,
  origin,
  fitAllSignal,
  accentHex,
  accentTextHex,
  accentBtnTextHex,
  currency,
  content,
  language,
  onResolvedPlaces,
  onSelectMarker,
  onCloseInfoWindow,
  onFindGuides,
  onRouteComputed,
  onRouteError,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const coreLib = useMapsLibrary('core');

  // Cache resolved destinations across rerenders to stay well within daily quota
  const cacheRef = useRef<Record<string, ResolvedDestinationPlace>>({});
  const hasFittedInitialBoundsRef = useRef(false);

  // Resolve all visible destinations dynamically via Places API (New) Place.searchByText
  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    const toResolve = summaries.filter((s) => {
      const cacheKey = `${s.destination.id}:${language}`;
      return !cacheRef.current[cacheKey];
    });

    if (toResolve.length === 0) {
      const nextMap: Record<string, ResolvedDestinationPlace> = {};
      for (const s of summaries) {
        const cached = cacheRef.current[`${s.destination.id}:${language}`];
        if (cached) nextMap[s.destination.id] = cached;
      }
      onResolvedPlaces(nextMap);
      return;
    }

    (async () => {
      const resolvedBatch: Record<string, ResolvedDestinationPlace> = {};
      for (const s of summaries) {
        const existing = cacheRef.current[`${s.destination.id}:${language}`];
        if (existing) {
          resolvedBatch[s.destination.id] = existing;
        }
      }

      await Promise.all(
        toResolve.map(async (s) => {
          const textQuery = buildDestinationSearchQuery(s.destination);
          try {
            const { places } = await placesLib.Place.searchByText({
              textQuery,
              fields: [
                'id',
                'displayName',
                'formattedAddress',
                'location',
                'googleMapsURI',
                'rating',
                'userRatingCount',
              ],
              maxResultCount: 1,
              region: 'SA',
              language,
            });
            if (cancelled) return;
            const top = places?.[0];
            if (top?.location) {
              const loc =
                typeof top.location.toJSON === 'function'
                  ? top.location.toJSON()
                  : {
                      lat: Number(top.location.lat),
                      lng: Number(top.location.lng),
                    };
              const item: ResolvedDestinationPlace = {
                destinationId: s.destination.id,
                placeId: top.id || '',
                displayName: top.displayName || s.destination.name,
                formattedAddress: top.formattedAddress || textQuery,
                location: loc,
                googleMapsURI: top.googleMapsURI || null,
                rating: typeof top.rating === 'number' ? top.rating : null,
                userRatingCount:
                  typeof top.userRatingCount === 'number'
                    ? top.userRatingCount
                    : null,
              };
              cacheRef.current[`${s.destination.id}:${language}`] = item;
              resolvedBatch[s.destination.id] = item;
            }
          } catch (err) {
            if (isMapsQuotaError(err)) {
              window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            }
          }
        })
      );

      if (!cancelled) {
        onResolvedPlaces(resolvedBatch);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placesLib, summaries, language, onResolvedPlaces]);

  // Fit map bounds once resolved locations arrive or user clicks Reset View
  const fitAllDestinations = useCallback(() => {
    if (!map || !coreLib) return;
    const locs = Object.values(resolvedPlaces)
      .map((p) => p.location)
      .filter(Boolean);
    if (locs.length === 0) return;

    if (locs.length === 1) {
      map.panTo(locs[0]);
      map.setZoom(11);
      return;
    }

    const bounds = new coreLib.LatLngBounds();
    locs.forEach((loc) => bounds.extend(loc));
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [map, coreLib, resolvedPlaces]);

  useEffect(() => {
    if (
      !hasFittedInitialBoundsRef.current &&
      Object.keys(resolvedPlaces).length > 0 &&
      !panTargetDestId
    ) {
      hasFittedInitialBoundsRef.current = true;
      fitAllDestinations();
    }
  }, [resolvedPlaces, panTargetDestId, fitAllDestinations]);

  useEffect(() => {
    if (fitAllSignal > 0) {
      fitAllDestinations();
    }
  }, [fitAllSignal, fitAllDestinations]);

  // Pan smoothly when a traveler explicitly selects a spot or clicks View on Map
  useEffect(() => {
    if (!map || !panTargetDestId || origin) return;
    const resolved = resolvedPlaces[panTargetDestId];
    if (resolved?.location) {
      map.panTo(resolved.location);
      const currentZoom = map.getZoom() || 5;
      if (currentZoom < 9) {
        map.setZoom(10);
      }
    }
  }, [map, panTargetDestId, resolvedPlaces, origin]);

  const selectedResolvedLocation =
    selectedDestId && resolvedPlaces[selectedDestId]
      ? resolvedPlaces[selectedDestId].location
      : null;

  return (
    <GoogleMap
      mapId="DEMO_MAP_ID"
      defaultCenter={SAUDI_DEFAULT_CENTER}
      defaultZoom={5}
      gestureHandling="cooperative"
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={true}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      className="w-full h-full"
    >
      {summaries.map((summary) => {
        const resolved = resolvedPlaces[summary.destination.id];
        if (!resolved) return null;
        return (
          <DestinationMarkerItem
            key={summary.destination.id}
            summary={summary}
            resolved={resolved}
            isSelected={selectedDestId === summary.destination.id}
            isInfoOpen={infoWindowDestId === summary.destination.id}
            accentHex={accentHex}
            accentTextHex={accentTextHex}
            accentBtnTextHex={accentBtnTextHex}
            currency={currency}
            content={content}
            language={language}
            originLabel={origin?.label}
            onSelectMarker={onSelectMarker}
            onCloseInfoWindow={onCloseInfoWindow}
            onFindGuides={onFindGuides}
          />
        );
      })}

      {origin && (
        <AdvancedMarker position={origin.location} title={origin.label} zIndex={60}>
          <Pin
            background="#0284C7"
            borderColor="#FFFFFF"
            glyphColor="#FFFFFF"
            scale={1.1}
          >
            <Building2 className="w-3.5 h-3.5 text-white" />
          </Pin>
        </AdvancedMarker>
      )}

      <RouteOverlayController
        origin={origin}
        destination={selectedResolvedLocation}
        language={language}
        strokeColor={accentHex}
        onRouteComputed={onRouteComputed}
        onRouteError={onRouteError}
      />
    </GoogleMap>
  );
};

interface OriginAutocompleteControlProps {
  language: 'en' | 'ar';
  accentTextHex: string;
  accentHex: string;
  accentBtnTextHex: string;
  origin: OriginLocation | null;
  onSetOrigin: (origin: OriginLocation | null) => void;
}

const OriginAutocompleteControl: React.FC<OriginAutocompleteControlProps> = ({
  language,
  accentTextHex,
  accentHex,
  accentBtnTextHex,
  origin,
  onSetOrigin,
}) => {
  const { hasApiKey } = useMapsAvailability();
  const placesLib = useMapsLibrary('places');
  const isArabic = language === 'ar';

  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Debounced AutocompleteSuggestion using modern Places API (New)
  useEffect(() => {
    if (!hasApiKey || !placesLib) return;
    const trimmed = inputVal.trim();
    if (trimmed.length < 2 || (origin && origin.label === trimmed)) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        setIsSearching(true);
        const res =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: trimmed,
            sessionToken: sessionTokenRef.current,
            includedRegionCodes: ['sa'],
            language,
          });
        setSuggestions(res?.suggestions || []);
      } catch (err) {
        if (isMapsQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [hasApiKey, placesLib, inputVal, language, origin]);

  const handlePickSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!placesLib || !suggestion.placePrediction) return;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
      if (place.location) {
        const loc =
          typeof place.location.toJSON === 'function'
            ? place.location.toJSON()
            : {
                lat: Number(place.location.lat),
                lng: Number(place.location.lng),
              };
        const label =
          place.displayName ||
          place.formattedAddress ||
          suggestion.placePrediction.text.text;
        setInputVal(label);
        onSetOrigin({ label, location: loc });
      }
    } catch (err) {
      if (isMapsQuotaError(err)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
    } finally {
      sessionTokenRef.current = null;
      setSuggestions([]);
    }
  };

  const handleUseCurrentGps = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError(
        isArabic
          ? 'المتصفح لا يدعم تحديد الموقع.'
          : 'Geolocation is not supported in this browser.'
      );
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const label = isArabic ? 'موقعي الحالي' : 'My Current Location';
        setInputVal(label);
        setSuggestions([]);
        onSetOrigin({
          label,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          isArabic
            ? 'تعذر الوصول للموقع الحالي. اكتب اسم الفندق أعلاه.'
            : 'Location permission declined. Type your hotel name above instead.'
        );
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleClear = () => {
    setInputVal('');
    setSuggestions([]);
    setGeoError(null);
    onSetOrigin(null);
  };

  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Building2
            className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: accentTextHex }}
          />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (origin && e.target.value !== origin.label) {
                onSetOrigin(null);
              }
            }}
            placeholder={
              isArabic
                ? 'أدخل فندقك أو مكان إقامتك لحساب المسار...'
                : 'Enter your hotel or stay in KSA to compute route...'
            }
            className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-8 rtl:pl-8 rtl:pr-9 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder:text-[var(--tf-muted)] focus:outline-none"
          />
          {(inputVal || origin) && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={isArabic ? 'مسح نقطة الانطلاق' : 'Clear hotel location'}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleUseCurrentGps}
          disabled={geoLoading}
          style={
            origin?.label === 'My Current Location' ||
            origin?.label === 'موقعي الحالي'
              ? { backgroundColor: accentHex, color: accentBtnTextHex }
              : undefined
          }
          className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] text-[var(--tf-heading)] flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-60"
          title={
            isArabic
              ? 'استخدام موقعي الحالي بموافقتي'
              : 'Use my current GPS location'
          }
        >
          <LocateFixed className="w-3.5 h-3.5" style={{ color: accentTextHex }} />
          <span className="hidden sm:inline">
            {geoLoading
              ? isArabic
                ? 'جاري التحديد...'
                : 'Locating...'
              : isArabic
              ? 'موقعي'
              : 'My Location'}
          </span>
        </button>
      </div>

      {geoError && (
        <p className="text-[11px] text-[var(--tf-danger-text)] mt-1">
          {geoError}
        </p>
      )}

      {isSearching && (
        <div className="text-[11px] text-[var(--tf-muted)] mt-1">
          {isArabic ? 'جاري البحث عن الفندق...' : 'Searching Saudi places...'}
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1.5 z-30 bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((suggestion, idx) => {
            const text = suggestion.placePrediction?.text?.text || '';
            if (!text) return null;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handlePickSuggestion(suggestion)}
                  className="w-full text-start px-3.5 py-2.5 text-xs text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] flex items-center gap-2 border-b last:border-b-0 border-[var(--tf-border)] cursor-pointer"
                >
                  <MapPin
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: accentTextHex }}
                  />
                  <span className="truncate">{text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const DestinationMapExplorer: React.FC<DestinationMapExplorerProps> = ({
  destinations,
  experiences,
  content,
  currency,
  focusedDestinationId,
  onSelectDestinationForCatalog,
  onOpenExperienceDetail,
}) => {
  const { language, isRtl } = useLanguage();
  const {
    getGlassyCardStyle,
    currentAccentHex,
    currentAccentTextHex,
    currentAccentBtnTextHex,
  } = useTheme();
  const { hasApiKey, isAvailable } = useMapsAvailability();
  const isArabic = language === 'ar';

  const cardStyle = getGlassyCardStyle();

  const allSummaries = useMemo(
    () => summarizeDestinationGuides(destinations, experiences),
    [destinations, experiences]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [onlyWithGuides, setOnlyWithGuides] = useState(false);

  const filteredSummaries = useMemo(
    () =>
      filterDestinationSummaries(allSummaries, {
        searchTerm,
        onlyWithGuides,
      }),
    [allSummaries, searchTerm, onlyWithGuides]
  );

  const [selectedDestId, setSelectedDestId] = useState<string | null>(
    () => allSummaries[0]?.destination.id || null
  );
  const [panTargetDestId, setPanTargetDestId] = useState<string | null>(null);
  const [infoWindowDestId, setInfoWindowDestId] = useState<string | null>(null);
  const [resolvedPlaces, setResolvedPlaces] = useState<
    Record<string, ResolvedDestinationPlace>
  >({});
  const [origin, setOrigin] = useState<OriginLocation | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteSummaryInfo | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [fitAllSignal, setFitAllSignal] = useState(0);

  // Sync external focus requests (e.g. clicking "View on Map" on FeaturedDestinations card)
  useEffect(() => {
    if (focusedDestinationId) {
      setSelectedDestId(focusedDestinationId);
      setPanTargetDestId(focusedDestinationId);
      setInfoWindowDestId(focusedDestinationId);
    }
  }, [focusedDestinationId]);

  // Keep selectedDestId valid when filtered list changes
  useEffect(() => {
    if (
      filteredSummaries.length > 0 &&
      !filteredSummaries.some((s) => s.destination.id === selectedDestId)
    ) {
      setSelectedDestId(filteredSummaries[0].destination.id);
    }
  }, [filteredSummaries, selectedDestId]);

  const activeSummary = useMemo(
    () =>
      filteredSummaries.find((s) => s.destination.id === selectedDestId) ||
      filteredSummaries[0] ||
      null,
    [filteredSummaries, selectedDestId]
  );

  const activeResolved = activeSummary
    ? resolvedPlaces[activeSummary.destination.id] || null
    : null;

  const totalLiveGuides = useMemo(
    () => allSummaries.reduce((acc, s) => acc + s.guideCount, 0),
    [allSummaries]
  );

  const handleSelectSpot = useCallback((destId: string) => {
    setSelectedDestId(destId);
    setPanTargetDestId(destId);
    setInfoWindowDestId(destId);
  }, []);

  const canRenderInteractiveMap = hasApiKey && isAvailable;

  return (
    <section
      id="map-explorer"
      className="py-20 bg-transparent border-t border-[var(--tf-border)] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div
              className="text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-1.5"
              style={{ color: currentAccentTextHex }}
            >
              <MapPin className="w-4 h-4" style={{ color: currentAccentTextHex }} />
              <span>{getSiteText(content, 'map.eyebrow', language)}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--tf-heading)] tracking-tight">
              {getSiteText(content, 'map.title', language)}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--tf-muted)] leading-relaxed">
              {getSiteText(content, 'map.sub', language)}
            </p>
          </div>

          {/* Quick Trust Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              style={cardStyle}
              className="px-4 py-2.5 rounded-xl flex items-center gap-2.5"
            >
              <CheckCircle2
                className="w-4 h-4 shrink-0"
                style={{ color: currentAccentTextHex }}
              />
              <div className="text-xs">
                <div className="font-bold text-[var(--tf-heading)] tabular-nums">
                  {totalLiveGuides}{' '}
                  {isArabic ? 'جولة مع مرشد محلي' : 'Local UMKM Guided Tours'}
                </div>
                <div className="text-[11px] text-[var(--tf-muted)]">
                  {isArabic
                    ? 'جاهزون للاستقبال بمجرد وصولك'
                    : 'Ready to host once you land'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Guide Filter & Hotel Route Origin Bar */}
        <div
          style={cardStyle}
          className="p-4 rounded-2xl mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--tf-muted)] absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث عن مدينة أو نقطة التقاء (مثال: العلا، الدرعية)...'
                  : 'Filter destinations or meeting points (e.g. AlUla, Diriyah)...'
              }
              className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-4 rtl:pl-4 rtl:pr-9 bg-[var(--tf-input-bg)] border border-[var(--tf-border)] rounded-xl text-[var(--tf-heading)] placeholder:text-[var(--tf-muted)] focus:outline-none"
            />
          </div>

          {hasApiKey && (
            <OriginAutocompleteControl
              language={language}
              accentTextHex={currentAccentTextHex}
              accentHex={currentAccentHex}
              accentBtnTextHex={currentAccentBtnTextHex}
              origin={origin}
              onSetOrigin={setOrigin}
            />
          )}

          <button
            type="button"
            onClick={() => setOnlyWithGuides((prev) => !prev)}
            style={
              onlyWithGuides
                ? {
                    backgroundColor: currentAccentHex,
                    color: currentAccentBtnTextHex,
                    borderColor: currentAccentHex,
                  }
                : undefined
            }
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
              onlyWithGuides
                ? 'shadow-sm'
                : 'bg-[var(--tf-surface-subtle)] border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {isArabic ? 'وجهات بها مرشدون فقط' : 'Local Guides Available Only'}
            </span>
          </button>
        </div>

        {/* Explorer Split Grid: Destination & Guide Directory + Live Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tourist Spots & Local Guide Readiness List */}
          <div className="lg:col-span-5 space-y-3 max-h-[560px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
            {filteredSummaries.length === 0 ? (
              <div style={cardStyle} className="p-8 rounded-2xl text-center">
                <Compass
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: currentAccentTextHex }}
                />
                <p className="text-sm font-bold text-[var(--tf-heading)]">
                  {isArabic
                    ? 'لا توجد وجهات مطابقة لبحثك'
                    : 'No destinations match your search'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setOnlyWithGuides(false);
                  }}
                  style={{ color: currentAccentTextHex }}
                  className="mt-2 text-xs font-bold hover:underline cursor-pointer"
                >
                  {isArabic ? 'إعادة ضبط البحث' : 'Reset Map Filter'}
                </button>
              </div>
            ) : (
              filteredSummaries.map((summary) => {
                const isSelected =
                  activeSummary?.destination.id === summary.destination.id;
                const resolved = resolvedPlaces[summary.destination.id];
                const name = isArabic
                  ? summary.destination.nameAr
                  : summary.destination.name;
                const region = isArabic
                  ? summary.destination.regionAr
                  : summary.destination.region;

                const gmapsUrl = buildGoogleMapsPlaceUrl({
                  googleMapsURI: resolved?.googleMapsURI,
                  placeId: resolved?.placeId,
                  query: buildDestinationSearchQuery(summary.destination),
                });

                return (
                  <div
                    key={summary.destination.id}
                    onClick={() => handleSelectSpot(summary.destination.id)}
                    style={{
                      ...cardStyle,
                      borderColor: isSelected
                        ? currentAccentHex
                        : cardStyle.borderColor,
                    }}
                    className={`rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-1 shadow-lg' : 'hover:brightness-[1.03]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={summary.destination.coverImage}
                        alt={name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[var(--tf-border)]"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[var(--tf-heading)] leading-tight">
                              {name}
                            </h3>
                            <p className="text-[11px] text-[var(--tf-muted)]">
                              {region}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border ${
                              summary.guideCount > 0
                                ? 'bg-[var(--tf-success-bg)] text-[var(--tf-success-text)] border-[var(--tf-success-border)]'
                                : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]'
                            }`}
                          >
                            {summary.guideCount > 0
                              ? isArabic
                                ? `${summary.guideCount} مرشد متاح`
                                : `${summary.guideCount} ${
                                    summary.guideCount === 1
                                      ? 'Guide Ready'
                                      : 'Guides Ready'
                                  }`
                              : isArabic
                              ? 'قريباً'
                              : 'Coming Soon'}
                          </span>
                        </div>

                        {resolved?.formattedAddress && (
                          <p className="text-[11px] text-[var(--tf-muted)] mt-1.5 flex items-center gap-1 truncate">
                            <MapPin
                              className="w-3 h-3 shrink-0"
                              style={{ color: currentAccentTextHex }}
                            />
                            <span className="truncate">
                              {resolved.formattedAddress}
                            </span>
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                          {summary.minPrice !== null && (
                            <span className="font-semibold text-[var(--tf-heading)]">
                              {isArabic ? 'تبدأ من ' : 'From '}
                              <span className="font-mono font-bold">
                                {summary.minPrice}{' '}
                                {localizeCurrency(currency, language)}
                              </span>
                            </span>
                          )}
                          {(resolved?.rating || summary.avgRating) && (
                            <span
                              className="inline-flex items-center gap-1 font-semibold"
                              style={{ color: currentAccentTextHex }}
                            >
                              <Star className="w-3 h-3 fill-current" />
                              <span className="tabular-nums">
                                {(resolved?.rating || summary.avgRating)?.toFixed(
                                  1
                                )}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Local UMKM Guide Preview + Actions when selected */}
                    {isSelected && (
                      <div className="mt-3.5 pt-3 border-t border-[var(--tf-border)] space-y-2.5">
                        {summary.publishedExperiences.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--tf-muted)]">
                              {isArabic
                                ? 'مرشدون محليون متاحون الآن:'
                                : 'Featured Local UMKM Guides at this Spot:'}
                            </div>
                            {summary.publishedExperiences
                              .slice(0, 2)
                              .map((exp) => (
                                <button
                                  key={exp.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenExperienceDetail(exp);
                                  }}
                                  className="w-full text-start px-3 py-2 rounded-xl bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] border border-[var(--tf-border)] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                                >
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-[var(--tf-heading)] truncate">
                                      {isArabic ? exp.titleAr : exp.title}
                                    </div>
                                    <div className="text-[10px] text-[var(--tf-muted)] truncate">
                                      {localizeCategory(exp.category, language)}{' '}
                                      ·{' '}
                                      {isArabic
                                        ? exp.meetingPointAr
                                        : exp.meetingPoint}
                                    </div>
                                  </div>
                                  <span
                                    className="text-xs font-mono font-bold shrink-0"
                                    style={{ color: currentAccentTextHex }}
                                  >
                                    {exp.price}{' '}
                                    {localizeCurrency(currency, language)}
                                  </span>
                                </button>
                              ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDestinationForCatalog(
                                summary.destination.id
                              );
                            }}
                            style={{
                              backgroundColor: currentAccentHex,
                              color: currentAccentBtnTextHex,
                            }}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer"
                          >
                            <span>
                              {getSiteText(
                                content,
                                'map.findGuidesCta',
                                language
                              )}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </button>

                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-2 px-3 rounded-xl border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] text-xs font-semibold text-[var(--tf-heading)] flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink
                              className="w-3.5 h-3.5"
                              style={{ color: currentAccentTextHex }}
                            />
                            <span>
                              {getSiteText(
                                content,
                                'map.openGmapsCta',
                                language
                              )}
                            </span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Live Interactive Google Map */}
          <div className="lg:col-span-7">
            <div
              style={cardStyle}
              className="rounded-2xl overflow-hidden relative h-[460px] lg:h-[560px]"
            >
              {canRenderInteractiveMap ? (
                <>
                  <InteractiveMapCanvas
                    summaries={filteredSummaries}
                    resolvedPlaces={resolvedPlaces}
                    selectedDestId={activeSummary?.destination.id || null}
                    panTargetDestId={panTargetDestId}
                    infoWindowDestId={infoWindowDestId}
                    origin={origin}
                    fitAllSignal={fitAllSignal}
                    accentHex={currentAccentHex}
                    accentTextHex={currentAccentTextHex}
                    accentBtnTextHex={currentAccentBtnTextHex}
                    currency={currency}
                    content={content}
                    language={language}
                    onResolvedPlaces={setResolvedPlaces}
                    onSelectMarker={handleSelectSpot}
                    onCloseInfoWindow={() => setInfoWindowDestId(null)}
                    onFindGuides={onSelectDestinationForCatalog}
                    onRouteComputed={setRouteInfo}
                    onRouteError={setRouteError}
                  />

                  {/* Floating Fit-All Control (keep at top-left so Google Maps fullscreen button at top-right never overlaps) */}
                  <button
                    type="button"
                    onClick={() => {
                      setInfoWindowDestId(null);
                      setPanTargetDestId(null);
                      setOrigin(null);
                      setFitAllSignal((n) => n + 1);
                    }}
                    className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-[var(--tf-modal-bg)]/95 border border-[var(--tf-border)] text-[var(--tf-heading)] text-xs font-bold shadow-md hover:bg-[var(--tf-surface-hover)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass
                      className="w-3.5 h-3.5"
                      style={{ color: currentAccentTextHex }}
                    />
                    <span>
                      {isArabic ? 'عرض كل الوجهات' : 'All Saudi Hubs'}
                    </span>
                  </button>

                  {/* Floating Live Route Banner */}
                  {(routeInfo || routeError) && activeSummary && (
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 p-3.5 rounded-2xl bg-[var(--tf-modal-bg)]/95 backdrop-blur-md border border-[var(--tf-border)] shadow-xl text-xs">
                      {routeInfo ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: currentAccentHex,
                                color: currentAccentBtnTextHex,
                              }}
                            >
                              <RouteIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[var(--tf-heading)] truncate">
                                {routeInfo.durationText} ·{' '}
                                {routeInfo.distanceText}
                              </div>
                              <div className="text-[11px] text-[var(--tf-muted)] truncate">
                                {origin?.label} →{' '}
                                {isArabic
                                  ? activeSummary.destination.nameAr
                                  : activeSummary.destination.name}
                              </div>
                            </div>
                          </div>

                          <a
                            href={buildGoogleMapsDirectionsUrl({
                              destinationQuery:
                                activeResolved?.formattedAddress ||
                                buildDestinationSearchQuery(
                                  activeSummary.destination
                                ),
                              destinationPlaceId: activeResolved?.placeId,
                              originQuery: origin?.label,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: currentAccentHex,
                              color: currentAccentBtnTextHex,
                            }}
                            className="px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap flex items-center gap-1"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>
                              {isArabic ? 'ابدأ الملاحة' : 'Navigate'}
                            </span>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[var(--tf-muted)]">
                            {routeError}
                          </span>
                          <a
                            href={buildGoogleMapsDirectionsUrl({
                              destinationQuery:
                                activeResolved?.formattedAddress ||
                                buildDestinationSearchQuery(
                                  activeSummary.destination
                                ),
                              destinationPlaceId: activeResolved?.placeId,
                              originQuery: origin?.label,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: currentAccentTextHex }}
                            className="font-bold hover:underline whitespace-nowrap"
                          >
                            {isArabic ? 'خرائط جوجل' : 'Google Maps'}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Graceful Fallback when API Key is unavailable or Map fails to load */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[var(--tf-surface-subtle)]">
                  <MapPin
                    className="w-10 h-10 mb-3"
                    style={{ color: currentAccentTextHex }}
                  />
                  <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)] mb-2">
                    {activeSummary
                      ? isArabic
                        ? activeSummary.destination.nameAr
                        : activeSummary.destination.name
                      : isArabic
                      ? 'خريطة الوجهات السعودية'
                      : 'Saudi Destination Map'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--tf-muted)] max-w-md mb-5 leading-relaxed">
                    {isArabic
                      ? 'الخريطة التفاعلية غير متوفرة حالياً، يمكنك فتح موقع الوجهة والاتجاهات مباشرة عبر خرائط جوجل.'
                      : 'Interactive map tiles are currently unavailable. You can still inspect every destination and launch directions directly in Google Maps.'}
                  </p>
                  {activeSummary && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={buildGoogleMapsPlaceUrl({
                          query: buildDestinationSearchQuery(
                            activeSummary.destination
                          ),
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: currentAccentHex,
                          color: currentAccentBtnTextHex,
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>
                          {getSiteText(content, 'map.openGmapsCta', language)}
                        </span>
                      </a>
                      <a
                        href={buildGoogleMapsDirectionsUrl({
                          destinationQuery: buildDestinationSearchQuery(
                            activeSummary.destination
                          ),
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--tf-border)] bg-[var(--tf-modal-bg)] text-[var(--tf-heading)] flex items-center gap-1.5"
                      >
                        <Navigation
                          className="w-3.5 h-3.5"
                          style={{ color: currentAccentTextHex }}
                        />
                        <span>
                          {isArabic ? 'الحصول على الاتجاهات' : 'Get Directions'}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
