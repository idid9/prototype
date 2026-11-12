import {
  Experience,
  Destination,
  Inquiry,
  Customer,
  Promotion,
  Coupon,
  QuizQuestion,
  WebsiteContent,
  AnalyticsEvent,
  ActivityLog,
  BusinessSettings,
  InquiryStatus,
} from '../types';

// High-fidelity image assets generated for TourFlow
export const IMAGES = {
  heroAlUla: '/src/assets/images/hero_alula_desert_1794458486059.jpg',
  hegraHeritage: '/src/assets/images/hegra_heritage_tomb_1794458485953.jpg',
  riyadhDiriyah: '/src/assets/images/riyadh_diriyah_dusk_1794458486723.jpg',
  jeddahAlBalad: '/src/assets/images/jeddah_albalad_heritage_1794458488400.jpg',
  redSeaCoastal: '/src/assets/images/red_sea_coastal_luxury_1794458487989.jpg',
};

// Initial realistic demo seed data
const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-alula',
    name: 'AlUla',
    nameAr: 'العلا',
    slug: 'alula',
    description: 'An ancient living museum of sandstone cliffs, Nabataean rock-cut monuments at Hegra, and world-class luxury eco-resorts.',
    descriptionAr: 'متحف حي مفتوح بين الصخور الرملية الشاهقة، ومقابر مدائن صالح النبطية، ومنتجعات بيئية فاخرة.',
    coverImage: IMAGES.heroAlUla,
    region: 'Madinah Province',
    regionAr: 'منطقة المدينة المنورة',
    experienceCount: 3,
    featured: true,
    published: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 'dest-riyadh',
    name: 'Riyadh',
    nameAr: 'الرياض',
    slug: 'riyadh',
    description: 'The dynamic capital blending futuristic architectural marvels with the historic mudbrick citadels of Diriyah and Bujairi Terrace.',
    descriptionAr: 'عاصمة المملكة النابضة، تجمع بين ناطحات السحاب المستقبلية وحصون الدرعية التاريخية في مطل البجيري.',
    coverImage: IMAGES.riyadhDiriyah,
    region: 'Riyadh Province',
    regionAr: 'منطقة الرياض',
    experienceCount: 2,
    featured: true,
    published: true,
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-03-02T12:00:00.000Z',
  },
  {
    id: 'dest-jeddah',
    name: 'Jeddah',
    nameAr: 'جدة',
    slug: 'jeddah',
    description: 'The Bride of the Red Sea, featuring UNESCO-listed Al-Balad coral stone merchant houses, vibrant souks, and coastal promenades.',
    descriptionAr: 'عروس البحر الأحمر، ببيوتها التاريخية في البلد المصنوعة من الحجر المنقبي ورواشينها الخشبية الأصيلة.',
    coverImage: IMAGES.jeddahAlBalad,
    region: 'Makkah Province',
    regionAr: 'منطقة مكة المكرمة',
    experienceCount: 1,
    featured: true,
    published: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-03T12:00:00.000Z',
  },
  {
    id: 'dest-red-sea',
    name: 'Red Sea',
    nameAr: 'البحر الأحمر',
    slug: 'red-sea',
    description: 'An untouched archipelago of 90+ islands, crystalline turquoise lagoons, world-class diving, and regenerative luxury hospitality.',
    descriptionAr: 'أرخبيل بكر يضم أكثر من 90 جزيرة، وشعاب مرجانية خلابة، وتجارب استجمام بيئية فائقة الفخامة.',
    coverImage: IMAGES.redSeaCoastal,
    region: 'Tabuk Province',
    regionAr: 'منطقة تبوك',
    experienceCount: 2,
    featured: true,
    published: true,
    createdAt: '2026-01-18T10:00:00.000Z',
    updatedAt: '2026-03-04T12:00:00.000Z',
  },
  {
    id: 'dest-diriyah',
    name: 'Diriyah',
    nameAr: 'الدرعية',
    slug: 'diriyah',
    description: 'The birthplace of the Saudi nation and UNESCO World Heritage site of At-Turaif, surrounded by lush date palms in Wadi Hanifah.',
    descriptionAr: 'مهد الدولة السعودية الأولى وموقع التراث العالمي حي الطريف، المحاط بنخيل وادي حنيفة الخضراء.',
    coverImage: IMAGES.riyadhDiriyah,
    region: 'Riyadh Province',
    regionAr: 'منطقة الرياض',
    experienceCount: 1,
    featured: true,
    published: true,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-03-05T12:00:00.000Z',
  },
];

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp-alula-desert',
    title: 'AlUla Desert Adventure & 4x4 Dune Exploration',
    titleAr: 'مغامرة صحراء العلا واستكشاف الكثبان الرباعية',
    slug: 'alula-desert-adventure',
    destinationId: 'dest-alula',
    destinationName: 'AlUla',
    category: 'Desert Adventure',
    categoryAr: 'مغامرات صحراوية',
    price: 450,
    currency: 'SAR',
    duration: '4 hours',
    durationAr: '4 ساعات',
    description: 'Embark on a heart-pounding off-road safari through the majestic red sand canyons of AlUla, guided by certified local Bedouin trackers. Conclude with traditional Saudi coffee and dates under towering sandstone rock arches.',
    descriptionAr: 'انطلق في رحلة سفاري صحراوية شيقة عبر ممرات العلا الرملية الشاهقة برفقة مرشدين محليين، واختتم الجولة بالقهوة السعودية والتمر الفاخر.',
    coverImage: IMAGES.heroAlUla,
    gallery: [IMAGES.heroAlUla, IMAGES.hegraHeritage],
    highlights: [
      'Guided 4x4 dune drive through protected AlUla canyons',
      'Panoramic sunset photo stops at Elephant Rock geological formations',
      'Traditional Saudi coffee (Gahwa) hospitality pavilion in the desert',
      'Experienced bilingual local guide and safety gear',
    ],
    highlightsAr: [
      'جولة دفع رباعي احترافية بين مضائق العلا المحمية',
      'إطلالات غروب الشمس البانورامية عند صخرة الفيل الشهيرة',
      'جلسة ضيافة قهوة سعودية وتمر في خيمة صحراوية أصيلة',
      'مرشد سياحي محلي معتمد مع كافة تجهيزات السلامة',
    ],
    inclusions: [
      'Licensed 4x4 vehicle & professional driver',
      'Desert tea, Gahwa, and medjool dates',
      'Bottled mineral water and refreshments',
      'Hotel pickup and drop-off in AlUla',
    ],
    inclusionsAr: [
      'سيارة دفع رباعي مجهزة وسائق محترف',
      'شاي صحراوي، قهوة سعودية، وتمر مجدول',
      'مياه معدنية ومشروبات منعشة',
      'خدمة التوصيل من وإلى فنادق العلا',
    ],
    exclusions: ['Personal travel insurance', 'Gratuities for guide', 'Souvenir purchases'],
    exclusionsAr: ['التأمين الشخصي', 'إكراميات المرشد', 'المشتريات الشخصية'],
    meetingPoint: 'Winter Park AlUla Visitor Hub, AlUla',
    meetingPointAr: 'مركز زوار وينتر بارك، العلا',
    featured: true,
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 38,
    maxGuests: 12,
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'exp-hegra-heritage',
    title: 'Hegra UNESCO Monumental Heritage Private Tour',
    titleAr: 'جولة الحجر الأثرية الخاصة بموقع التراث العالمي',
    slug: 'hegra-heritage-tour',
    destinationId: 'dest-alula',
    destinationName: 'AlUla',
    category: 'Cultural Experiences',
    categoryAr: 'تجارب ثقافية',
    price: 680,
    currency: 'SAR',
    duration: '5 hours',
    durationAr: '5 ساعات',
    description: 'Explore the Southern Capital of the ancient Nabataean Kingdom. Marvel at over 110 remarkably preserved monumental tombs cut into sandstone massifs, with exclusive storytelling from authorized Saudi Rawi historians.',
    descriptionAr: 'استكشف العاصمة الجنوبية لمملكة الأنباط، وشاهد أكثر من 110 مقابر صخرية بديعة منحوتة في الجبال الرملية مع رواة سعوديين معتمدين.',
    coverImage: IMAGES.hegraHeritage,
    gallery: [IMAGES.hegraHeritage, IMAGES.heroAlUla],
    highlights: [
      'Exclusive access to the Tomb of Lihyan son of Kuza (Qasr al-Farid)',
      'Jabal Ithlib sacred gathering hall and the Siq ceremonial passageway',
      'Expert commentary by certified Saudi Rawis (storytellers)',
      'Comfortable air-conditioned luxury transport throughout the site',
    ],
    highlightsAr: [
      'زيارة خاصة لقصر الفريد (مقبرة لحيان بن كوزا)',
      'استكشاف جبل إثلب والديوان والممر الصخري التاريخي',
      'سرد تاريخي موثق من رواة سعوديين معتمدين',
      'تنقل مريح بسيارات فاخرة مكيفة داخل الموقع',
    ],
    inclusions: [
      'Royal Commission for AlUla official site entry pass',
      'Private Rawi cultural expert guide',
      'Executive transportation',
      'Artisanal dates tasting and cold drinks',
    ],
    inclusionsAr: [
      'تصريح الدخول الرسمي من الهيئة الملكية لمحافظة العلا',
      'مرشد وراوي تاريخي خاص معتمد',
      'وسائل نقل فاخرة ومريحة',
      'تذوق تمور فاخرة ومشروبات باردة',
    ],
    exclusions: ['International transport', 'Meals outside specified tastings'],
    exclusionsAr: ['التذاكر الدولية', 'الوجبات الرئيسية غير المذكورة'],
    meetingPoint: 'Hegra Southern Gate Reception Pavilion',
    meetingPointAr: 'بوابة الحجر الجنوبية، العلا',
    featured: true,
    status: 'PUBLISHED',
    rating: 5.0,
    reviewsCount: 46,
    maxGuests: 8,
    createdAt: '2026-02-02T09:00:00.000Z',
    updatedAt: '2026-03-02T11:00:00.000Z',
  },
  {
    id: 'exp-riyadh-diriyah',
    title: 'Riyadh Cultural Discovery & Historic Diriyah Citadel',
    titleAr: 'اكتشاف ثقافة الرياض وحصون الدرعية التاريخية',
    slug: 'riyadh-cultural-discovery',
    destinationId: 'dest-riyadh',
    destinationName: 'Riyadh',
    category: 'Cultural Experiences',
    categoryAr: 'تجارب ثقافية',
    price: 380,
    currency: 'SAR',
    duration: '6 hours',
    durationAr: '6 ساعات',
    description: 'Immerse yourself in Saudi heritage at At-Turaif, the UNESCO-listed mudbrick birthplace of the Saudi state in Diriyah. Continue to Bujairi Terrace overlooking Wadi Hanifah for world-class gastronomy and modern Saudi culture.',
    descriptionAr: 'عش أصالة التاريخ السعودي في حي الطريف المدرج باليونسكو، وتعرف على حكاية تأسيس المملكة ثم استمتع بمطل البجيري الراقي المطل على وادي حنيفة.',
    coverImage: IMAGES.riyadhDiriyah,
    gallery: [IMAGES.riyadhDiriyah],
    highlights: [
      'Guided walk through At-Turaif UNESCO mudbrick palaces',
      'Visit to Diriyah Museum of the First Saudi State',
      'Sunset stroll along Bujairi Terrace and Wadi Hanifah gardens',
      'Traditional Najdi tea and cardamom coffee hospitality',
    ],
    highlightsAr: [
      'جولة إرشادية داخل قصور حي الطريف الطينية',
      'زيارة متحف الدرعية وتاريخ الدولة الأولى',
      'إطلالة الغروب الخلابة من مطل البجيري وحدائق وادي حنيفة',
      'ضيافة الشاي النجدي والقهوة بالهيل',
    ],
    inclusions: [
      'Diriyah gate admission & museum passes',
      'Bilingual licensed Saudi heritage guide',
      'Comfortable private vehicle with driver',
      'Traditional Saudi snacks and refreshments',
    ],
    inclusionsAr: [
      'تذاكر دخول بوابة الدرعية والمتاحف',
      'مرشد سياحي سعودي مرخص ثنائي اللغة',
      'سيارة خاصة مريحة مع سائق',
      'مقبلات وضيافة نجدية تقليدية ومشروبات',
    ],
    exclusions: ['Dinner at Bujairi Terrace luxury restaurants', 'Personal tips'],
    exclusionsAr: ['وجبة العشاء في مطاعم مطل البجيري', 'الإكراميات الشخصية'],
    meetingPoint: 'Bujairi Terrace Visitor Gate, Diriyah',
    meetingPointAr: 'بوابة زوار مطل البجيري، الدرعية',
    featured: true,
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 29,
    maxGuests: 15,
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-03-03T14:00:00.000Z',
  },
  {
    id: 'exp-jeddah-old-town',
    title: 'Jeddah Old Town Al-Balad Heritage Walk & Souk Tour',
    titleAr: 'جولة البلد التاريخية بجدة وسوق العلوي القديم',
    slug: 'jeddah-old-town-walk',
    destinationId: 'dest-jeddah',
    destinationName: 'Jeddah',
    category: 'City Tours',
    categoryAr: 'جولات المدن',
    price: 290,
    currency: 'SAR',
    duration: '3.5 hours',
    durationAr: '3.5 ساعات',
    description: 'Walk through narrow stone alleyways lined with 500-year-old coral architecture and delicate wooden Roshan windows. Visit historic merchant mansions like Bait Nassif and sample authentic Hejazi street delicacies.',
    descriptionAr: 'تجول في أزقة جدة التاريخية المرصوفة بحجر البحر واستمتع برواشينها الخشبية العريقة، وزر بيت نصيف وتذوق أشهر مأكولات الحجاز التراثية.',
    coverImage: IMAGES.jeddahAlBalad,
    gallery: [IMAGES.jeddahAlBalad],
    highlights: [
      'Visit historic Bait Nassif and Bait Sallum heritage homes',
      'Discover traditional spices, oud, and textiles in Souk Al-Alawi',
      'Sample warm Mutabbaq, Hejazi Ful, and freshly baked tamees',
      'Sunset photography at historic Bab Makkah',
    ],
    highlightsAr: [
      'زيارة بيت نصيف التاريخي وبيت سلوم التراثي',
      'استكشاف البهارات والعطور والمنسوجات في سوق العلوي القديم',
      'تذوق المطبق الحجازي والفول والتميس الساخن',
      'جلسة تصوير عند باب مكة التاريخي أثناء الغروب',
    ],
    inclusions: [
      'Heritage house admissions',
      'Licensed local Jeddah cultural guide',
      'Hejazi food tastings and mint tea',
    ],
    inclusionsAr: [
      'تذاكر دخول البيوت والمتاحف التراثية',
      'مرشد سياحي حجازي مرخص',
      'تذوق أكلات شعبية حجازية وشاي بالنعناع',
    ],
    exclusions: ['Hotel transfer', 'Personal shopping'],
    exclusionsAr: ['المواصلات من الفندق', 'المشتريات الشخصية'],
    meetingPoint: 'Bab Jadid Entrance, Al-Balad, Jeddah',
    meetingPointAr: 'بوابة باب جديد، جدة التاريخية',
    featured: false,
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 31,
    maxGuests: 10,
    createdAt: '2026-02-08T11:00:00.000Z',
    updatedAt: '2026-03-04T15:00:00.000Z',
  },
  {
    id: 'exp-red-sea-coastal',
    title: 'Red Sea Coastal Escape & Coral Reef Snorkeling',
    titleAr: 'رحلة البحر الأحمر الساحلية والغوص في الشعاب المرجانية',
    slug: 'red-sea-coastal-escape',
    destinationId: 'dest-red-sea',
    destinationName: 'Red Sea',
    category: 'Nature & Outdoor',
    categoryAr: 'طبيعة ومغامرات خارجية',
    price: 850,
    currency: 'SAR',
    duration: 'Full Day (7 hrs)',
    durationAr: 'يوم كامل (7 ساعات)',
    description: 'Sail aboard a private eco-catamaran to untouched coral atolls. Encounter vibrant marine life, sea turtles, and dolphins in the pristine waters of the Saudi Red Sea, accompanied by marine biologists and private chefs.',
    descriptionAr: 'أبحر على متن يخت كاتاماران بيئي خاص نحو جزر مرجانية عذراء، وشاهد الدلافين والسلاحف البحرية برفقة خبراء بيئة بحرية وطهاة محليين.',
    coverImage: IMAGES.redSeaCoastal,
    gallery: [IMAGES.redSeaCoastal],
    highlights: [
      'Private catamaran cruise through virgin island lagoons',
      'Two guided snorkeling sessions at protected marine reefs',
      'Gourmet Red Sea fresh seafood lunch prepared onboard',
      'Professional underwater GoPro photography package included',
    ],
    highlightsAr: [
      'إبحار بيئي خاص بين بحيرات الجزر الفيروزية',
      'جلستا غوص سطحي برفقة مرشد بحري متخصص',
      'وجبة غداء بحرية فاخرة طازجة على متن اليخت',
      'باقة تصوير فوتوغرافي مجانية تحت الماء',
    ],
    inclusions: [
      'Full day boat charter & captain',
      'Snorkeling gear, fins, and safety vests',
      'Gourmet lunch, fresh fruit, juices, and espresso',
      'Marine conservation permit fees',
    ],
    inclusionsAr: [
      'استئجار القارب مع القبطان وطاقم الخدمة',
      'معدات الغوص السطحي وسترات النجاة',
      'غداء فاخر وفواكه وعصائر طازجة وقهوة مختصة',
      'رسوم المحميات البحرية وتصاريح الإبحار',
    ],
    exclusions: ['Scuba tank equipment (available as add-on)'],
    exclusionsAr: ['معدات الغوص بالأسطوانات (متاحة كخيار إضافي)'],
    meetingPoint: 'Red Sea Marina Hub, Turtle Bay',
    meetingPointAr: 'مرسى البحر الأحمر، خليج السلاحف',
    featured: true,
    status: 'PUBLISHED',
    rating: 5.0,
    reviewsCount: 22,
    maxGuests: 6,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-05T16:00:00.000Z',
  },
  {
    id: 'exp-saudi-culinary',
    title: 'Authentic Saudi Culinary Masterclass & Majlis Feast',
    titleAr: 'ماستر كلاس الطهي السعودي الأصيل ووليمة المجلس',
    slug: 'saudi-culinary-experience',
    destinationId: 'dest-riyadh',
    destinationName: 'Riyadh',
    category: 'Cultural Experiences',
    categoryAr: 'تجارب ثقافية',
    price: 320,
    currency: 'SAR',
    duration: '3 hours',
    durationAr: '3 ساعات',
    description: 'Learn the secrets of Saudi regional gastronomy inside a traditional Najdi heritage home. Prepare authentic Kabsa, Jareesh, and Maamoul sweets alongside celebrated local culinary artisans.',
    descriptionAr: 'اكتشف أسرار المطبخ السعودي العريق في بيت تراثي نجدي، وتعلم طهي الكبسة والجريش وتحضير المعمول الفاخر برفقة طهاة سعوديين.',
    coverImage: IMAGES.riyadhDiriyah,
    gallery: [IMAGES.riyadhDiriyah],
    highlights: [
      'Hands-on cooking station with premium Saudi ingredients',
      'Mastering traditional spice blending (Bahar Najdi)',
      'Shared family feast in a restored traditional courtyard Majlis',
      'Recipe booklet and artisan spice souvenir jar to take home',
    ],
    highlightsAr: [
      'محطة طهي عملية بأجود المكونات والتمور والتوابل',
      'تعلم أسرار خلطات البهار النجدي الأصلية',
      'وليمة مشتركة في مجلس تراثي فسيح ودافئ',
      'كتيب وصفات وهدية تذكارية من التوابل السعودية الفاخرة',
    ],
    inclusions: [
      'All ingredients, cooking utensils, and chef apron',
      'Full multi-course feast with mocktails and desserts',
      'Traditional tea and Arabic coffee ceremony',
    ],
    inclusionsAr: [
      'كافة مكونات الطهي والمعدات ومئزر الشيف',
      'وليمة عشاء كاملة مع المشروبات والحلويات',
      'مراسم تقديم القهوة السعودية والشاي التراثي',
    ],
    exclusions: ['Hotel transportation'],
    exclusionsAr: ['المواصلات'],
    meetingPoint: 'Heritage Culinary Pavilion, Al-Bujairi, Riyadh',
    meetingPointAr: 'جناح فنون الطهي التراثي، البجيري، الرياض',
    featured: false,
    status: 'PUBLISHED',
    rating: 4.8,
    reviewsCount: 19,
    maxGuests: 10,
    createdAt: '2026-02-12T13:00:00.000Z',
    updatedAt: '2026-03-05T17:00:00.000Z',
  },
  {
    id: 'exp-alula-stargazing',
    title: 'Al-Gharameel Dark Sky Stargazing & Astrophotography',
    titleAr: 'تأمل النجوم في سماء الغراميل والتصوير الفلكي',
    slug: 'alula-stargazing-expedition',
    destinationId: 'dest-alula',
    destinationName: 'AlUla',
    category: 'Desert Adventure',
    categoryAr: 'مغامرات صحراوية',
    price: 520,
    currency: 'SAR',
    duration: '4.5 hours',
    durationAr: '4.5 ساعات',
    description: 'Travel into the deep desert of Al-Gharameel, where dramatic stone pillars silhouette against the Milky Way. An astronomer guides you through constellations using high-powered computerized telescopes.',
    descriptionAr: 'سافر إلى أعماق صحراء الغراميل حيث تنتصب الأعمدة الحجرية المهيبة تحت مجرة درب التبانة، بمرافقة فلكي وتلسكوبات رقمية متطورة.',
    coverImage: IMAGES.heroAlUla,
    gallery: [IMAGES.heroAlUla],
    highlights: [
      'Certified International Dark-Sky Reserve quality night skies',
      'Deep-sky telescope observation of Saturn rings and distant nebulae',
      'Campfire storytelling, warm spiced tea, and traditional acoustic oud',
      'Astrophotography tips and long-exposure portraits under the stars',
    ],
    highlightsAr: [
      'تجربة سماء نقية معتمدة دولياً لمشاهدة النجوم دون تلوث ضوئي',
      'رصد فلكي متقدم لكواكب المجموعة الشمسية والسدم الفلكية',
      'جلسة سمر حول النار مع العود والمشروبات الدافئة',
      'التقاط صور تذكارية احترافية للضيوف تحت مجرة النجوم',
    ],
    inclusions: [
      'Desert 4WD transfer to Al-Gharameel sanctuary',
      'Professional astronomer and optical telescopes',
      'Warm blankets, plush carpet seating, campfire, and hot drinks',
    ],
    inclusionsAr: [
      'النقل بسيارات دفع رباعي لمحمية الغراميل',
      'عالم فلك متخصص وتلسكوبات رصد متقدمة',
      'جلسات سجاد مريحة وبطانيات ومشروبات ساخنة',
    ],
    exclusions: ['Warm winter outerwear (guests advised to dress warmly)'],
    exclusionsAr: ['الملابس الشتوية الدافئة (يُنصح بارتداء معاطف)'],
    meetingPoint: 'Winter Park Stargazing Departure Station, AlUla',
    meetingPointAr: 'محطة انطلاق رحلات النجوم، وينتر بارك، العلا',
    featured: false,
    status: 'PUBLISHED',
    rating: 4.9,
    reviewsCount: 35,
    maxGuests: 14,
    createdAt: '2026-02-14T14:00:00.000Z',
    updatedAt: '2026-03-06T18:00:00.000Z',
  },
  {
    id: 'exp-family-nature-draft',
    title: 'Family Nature & Red Sea Island Mangrove Kayaking',
    titleAr: 'مغامرة عائلية وتجديف الكاياك بين أشجار المانجروف',
    slug: 'family-nature-kayak',
    destinationId: 'dest-red-sea',
    destinationName: 'Red Sea',
    category: 'Family Activities',
    categoryAr: 'أنشطة عائلية',
    price: 600,
    currency: 'SAR',
    duration: '5 hours',
    durationAr: '5 ساعات',
    description: 'A gentle, kid-friendly eco-adventure exploring the vital mangrove ecosystems of the Red Sea. Children learn about marine conservation while spotting flamingos and juvenile sea turtles.',
    descriptionAr: 'مغامرة بيئية لطيفة مناسبة للأطفال والعائلات لاستكشاف غابات المانجروف بالبحر الأحمر ومشاهدة طيور النحام والسلاحف الصغيرة.',
    coverImage: IMAGES.redSeaCoastal,
    gallery: [IMAGES.redSeaCoastal],
    highlights: [
      'Stable tandem sea kayaks suitable for children and beginners',
      'Interactive marine biology treasure hunt led by naturalists',
      'Mangrove seedling planting activity contributing to the Saudi Green Initiative',
      'Picnic on a secluded white sand sandbar',
    ],
    highlightsAr: [
      'قوارب كاياك مزدوجة آمنة ومريحة للأطفال والمبتدئين',
      'لعبة البحث عن الكنز البيئي بإشراف مرشدين متخصصين',
      'المشاركة في زراعة شتلات المانجروف دعماً لمبادرة السعودية الخضراء',
      'نزهة غداء على شاطئ رملي أبيض هادئ',
    ],
    inclusions: ['Kayaks, paddles, life vests', 'Certified family guides', 'Eco-picnic snacks'],
    inclusionsAr: ['قوارب الكاياك والمجاذيف وسترات النجاة', 'مرشدين أسريين معتمدين', 'وجبات خفيفة صحية'],
    exclusions: ['Swimwear'],
    exclusionsAr: ['ملابس السباحة'],
    meetingPoint: 'Mangrove Eco-Center Pier, Red Sea',
    meetingPointAr: 'رصيف مركز المانجروف البيئي، البحر الأحمر',
    featured: false,
    status: 'DRAFT', // Explicitly DRAFT to test that draft experiences do not appear in visitor panel!
    rating: 0,
    reviewsCount: 0,
    maxGuests: 16,
    createdAt: '2026-02-20T15:00:00.000Z',
    updatedAt: '2026-03-07T19:00:00.000Z',
  },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Winter at Tantora Season Special',
    titleAr: 'موسم شتاء طنطورة بالعلا',
    description: 'Enjoy 15% promotional credit on multi-day cultural tours across AlUla and Hegra heritage sites through April 2026.',
    descriptionAr: 'احصل على خصم 15% على الجولات الثقافية متعددة الأيام في العلا ومواقع الحجر حتى أبريل 2026.',
    bannerImage: IMAGES.heroAlUla,
    destinationId: 'dest-alula',
    linkedExperienceId: 'exp-hegra-heritage',
    ctaText: 'Explore Winter Offers',
    ctaTextAr: 'استكشف عروض الشتاء',
    ctaLink: '/experience/hegra-heritage-tour',
    active: true,
    badge: 'Limited Season Offer',
    badgeAr: 'عرض الموسم المحدود',
    createdAt: '2026-01-25T10:00:00.000Z',
  },
  {
    id: 'promo-2',
    title: 'Discover Diriyah & At-Turaif Heritage Experience',
    titleAr: 'اكتشف عبق الدرعية التاريخية وحي الطريف',
    description: 'Immerse your family in authentic Najdi traditions with guaranteed priority passes to Bujairi Terrace and At-Turaif.',
    descriptionAr: 'عش أروع التقاليد النجدية مع تصاريح دخول مؤكدة إلى مطل البجيري وحي الطريف.',
    bannerImage: IMAGES.riyadhDiriyah,
    destinationId: 'dest-diriyah',
    linkedExperienceId: 'exp-riyadh-diriyah',
    ctaText: 'Book Diriyah Tour',
    ctaTextAr: 'احجز جولة الدرعية',
    ctaLink: '/experience/riyadh-cultural-discovery',
    active: true,
    badge: 'Cultural Highlight',
    badgeAr: 'أبرز الجولات الثقافية',
    createdAt: '2026-02-01T12:00:00.000Z',
  },
  {
    id: 'promo-3',
    title: 'Red Sea Virgin Reef Eco-Expedition',
    titleAr: 'رحلات البحر الأحمر البيئية بين الشعاب البكر',
    description: 'Reserve private catamaran voyages for up to 6 guests with onboard chef and marine biologist guide.',
    descriptionAr: 'احجز رحلة يخت خاصة تتسع لـ 6 ضيوف مع طاهٍ خاص ومرشد بحري متخصص.',
    bannerImage: IMAGES.redSeaCoastal,
    destinationId: 'dest-red-sea',
    linkedExperienceId: 'exp-red-sea-coastal',
    ctaText: 'View Red Sea Voyage',
    ctaTextAr: 'شاهد رحلة البحر الأحمر',
    ctaLink: '/experience/red-sea-coastal-escape',
    active: true,
    badge: 'Luxury Escape',
    badgeAr: 'ملاذ فاخر',
    createdAt: '2026-02-15T14:00:00.000Z',
  },
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-2026-801',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@travelworld.co.uk',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    experienceId: 'exp-alula-desert',
    experienceTitle: 'AlUla Desert Adventure & 4x4 Dune Exploration',
    preferredDate: '2026-11-20',
    guests: 2,
    message: 'We are celebrating our 10th anniversary in Saudi Arabia. Looking for a luxury sunset setup with private guide.',
    status: 'NEW',
    internalNotes: ['Assigned to Senior Guide Faisal. Check anniversary welcome amenities.'],
    estimatedValue: 900,
    createdAt: '2026-11-10T14:22:00.000Z',
    updatedAt: '2026-11-10T14:22:00.000Z',
  },
  {
    id: 'INQ-2026-802',
    customerName: 'Tariq Al-Ghamdi',
    email: 'tariq.ghamdi@energy-sa.com',
    phone: '+966 50 123 4567',
    country: 'Saudi Arabia',
    experienceId: 'exp-hegra-heritage',
    experienceTitle: 'Hegra UNESCO Monumental Heritage Private Tour',
    preferredDate: '2026-11-25',
    guests: 4,
    message: 'Family group visiting AlUla for the weekend. Need bilingual Rawi guide for history buffs.',
    status: 'CONTACTED',
    internalNotes: ['Spoke on WhatsApp. Confirmed interest in private luxury SUV.'],
    estimatedValue: 2720,
    createdAt: '2026-11-09T09:15:00.000Z',
    updatedAt: '2026-11-10T11:00:00.000Z',
  },
  {
    id: 'INQ-2026-803',
    customerName: 'Marie Dupont',
    email: 'marie.dupont@voyages-paris.fr',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    experienceId: 'exp-red-sea-coastal',
    experienceTitle: 'Red Sea Coastal Escape & Coral Reef Snorkeling',
    preferredDate: '2026-12-04',
    guests: 2,
    message: 'Interested in pristine diving spots. Does the catamaran offer vegetarian lunch options?',
    status: 'PENDING',
    internalNotes: ['Chef confirmed customized French-Hejazi vegetarian menu.'],
    estimatedValue: 1700,
    createdAt: '2026-11-08T16:40:00.000Z',
    updatedAt: '2026-11-09T10:30:00.000Z',
  },
  {
    id: 'INQ-2026-804',
    customerName: 'Khalid Mansoor',
    email: 'khalid.m@dubaiholding.ae',
    phone: '+971 50 987 6543',
    country: 'United Arab Emirates',
    experienceId: 'exp-riyadh-diriyah',
    experienceTitle: 'Riyadh Cultural Discovery & Historic Diriyah Citadel',
    preferredDate: '2026-11-18',
    guests: 6,
    message: 'Executive delegation looking for a bespoke culture and gastronomy afternoon in Diriyah.',
    status: 'CONFIRMED',
    internalNotes: ['Confirmed corporate package. VIP reservation at Bujairi Terrace secured.'],
    estimatedValue: 2280,
    createdAt: '2026-11-07T11:05:00.000Z',
    updatedAt: '2026-11-09T14:15:00.000Z',
  },
  {
    id: 'INQ-2026-805',
    customerName: 'Elena Rostova',
    email: 'elena.rostova@berlin-travel.de',
    phone: '+49 170 1234567',
    country: 'Germany',
    experienceId: 'exp-jeddah-old-town',
    experienceTitle: 'Jeddah Old Town Al-Balad Heritage Walk & Souk Tour',
    preferredDate: '2026-11-02',
    guests: 3,
    message: 'Passionate about traditional Islamic architecture and woodwork. Looking for historical immersion.',
    status: 'COMPLETED',
    internalNotes: ['Tour successfully executed. Client rated experience 5/5 stars.'],
    estimatedValue: 870,
    createdAt: '2026-10-28T08:30:00.000Z',
    updatedAt: '2026-11-03T18:00:00.000Z',
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@travelworld.co.uk',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    totalInquiries: 1,
    confirmedBookings: 0,
    lastInteraction: '2026-11-10T14:22:00.000Z',
    notes: 'High interest in luxury desert accommodations and cultural excursions.',
    createdAt: '2026-11-10T14:22:00.000Z',
  },
  {
    id: 'cust-2',
    name: 'Tariq Al-Ghamdi',
    email: 'tariq.ghamdi@energy-sa.com',
    phone: '+966 50 123 4567',
    country: 'Saudi Arabia',
    totalInquiries: 2,
    confirmedBookings: 1,
    lastInteraction: '2026-11-10T11:00:00.000Z',
    notes: 'Domestic VIP client. Frequently books weekend tours for extended family in AlUla and Taif.',
    createdAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'cust-3',
    name: 'Khalid Mansoor',
    email: 'khalid.m@dubaiholding.ae',
    phone: '+971 50 987 6543',
    country: 'United Arab Emirates',
    totalInquiries: 3,
    confirmedBookings: 2,
    lastInteraction: '2026-11-09T14:15:00.000Z',
    notes: 'GCC corporate delegation organizer. Requires premium executive vehicles and English-speaking guides.',
    createdAt: '2026-08-04T12:00:00.000Z',
  },
];

