import React, { useState, useEffect, useRef } from 'react';
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
import { Experience } from '../../types';
import {
  buildExperienceSearchQuery,
  buildGoogleMapsPlaceUrl,
  buildGoogleMapsDirectionsUrl,
  isMapsQuotaError,
} from '../../utils/mapGuideUtils';
import { useMapsAvailability } from './MapsProvider';
import { ExternalLink, Navigation, MapPin, Star } from 'lucide-react';

interface ResolvedMeetingPlace {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  googleMapsURI?: string | null;
  rating?: number | null;
}

interface ExperienceLocationMapProps {
  experience: Experience;
}

interface InnerExperienceMapProps {
  experience: Experience;
  resolved: ResolvedMeetingPlace | null;
  language: 'en' | 'ar';
  accentHex: string;
  onResolved: (place: ResolvedMeetingPlace | null) => void;
}

const InnerExperienceMap: React.FC<InnerExperienceMapProps> = ({
  experience,
  resolved,
  language,
  accentHex,
  onResolved,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const cacheRef = useRef<Record<string, ResolvedMeetingPlace>>({});
  const isArabic = language === 'ar';

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;
    const cacheKey = `${experience.id}:${language}`;

    if (cacheRef.current[cacheKey]) {
      onResolved(cacheRef.current[cacheKey]);
      return;
    }

    const queryText = buildExperienceSearchQuery(experience);

    (async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: queryText,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'googleMapsURI',
            'rating',
          ],
          maxResultCount: 1,
          region: 'SA',
          language,
        });
        if (cancelled) return;
        const primary = places?.[0];
        if (primary?.location) {
          const loc =
            typeof primary.location.toJSON === 'function'
              ? primary.location.toJSON()
              : {
                  lat: Number(primary.location.lat),
                  lng: Number(primary.location.lng),
                };
          const resolvedItem: ResolvedMeetingPlace = {
            placeId: primary.id || '',
            displayName:
              primary.displayName ||
              (isArabic ? experience.meetingPointAr : experience.meetingPoint),
            formattedAddress: primary.formattedAddress || queryText,
            location: loc,
            googleMapsURI: primary.googleMapsURI || null,
            rating: typeof primary.rating === 'number' ? primary.rating : null,
          };
          cacheRef.current[cacheKey] = resolvedItem;
          onResolved(resolvedItem);
          return;
        }

        // Second attempt using broader destination hub if meeting point name is niche
        const fallback = await placesLib.Place.searchByText({
          textQuery: `${experience.destinationName}, Saudi Arabia`,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'googleMapsURI',
            'rating',
          ],
          maxResultCount: 1,
          region: 'SA',
          language,
        });
        if (cancelled) return;
        const fbPlace = fallback.places?.[0];
        if (fbPlace?.location) {
          const loc =
            typeof fbPlace.location.toJSON === 'function'
              ? fbPlace.location.toJSON()
              : {
                  lat: Number(fbPlace.location.lat),
                  lng: Number(fbPlace.location.lng),
                };
          const resolvedItem: ResolvedMeetingPlace = {
            placeId: fbPlace.id || '',
            displayName: fbPlace.displayName || experience.destinationName,
            formattedAddress: fbPlace.formattedAddress || experience.destinationName,
            location: loc,
            googleMapsURI: fbPlace.googleMapsURI || null,
            rating: typeof fbPlace.rating === 'number' ? fbPlace.rating : null,
          };
          cacheRef.current[cacheKey] = resolvedItem;
          onResolved(resolvedItem);
        }
      } catch (err) {
        if (isMapsQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placesLib, experience, language, isArabic, onResolved]);

  useEffect(() => {
    if (map && resolved?.location) {
      map.panTo(resolved.location);
      map.setZoom(12);
    }
  }, [map, resolved]);

  return (
    <GoogleMap
      mapId="DEMO_MAP_ID"
      defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
      defaultZoom={5}
      gestureHandling="cooperative"
      mapTypeControl={false}
      streetViewControl={false}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      className="w-full h-full"
    >
      {resolved && (
        <>
          <AdvancedMarker
            ref={markerRef}
            position={resolved.location}
            title={resolved.displayName}
            onClick={() => setInfoOpen(true)}
          >
            <Pin
              background={accentHex}
              borderColor="#FFFFFF"
              glyphColor="#0D2B24"
              scale={1.15}
            />
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow
              anchor={marker}
              maxWidth={240}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div
                className="p-0.5 text-[#0B3B30]"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <div className="font-bold text-xs text-[#0B3B30]">
                  {resolved.displayName}
                </div>
                <div className="text-[11px] text-[#42685E] mt-0.5">
                  {resolved.formattedAddress}
                </div>
                {resolved.rating && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{resolved.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </>
      )}
    </GoogleMap>
  );
};

export const ExperienceLocationMap: React.FC<ExperienceLocationMapProps> = ({
  experience,
}) => {
  const { language } = useLanguage();
  const { currentAccentHex, currentAccentTextHex, currentAccentBtnTextHex } =
    useTheme();
  const { hasApiKey, isAvailable } = useMapsAvailability();
  const isArabic = language === 'ar';

  const [resolved, setResolved] = useState<ResolvedMeetingPlace | null>(null);

  const query = buildExperienceSearchQuery(experience);
  const gmapsUrl = buildGoogleMapsPlaceUrl({
    googleMapsURI: resolved?.googleMapsURI,
    placeId: resolved?.placeId,
    query,
  });
  const directionsUrl = buildGoogleMapsDirectionsUrl({
    destinationQuery: resolved?.formattedAddress || query,
    destinationPlaceId: resolved?.placeId,
  });

  const canRenderMap = hasApiKey && isAvailable;

  return (
    <div className="mt-4 space-y-3">
      {resolved?.formattedAddress && (
        <div className="flex items-start gap-1.5 text-xs text-[var(--tf-muted)]">
          <MapPin
            className="w-3.5 h-3.5 shrink-0 mt-0.5"
            style={{ color: currentAccentTextHex }}
          />
          <span>{resolved.formattedAddress}</span>
        </div>
      )}

      {canRenderMap && (
        <div className="h-[260px] w-full rounded-xl overflow-hidden border border-[var(--tf-border)]">
          <InnerExperienceMap
            experience={experience}
            resolved={resolved}
            language={language}
            accentHex={currentAccentHex}
            onResolved={setResolved}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: currentAccentHex,
            color: currentAccentBtnTextHex,
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{isArabic ? 'عرض في خرائط جوجل' : 'Open in Google Maps'}</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] text-[var(--tf-heading)] inline-flex items-center gap-1.5 transition-colors"
        >
          <Navigation
            className="w-3.5 h-3.5"
            style={{ color: currentAccentTextHex }}
          />
          <span>
            {isArabic
              ? 'اتجاهات القيادة من فندقك'
              : 'Directions from Your Hotel'}
          </span>
        </a>
      </div>
    </div>
  );
};
