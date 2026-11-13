import { Destination, Experience, ExperienceStatus, InquiryStatus, Language } from '../types';

const CATEGORY_AR_MAP: Record<string, string> = {
  'Desert Adventure': 'مغامرات صحراوية',
  'Cultural Experiences': 'تجارب ثقافية',
  'City Tours': 'جولات المدن',
  'Nature & Outdoor': 'طبيعة ومغامرات خارجية',
  'Luxury Experiences': 'تجارب فاخرة',
  'Family Activities': 'أنشطة عائلية',
  'Custom Package': 'باقة مخصصة',
  'Heritage & History': 'التراث والتاريخ',
  Culture: 'الثقافة',
  Architecture: 'العمارة',
  Traditions: 'التقاليد',
  'Nature & Islands': 'الطبيعة والجزر',
};

const DESTINATION_AR_MAP: Record<string, string> = {
  AlUla: 'العلا',
  Riyadh: 'الرياض',
  Jeddah: 'جدة',
  'Red Sea': 'البحر الأحمر',
  Diriyah: 'الدرعية',
  'Saudi Arabia': 'المملكة العربية السعودية',
};

const COUNTRY_AR_MAP: Record<string, string> = {
  'Saudi Arabia': 'المملكة العربية السعودية',
  'United Kingdom': 'المملكة المتحدة',
  France: 'فرنسا',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  Germany: 'ألمانيا',
  International: 'دولي',
};

const INQUIRY_STATUS_AR_MAP: Record<InquiryStatus, string> = {
  NEW: 'جديد',
  CONTACTED: 'تم التواصل',
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

const EXP_STATUS_AR_MAP: Record<ExperienceStatus, string> = {
  PUBLISHED: 'منشور',
  DRAFT: 'مسودة (مخفي)',
  ARCHIVED: 'مؤرشف',
};

const ACTIVITY_ACTION_AR_MAP: Record<string, string> = {
  'Experience Created': 'تم إنشاء تجربة جديدة',
  'Experience Updated': 'تم تحديث التجربة',
  'Experience Deleted': 'تم حذف التجربة',
  'Experience Duplicated': 'تم نسخ التجربة',
  'Destination Created': 'تمت إضافة وجهة جديدة',
  'Destination Updated': 'تم تحديث الوجهة',
  'New Inquiry Received': 'تم استلام طلب حجز جديد',
  'Inquiry Status Changed': 'تم تحديث حالة الطلب',
  'Promotion Created': 'تم إنشاء حملة ترويجية',
  'Promotion Updated': 'تم تحديث الحملة الترويجية',
  'Promo Code Created': 'تم إنشاء كود خصم',
  'Promo Code Updated': 'تم تحديث كود الخصم',
  'Quiz Question Added': 'تمت إضافة سؤال تفاعلي',
  'Quiz Question Updated': 'تم تحديث سؤال تفاعلي',
  'Quiz Question Deleted': 'تم حذف سؤال تفاعلي',
  'Website CMS Updated': 'تم تحديث محتوى الموقع',
  'Settings Updated': 'تم تحديث إعدادات المنصة',
  'Database Reset': 'إعادة تعيين قاعدة البيانات',
};

export function localizeCategory(category: string, language: Language): string {
  if (language !== 'ar') return category;
  return CATEGORY_AR_MAP[category] || category;
}

export function localizeDestinationName(
  name: string,
  language: Language,
  destinations?: Destination[],
  destinationId?: string
): string {
  if (language !== 'ar') return name;
  if (destinations && destinations.length > 0) {
    const matched = destinations.find(
      (d) => (destinationId && d.id === destinationId) || d.name === name
    );
    if (matched?.nameAr) return matched.nameAr;
  }
  return DESTINATION_AR_MAP[name] || name;
}

export function localizeExperienceTitle(
  title: string,
  language: Language,
  experiences?: Experience[],
  experienceId?: string
): string {
  if (language !== 'ar') return title;
  if (experiences && experiences.length > 0) {
    const matched = experiences.find(
      (e) => (experienceId && e.id === experienceId) || e.title === title
    );
    if (matched?.titleAr) return matched.titleAr;
  }
  return title;
}

export function localizeCountry(country: string, language: Language): string {
  if (language !== 'ar') return country;
  return COUNTRY_AR_MAP[country] || country;
}

export function localizeInquiryStatus(status: InquiryStatus, language: Language): string {
  if (language !== 'ar') return status;
  return INQUIRY_STATUS_AR_MAP[status] || status;
}

export function localizeExperienceStatus(status: ExperienceStatus, language: Language): string {
  if (language !== 'ar') return status === 'DRAFT' ? 'DRAFT (Hidden)' : status;
  return EXP_STATUS_AR_MAP[status] || status;
}

export function localizeCurrency(currency: string | undefined, language: Language): string {
  const code = currency || 'SAR';
  if (language !== 'ar') return code;
  if (code === 'SAR') return 'ريال';
  return code;
}

export function formatGuestsCount(count: number, language: Language): string {
  if (language !== 'ar') {
    return `${count} ${count === 1 ? 'Guest' : 'Guests'}`;
  }
  if (count === 1) return 'ضيف واحد';
  if (count === 2) return 'ضيفان';
  if (count >= 3 && count <= 10) return `${count} ضيوف`;
  return `${count} ضيفاً`;
}

export function localizeActivityAction(action: string, language: Language): string {
  if (language !== 'ar') return action;
  return ACTIVITY_ACTION_AR_MAP[action] || action;
}

export function localizeActivityDetails(details: string, language: Language): string {
  if (language !== 'ar') return details;
  if (details === 'Homepage content & copy updated') {
    return 'تم تحديث محتوى ونصوص الصفحة الرئيسية';
  }
  if (details === 'Platform business settings updated') {
    return 'تم تحديث إعدادات الأعمال والمنصة';
  }
  if (details === 'Demo database restored to default seed state') {
    return 'تمت استعادة البيانات التجريبية الافتراضية';
  }
  const statusMatch = details.match(/^Inquiry (\S+) status updated to (\S+)$/);
  if (statusMatch) {
    const [, inqId, st] = statusMatch;
    const arStatus = INQUIRY_STATUS_AR_MAP[st as InquiryStatus] || st;
    return `تم تحديث حالة الطلب ${inqId} إلى ${arStatus}`;
  }
  return details;
}