const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    question: 'Which ancient civilization carved the monumental sandstone tombs of Hegra in AlUla?',
    questionAr: 'أي حضارة قديمة نحتت المقابر الصخرية الشاهقة في الحجر بالعلا؟',
    options: ['The Nabataeans', 'The Phoenicians', 'The Romans', 'The Ottomans'],
    optionsAr: ['الأنباط', 'الفينيقيون', 'الرومان', 'العثمانيون'],
    correctIndex: 0,
    explanation: 'Hegra was the southern capital of the Nabataean Kingdom, celebrated for over 110 monumental tombs carved with intricate classical facades.',
    explanationAr: 'كانت الحجر العاصمة الجنوبية لمملكة الأنباط، وتشتهر بأكثر من 110 مقابر صخرية منحوتة بواجهات معمارية فريدة.',
    category: 'Heritage & History',
    active: true,
  },
  {
    id: 'quiz-2',
    question: 'What is the historic mudbrick district in Diriyah recognized as a UNESCO World Heritage site?',
    questionAr: 'ما هو الحي الطيني التاريخي في الدرعية المسجل كموقع تراث عالمي لدى اليونسكو؟',
    options: ['At-Turaif', 'Al-Balad', 'Masmak', 'Al-Ula Old Town'],
    optionsAr: ['حي الطريف', 'البلد', 'المصمك', 'بلدة العلا القديمة'],
    correctIndex: 0,
    explanation: 'At-Turaif in Diriyah was the original capital of the First Saudi State, renowned for its distinctive Najdi mudbrick palace architecture.',
    explanationAr: 'حي الطريف بالدرعية هو مهد الدولة السعودية الأولى، ويتميز بفنون العمارة النجدية الطينية الفريدة.',
    category: 'Culture',
    active: true,
  },
  {
    id: 'quiz-3',
    question: 'What distinctive architectural feature characterizes the traditional merchant homes of Jeddah Al-Balad?',
    questionAr: 'ما هي الميزة المعمارية البارزة التي تشتهر بها بيوت جدة التاريخية في البلد؟',
    options: ['Ornate wooden Rawashin balconies', 'Gothic stained arches', 'Marble columns', 'Clay domes'],
    optionsAr: ['الرواشين الخشبية المزخرفة', 'الأقواس القوطية', 'الأعمدة الرخامية', 'القباب الطينية'],
    correctIndex: 0,
    explanation: 'Rawashin are intricately carved wooden latticework windows designed to catch coastal Red Sea breezes while preserving privacy.',
    explanationAr: 'الرواشين هي مشربيات خشبية مزخرفة مصممة بذكاء لتمرير نسيم البحر الأحمر وتوفير الخصوصية لسكان البيت.',
    category: 'Architecture',
    active: true,
  },
  {
    id: 'quiz-4',
    question: 'What traditional Saudi beverage is served as an essential gesture of hospitality (Diafah)?',
    questionAr: 'ما هو المشروب السعودي التقليدي الذي يُقدّم كرمز أساسي لحسن الضيافة والكرم؟',
    options: ['Gahwa (Cardamom & saffron coffee)', 'Mint lemonade', 'Sahlab', 'Karkadeh'],
    optionsAr: ['القهوة السعودية بالهيل والزعفران', 'عصير الليمون بالنعناع', 'السحلب', 'الكركديه'],
    correctIndex: 0,
    explanation: 'Saudi Coffee (Gahwa) is an inscribed element of intangible cultural heritage, brewed with lightly roasted beans, cardamom, and saffron.',
    explanationAr: 'القهوة السعودية رمز الكرم والضيافة ومسجلة في قائمة التراث الثقافي غير المادي باليونسكو.',
    category: 'Traditions',
    active: true,
  },
  {
    id: 'quiz-5',
    question: 'How many islands make up the pristine archipelago of the Saudi Red Sea destination project?',
    questionAr: 'كم عدد الجزر التي يضمها أرخبيل وجهة البحر الأحمر البكر في السعودية؟',
    options: ['Over 90 virgin islands', 'Around 12 islands', 'Exactly 5 islands', 'Over 500 islands'],
    optionsAr: ['أكثر من 90 جزيرة بكر', 'حوالي 12 جزيرة', '5 جزر فقط', 'أكثر من 500 جزيرة'],
    correctIndex: 0,
    explanation: 'The Saudi Red Sea destination spans over 90 untouched islands with 200 km of coastline, protected coral atolls, and dormant volcanoes.',
    explanationAr: 'تمتد وجهة البحر الأحمر عبر أكثر من 90 جزيرة طبيعية بكر مع 200 كيلومتر من السواحل والشعاب المرجانية المحمية.',
    category: 'Nature & Islands',
    active: true,
  },
];

