import { Destination, Experience, ExperienceCategory, Language } from '../types';

export interface DestinationGuideSummary {
  destination: Destination;
  publishedExperiences: Experience[];
  guideCount: number;
  minPrice: number | null;
  avgRating: number | null;
  categories: ExperienceCategory[];
  topExperience: Experience | null;
}

/**
 * Builds a clean Saudi Arabia search query for Places Text Search (New).
 * Uses only TourFlow destination metadata — never hardcoded coordinates.
 */
export function buildDestinationSearchQuery(
  dest: Pick<Destination, 'name' | 'region'>
): string {
  const parts = [dest.name?.trim(), dest.region?.trim(), 'Saudi Arabia'].filter(
    (part): part is string => Boolean(part && part.length > 0)
  );
  // Deduplicate repeated city/province words cleanly while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const part of parts) {
    const normalized = part.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(part);
    }
  }
  return unique.join(', ');
}

/**
 * Builds a clean search query for an Experience's guide meeting point.
 */
export function buildExperienceSearchQuery(
  exp: Pick<Experience, 'meetingPoint' | 'destinationName'>
): string {
  const parts = [
    exp.meetingPoint?.trim(),
    exp.destinationName?.trim(),
    'Saudi Arabia',
  ].filter((part): part is string => Boolean(part && part.length > 0));
  return parts.join(', ');
}

/**
 * Builds a safe Google Maps place URL, preferring googleMapsURI returned by Places API (New).
 */
export function buildGoogleMapsPlaceUrl(params: {
  googleMapsURI?: string | null;
  placeId?: string | null;
  query: string;
}): string {
  const directUri = params.googleMapsURI?.trim();
  if (directUri && /^https?:\/\//i.test(directUri)) {
    return directUri;
  }

  const search = new URLSearchParams({
    api: '1',
    query: params.query.trim() || 'Saudi Arabia',
  });
  if (params.placeId?.trim()) {
    search.set('query_place_id', params.placeId.trim());
  }
  return `https://www.google.com/maps/search/?${search.toString()}`;
}

/**
 * Builds an official Google Maps Directions link from a traveler's hotel/origin to the destination.
 */
export function buildGoogleMapsDirectionsUrl(params: {
  destinationQuery: string;
  destinationPlaceId?: string | null;
  originQuery?: string | null;
  travelMode?: 'driving' | 'walking' | 'transit';
}): string {
  const search = new URLSearchParams({
    api: '1',
    destination: params.destinationQuery.trim() || 'Saudi Arabia',
    travelmode: params.travelMode || 'driving',
  });
  if (params.destinationPlaceId?.trim()) {
    search.set('destination_place_id', params.destinationPlaceId.trim());
  }
  if (params.originQuery?.trim()) {
    search.set('origin', params.originQuery.trim());
  }
  return `https://www.google.com/maps/dir/?${search.toString()}`;
}

/**
 * Aggregates published local UMKM operator experiences per published destination.
 */
