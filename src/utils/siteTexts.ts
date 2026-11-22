import { Language, WebsiteContent } from '../types';

export type SiteTextGroupId =
  | 'nav'
  | 'hero'
  | 'destinations'
  | 'map'
  | 'experiences'
  | 'quiz'
  | 'marketing'
  | 'about'
  | 'details'
  | 'footer';

export interface SiteTextGroup {
  id: SiteTextGroupId;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

export interface SiteTextDefinition {
  key: string;
  group: SiteTextGroupId;
  label: string;
  labelAr: string;
  defaultEn: string;
  defaultAr: string;
  multiline?: boolean;
}

export const SITE_TEXT_GROUPS: SiteTextGroup[] = [
  {
    id: 'nav',
    title: 'Header & Navigation',
    titleAr: 'الشريط العلوي والقائمة',
    description: 'Brand wordmark, menu links, primary CTA button, and admin link.',
    descriptionAr: 'اسم العلامة التجارية، روابط القائمة العلوية، وزر الحجز.',
  },
  {
    id: 'hero',
    title: 'Hero & Search Bar',
    titleAr: 'القسم الرئيسي وشريط البحث',
    description: 'Top trust bar tags, search field labels, placeholders, and search button.',
    descriptionAr: 'وسوم الثقة العلوية، حقول البحث، وزر استكشاف التجارب.',
  },
  {
    id: 'destinations',
    title: 'Destinations Section',
    titleAr: 'قسم الوجهات السياحية',
    description: 'Section headings, counters, and destination card call-to-action labels.',
    descriptionAr: 'عناوين قسم الوجهات، عداد التجارب، ونص استكشف الوجهة.',
  },
  {
    id: 'map',
    title: 'Live Google Maps Guide Finder',
    titleAr: 'خريطة الوجهات والمرشدين المحليين',
    description: 'Interactive Google Maps explorer helping travelers find local SME tour guides at each hub.',
    descriptionAr: 'خريطة جوجل التفاعلية لمساعدة المسافرين على إيجاد المواقع والمرشدين المحليين.',
  },
  {
    id: 'experiences',
    title: 'Experiences Catalog',
    titleAr: 'كتالوج التجارب السياحية',
    description: 'Catalog headers, search/sort controls, filter reset, and card price labels.',
    descriptionAr: 'عناوين الكتالوج، مربع البحث والترتيب، وحالات عدم وجود نتائج.',
  },
  {
    id: 'quiz',
    title: 'Interactive Matcher & Quiz',
    titleAr: 'مستكشف التجارب والتحدي التفاعلي',
    description: 'Tabs, matcher questions & choices, game completion text, and action buttons.',
    descriptionAr: 'التبويبات، أسئلة وخيارات المطابقة، ونصوص نتائج اللعبة المعرفية.',
  },
  {
    id: 'marketing',
    title: 'Campaigns, Commitment & Reviews',
    titleAr: 'الحملات، المميزات، والتقييمات',
    description: 'Seasonal campaigns header, 4 operator commitment cards, and 3 guest testimonials.',
    descriptionAr: 'عناوين العروض الموسمية، بطاقات التزام المشغلين، وآراء المسافرين.',
  },
  {
    id: 'about',
    title: 'About Stats & Newsletter',
    titleAr: 'من نحن، الإحصائيات، والنشرة البريدية',
    description: 'Metric labels beneath the About narrative and the newsletter signup card.',
    descriptionAr: 'تسميات الإحصائيات ومحتوى صندوق الاشتراك في النشرة البريدية.',
  },
  {
    id: 'details',
    title: 'Experience Detail & Booking Form',
    titleAr: 'تفاصيل التجربة ونموذج الحجز',
    description: 'Section headings, verified operator badge, booking card copy, and confirmations.',
    descriptionAr: 'عناوين صفحة التفاصيل، شارة التوثيق، ونصوص نموذج طلب الحجز.',
  },
  {
    id: 'footer',
    title: 'Footer & Legal Bar',
    titleAr: 'تذييل الموقع وحقوق النشر',
    description: 'Footer description, Vision 2030 badge, column titles, and copyright suffix.',
    descriptionAr: 'نبذة التذييل، شارة رؤية 2030، عناوين الأعمدة، وحقوق النشر.',
  },
];

export const SITE_TEXT_DEFINITIONS: SiteTextDefinition[] = [
  // NAV
  {
    key: 'nav.brandName',
    group: 'nav',
    label: 'Navbar & Footer Brand Wordmark',
    labelAr: 'اسم العلامة في الشريط والتذييل',
    defaultEn: 'TourFlow',
    defaultAr: 'تورفلو',
  },
  {
    key: 'nav.explore',
    group: 'nav',
    label: 'Nav Link: Explore',
    labelAr: 'رابط القائمة: استكشف',
    defaultEn: 'Explore',
    defaultAr: 'استكشف',
  },
  {
    key: 'nav.destinations',
    group: 'nav',
    label: 'Nav Link: Destinations',
    labelAr: 'رابط القائمة: الوجهات',
    defaultEn: 'Destinations',
    defaultAr: 'الوجهات',
  },
  {
    key: 'nav.map',
    group: 'nav',
    label: 'Nav Link: Map Explorer',
    labelAr: 'رابط القائمة: خريطة المرشدين',
    defaultEn: 'Live Map',
    defaultAr: 'الخريطة المباشرة',
  },
  {
    key: 'nav.experiences',
    group: 'nav',
    label: 'Nav Link: Experiences',
    labelAr: 'رابط القائمة: التجارب',
    defaultEn: 'Experiences',
    defaultAr: 'التجارب',
  },
  {
    key: 'nav.quiz',
    group: 'nav',
    label: 'Nav Link: Discover Match',
    labelAr: 'رابط القائمة: طابق رحلتك',
    defaultEn: 'Discover Match',
    defaultAr: 'طابق رحلتك',
  },
  {
    key: 'nav.about',
    group: 'nav',
    label: 'Nav Link: About Us',
    labelAr: 'رابط القائمة: عن تورفلو',
    defaultEn: 'About Us',
    defaultAr: 'عن تورفلو',
  },
  {
    key: 'nav.bookCta',
    group: 'nav',
    label: 'Primary Navbar Button',
    labelAr: 'زر الحجز الرئيسي بالشريط',
    defaultEn: 'Book Experience',
    defaultAr: 'احجز تجربة',
  },
  {
    key: 'nav.adminPortal',
    group: 'nav',
    label: 'Admin Portal Button Label',
    labelAr: 'نص زر لوحة الإدارة',
    defaultEn: 'Admin Portal',
    defaultAr: 'لوحة الإدارة',
  },

  // HERO
  {
    key: 'hero.taglineLeft',
    group: 'hero',
    label: 'Hero Top Tag 1',
    labelAr: 'وسم الهيرو العلوي 1',
    defaultEn: 'Kingdom of Saudi Arabia',
    defaultAr: 'المملكة العربية السعودية',
  },
  {
    key: 'hero.taglineMid',
    group: 'hero',
    label: 'Hero Top Tag 2',
    labelAr: 'وسم الهيرو العلوي 2',
    defaultEn: 'Vision 2030 Tourism Ecosystem',
    defaultAr: 'منظومة سياحة رؤية 2030',
  },
  {
    key: 'hero.taglineRight',
    group: 'hero',
    label: 'Hero Top Tag 3',
    labelAr: 'وسم الهيرو العلوي 3',
    defaultEn: 'B2B Growth Platform',
    defaultAr: 'منصة نمو الأعمال السياحية',
  },
  {
    key: 'hero.searchDestination',
    group: 'hero',
    label: 'Search Label: Destination',
    labelAr: 'عنوان حقل الوجهة',
    defaultEn: 'Where to?',
    defaultAr: 'إلى أين وجهتك؟',
  },
  {
    key: 'hero.allDestinations',
    group: 'hero',
    label: 'Search Default Option: Destinations',
    labelAr: 'خيار جميع الوجهات',
    defaultEn: 'All Destinations',
    defaultAr: 'جميع الوجهات',
  },
  {
    key: 'hero.category',
    group: 'hero',
    label: 'Search Label: Category',
    labelAr: 'عنوان حقل التصنيف',
    defaultEn: 'Category',
    defaultAr: 'تصنيف التجربة',
  },
  {
    key: 'hero.allCategories',
    group: 'hero',
    label: 'Search Default Option: Categories',
    labelAr: 'خيار جميع التصنيفات',
    defaultEn: 'All Categories',
    defaultAr: 'جميع التصنيفات',
  },
  {
    key: 'hero.date',
    group: 'hero',
    label: 'Search Label: Travel Date',
    labelAr: 'عنوان حقل التاريخ',
    defaultEn: 'Travel Date',
    defaultAr: 'تاريخ السفر',
  },
  {
    key: 'hero.guests',
    group: 'hero',
    label: 'Search Label: Guests',
    labelAr: 'عنوان حقل الضيوف',
    defaultEn: 'Guests',
    defaultAr: 'عدد الضيوف',
  },
  {
    key: 'hero.searchBtn',
    group: 'hero',
    label: 'Search Submit Button',
    labelAr: 'زر تنفيذ البحث',
    defaultEn: 'Find Experiences',
    defaultAr: 'بحث عن تجارب',
  },

  // DESTINATIONS
  {
    key: 'destinations.viewAll',
    group: 'destinations',
    label: 'Section Eyebrow',
    labelAr: 'العنوان الفرعي العلوي للوجهات',
    defaultEn: 'All Saudi Destinations',
    defaultAr: 'كافة وجهات المملكة',
  },
  {
    key: 'destinations.title',
    group: 'destinations',
    label: 'Section Heading',
    labelAr: 'عنوان قسم الوجهات',
    defaultEn: 'Explore Extraordinary Destinations',
    defaultAr: 'استكشف وجهات استثنائية',
  },
  {
    key: 'destinations.sub',
    group: 'destinations',
    label: 'Section Subtitle',
    labelAr: 'وصف قسم الوجهات',
    defaultEn:
      'From the ancient Nabataean sandstone canyons of AlUla to the historic coral alleyways of Jeddah and the untouched Red Sea.',
    defaultAr:
      'من ممرات العلا الصخرية الشامخة إلى أزقة جدة التاريخية العريقة ومياه البحر الأحمر العذراء.',
    multiline: true,
  },
  {
    key: 'destinations.hubsSuffix',
    group: 'destinations',
    label: 'Hubs Counter Suffix',
    labelAr: 'وصف عدد الوجهات',
    defaultEn: 'Key Tourism Hubs',
    defaultAr: 'وجهات سياحية رئيسية',
  },
  {
    key: 'destinations.experiencesSuffix',
    group: 'destinations',
    label: 'Card Experience Count Label',
    labelAr: 'تسمية عدد التجارب بالبطاقة',
    defaultEn: 'Curated Experiences',
    defaultAr: 'تجارب مختارة',
  },
  {
    key: 'destinations.exploreCta',
    group: 'destinations',
    label: 'Destination Card CTA',
    labelAr: 'نص رابط البطاقة',
    defaultEn: 'Explore Destination',
    defaultAr: 'استكشف الوجهة',
  },

  // LIVE GOOGLE MAPS GUIDE FINDER
  {
    key: 'map.eyebrow',
    group: 'map',
    label: 'Map Section Eyebrow',
    labelAr: 'العنوان الفرعي العلوي للخريطة',
    defaultEn: 'Flight & Hotel Booked? Explore Nearby Guides',
    defaultAr: 'حجزت طيرانك وفندقك؟ اكتشف المرشدين حولك',
  },
  {
    key: 'map.title',
    group: 'map',
    label: 'Map Section Heading',
    labelAr: 'عنوان قسم الخريطة التفاعلية',
    defaultEn: 'Live Saudi Destination Map & Local UMKM Tour Guides',
    defaultAr: 'خريطة الوجهات السعودية المباشرة والمرشدون المحليون',
  },
  {
    key: 'map.sub',
    group: 'map',
    label: 'Map Section Subtitle',
    labelAr: 'وصف قسم الخريطة التفاعلية',
    defaultEn:
      'Locate every tourist spot on Google Maps, verify available local SME operators ready to guide you, plan driving routes from your hotel, or launch Google Maps navigation.',
    defaultAr:
      'حدّد مواقع المعالم السياحية على خرائط جوجل، وتعرّف على المرشدين المحليين المعتمدين في كل وجهة، واحسب مسار القيادة من فندقك مباشرة.',
    multiline: true,
  },
  {
    key: 'map.trustTitleSuffix',
    group: 'map',
    label: 'Trust Badge Title Suffix',
    labelAr: 'تسمية شارة الثقة',
    defaultEn: 'Local UMKM Guided Tours',
    defaultAr: 'جولة مع مرشد محلي',
  },
  {
    key: 'map.trustSubtitle',
    group: 'map',
    label: 'Trust Badge Subtitle',
    labelAr: 'النص الفرعي لشارة الثقة',
    defaultEn: 'Ready to host once you land',
    defaultAr: 'جاهزون للاستقبال بمجرد وصولك',
  },
  {
    key: 'map.findGuidesCta',
    group: 'map',
    label: 'Map Spot Primary CTA',
    labelAr: 'زر عرض المرشدين بالوجهة',
    defaultEn: 'Browse Local Guides Here',
    defaultAr: 'عرض المرشدين المحليين هنا',
  },
  {
    key: 'map.openGmapsCta',
    group: 'map',
    label: 'Open in Google Maps CTA',
    labelAr: 'زر الفتح في خرائط جوجل',
    defaultEn: 'Open in Google Maps',
    defaultAr: 'فتح في خرائط جوجل',
  },

  // EXPERIENCES CATALOG
  {
    key: 'experiences.featuredBadge',
    group: 'experiences',
    label: 'Catalog Eyebrow',
    labelAr: 'العنوان الفرعي العلوي للتجارب',
    defaultEn: 'Featured',
    defaultAr: 'المميزة',
  },
  {
    key: 'experiences.title',
    group: 'experiences',
    label: 'Catalog Heading',
    labelAr: 'عنوان كتالوج التجارب',
    defaultEn: 'Curated Saudi Experiences',
    defaultAr: 'تجارب سياحية سعودية أصيلة',
  },
  {
    key: 'experiences.sub',
    group: 'experiences',
    label: 'Catalog Subtitle',
    labelAr: 'وصف كتالوج التجارب',
    defaultEn:
      'Handpicked journeys hosted by certified local Saudi guides, cultural storytellers, and adventure curators.',
    defaultAr: 'جولات مختارة بعناية يقودها مرشدون ورواة محليون معتمدون في قلب المملكة.',
    multiline: true,
  },
  {
    key: 'experiences.searchPlaceholder',
    group: 'experiences',
    label: 'Search Input Placeholder',
    labelAr: 'نص مربع البحث في التجارب',
    defaultEn: 'Search experiences...',
    defaultAr: 'ابحث في التجارب...',
  },
  {
    key: 'experiences.sortFeatured',
    group: 'experiences',
    label: 'Sort Option: Featured',
    labelAr: 'ترتيب: الأكثر تميزاً',
    defaultEn: 'Featured First',
    defaultAr: 'الأكثر تميزاً',
  },
  {
    key: 'experiences.sortPriceAsc',
    group: 'experiences',
    label: 'Sort Option: Price Ascending',
    labelAr: 'ترتيب: السعر الأقل',
    defaultEn: 'Price: Low to High',
    defaultAr: 'السعر: من الأقل إلى الأعلى',
  },
  {
    key: 'experiences.sortPriceDesc',
    group: 'experiences',
    label: 'Sort Option: Price Descending',
    labelAr: 'ترتيب: السعر الأعلى',
    defaultEn: 'Price: High to Low',
    defaultAr: 'السعر: من الأعلى إلى الأقل',
  },
  {
    key: 'experiences.allTab',
    group: 'experiences',
    label: 'All Categories Tab Label',
    labelAr: 'زر عرض جميع التجارب',
    defaultEn: 'All Experiences',
    defaultAr: 'جميع التجارب',
  },
  {
    key: 'experiences.filteredBy',
    group: 'experiences',
    label: 'Active Filter Label',
    labelAr: 'نص التصفية النشطة',
    defaultEn: 'Filtered by destination:',
    defaultAr: 'تمت التصفية حسب الوجهة:',
  },
  {
    key: 'experiences.clearFilter',
    group: 'experiences',
    label: 'Clear Filter Link',
    labelAr: 'زر إزالة التصفية',
    defaultEn: 'Clear filter',
    defaultAr: 'إزالة التصفية',
  },
  {
    key: 'experiences.from',
    group: 'experiences',
    label: 'Card Price Prefix',
    labelAr: 'بادئة السعر',
    defaultEn: 'From',
    defaultAr: 'ابتداءً من',
  },
  {
    key: 'experiences.viewDetails',
    group: 'experiences',
    label: 'Card Details Button',
    labelAr: 'نص زر تفاصيل التجربة',
    defaultEn: 'View Experience',
    defaultAr: 'تفاصيل التجربة',
  },
  {
    key: 'experiences.emptyTitle',
    group: 'experiences',
    label: 'Empty State Heading',
    labelAr: 'عنوان عدم وجود نتائج',
    defaultEn: 'No published experiences match your filter',
    defaultAr: 'لا توجد تجارب منشورة تطابق بحثك',
  },
  {
    key: 'experiences.emptySub',
    group: 'experiences',
    label: 'Empty State Subtitle',
    labelAr: 'وصف عدم وجود نتائج',
    defaultEn: 'Try adjusting your category or destination selection.',
    defaultAr: 'جرّب تعديل التصنيف أو الوجهة المختارة.',
  },
  {
    key: 'experiences.resetFilters',
    group: 'experiences',
    label: 'Empty State Reset Button',
    labelAr: 'زر إعادة ضبط الفلاتر',
    defaultEn: 'Reset All Filters',
    defaultAr: 'إعادة ضبط جميع الفلاتر',
  },

  // QUIZ & MATCHER
  {
    key: 'quiz.badge',
    group: 'quiz',
    label: 'Quiz Section Eyebrow',
    labelAr: 'الوسم العلوي للاختبار',
    defaultEn: 'Interactive Experience Matcher',
    defaultAr: 'مستكشف التجارب التفاعلي',
  },
  {
    key: 'quiz.title',
    group: 'quiz',
    label: 'Quiz Section Heading',
    labelAr: 'عنوان قسم الاختبار التفاعلي',
    defaultEn: 'Discover Your Saudi Experience',
    defaultAr: 'اكتشف تجربتك السعودية المثالية',
  },
  {
    key: 'quiz.sub',
    group: 'quiz',
    label: 'Quiz Section Subtitle',
    labelAr: 'وصف قسم الاختبار التفاعلي',
    defaultEn:
      'Take our 30-second Saudi discovery quiz and let our recommendation engine find your ideal authentic adventure.',
    defaultAr:
      'أجب عن بضعة أسئلة في 30 ثانية لنوصلك بالتجربة التي تناسب ذوقك وتطلعاتك.',
    multiline: true,
  },
  {
    key: 'quiz.tabMatcher',
    group: 'quiz',
    label: 'Tab 1 Label (Matcher)',
    labelAr: 'تبويب 1 (مستكشف التجارب)',
    defaultEn: 'Experience Matcher',
    defaultAr: 'مستكشف التجارب',
  },
  {
    key: 'quiz.tabKnowledge',
    group: 'quiz',
    label: 'Tab 2 Label (Knowledge Game)',
    labelAr: 'تبويب 2 (تحدي المعرفة)',
    defaultEn: 'Saudi Knowledge Game',
    defaultAr: 'تحدي المعرفة السعودية',
  },
  {
    key: 'quiz.matcherQ1',
    group: 'quiz',
    label: 'Matcher Question 1',
    labelAr: 'سؤال المطابقة 1',
    defaultEn: 'What landscape or setting calls to you most?',
    defaultAr: 'ما هي الطبيعة أو البيئة التي تجذبك أكثر؟',
  },
  {
    key: 'quiz.matcherQ2',
    group: 'quiz',
    label: 'Matcher Question 2',
    labelAr: 'سؤال المطابقة 2',
    defaultEn: 'Who will be sharing this journey with you?',
    defaultAr: 'مع من تخطط لمشاركة هذه التجربة؟',
  },
  {
    key: 'quiz.matcherQ3',
    group: 'quiz',
    label: 'Matcher Question 3',
    labelAr: 'سؤال المطابقة 3',
    defaultEn: 'What is your preferred rhythm for the day?',
    defaultAr: 'ما هو النمط المفضل لبرنامج يومك؟',
  },
  {
    key: 'quiz.congrats',
    group: 'quiz',
    label: 'Match Found Headline',
    labelAr: 'عنوان النتيجة الموصى بها',
    defaultEn: 'Mabrook! Your Custom Match',
    defaultAr: 'مبروك! التجربة المثالية لك',
  },
  {
    key: 'quiz.matchSub',
    group: 'quiz',
    label: 'Match Found Subtitle',
    labelAr: 'وصف النتيجة الموصى بها',
    defaultEn:
      'Based on your preferences, our platform recommends this tailor-made Saudi experience:',
    defaultAr: 'بناءً على اختياراتك وتفضيلاتك، توصي منصتنا بهذه التجربة السعودية المصممة لك:',
  },
  {
    key: 'quiz.confirmAnswer',
    group: 'quiz',
    label: 'Confirm Answer Button',
    labelAr: 'زر تأكيد الإجابة',
    defaultEn: 'Confirm Answer',
    defaultAr: 'تأكيد الإجابة',
  },
  {
    key: 'quiz.nextQuestion',
    group: 'quiz',
    label: 'Next Question Button',
    labelAr: 'زر السؤال التالي',
    defaultEn: 'Next Question',
    defaultAr: 'السؤال التالي',
  },
  {
    key: 'quiz.viewResults',
    group: 'quiz',
    label: 'View Results Button',
    labelAr: 'زر عرض النتيجة',
    defaultEn: 'View Results',
    defaultAr: 'عرض النتيجة',
  },
  {
    key: 'quiz.completeTitle',
    group: 'quiz',
    label: 'Knowledge Game Complete Heading',
    labelAr: 'عنوان إكمال التحدي',
    defaultEn: 'Knowledge Quest Complete!',
    defaultAr: 'اكتملت رحلة المعرفة!',
  },
  {
    key: 'quiz.share',
    group: 'quiz',
    label: 'Share Result Button',
    labelAr: 'زر مشاركة النتيجة',
    defaultEn: 'Share Result',
    defaultAr: 'مشاركة النتيجة',
  },
  {
    key: 'quiz.retake',
    group: 'quiz',
    label: 'Retake Quiz Button',
    labelAr: 'زر إعادة المحاولة',
    defaultEn: 'Take Again',
    defaultAr: 'إعادة المحاولة',
  },

  // MARKETING (CAMPAIGNS, WHY CHOOSE US, REVIEWS)
  {
    key: 'campaigns.eyebrow',
    group: 'marketing',
    label: 'Campaigns Section Eyebrow',
    labelAr: 'الوسم العلوي للحملات',
    defaultEn: 'Seasonal Highlights',
    defaultAr: 'أبرز عروض الموسم',
  },
  {
    key: 'campaigns.title',
    group: 'marketing',
    label: 'Campaigns Section Title',
    labelAr: 'عنوان قسم الحملات الموسمية',
    defaultEn: 'Limited Saudi Campaigns & Special Editions',
    defaultAr: 'حملات سعودية محدودة وإصدارات خاصة',
  },
  {
    key: 'why.eyebrow',
    group: 'marketing',
    label: 'Commitment Eyebrow',
    labelAr: 'الوسم العلوي للمميزات',
    defaultEn: 'The TourFlow Commitment',
    defaultAr: 'التزام تورفلو',
  },
  {
    key: 'why.title',
    group: 'marketing',
    label: 'Commitment Heading',
    labelAr: 'عنوان لماذا تختار المشغلين',
    defaultEn: 'Why Choose Local Saudi Operators?',
    defaultAr: 'لماذا تختار المشغلين السعوديين المحليين؟',
  },
  {
    key: 'why.sub',
    group: 'marketing',
    label: 'Commitment Subtitle',
    labelAr: 'وصف التزام المنصة',
    defaultEn:
      'True luxury lies in authentic human connection, living heritage, and genuine desert hospitality.',
    defaultAr:
      'الفخامة الحقيقية تكمن في التواصل الإنساني الأصيل، والتراث الحي، وكرم الضيافة الصحراوية الصادقة.',
    multiline: true,
  },
  {
    key: 'why.r1Title',
    group: 'marketing',
    label: 'Pillar 1 Title',
    labelAr: 'عنوان الميزة 1',
    defaultEn: 'Direct Operator Empowerment',
    defaultAr: 'تمكين مباشر للمشغلين المحليين',
  },
  {
    key: 'why.r1Desc',
    group: 'marketing',
    label: 'Pillar 1 Description',
    labelAr: 'وصف الميزة 1',
    defaultEn:
      '100% of our experiences are hosted by Saudi registered SMEs, Bedouin guides, and independent cultural custodians.',
    defaultAr: 'جميع تجاربنا يقودها مشغلون سعوديون مرخصون ورواة محليون للحفاظ على الهوية الأصيلة.',
    multiline: true,
  },
  {
    key: 'why.r2Title',
    group: 'marketing',
    label: 'Pillar 2 Title',
    labelAr: 'عنوان الميزة 2',
    defaultEn: 'Certified Saudi Rawis (Storytellers)',
    defaultAr: 'رواة ومرشدون سياحيون معتمدون',
  },
  {
    key: 'why.r2Desc',
    group: 'marketing',
    label: 'Pillar 2 Description',
    labelAr: 'وصف الميزة 2',
    defaultEn:
      'Every narrative is authenticated by certified local guides recognized by the Ministry of Tourism and the Royal Commissions.',
    defaultAr: 'سرد تاريخي موثق بإشراف مرشدين مؤهلين ومعتمدين من وزارة السياحة والهيئات الملكية.',
    multiline: true,
  },
  {
    key: 'why.r3Title',
    group: 'marketing',
    label: 'Pillar 3 Title',
    labelAr: 'عنوان الميزة 3',
    defaultEn: 'Transparent SAR Direct Rates',
    defaultAr: 'أسعار مباشرة بالريال السعودي',
  },
  {
    key: 'why.r3Desc',
    group: 'marketing',
    label: 'Pillar 3 Description',
    labelAr: 'وصف الميزة 3',
    defaultEn:
      'No middleman markups or opaque commissions. Inquire directly and coordinate custom itineraries with local operators.',
    defaultAr: 'بدون رسوم وساطة خفية، تواصل مباشر مع المشغلين لتنسيق باقات وتفاصيل الرحلة.',
    multiline: true,
  },
  {
    key: 'why.r4Title',
    group: 'marketing',
    label: 'Pillar 4 Title',
    labelAr: 'عنوان الميزة 4',
    defaultEn: 'Regenerative Cultural Stewardship',
    defaultAr: 'استدامة التراث وحماية البيئة',
  },
  {
    key: 'why.r4Desc',
    group: 'marketing',
    label: 'Pillar 4 Description',
    labelAr: 'وصف الميزة 4',
    defaultEn:
      'Supporting the Saudi Green Initiative and community tourism that directly funds heritage preservation.',
    defaultAr: 'دعم مبادرة السعودية الخضراء والسياحة المجتمعية لتمويل استدامة المواقع التراثية.',
    multiline: true,
  },
  {
    key: 'reviews.eyebrow',
    group: 'marketing',
    label: 'Reviews Section Eyebrow',
    labelAr: 'الوسم العلوي للتقييمات',
    defaultEn: 'Traveler Ratings & Trust Score',
    defaultAr: 'تقييمات المسافرين ومؤشر الثقة',
  },
  {
    key: 'reviews.title',
    group: 'marketing',
    label: 'Reviews Section Title',
    labelAr: 'عنوان قسم آراء الضيوف',
    defaultEn: 'Verified Guest Feedback & Operator Ratings',
    defaultAr: 'آراء الضيوف الموثقة وتقييمات المشغلين',
  },
  {
    key: 'reviews.avgScoreLabel',
    group: 'marketing',
    label: 'Metric Label: Avg Score',
    labelAr: 'تسمية متوسط التقييم',
    defaultEn: 'Average Experience Score',
    defaultAr: 'متوسط تقييم التجارب',
  },
  {
    key: 'reviews.totalLabel',
    group: 'marketing',
    label: 'Metric Label: Verified Reviews',
    labelAr: 'تسمية التقييمات الموثقة',
    defaultEn: 'Verified Reviews',
    defaultAr: 'تقييمات موثقة',
  },
  {
    key: 'reviews.satisfactionLabel',
    group: 'marketing',
    label: 'Metric Label: Satisfaction',
    labelAr: 'تسمية نسبة الرضا',
    defaultEn: 'Guest Satisfaction',
    defaultAr: 'نسبة رضا الضيوف',
  },
  {
    key: 'reviews.t1Guest',
    group: 'marketing',
    label: 'Testimonial 1 Author',
    labelAr: 'اسم الضيف 1',
    defaultEn: 'Elena Vance · London, UK',
    defaultAr: 'إيلينا فانس · لندن، المملكة المتحدة',
  },
  {
    key: 'reviews.t1Quote',
    group: 'marketing',
    label: 'Testimonial 1 Quote',
    labelAr: 'نص شهادة الضيف 1',
    defaultEn:
      'Our local AlUla Rawi timed our Hegra canyon arrival at golden hour and arranged Bedouin cardamom coffee under the stars.',
    defaultAr: 'رتب الراوي المحلي وصولنا إلى الحجر عند الغروب مع قهوة سعودية أصيلة تحت النجوم.',
    multiline: true,
  },
  {
    key: 'reviews.t2Guest',
    group: 'marketing',
    label: 'Testimonial 2 Author',
    labelAr: 'اسم الضيف 2',
    defaultEn: 'Faisal Al-Qahtani · Riyadh, KSA',
    defaultAr: 'فيصل القحطاني · الرياض، السعودية',
  },
  {
    key: 'reviews.t2Quote',
    group: 'marketing',
    label: 'Testimonial 2 Quote',
    labelAr: 'نص شهادة الضيف 2',
    defaultEn:
      'Seamless direct SAR coordination with no agency markup. Our family felt genuinely welcomed from pickup to farewell.',
    defaultAr: 'تنسيق مباشر وشفاف بالريال السعودي بدون أي عمولات إضافية واستقبال عائلي رائع.',
    multiline: true,
  },
  {
    key: 'reviews.t3Guest',
    group: 'marketing',
    label: 'Testimonial 3 Author',
    labelAr: 'اسم الضيف 3',
    defaultEn: 'Marcello Rossi · Milan, Italy',
    defaultAr: 'مارسيلو روسي · ميلانو، إيطاليا',
  },
  {
    key: 'reviews.t3Quote',
    group: 'marketing',
    label: 'Testimonial 3 Quote',
    labelAr: 'نص شهادة الضيف 3',
    defaultEn:
      'World-class conservation standards and deeply knowledgeable coastal conservation guides along the Red Sea islands.',
    defaultAr: 'معايير عالمية في السياحة المستدامة ومرشدون متخصصون في جزر البحر الأحمر.',
    multiline: true,
  },

  // ABOUT & NEWSLETTER
  {
    key: 'about.tagline',
    group: 'about',
    label: 'About Section Eyebrow',
    labelAr: 'العنوان الفرعي لقسم من نحن',
    defaultEn: 'Turning Local Experiences Into Digital Growth',
    defaultAr: 'تحويل التجارب المحلية إلى نمو رقمي مستدام',
  },
  {
    key: 'about.statOperators',
    group: 'about',
    label: 'Stat 1 Label',
    labelAr: 'تسمية الإحصائية 1',
    defaultEn: 'Local Operators',
    defaultAr: 'مشغل محلي مرخص',
  },
  {
    key: 'about.statExperiences',
    group: 'about',
    label: 'Stat 2 Label',
    labelAr: 'تسمية الإحصائية 2',
    defaultEn: 'Curated Journeys',
    defaultAr: 'رحلة وتجربة سياحية',
  },
  {
    key: 'about.statTravelers',
    group: 'about',
    label: 'Stat 3 Label',
    labelAr: 'تسمية الإحصائية 3',
    defaultEn: 'Travelers Welcomed',
    defaultAr: 'زائر ومسافر',
  },
  {
    key: 'about.statSatisfaction',
    group: 'about',
    label: 'Stat 4 Label',
    labelAr: 'تسمية الإحصائية 4',
    defaultEn: 'Guest Satisfaction',
    defaultAr: 'نسبة رضا الضيوف',
  },
  {
    key: 'newsletter.eyebrow',
    group: 'about',
    label: 'Newsletter Eyebrow',
    labelAr: 'الوسم العلوي للنشرة البريدية',
    defaultEn: 'Stay Connected',
    defaultAr: 'ابقَ على تواصل',
  },
  {
    key: 'newsletter.title',
    group: 'about',
    label: 'Newsletter Title',
    labelAr: 'عنوان النشرة البريدية',
    defaultEn: 'Join the Saudi Tourism Movement',
    defaultAr: 'انضم إلى مسيرة السياحة السعودية',
  },
  {
    key: 'newsletter.desc',
    group: 'about',
    label: 'Newsletter Description',
    labelAr: 'وصف النشرة البريدية',
    defaultEn:
      'Subscribe to receive seasonal itineraries, cultural dispatches from AlUla and Diriyah, and exclusive operator rates.',
    defaultAr:
      'اشترك لتصلك البرامج الموسمية، والرسائل الثقافية من العلا والدرعية، والأسعار الحصرية مباشرة من المشغلين.',
    multiline: true,
  },
  {
    key: 'newsletter.placeholder',
    group: 'about',
    label: 'Newsletter Email Placeholder',
    labelAr: 'نص حقل البريد الإلكتروني',
    defaultEn: 'Enter your email address',
    defaultAr: 'أدخل بريدك الإلكتروني',
  },
  {
    key: 'newsletter.btn',
    group: 'about',
    label: 'Newsletter Subscribe Button',
    labelAr: 'زر الاشتراك بالنشرة',
    defaultEn: 'Subscribe',
    defaultAr: 'اشترك الآن',
  },
  {
    key: 'newsletter.success',
    group: 'about',
    label: 'Newsletter Success Message',
    labelAr: 'رسالة نجاح الاشتراك',
    defaultEn: 'Thank you for subscribing! Seasonal Saudi updates will arrive in your inbox.',
    defaultAr: 'شكراً لاشتراكك! ستصلك أحدث الوجهات والعروض الموسمية السعودية في بريدك.',
  },

  // EXPERIENCE DETAIL & BOOKING
  {
    key: 'details.backToCatalog',
    group: 'details',
    label: 'Back Link Label',
    labelAr: 'رابط العودة للتجارب',
    defaultEn: 'Back to Experiences',
    defaultAr: 'العودة إلى التجارب',
  },
  {
    key: 'details.shareBtn',
    group: 'details',
    label: 'Share Button Label',
    labelAr: 'زر المشاركة',
    defaultEn: 'Share',
    defaultAr: 'مشاركة',
  },
  {
    key: 'details.overview',
    group: 'details',
    label: 'Section Heading: Overview',
    labelAr: 'عنوان قسم النبذة العامة',
    defaultEn: 'Overview',
    defaultAr: 'نبذة عامة',
  },
  {
    key: 'details.highlights',
    group: 'details',
    label: 'Section Heading: Highlights',
    labelAr: 'عنوان أبرز المميزات',
    defaultEn: 'Experience Highlights',
    defaultAr: 'أبرز مميزات الرحلة',
  },
  {
    key: 'details.included',
    group: 'details',
    label: "Section Heading: What's Included",
    labelAr: 'عنوان ما تشمله الرحلة',
    defaultEn: "What's Included",
    defaultAr: 'ما تشمله الرحلة',
  },
  {
    key: 'details.notIncluded',
    group: 'details',
    label: "Section Heading: What's Not Included",
    labelAr: 'عنوان ما لا تشمله الرحلة',
    defaultEn: "What's Not Included",
    defaultAr: 'ما لا تشمله الرحلة',
  },
  {
    key: 'details.meetingPoint',
    group: 'details',
    label: 'Section Heading: Meeting Point',
    labelAr: 'عنوان نقطة الالتقاء',
    defaultEn: 'Meeting Point & Location',
    defaultAr: 'نقطة الالتقاء والموقع',
  },
  {
    key: 'details.verifiedBadge',
    group: 'details',
    label: 'Verified Operator Label',
    labelAr: 'نص شارة التوثيق الرسمية',
    defaultEn: 'Verified Saudi Ministry of Tourism Operator',
    defaultAr: 'مشغل سياحي مرخص ومعتمد من وزارة السياحة السعودية',
  },
  {
    key: 'details.officialRate',
    group: 'details',
    label: 'Booking Price Eyebrow',
    labelAr: 'تسمية السعر الرسمي',
    defaultEn: 'Official Rate',
    defaultAr: 'السعر الرسمي',
  },
  {
    key: 'details.perGuest',
    group: 'details',
    label: 'Per Guest Price Suffix',
    labelAr: 'لاحقة السعر للضيف',
    defaultEn: '/ guest',
    defaultAr: '/ للضيف',
  },
  {
    key: 'details.instantDirect',
    group: 'details',
    label: 'Instant Direct Label',
    labelAr: 'شارة الحجز المباشر',
    defaultEn: 'Instant Operator Direct',
    defaultAr: 'مباشرة مع المشغل',
  },
  {
    key: 'details.bookingTitle',
    group: 'details',
    label: 'Booking Form Title',
    labelAr: 'عنوان بطاقة طلب الحجز',
    defaultEn: 'Request Your Experience',
    defaultAr: 'طلب حجز التجربة',
  },
  {
    key: 'details.bookingSub',
    group: 'details',
    label: 'Booking Form Subtitle',
    labelAr: 'وصف بطاقة طلب الحجز',
    defaultEn: 'Direct request to certified local operators. No prepayment required.',
    defaultAr: 'طلب مباشر للمشغل المحلي المرخص دون الحاجة للدفع المسبق.',
  },
  {
    key: 'details.submitBtn',
    group: 'details',
    label: 'Booking Submit Button',
    labelAr: 'زر إرسال طلب الحجز',
    defaultEn: 'Submit Booking Inquiry',
    defaultAr: 'إرسال طلب الحجز',
  },
  {
    key: 'details.successTitle',
    group: 'details',
    label: 'Booking Confirmation Heading',
    labelAr: 'عنوان تأكيد إرسال الطلب',
    defaultEn: 'Inquiry Submitted Successfully!',
    defaultAr: 'تم إرسال طلبك بنجاح!',
  },
  {
    key: 'details.successMsg',
    group: 'details',
    label: 'Booking Confirmation Message',
    labelAr: 'رسالة تأكيد إرسال الطلب',
    defaultEn:
      'Your inquiry has been logged in real-time. A certified local concierge will contact you within 2 business hours.',
    defaultAr:
      'تم حفظ طلبك فورياً في النظام، وسيتواصل معك منسق الرحلات خلال ساعتي عمل.',
    multiline: true,
  },
  {
    key: 'details.whatsappBtn',
    group: 'details',
    label: 'WhatsApp Follow-up Button',
    labelAr: 'زر متابعة الواتساب',
    defaultEn: 'Chat on WhatsApp',
    defaultAr: 'تواصل عبر واتساب',
  },
  {
    key: 'details.freeNote',
    group: 'details',
    label: 'No-Prepayment Trust Footnote',
    labelAr: 'ملاحظة الحجز المجاني السفلية',
    defaultEn: 'Free inquiry · No upfront payment required',
    defaultAr: 'طلب مجاني · لا يتطلب أي دفع مسبق',
  },

  // FOOTER
  {
    key: 'footer.bio',
    group: 'footer',
    label: 'Footer Brand Statement',
    labelAr: 'النبذة التعريفية بالتذييل',
    defaultEn:
      '"Turning Local Experiences Into Digital Growth." Saudi Arabia’s premier digital platform connecting licensed tour operators with global and domestic travelers.',
    defaultAr:
      '"تحويل التجارب المحلية إلى نمو رقمي مستدام." المنصة الرقمية الرائدة في المملكة العربية السعودية لربط مشغلي الجولات المرخصين بالمسافرين محلياً وعالمياً.',
    multiline: true,
  },
  {
    key: 'footer.visionBadge',
    group: 'footer',
    label: 'Vision 2030 Alignment Badge',
    labelAr: 'شارة التوافق مع رؤية 2030',
    defaultEn: 'Aligned with Saudi Vision 2030 Tourism Ecosystem',
    defaultAr: 'متوافقة مع منظومة السياحة في رؤية السعودية 2030',
  },
  {
    key: 'footer.destinationsCol',
    group: 'footer',
    label: 'Footer Column 2 Heading',
    labelAr: 'عنوان عمود الوجهات بالتذييل',
    defaultEn: 'Explore Destinations',
    defaultAr: 'استكشف الوجهات',
  },
  {
    key: 'footer.conciergeCol',
    group: 'footer',
    label: 'Footer Column 3 Heading',
    labelAr: 'عنوان عمود التواصل بالتذييل',
    defaultEn: 'Platform Concierge',
    defaultAr: 'خدمة الكونسيرج والتواصل',
  },
  {
    key: 'footer.rightsSuffix',
    group: 'footer',
    label: 'Copyright Rights Suffix',
    labelAr: 'نص حقوق النشر السفلي',
    defaultEn: 'All rights reserved.',
    defaultAr: 'جميع الحقوق محفوظة.',
  },
];

const SITE_TEXT_MAP: Record<string, SiteTextDefinition> = SITE_TEXT_DEFINITIONS.reduce(
  (acc, def) => {
    acc[def.key] = def;
    return acc;
  },
  {} as Record<string, SiteTextDefinition>
);

export function getDefaultSiteText(key: string, language: Language): string {
  const def = SITE_TEXT_MAP[key];
  if (!def) return '';
  return language === 'ar' ? def.defaultAr : def.defaultEn;
}

export function getSiteText(
  content: WebsiteContent | null | undefined,
  key: string,
  language: Language,
  fallbackEn?: string,
  fallbackAr?: string
): string {
  const def = SITE_TEXT_MAP[key];
  if (language === 'ar') {
    const customAr = content?.componentTextsAr?.[key];
    if (typeof customAr === 'string' && customAr.trim().length > 0) {
      return customAr;
    }
    return fallbackAr ?? def?.defaultAr ?? fallbackEn ?? def?.defaultEn ?? '';
  }

  const customEn = content?.componentTexts?.[key];
  if (typeof customEn === 'string' && customEn.trim().length > 0) {
    return customEn;
  }
  return fallbackEn ?? def?.defaultEn ?? '';
}