const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  heroHeadline: 'Discover Saudi Arabia Beyond the Ordinary',
  heroHeadlineAr: 'اكتشف المملكة العربية السعودية كما لم ترها من قبل',
  heroDescription: 'Explore extraordinary destinations, authentic local experiences, and unforgettable adventures across Saudi Arabia.',
  heroDescriptionAr: 'استكشف وجهات استثنائية، وتجارب محلية أصيلة، ومغامرات لا تُنسى في مختلف أنحاء المملكة العربية السعودية.',
  heroImage: IMAGES.heroAlUla,
  aboutHeadline: 'Empowering Local Tourism SMEs in Saudi Arabia',
  aboutHeadlineAr: 'تمكين المنشآت السياحية السعودية وتحويل التجارب المحلية لنمو رقمي',
  aboutText: 'TourFlow is Saudi Arabia’s premier B2B tourism digital growth platform. We bridge boutique Saudi tour operators, Bedouin guides, cultural storytellers, and adventure curators with discerning travelers from across the Kingdom and the world.',
  aboutTextAr: 'تورفلو هي المنصة الرقمية الرائدة لنمو قطاع السياحة بالمملكة. نربط مشغلي الجولات المحليين والمرشدين والرواة بالمسافرين الباحثين عن تجارب سعودية أصيلة وثرية.',
  stats: {
    operators: 140,
    experiences: 85,
    travelersServed: 4200,
    satisfactionRate: 99,
  },
  contactEmail: 'concierge@tourflow.sa',
  contactPhone: '+966 11 456 7890',
  whatsappNumber: '+966 50 888 7766',
  officeAddress: 'King Fahd Road, Al-Olaya District, Riyadh 12214, Saudi Arabia',
  officeAddressAr: 'طريق الملك فهد، حي العليا، الرياض 12214، المملكة العربية السعودية',
  socialLinks: {
    twitter: 'https://twitter.com/tourflow_sa',
    instagram: 'https://instagram.com/tourflow.sa',
    linkedin: 'https://linkedin.com/company/tourflow-sa',
  },
};