export function summarizeDestinationGuides(
  destinations: Destination[],
  experiences: Experience[]
): DestinationGuideSummary[] {
  const publishedDest = destinations.filter((d) => d.published);
  const publishedExps = experiences.filter((e) => e.status === 'PUBLISHED');

  return publishedDest
    .map((destination) => {
      const matched = publishedExps.filter(
        (exp) => exp.destinationId === destination.id
      );

      const prices = matched
        .map((e) => e.price)
        .filter((p) => typeof p === 'number' && Number.isFinite(p) && p >= 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;

      const ratings = matched
        .map((e) => e.rating)
        .filter((r): r is number => typeof r === 'number' && Number.isFinite(r) && r > 0);
      const avgRating =
        ratings.length > 0
          ? Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
          : null;

      const categorySet = new Set<ExperienceCategory>();
      for (const exp of matched) {
        if (exp.category) categorySet.add(exp.category);
      }

      const sortedTop = [...matched].sort((a, b) => {
        const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (featuredDiff !== 0) return featuredDiff;
        return (b.rating || 0) - (a.rating || 0);
      });

      return {
        destination,
        publishedExperiences: matched,
        guideCount: matched.length,
        minPrice,
        avgRating,
        categories: Array.from(categorySet),
        topExperience: sortedTop[0] || null,
      };
    })
    .sort((a, b) => {
      if (b.guideCount !== a.guideCount) return b.guideCount - a.guideCount;
      return (b.destination.featured ? 1 : 0) - (a.destination.featured ? 1 : 0);
    });
}

/**
 * Filters summarized destinations by text query, guide availability, and experience category.
 */
export function filterDestinationSummaries(
  summaries: DestinationGuideSummary[],
  filters: {
    searchTerm?: string;
    onlyWithGuides?: boolean;
    category?: string;
  }
): DestinationGuideSummary[] {
  const q = filters.searchTerm?.trim().toLowerCase() || '';
  const cat = filters.category?.trim() || 'all';
  const onlyWithGuides = Boolean(filters.onlyWithGuides);

  return summaries.filter((item) => {
    if (onlyWithGuides && item.guideCount === 0) {
      return false;
    }

    if (cat !== 'all' && !item.categories.includes(cat as ExperienceCategory)) {
      return false;
    }

    if (q) {
      const destMatch =
        item.destination.name.toLowerCase().includes(q) ||
        item.destination.nameAr.includes(q) ||
        item.destination.region.toLowerCase().includes(q) ||
        item.destination.regionAr.includes(q);

      const expMatch = item.publishedExperiences.some(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          exp.titleAr.includes(q) ||
          exp.meetingPoint.toLowerCase().includes(q)
      );

      if (!destMatch && !expMatch) return false;
    }

    return true;
  });
}

/**
 * Formats distance (meters) and duration (milliseconds) returned by Routes API computeRoutes().
 */
export function formatRouteMetrics(
  distanceMeters?: number | null,
  durationMillis?: number | null,
  language: Language = 'en'
): { distanceText: string; durationText: string } {
  const isArabic = language === 'ar';

  let distanceText = '';
  if (typeof distanceMeters === 'number' && Number.isFinite(distanceMeters) && distanceMeters >= 0) {
    if (distanceMeters < 1000) {
      distanceText = isArabic
        ? `${Math.round(distanceMeters)} م`
        : `${Math.round(distanceMeters)} m`;
    } else {
      const km = distanceMeters / 1000;
      const formattedKm = km >= 100 ? Math.round(km).toString() : km.toFixed(1);
      distanceText = isArabic ? `${formattedKm} كم` : `${formattedKm} km`;
    }
  }

  let durationText = '';
  if (typeof durationMillis === 'number' && Number.isFinite(durationMillis) && durationMillis >= 0) {
    const totalMinutes = Math.max(1, Math.round(durationMillis / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) {
      durationText = isArabic ? `${totalMinutes} دقيقة` : `${totalMinutes} min`;
    } else if (mins === 0) {
      durationText = isArabic ? `${hours} ساعة` : `${hours} hr`;
    } else {
      durationText = isArabic ? `${hours} س ${mins} د` : `${hours} hr ${mins} min`;
    }
  }

  return { distanceText, durationText };
}

/**
 * Detects Google Maps Platform quota/auth failures for Demo Key Tier 2 defense without false positives.
 */
export function isMapsQuotaError(err: unknown): boolean {
  if (!err) return false;
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (obj.status === 429 || obj.code === 429) return true;
    if (
      obj.status === 'RESOURCE_EXHAUSTED' ||
      obj.status === 'OVER_QUERY_LIMIT'
    ) {
      return true;
    }
    const nested = obj.error as Record<string, unknown> | undefined;
    if (
      nested &&
      (nested.code === 429 || nested.status === 'RESOURCE_EXHAUSTED')
    ) {
      return true;
    }
  }

  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
      ? err
      : JSON.stringify(err);

  return /OverQuotaMapError|QuotaExceededError|RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT/i.test(
    msg
  );
}
