import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDestinationSearchQuery,
  buildExperienceSearchQuery,
  buildGoogleMapsPlaceUrl,
  buildGoogleMapsDirectionsUrl,
  summarizeDestinationGuides,
  filterDestinationSummaries,
  formatRouteMetrics,
  isMapsQuotaError,
} from './mapGuideUtils.ts';
import type { Destination, Experience } from '../types/index.ts';

const SAMPLE_DESTINATIONS: Destination[] = [
  {
    id: 'dest-alula',
    name: 'AlUla',
    nameAr: 'العلا',
    slug: 'alula',
    description: 'Ancient sandstone canyons',
    descriptionAr: 'العلا',
    coverImage: 'img1.jpg',
    region: 'Madinah Province',
    regionAr: 'منطقة المدينة المنورة',
    experienceCount: 2,
    featured: true,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dest-riyadh',
    name: 'Riyadh',
    nameAr: 'الرياض',
    slug: 'riyadh',
    description: 'Capital city',
    descriptionAr: 'الرياض',
    coverImage: 'img2.jpg',
    region: 'Riyadh',
    regionAr: 'الرياض',
    experienceCount: 1,
    featured: false,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dest-hidden',
    name: 'Abha',
    nameAr: 'أبها',
    slug: 'abha',
    description: 'Highlands',
    descriptionAr: 'أبها',
    coverImage: 'img3.jpg',
    region: 'Asir',
    regionAr: 'عسير',
    experienceCount: 1,
    featured: true,
    published: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

const SAMPLE_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    title: 'AlUla Desert Safari',
    titleAr: 'سفاري العلا',
    slug: 'alula-safari',
    destinationId: 'dest-alula',
    destinationName: 'AlUla',
    category: 'Desert Adventure',
    categoryAr: 'مغامرات صحراوية',
    price: 450,
    currency: 'SAR',
    duration: '4 hours',
    durationAr: '4 ساعات',
    description: 'Guided 4x4 tour',
    descriptionAr: 'جولة',
    coverImage: 'exp1.jpg',
    gallery: [],
    highlights: [],
    highlightsAr: [],
    inclusions: [],
    inclusionsAr: [],
    exclusions: [],
    exclusionsAr: [],
    meetingPoint: 'Winter Park AlUla Visitor Hub',
    meetingPointAr: 'وينتر بارك العلا',
    featured: true,
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 20,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'exp-2',
    title: 'Hegra UNESCO Tour',
    titleAr: 'جولة الحجر',
    slug: 'hegra-tour',
    destinationId: 'dest-alula',
    destinationName: 'AlUla',
    category: 'Cultural Experiences',
    categoryAr: 'تجارب ثقافية',
    price: 680,
    currency: 'SAR',
    duration: '5 hours',
    durationAr: '5 ساعات',
    description: 'Certified Rawi heritage walk',
    descriptionAr: 'جولة ثقافية',
    coverImage: 'exp2.jpg',
    gallery: [],
    highlights: [],
    highlightsAr: [],
    inclusions: [],
    inclusionsAr: [],
    exclusions: [],
    exclusionsAr: [],
    meetingPoint: 'Hegra Visitor Center',
    meetingPointAr: 'مركز زوار الحجر',
    featured: false,
    status: 'PUBLISHED',
    rating: 4.7,
    reviewsCount: 15,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'exp-draft',
    title: 'Draft Riyadh Tour',
    titleAr: 'مسودة',
    slug: 'draft-riyadh',
    destinationId: 'dest-riyadh',
    destinationName: 'Riyadh',
    category: 'City Tours',
    categoryAr: 'جولات المدن',
    price: 300,
    currency: 'SAR',
    duration: '3 hours',
    durationAr: '3 ساعات',
    description: 'Not published yet',
    descriptionAr: 'مسودة',
    coverImage: 'exp3.jpg',
    gallery: [],
    highlights: [],
    highlightsAr: [],
    inclusions: [],
    inclusionsAr: [],
    exclusions: [],
    exclusionsAr: [],
    meetingPoint: 'Kingdom Centre',
    meetingPointAr: 'برج المملكة',
    featured: false,
    status: 'DRAFT',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

test('buildDestinationSearchQuery builds deduplicated Saudi query', () => {
  assert.equal(
    buildDestinationSearchQuery({ name: 'AlUla', region: 'Madinah Province' }),
    'AlUla, Madinah Province, Saudi Arabia'
  );
  assert.equal(
    buildDestinationSearchQuery({ name: 'Riyadh', region: 'Riyadh' }),
    'Riyadh, Saudi Arabia'
  );
});

test('buildExperienceSearchQuery combines meeting point and destination', () => {
  assert.equal(
    buildExperienceSearchQuery({
      meetingPoint: 'Winter Park',
      destinationName: 'AlUla',
    }),
    'Winter Park, AlUla, Saudi Arabia'
  );
});

test('buildGoogleMapsPlaceUrl prefers Places API URI and safely constructs fallback', () => {
  assert.equal(
    buildGoogleMapsPlaceUrl({
      googleMapsURI: 'https://maps.google.com/?cid=12345',
      placeId: 'abc',
      query: 'AlUla',
    }),
    'https://maps.google.com/?cid=12345'
  );

  const fallbackUrl = buildGoogleMapsPlaceUrl({
    placeId: 'ChIJ_test',
    query: 'AlUla, Saudi Arabia',
  });
  assert.ok(fallbackUrl.startsWith('https://www.google.com/maps/search/?'));
  assert.ok(fallbackUrl.includes('query_place_id=ChIJ_test'));
  assert.ok(fallbackUrl.includes('AlUla'));
});

test('buildGoogleMapsDirectionsUrl includes origin and destination parameters', () => {
  const url = buildGoogleMapsDirectionsUrl({
    destinationQuery: 'Hegra, AlUla',
    destinationPlaceId: 'ChIJ_hegra',
    originQuery: 'Winter Park Hotel, AlUla',
    travelMode: 'driving',
  });
  assert.ok(url.startsWith('https://www.google.com/maps/dir/?'));
  assert.ok(url.includes('destination_place_id=ChIJ_hegra'));
  assert.ok(url.includes('origin=Winter+Park+Hotel'));
  assert.ok(url.includes('travelmode=driving'));
});

test('summarizeDestinationGuides excludes unpublished destinations and draft experiences', () => {
  const summaries = summarizeDestinationGuides(
    SAMPLE_DESTINATIONS,
    SAMPLE_EXPERIENCES
  );
  assert.equal(summaries.length, 2);
  assert.equal(summaries[0].destination.id, 'dest-alula');
  assert.equal(summaries[0].guideCount, 2);
  assert.equal(summaries[0].minPrice, 450);
  assert.equal(summaries[0].avgRating, 4.8);
  assert.equal(summaries[0].topExperience?.id, 'exp-1');
  assert.equal(summaries[1].destination.id, 'dest-riyadh');
  assert.equal(summaries[1].guideCount, 0);
  assert.equal(summaries[1].minPrice, null);
});

test('filterDestinationSummaries filters by guides availability, category, and search term', () => {
  const summaries = summarizeDestinationGuides(
    SAMPLE_DESTINATIONS,
    SAMPLE_EXPERIENCES
  );

  assert.equal(
    filterDestinationSummaries(summaries, { onlyWithGuides: true }).length,
    1
  );
  assert.equal(
    filterDestinationSummaries(summaries, { category: 'Cultural Experiences' })
      .length,
    1
  );
  assert.equal(
    filterDestinationSummaries(summaries, { searchTerm: 'Winter Park' }).length,
    1
  );
  assert.equal(
    filterDestinationSummaries(summaries, { searchTerm: 'NonExistent' }).length,
    0
  );
});

test('formatRouteMetrics formats English and Arabic distance and duration cleanly', () => {
  assert.deepEqual(formatRouteMetrics(850, 5 * 60000, 'en'), {
    distanceText: '850 m',
    durationText: '5 min',
  });
  assert.deepEqual(formatRouteMetrics(18500, 95 * 60000, 'en'), {
    distanceText: '18.5 km',
    durationText: '1 hr 35 min',
  });
  assert.deepEqual(formatRouteMetrics(150000, 120 * 60000, 'ar'), {
    distanceText: '150 كم',
    durationText: '2 ساعة',
  });
});

test('isMapsQuotaError detects quota errors without false positives', () => {
  assert.equal(isMapsQuotaError({ status: 429 }), true);
  assert.equal(isMapsQuotaError({ status: 'RESOURCE_EXHAUSTED' }), true);
  assert.equal(
    isMapsQuotaError(new Error('Google Maps OverQuotaMapError reached')),
    true
  );
  assert.equal(isMapsQuotaError(new Error('ZERO_RESULTS')), false);
  assert.equal(isMapsQuotaError(null), false);
});