const INITIAL_SETTINGS: BusinessSettings = {
  businessName: 'TourFlow Digital Tourism Platform',
  businessEmail: 'contact@tourflow.sa',
  businessPhone: '+966 11 456 7890',
  whatsappNumber: '+966 50 888 7766',
  businessAddress: 'King Fahd Road, Al-Olaya, Riyadh 12214, Saudi Arabia',
  currency: 'SAR',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
  socialLinks: {
    twitter: 'https://twitter.com/tourflow_sa',
    instagram: 'https://instagram.com/tourflow.sa',
    linkedin: 'https://linkedin.com/company/tourflow-sa',
  },
  enableEmailNotifications: true,
  enableWhatsAppNotifications: true,
};

// Storage keys
const STORAGE_KEYS = {
  EXPERIENCES: 'tourflow_experiences_v1',
  DESTINATIONS: 'tourflow_destinations_v1',
  INQUIRIES: 'tourflow_inquiries_v1',
  CUSTOMERS: 'tourflow_customers_v1',
  PROMOTIONS: 'tourflow_promotions_v1',
  QUIZZES: 'tourflow_quizzes_v1',
  WEBSITE_CONTENT: 'tourflow_website_content_v1',
  SETTINGS: 'tourflow_settings_v1',
  ACTIVITY_LOGS: 'tourflow_activity_logs_v1',
  ANALYTICS: 'tourflow_analytics_v1',
};

