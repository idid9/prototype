export type Language = 'en' | 'ar';

export type ExperienceCategory =
  | 'Desert Adventure'
  | 'Cultural Experiences'
  | 'City Tours'
  | 'Nature & Outdoor'
  | 'Luxury Experiences'
  | 'Family Activities';

export type ExperienceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Experience {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  category: ExperienceCategory;
  categoryAr: string;
  price: number;
  currency: 'SAR';
  duration: string;
  durationAr: string;
  description: string;
  descriptionAr: string;
  coverImage: string;
  gallery: string[];
  highlights: string[];
  highlightsAr: string[];
  inclusions: string[];
  inclusionsAr: string[];
  exclusions: string[];
  exclusionsAr: string[];
  meetingPoint: string;
  meetingPointAr: string;
  featured: boolean;
  status: ExperienceStatus;
  rating?: number;
  reviewsCount?: number;
  maxGuests?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  coverImage: string;
  region: string;
  regionAr: string;
  experienceCount: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Inquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  experienceId: string;
  experienceTitle: string;
  preferredDate: string;
  guests: number;
  message: string;
  status: InquiryStatus;
  internalNotes?: string[];
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalInquiries: number;
  confirmedBookings: number;
  lastInteraction: string;
  notes: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  bannerImage: string;
  destinationId?: string;
  linkedExperienceId?: string;
  ctaText: string;
  ctaTextAr: string;
  ctaLink: string;
  active: boolean;
  badge?: string;
  badgeAr?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
  category: string;
  active: boolean;
}

export interface WebsiteContent {
  heroHeadline: string;
  heroHeadlineAr: string;
  heroDescription: string;
  heroDescriptionAr: string;
  heroImage: string;
  heroImages?: string[];
  heroSlideshowEnabled?: boolean;
  heroSlideIntervalSec?: number;
  aboutHeadline: string;
  aboutHeadlineAr: string;
  aboutText: string;
  aboutTextAr: string;
  stats: {
    operators: number;
    experiences: number;
    travelersServed: number;
    satisfactionRate: number;
  };
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  officeAddressAr: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  componentTexts?: Record<string, string>;
  componentTextsAr?: Record<string, string>;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'experience_view' | 'search' | 'inquiry_submit' | 'booking_confirm';
  path?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  adminUser: string;
  timestamp: string;
}

export interface BusinessSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  whatsappNumber: string;
  businessAddress: string;
  currency: 'SAR';
  defaultLanguage: Language;
  supportedLanguages: Language[];
  socialLinks: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  enableEmailNotifications: boolean;
  enableWhatsAppNotifications: boolean;
}