// Broadcast channel for instantaneous cross-tab synchronization
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('tourflow_realtime_sync');
  }
} catch {
  syncChannel = null;
}

// In-memory reactive subscriber registry
type Listener<T> = (data: T) => void;
const listeners: Record<string, Set<Listener<any>>> = {};

function notifyListeners(collection: string, data: any) {
  if (listeners[collection]) {
    listeners[collection].forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }
  if (syncChannel) {
    try {
      syncChannel.postMessage({ collection, timestamp: Date.now() });
    } catch (e) {
      console.warn('Sync postMessage warning:', e);
    }
  }
}

// Hook up listener for broadcast channel messages
if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { collection } = event.data || {};
    if (collection && listeners[collection]) {
      const freshData = loadCollection(collection);
      listeners[collection].forEach((listener) => listener(freshData));
    }
  };
}

// Storage helpers
function loadCollection<T>(key: string): T {
  if (typeof window === 'undefined') return [] as unknown as T;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [] as unknown as T;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse from localStorage', key, e);
    return [] as unknown as T;
  }
}

function saveCollection<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', key, e);
  }
}

// Initialise storage if first run
export function initializeRepository() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
    saveCollection(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCES)) {
    saveCollection(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROMOTIONS)) {
    saveCollection(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
    saveCollection(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    saveCollection(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    saveCollection(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEBSITE_CONTENT)) {
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveCollection(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    saveCollection(STORAGE_KEYS.ACTIVITY_LOGS, [
      {
        id: 'log-1',
        action: 'System Initialized',
        details: 'TourFlow platform seeded with authentic Saudi tourism packages and AlUla assets',
        adminUser: 'System',
        timestamp: new Date().toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    saveCollection(STORAGE_KEYS.ANALYTICS, [
      { id: 'ev-1', type: 'page_view', path: '/', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'ev-2', type: 'experience_view', path: '/experience/alula-desert-adventure', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 'ev-3', type: 'inquiry_submit', metadata: { exp: 'exp-alula-desert' }, timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
    ]);
  }
}

// Reactive Subscription helper (behaves exactly like onSnapshot)
export function subscribeTo<T>(collectionKey: string, callback: (data: T) => void): () => void {
  if (!listeners[collectionKey]) {
    listeners[collectionKey] = new Set();
  }
  listeners[collectionKey].add(callback);

  // Send current data immediately
  const current = loadCollection<T>(collectionKey);
  callback(current);

  return () => {
    listeners[collectionKey].delete(callback);
  };
}

// Data Service API
export const DataService = {
  // Experiences
  getExperiences(): Experience[] {
    return loadCollection<Experience[]>(STORAGE_KEYS.EXPERIENCES) || INITIAL_EXPERIENCES;
  },

  getPublishedExperiences(): Experience[] {
    return this.getExperiences().filter((exp) => exp.status === 'PUBLISHED');
  },

  getExperienceBySlug(slug: string): Experience | undefined {
    return this.getExperiences().find((exp) => exp.slug === slug || exp.id === slug);
  },

  subscribeExperiences(callback: (experiences: Experience[]) => void): () => void {
    return subscribeTo<Experience[]>(STORAGE_KEYS.EXPERIENCES, callback);
  },

  createExperience(exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Experience {
    const list = this.getExperiences();
    const id = `exp-${Date.now()}`;
    const newExp: Experience = {
      ...exp,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newExp);
    saveCollection(STORAGE_KEYS.EXPERIENCES, list);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, list);
    this.logActivity('Experience Created', `Created experience "${newExp.title}" (Status: ${newExp.status})`);
    return newExp;
  },

  updateExperience(id: string, updates: Partial<Experience>): Experience | null {
    const list = this.getExperiences();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const updated: Experience = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.EXPERIENCES, list);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, list);
    this.logActivity('Experience Updated', `Updated "${updated.title}" (Status: ${updated.status})`);
    return updated;
  },

  deleteExperience(id: string): boolean {
    const list = this.getExperiences();
    const target = list.find((e) => e.id === id);
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length !== list.length) {
      saveCollection(STORAGE_KEYS.EXPERIENCES, filtered);
      notifyListeners(STORAGE_KEYS.EXPERIENCES, filtered);
      this.logActivity('Experience Deleted', `Removed experience "${target?.title || id}"`);
      return true;
    }
    return false;
  },

  duplicateExperience(id: string): Experience | null {
    const list = this.getExperiences();
    const original = list.find((e) => e.id === id);
    if (!original) return null;
    const duplicated: Experience = {
      ...original,
      id: `exp-${Date.now()}`,
      title: `${original.title} (Copy)`,
      titleAr: `${original.titleAr} (نسخة)`,
      slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(duplicated);
    saveCollection(STORAGE_KEYS.EXPERIENCES, list);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, list);
    this.logActivity('Experience Duplicated', `Duplicated "${original.title}" as DRAFT`);
    return duplicated;
  },

  // Destinations
  getDestinations(): Destination[] {
    return loadCollection<Destination[]>(STORAGE_KEYS.DESTINATIONS) || INITIAL_DESTINATIONS;
  },

  getPublishedDestinations(): Destination[] {
    return this.getDestinations().filter((d) => d.published);
  },

  subscribeDestinations(callback: (destinations: Destination[]) => void): () => void {
    return subscribeTo<Destination[]>(STORAGE_KEYS.DESTINATIONS, callback);
  },

  createDestination(dest: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Destination {
    const list = this.getDestinations();
    const id = `dest-${Date.now()}`;
    const newDest: Destination = {
      ...dest,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.push(newDest);
    saveCollection(STORAGE_KEYS.DESTINATIONS, list);
    notifyListeners(STORAGE_KEYS.DESTINATIONS, list);
    this.logActivity('Destination Created', `Created destination "${newDest.name}"`);
    return newDest;
  },

  updateDestination(id: string, updates: Partial<Destination>): Destination | null {
    const list = this.getDestinations();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;
    const updated: Destination = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.DESTINATIONS, list);
    notifyListeners(STORAGE_KEYS.DESTINATIONS, list);
    this.logActivity('Destination Updated', `Updated destination "${updated.name}"`);
    return updated;
  },

  // Inquiries
  getInquiries(): Inquiry[] {
    return loadCollection<Inquiry[]>(STORAGE_KEYS.INQUIRIES) || INITIAL_INQUIRIES;
  },

  subscribeInquiries(callback: (inquiries: Inquiry[]) => void): () => void {
    return subscribeTo<Inquiry[]>(STORAGE_KEYS.INQUIRIES, callback);
  },

  createInquiry(data: {
    customerName: string;
    email: string;
    phone: string;
    country: string;
    experienceId: string;
    experienceTitle: string;
    preferredDate: string;
    guests: number;
    message: string;
    estimatedValue?: number;
  }): Inquiry {
    const list = this.getInquiries();
    const id = `INQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInquiry: Inquiry = {
      ...data,
      id,
      status: 'NEW',
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newInquiry);
    saveCollection(STORAGE_KEYS.INQUIRIES, list);
    notifyListeners(STORAGE_KEYS.INQUIRIES, list);

    // Sync CRM Customer record automatically
    this.syncCustomerFromInquiry(newInquiry);

    // Record analytics event
    this.recordEvent('inquiry_submit', `/experience/${data.experienceId}`, {
      inquiryId: id,
      experienceId: data.experienceId,
      guests: data.guests,
    });

    this.logActivity('New Inquiry Received', `Inquiry ${id} from ${data.customerName} for ${data.experienceTitle}`);
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: InquiryStatus, internalNote?: string): Inquiry | null {
    const list = this.getInquiries();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const notes = list[index].internalNotes ? [...list[index].internalNotes!] : [];
    if (internalNote) {
      notes.push(`[${new Date().toLocaleDateString()}] ${internalNote}`);
    }

    const updated: Inquiry = {
      ...list[index],
      status,
      internalNotes: notes,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.INQUIRIES, list);
    notifyListeners(STORAGE_KEYS.INQUIRIES, list);

    // If confirmed, update customer record
    if (status === 'CONFIRMED') {
      this.incrementCustomerBookings(updated.email);
      this.recordEvent('booking_confirm', undefined, { inquiryId: id, value: updated.estimatedValue });
    }

    this.logActivity('Inquiry Status Changed', `Inquiry ${id} status updated to ${status}`);
    return updated;
  },

  addInquiryNote(id: string, note: string): Inquiry | null {
    const list = this.getInquiries();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const notes = list[index].internalNotes ? [...list[index].internalNotes!] : [];
    notes.push(`[${new Date().toLocaleString()}] ${note}`);

    const updated: Inquiry = {
      ...list[index],
      internalNotes: notes,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.INQUIRIES, list);
    notifyListeners(STORAGE_KEYS.INQUIRIES, list);
    return updated;
  },

  // Customers CRM
  getCustomers(): Customer[] {
    return loadCollection<Customer[]>(STORAGE_KEYS.CUSTOMERS) || INITIAL_CUSTOMERS;
  },

  subscribeCustomers(callback: (customers: Customer[]) => void): () => void {
    return subscribeTo<Customer[]>(STORAGE_KEYS.CUSTOMERS, callback);
  },

  syncCustomerFromInquiry(inquiry: Inquiry) {
    const customers = this.getCustomers();
    const existing = customers.find((c) => c.email.toLowerCase() === inquiry.email.toLowerCase());
    if (existing) {
      existing.totalInquiries += 1;
      existing.lastInteraction = new Date().toISOString();
      if (!existing.phone && inquiry.phone) existing.phone = inquiry.phone;
      if (!existing.country && inquiry.country) existing.country = inquiry.country;
    } else {
      customers.unshift({
        id: `cust-${Date.now()}`,
        name: inquiry.customerName,
        email: inquiry.email,
        phone: inquiry.phone,
        country: inquiry.country,
        totalInquiries: 1,
        confirmedBookings: 0,
        lastInteraction: new Date().toISOString(),
        notes: `First inquiry on ${new Date().toLocaleDateString()} for ${inquiry.experienceTitle}`,
        createdAt: new Date().toISOString(),
      });
    }
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
  },

  incrementCustomerBookings(email: string) {
    const customers = this.getCustomers();
    const existing = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.confirmedBookings += 1;
      existing.lastInteraction = new Date().toISOString();
      saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
      notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
    }
  },

  updateCustomerNotes(id: string, notes: string): Customer | null {
    const customers = this.getCustomers();
    const target = customers.find((c) => c.id === id);
    if (!target) return null;
    target.notes = notes;
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
    return target;
  },

  // Promotions
  getPromotions(): Promotion[] {
    return loadCollection<Promotion[]>(STORAGE_KEYS.PROMOTIONS) || INITIAL_PROMOTIONS;
  },

  getActivePromotions(): Promotion[] {
    return this.getPromotions().filter((p) => p.active);
  },

  subscribePromotions(callback: (promotions: Promotion[]) => void): () => void {
    return subscribeTo<Promotion[]>(STORAGE_KEYS.PROMOTIONS, callback);
  },

  createPromotion(promo: Omit<Promotion, 'id' | 'createdAt'>): Promotion {
    const list = this.getPromotions();
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newPromo);
    saveCollection(STORAGE_KEYS.PROMOTIONS, list);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, list);
    this.logActivity('Promotion Created', `Created campaign "${newPromo.title}"`);
    return newPromo;
  },

  updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const list = this.getPromotions();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Promotion = { ...list[index], ...updates };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.PROMOTIONS, list);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, list);
    this.logActivity('Promotion Updated', `Updated campaign "${updated.title}"`);
    return updated;
  },

  // Quizzes & Interactive Mini-Game
  getQuizzes(): QuizQuestion[] {
    return loadCollection<QuizQuestion[]>(STORAGE_KEYS.QUIZZES) || INITIAL_QUIZ_QUESTIONS;
  },

  getActiveQuizzes(): QuizQuestion[] {
    return this.getQuizzes().filter((q) => q.active);
  },

  subscribeQuizzes(callback: (quizzes: QuizQuestion[]) => void): () => void {
    return subscribeTo<QuizQuestion[]>(STORAGE_KEYS.QUIZZES, callback);
  },

  updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): QuizQuestion | null {
    const list = this.getQuizzes();
    const index = list.findIndex((q) => q.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    saveCollection(STORAGE_KEYS.QUIZZES, list);
    notifyListeners(STORAGE_KEYS.QUIZZES, list);
    return list[index];
  },

  // Website Content CMS
  getWebsiteContent(): WebsiteContent {
    return loadCollection<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT) || INITIAL_WEBSITE_CONTENT;
  },

  subscribeWebsiteContent(callback: (content: WebsiteContent) => void): () => void {
    return subscribeTo<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, callback);
  },

  updateWebsiteContent(updates: Partial<WebsiteContent>): WebsiteContent {
    const current = this.getWebsiteContent();
    const updated: WebsiteContent = {
      ...current,
      ...updates,
      stats: {
        ...current.stats,
        ...(updates.stats || {}),
      },
    };
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, updated);
    notifyListeners(STORAGE_KEYS.WEBSITE_CONTENT, updated);
    this.logActivity('Website CMS Updated', 'Homepage content & copy updated');
    return updated;
  },

  // Business Settings
  getSettings(): BusinessSettings {
    return loadCollection<BusinessSettings>(STORAGE_KEYS.SETTINGS) || INITIAL_SETTINGS;
  },

  subscribeSettings(callback: (settings: BusinessSettings) => void): () => void {
    return subscribeTo<BusinessSettings>(STORAGE_KEYS.SETTINGS, callback);
  },

  updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    saveCollection(STORAGE_KEYS.SETTINGS, updated);
    notifyListeners(STORAGE_KEYS.SETTINGS, updated);
    this.logActivity('Settings Updated', 'Platform business settings updated');
    return updated;
  },

  // Analytics & Activity Logs
  recordEvent(type: AnalyticsEvent['type'], path?: string, metadata?: Record<string, any>) {
    const events = loadCollection<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS) || [];
    const newEvent: AnalyticsEvent = {
      id: `ev-${Date.now()}`,
      type,
      path,
      metadata,
      timestamp: new Date().toISOString(),
    };
    events.push(newEvent);
    if (events.length > 500) events.shift();
    saveCollection(STORAGE_KEYS.ANALYTICS, events);
    notifyListeners(STORAGE_KEYS.ANALYTICS, events);
  },

  getAnalyticsEvents(): AnalyticsEvent[] {
    return loadCollection<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS) || [];
  },

  logActivity(action: string, details: string, adminUser = 'Admin') {
    const logs = loadCollection<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS) || [];
    logs.unshift({
      id: `log-${Date.now()}`,
      action,
      details,
      adminUser,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 100) logs.pop();
    saveCollection(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    notifyListeners(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  },

  getActivityLogs(): ActivityLog[] {
    return loadCollection<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS) || [];
  },

  // Reset to initial demo data
  resetDemoData() {
    saveCollection(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    saveCollection(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    saveCollection(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    saveCollection(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    saveCollection(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    saveCollection(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    saveCollection(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

    // Notify all
    notifyListeners(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    notifyListeners(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    notifyListeners(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
    notifyListeners(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    notifyListeners(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

    this.logActivity('Database Reset', 'Demo database restored to default seed state');
  },
};
