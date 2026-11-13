import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
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
import {
  auth,
  db,
  isFirebaseConfigured,
  stripUndefined,
  handleFirestoreError,
  OperationType,
} from './firebase/firestore';

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
    status: 'DRAFT',
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

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'FOUNDING2026',
    discountType: 'percentage',
    discountAmount: 15,
    expiryDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 42,
    active: true,
  },
  {
    id: 'cpn-2',
    code: 'ALULA_WINTER',
    discountType: 'fixed',
    discountAmount: 200,
    expiryDate: '2026-12-31',
    usageLimit: 150,
    usedCount: 88,
    active: true,
  },
  {
    id: 'cpn-3',
    code: 'REDSEA_VIP',
    discountType: 'percentage',
    discountAmount: 20,
    expiryDate: '2026-08-31',
    usageLimit: 50,
    usedCount: 19,
    active: false,
  },
];

const INITIAL_ANALYTICS: AnalyticsEvent[] = [
  { id: 'ev-1', type: 'page_view', path: '/', timestamp: '2026-11-10T08:00:00.000Z' },
  { id: 'ev-2', type: 'experience_view', path: '/experience/alula-desert-adventure', timestamp: '2026-11-10T10:00:00.000Z' },
  { id: 'ev-3', type: 'inquiry_submit', metadata: { exp: 'exp-alula-desert' }, timestamp: '2026-11-10T12:00:00.000Z' },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'System Initialized',
    details: 'TourFlow platform seeded with authentic Saudi tourism packages and AlUla assets',
    adminUser: 'System',
    timestamp: '2026-11-10T08:00:00.000Z',
  },
];

// Storage keys
const STORAGE_KEYS = {
  EXPERIENCES: 'tourflow_experiences_v1',
  DESTINATIONS: 'tourflow_destinations_v1',
  INQUIRIES: 'tourflow_inquiries_v1',
  CUSTOMERS: 'tourflow_customers_v1',
  PROMOTIONS: 'tourflow_promotions_v1',
  COUPONS: 'tourflow_coupons_v1',
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

// In-memory reactive subscriber registry & live cloud cache
type Listener<T> = (data: T) => void;
const listeners: Record<string, Set<Listener<any>>> = {};
const memoryCache: Record<string, any> = {};

// Cloud Firestore sync state
let adminCloudMode = false;
let cloudSeedKnown = false;
let cloudSeedingInProgress = false;
let firestoreListenersStarted = false;
let firestoreUnsubs: Unsubscribe[] = [];
const reconciledInquiryIds = new Set<string>();

function createUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Strict payload sanitizers matching firestore.rules hasOnly(...) whitelists
function toFirestoreExperience(exp: Experience) {
  return stripUndefined({
    id: exp.id,
    title: exp.title,
    titleAr: exp.titleAr || '',
    slug: exp.slug,
    destinationId: exp.destinationId,
    destinationName: exp.destinationName || '',
    category: exp.category,
    categoryAr: exp.categoryAr || '',
    price: Number(exp.price) || 0,
    currency: exp.currency || 'SAR',
    duration: exp.duration || '',
    durationAr: exp.durationAr || '',
    description: exp.description || '',
    descriptionAr: exp.descriptionAr || '',
    coverImage: exp.coverImage || '',
    gallery: Array.isArray(exp.gallery) ? exp.gallery.slice(0, 4) : [],
    highlights: Array.isArray(exp.highlights) ? exp.highlights.slice(0, 20) : [],
    highlightsAr: Array.isArray(exp.highlightsAr) ? exp.highlightsAr.slice(0, 20) : [],
    inclusions: Array.isArray(exp.inclusions) ? exp.inclusions.slice(0, 20) : [],
    inclusionsAr: Array.isArray(exp.inclusionsAr) ? exp.inclusionsAr.slice(0, 20) : [],
    exclusions: Array.isArray(exp.exclusions) ? exp.exclusions.slice(0, 20) : [],
    exclusionsAr: Array.isArray(exp.exclusionsAr) ? exp.exclusionsAr.slice(0, 20) : [],
    meetingPoint: exp.meetingPoint || '',
    meetingPointAr: exp.meetingPointAr || '',
    featured: Boolean(exp.featured),
    status: exp.status,
    rating: Number(exp.rating ?? 4.9),
    reviewsCount: Number(exp.reviewsCount ?? 0),
    maxGuests: Number(exp.maxGuests ?? 10),
    createdAt: exp.createdAt,
    updatedAt: exp.updatedAt,
  });
}

function toFirestoreDestination(dest: Destination) {
  return stripUndefined({
    id: dest.id,
    name: dest.name,
    nameAr: dest.nameAr || '',
    slug: dest.slug,
    description: dest.description || '',
    descriptionAr: dest.descriptionAr || '',
    coverImage: dest.coverImage || '',
    region: dest.region || '',
    regionAr: dest.regionAr || '',
    experienceCount: Number(dest.experienceCount ?? 0),
    featured: Boolean(dest.featured),
    published: Boolean(dest.published),
    createdAt: dest.createdAt,
    updatedAt: dest.updatedAt,
  });
}

function toFirestoreInquiry(inq: Inquiry) {
  return stripUndefined({
    id: inq.id,
    customerName: inq.customerName,
    email: inq.email,
    phone: inq.phone,
    country: inq.country || 'Saudi Arabia',
    experienceId: inq.experienceId,
    experienceTitle: inq.experienceTitle || '',
    preferredDate: inq.preferredDate,
    guests: Math.max(1, Math.min(100, Number(inq.guests) || 1)),
    message: inq.message || '',
    status: inq.status,
    internalNotes: Array.isArray(inq.internalNotes) ? inq.internalNotes.slice(0, 50) : [],
    estimatedValue: inq.estimatedValue !== undefined ? Number(inq.estimatedValue) : undefined,
    createdAt: inq.createdAt,
    updatedAt: inq.updatedAt,
  });
}

function toFirestoreCustomer(cust: Customer) {
  return stripUndefined({
    id: cust.id,
    name: cust.name,
    email: cust.email,
    phone: cust.phone || '',
    country: cust.country || '',
    totalInquiries: Number(cust.totalInquiries ?? 1),
    confirmedBookings: Number(cust.confirmedBookings ?? 0),
    lastInteraction: cust.lastInteraction,
    notes: cust.notes || '',
    createdAt: cust.createdAt,
  });
}

function toFirestorePromotion(promo: Promotion) {
  return stripUndefined({
    id: promo.id,
    title: promo.title,
    titleAr: promo.titleAr || '',
    description: promo.description || '',
    descriptionAr: promo.descriptionAr || '',
    bannerImage: promo.bannerImage || '',
    destinationId: promo.destinationId || '',
    linkedExperienceId: promo.linkedExperienceId || '',
    ctaText: promo.ctaText || 'Explore',
    ctaTextAr: promo.ctaTextAr || '',
    ctaLink: promo.ctaLink || '',
    active: Boolean(promo.active),
    badge: promo.badge || '',
    badgeAr: promo.badgeAr || '',
    createdAt: promo.createdAt,
  });
}

function toFirestoreCoupon(cpn: Coupon) {
  return stripUndefined({
    id: cpn.id,
    code: cpn.code,
    discountType: cpn.discountType,
    discountAmount: Number(cpn.discountAmount) || 0,
    expiryDate: cpn.expiryDate || '2026-12-31',
    usageLimit: Number(cpn.usageLimit ?? 100),
    usedCount: Number(cpn.usedCount ?? 0),
    active: Boolean(cpn.active),
  });
}

function toFirestoreQuiz(quiz: QuizQuestion) {
  return stripUndefined({
    id: quiz.id,
    question: quiz.question,
    questionAr: quiz.questionAr || '',
    options: Array.isArray(quiz.options) ? quiz.options.slice(0, 10) : [],
    optionsAr: Array.isArray(quiz.optionsAr) ? quiz.optionsAr.slice(0, 10) : [],
    correctIndex: Number(quiz.correctIndex) || 0,
    explanation: quiz.explanation || '',
    explanationAr: quiz.explanationAr || '',
    category: quiz.category || 'Heritage',
    active: Boolean(quiz.active),
  });
}

function toFirestoreWebsiteContent(content: WebsiteContent) {
  return stripUndefined({
    heroHeadline: content.heroHeadline,
    heroHeadlineAr: content.heroHeadlineAr || '',
    heroDescription: content.heroDescription || '',
    heroDescriptionAr: content.heroDescriptionAr || '',
    heroImage: content.heroImage || IMAGES.heroAlUla,
    aboutHeadline: content.aboutHeadline,
    aboutHeadlineAr: content.aboutHeadlineAr || '',
    aboutText: content.aboutText || '',
    aboutTextAr: content.aboutTextAr || '',
    stats: content.stats,
    contactEmail: content.contactEmail || '',
    contactPhone: content.contactPhone || '',
    whatsappNumber: content.whatsappNumber || '',
    officeAddress: content.officeAddress || '',
    officeAddressAr: content.officeAddressAr || '',
    socialLinks: content.socialLinks || {},
  });
}

function toFirestoreBusinessSettings(settings: BusinessSettings) {
  return stripUndefined({
    businessName: settings.businessName,
    businessEmail: settings.businessEmail || '',
    businessPhone: settings.businessPhone || '',
    whatsappNumber: settings.whatsappNumber || '',
    businessAddress: settings.businessAddress || '',
    currency: settings.currency || 'SAR',
    defaultLanguage: settings.defaultLanguage || 'en',
    supportedLanguages: settings.supportedLanguages || ['en', 'ar'],
    socialLinks: settings.socialLinks || {},
    enableEmailNotifications: Boolean(settings.enableEmailNotifications),
    enableWhatsAppNotifications: Boolean(settings.enableWhatsAppNotifications),
  });
}

function toFirestoreAnalyticsEvent(event: AnalyticsEvent) {
  return stripUndefined({
    id: event.id,
    type: event.type,
    path: event.path,
    metadata: event.metadata,
    timestamp: event.timestamp,
  });
}

function toFirestoreActivityLog(log: ActivityLog) {
  return stripUndefined({
    id: log.id,
    action: log.action,
    details: log.details,
    adminUser: log.adminUser || 'Admin',
    timestamp: log.timestamp,
  });
}

function emitLocalListeners(collectionKey: string, data: any) {
  if (listeners[collectionKey]) {
    listeners[collectionKey].forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }
}

function notifyListeners(collectionKey: string, data: any) {
  emitLocalListeners(collectionKey, data);
  if (syncChannel) {
    try {
      syncChannel.postMessage({ collection: collectionKey, timestamp: Date.now() });
    } catch {
      // Ignore broadcast channel errors in restricted contexts
    }
  }
}

// Hook up listener for broadcast channel messages
if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { collection: key } = event.data || {};
    if (key && listeners[key]) {
      const freshData = loadCollection(key);
      memoryCache[key] = freshData;
      emitLocalListeners(key, freshData);
    }
  };
}

// Fallback cross-tab storage event listener
if (typeof window !== 'undefined') {
  const validKeys = new Set(Object.values(STORAGE_KEYS));
  window.addEventListener('storage', (event) => {
    if (event.key && validKeys.has(event.key) && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        memoryCache[event.key] = parsed;
        emitLocalListeners(event.key, parsed);
      } catch (e) {
        console.warn('Storage sync parse warning:', e);
      }
    }
  });
}

// Storage helpers
function loadCollection<T>(key: string): T {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key] as T;
  }
  if (typeof window === 'undefined') return [] as unknown as T;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [] as unknown as T;
    const parsed = JSON.parse(raw);
    memoryCache[key] = parsed;
    return parsed;
  } catch (e) {
    console.error('Failed to parse from localStorage', key, e);
    return [] as unknown as T;
  }
}

function saveCollection<T>(key: string, data: T) {
  memoryCache[key] = data;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage quota warning for', key, e);
  }
}

function writeCloudDoc(collectionName: string, docId: string, data: Record<string, unknown>) {
  if (!isFirebaseConfigured() || !db) return;
  setDoc(doc(db, collectionName, docId), stripUndefined(data)).catch((err) => {
    handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${docId}`);
  });
}

function deleteCloudDoc(collectionName: string, docId: string) {
  if (!isFirebaseConfigured() || !db) return;
  deleteDoc(doc(db, collectionName, docId)).catch((err) => {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
  });
}

function sortByCreatedDesc<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

function applyCloudSnapshot<T>(storageKey: string, items: T) {
  saveCollection(storageKey, items);
  notifyListeners(storageKey, items);
}

/**
 * Reconciles visitor-submitted inquiries from Firestore into the Admin-only Customer CRM
 * and promo coupon usage counters.
 */
function reconcileVisitorInquiriesIntoCrm(inquiries: Inquiry[]) {
  if (!adminCloudMode || !isFirebaseConfigured() || !db) return;

  const customers = DataService.getCustomers();
  const recentThreshold = '2026-11-12T00:00:00.000Z';

  for (const inq of inquiries) {
    if (reconciledInquiryIds.has(inq.id)) continue;
    if ((inq.createdAt || '') < recentThreshold) {
      reconciledInquiryIds.add(inq.id);
      continue;
    }

    const emailLower = inq.email.trim().toLowerCase();
    const existing = customers.find((c) => c.email.trim().toLowerCase() === emailLower);

    if (!existing) {
      const safeEmailId = emailLower.replace(/[^a-z0-9]/g, '_').slice(0, 64);
      const newCust: Customer = {
        id: `cust-${safeEmailId || Date.now()}`,
        name: inq.customerName,
        email: inq.email,
        phone: inq.phone,
        country: inq.country,
        totalInquiries: 1,
        confirmedBookings: inq.status === 'CONFIRMED' || inq.status === 'COMPLETED' ? 1 : 0,
        lastInteraction: inq.createdAt,
        notes: `First inquiry on ${new Date(inq.createdAt).toLocaleDateString()} for ${inq.experienceTitle}`,
        createdAt: inq.createdAt,
      };
      reconciledInquiryIds.add(inq.id);
      customers.unshift(newCust);
      saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
      notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
      writeCloudDoc('customers', newCust.id, toFirestoreCustomer(newCust));
    } else if ((existing.lastInteraction || '') < (inq.createdAt || '')) {
      reconciledInquiryIds.add(inq.id);
      existing.totalInquiries += 1;
      existing.lastInteraction = inq.createdAt;
      if (!existing.phone && inq.phone) existing.phone = inq.phone;
      if (!existing.country && inq.country) existing.country = inq.country;
      saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
      notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
      writeCloudDoc('customers', existing.id, toFirestoreCustomer(existing));
    } else {
      reconciledInquiryIds.add(inq.id);
    }
  }
}

/**
 * Seeds Firestore once when an authenticated admin connects to a fresh database.
 */
async function ensureCloudSeeded(): Promise<void> {
  if (!isFirebaseConfigured() || !db || !auth?.currentUser || cloudSeedingInProgress) return;
  cloudSeedingInProgress = true;

  try {
    const [settingsSnap, contentSnap] = await Promise.all([
      getDoc(doc(db, 'settings', 'main')),
      getDoc(doc(db, 'websiteContent', 'main')),
    ]);

    if (settingsSnap.exists() && contentSnap.exists()) {
      cloudSeedKnown = true;
      return;
    }

    const batch = writeBatch(db);

    for (const dest of INITIAL_DESTINATIONS) {
      batch.set(doc(db, 'destinations', dest.id), toFirestoreDestination(dest));
    }
    for (const exp of INITIAL_EXPERIENCES) {
      batch.set(doc(db, 'experiences', exp.id), toFirestoreExperience(exp));
    }
    for (const promo of INITIAL_PROMOTIONS) {
      batch.set(doc(db, 'promotions', promo.id), toFirestorePromotion(promo));
    }
    for (const cpn of INITIAL_COUPONS) {
      batch.set(doc(db, 'coupons', cpn.id), toFirestoreCoupon(cpn));
    }
    for (const quiz of INITIAL_QUIZ_QUESTIONS) {
      batch.set(doc(db, 'quizzes', quiz.id), toFirestoreQuiz(quiz));
    }
    for (const inq of INITIAL_INQUIRIES) {
      batch.set(doc(db, 'inquiries', inq.id), toFirestoreInquiry(inq));
    }
    for (const cust of INITIAL_CUSTOMERS) {
      batch.set(doc(db, 'customers', cust.id), toFirestoreCustomer(cust));
    }
    for (const ev of INITIAL_ANALYTICS) {
      batch.set(doc(db, 'analyticsEvents', ev.id), toFirestoreAnalyticsEvent(ev));
    }
    for (const log of INITIAL_LOGS) {
      batch.set(doc(db, 'activityLogs', log.id), toFirestoreActivityLog(log));
    }

    batch.set(doc(db, 'websiteContent', 'main'), toFirestoreWebsiteContent(INITIAL_WEBSITE_CONTENT));
    batch.set(doc(db, 'settings', 'main'), toFirestoreBusinessSettings(INITIAL_SETTINGS));

    await batch.commit();
    cloudSeedKnown = true;
  } catch (err) {
    console.error('Error seeding Firestore database:', err);
  } finally {
    cloudSeedingInProgress = false;
  }
}

function stopFirestoreSubscriptions() {
  firestoreUnsubs.forEach((unsub) => {
    try {
      unsub();
    } catch {
      // Ignore cleanup errors
    }
  });
  firestoreUnsubs = [];
  firestoreListenersStarted = false;
}

function startFirestoreSubscriptions() {
  if (typeof window === 'undefined' || !isFirebaseConfigured() || !db) return;

  stopFirestoreSubscriptions();
  firestoreListenersStarted = true;

  // 1. Website Content CMS (Public get, Admin write)
  firestoreUnsubs.push(
    onSnapshot(
      doc(db, 'websiteContent', 'main'),
      (snap) => {
        if (snap.exists()) {
          cloudSeedKnown = true;
          applyCloudSnapshot(STORAGE_KEYS.WEBSITE_CONTENT, snap.data() as WebsiteContent);
        }
      },
      (err) => {
        console.warn('WebsiteContent snapshot error:', err.message);
      }
    )
  );

  // 2. Business Settings (Public get, Admin write)
  firestoreUnsubs.push(
    onSnapshot(
      doc(db, 'settings', 'main'),
      (snap) => {
        if (snap.exists()) {
          cloudSeedKnown = true;
          applyCloudSnapshot(STORAGE_KEYS.SETTINGS, snap.data() as BusinessSettings);
        }
      },
      (err) => {
        console.warn('Settings snapshot error:', err.message);
      }
    )
  );

  // 3. Experiences (Visitor: published only; Admin: all)
  const expQuery = adminCloudMode
    ? collection(db, 'experiences')
    : query(collection(db, 'experiences'), where('status', '==', 'PUBLISHED'));

  firestoreUnsubs.push(
    onSnapshot(
      expQuery,
      (snap) => {
        if (!snap.empty || cloudSeedKnown || adminCloudMode) {
          const items = sortByCreatedDesc(snap.docs.map((d) => d.data() as Experience));
          applyCloudSnapshot(STORAGE_KEYS.EXPERIENCES, items);
        }
      },
      (err) => {
        console.warn('Experiences snapshot error:', err.message);
      }
    )
  );

  // 4. Destinations (Visitor: published only; Admin: all)
  const destQuery = adminCloudMode
    ? collection(db, 'destinations')
    : query(collection(db, 'destinations'), where('published', '==', true));

  firestoreUnsubs.push(
    onSnapshot(
      destQuery,
      (snap) => {
        if (!snap.empty || cloudSeedKnown || adminCloudMode) {
          const items = snap.docs
            .map((d) => d.data() as Destination)
            .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
          applyCloudSnapshot(STORAGE_KEYS.DESTINATIONS, items);
        }
      },
      (err) => {
        console.warn('Destinations snapshot error:', err.message);
      }
    )
  );

  // 5. Promotions (Visitor: active only; Admin: all)
  const promoQuery = adminCloudMode
    ? collection(db, 'promotions')
    : query(collection(db, 'promotions'), where('active', '==', true));

  firestoreUnsubs.push(
    onSnapshot(
      promoQuery,
      (snap) => {
        if (!snap.empty || cloudSeedKnown || adminCloudMode) {
          const items = sortByCreatedDesc(snap.docs.map((d) => d.data() as Promotion));
          applyCloudSnapshot(STORAGE_KEYS.PROMOTIONS, items);
        }
      },
      (err) => {
        console.warn('Promotions snapshot error:', err.message);
      }
    )
  );

  // 6. Coupons (Visitor: active only; Admin: all)
  const couponQuery = adminCloudMode
    ? collection(db, 'coupons')
    : query(collection(db, 'coupons'), where('active', '==', true));

  firestoreUnsubs.push(
    onSnapshot(
      couponQuery,
      (snap) => {
        if (!snap.empty || cloudSeedKnown || adminCloudMode) {
          const items = snap.docs.map((d) => d.data() as Coupon);
          applyCloudSnapshot(STORAGE_KEYS.COUPONS, items);
        }
      },
      (err) => {
        console.warn('Coupons snapshot error:', err.message);
      }
    )
  );

  // 7. Interactive Quizzes (Visitor: active only; Admin: all)
  const quizQuery = adminCloudMode
    ? collection(db, 'quizzes')
    : query(collection(db, 'quizzes'), where('active', '==', true));

  firestoreUnsubs.push(
    onSnapshot(
      quizQuery,
      (snap) => {
        if (!snap.empty || cloudSeedKnown || adminCloudMode) {
          const items = snap.docs
            .map((d) => d.data() as QuizQuestion)
            .sort((a, b) => a.id.localeCompare(b.id));
          applyCloudSnapshot(STORAGE_KEYS.QUIZZES, items);
        }
      },
      (err) => {
        console.warn('Quizzes snapshot error:', err.message);
      }
    )
  );

  // 8-11. Admin-only collections (PII isolation enforced by firestore.rules)
  if (adminCloudMode) {
    firestoreUnsubs.push(
      onSnapshot(
        collection(db, 'customers'),
        (snap) => {
          if (!snap.empty || cloudSeedKnown) {
            const items = sortByCreatedDesc(snap.docs.map((d) => d.data() as Customer));
            applyCloudSnapshot(STORAGE_KEYS.CUSTOMERS, items);
          }
        },
        (err) => {
          console.warn('Customers snapshot error:', err.message);
        }
      )
    );

    firestoreUnsubs.push(
      onSnapshot(
        collection(db, 'inquiries'),
        (snap) => {
          if (!snap.empty || cloudSeedKnown) {
            const items = sortByCreatedDesc(snap.docs.map((d) => d.data() as Inquiry));
            applyCloudSnapshot(STORAGE_KEYS.INQUIRIES, items);
            reconcileVisitorInquiriesIntoCrm(items);
          }
        },
        (err) => {
          console.warn('Inquiries snapshot error:', err.message);
        }
      )
    );

    firestoreUnsubs.push(
      onSnapshot(
        collection(db, 'analyticsEvents'),
        (snap) => {
          if (!snap.empty || cloudSeedKnown) {
            const items = snap.docs
              .map((d) => d.data() as AnalyticsEvent)
              .sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''))
              .slice(-500);
            applyCloudSnapshot(STORAGE_KEYS.ANALYTICS, items);
          }
        },
        (err) => {
          console.warn('Analytics snapshot error:', err.message);
        }
      )
    );

    firestoreUnsubs.push(
      onSnapshot(
        collection(db, 'activityLogs'),
        (snap) => {
          if (!snap.empty || cloudSeedKnown) {
            const items = snap.docs
              .map((d) => d.data() as ActivityLog)
              .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
              .slice(0, 100);
            applyCloudSnapshot(STORAGE_KEYS.ACTIVITY_LOGS, items);
          }
        },
        (err) => {
          console.warn('ActivityLogs snapshot error:', err.message);
        }
      )
    );
  }
}

// Initialise storage & start real-time Firestore listeners on first boot
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
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    saveCollection(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
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
    saveCollection(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    saveCollection(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
  }

  if (isFirebaseConfigured() && !firestoreListenersStarted) {
    startFirestoreSubscriptions();
  }
}

// Reactive Subscription helper (behaves like onSnapshot backed by live Firestore)
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
  /**
   * Switches Firestore realtime listeners between public Visitor mode and full Admin mode.
   * Called automatically by AuthContext when Google Admin sign-in state changes.
   */
  setAdminCloudMode(isAdmin: boolean) {
    const changed = adminCloudMode !== isAdmin;
    adminCloudMode = isAdmin;

    if (!isFirebaseConfigured()) return;

    if (isAdmin) {
      ensureCloudSeeded().then(() => {
        startFirestoreSubscriptions();
      });
    } else if (changed || !firestoreListenersStarted) {
      startFirestoreSubscriptions();
    }
  },

  isCloudSyncEnabled(): boolean {
    return isFirebaseConfigured();
  },

  // Experiences
  getExperiences(): Experience[] {
    const loaded = loadCollection<Experience[]>(STORAGE_KEYS.EXPERIENCES);
    return Array.isArray(loaded) ? loaded : INITIAL_EXPERIENCES;
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

  syncDestinationExperienceCounts(experiencesList?: Experience[]) {
    const exps = experiencesList || this.getExperiences();
    const dests = this.getDestinations();
    const changedDests: Destination[] = [];
    const updatedDests = dests.map((dest) => {
      const publishedCount = exps.filter(
        (e) => e.destinationId === dest.id && e.status === 'PUBLISHED'
      ).length;
      if (dest.experienceCount !== publishedCount) {
        const nextDest = {
          ...dest,
          experienceCount: publishedCount,
          updatedAt: new Date().toISOString(),
        };
        changedDests.push(nextDest);
        return nextDest;
      }
      return dest;
    });
    if (changedDests.length > 0) {
      saveCollection(STORAGE_KEYS.DESTINATIONS, updatedDests);
      notifyListeners(STORAGE_KEYS.DESTINATIONS, updatedDests);
      if (adminCloudMode) {
        changedDests.forEach((d) => {
          writeCloudDoc('destinations', d.id, toFirestoreDestination(d));
        });
      }
    }
  },

  createExperience(exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Experience {
    const list = [...this.getExperiences()];
    const id = createUniqueId('exp');
    const now = new Date().toISOString();
    const newExp: Experience = {
      ...exp,
      id,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newExp);
    saveCollection(STORAGE_KEYS.EXPERIENCES, list);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, list);
    if (adminCloudMode) {
      writeCloudDoc('experiences', id, toFirestoreExperience(newExp));
    }
    this.syncDestinationExperienceCounts(list);
    this.logActivity('Experience Created', `Created experience "${newExp.title}" (Status: ${newExp.status})`);
    return newExp;
  },

  updateExperience(id: string, updates: Partial<Experience>): Experience | null {
    const list = [...this.getExperiences()];
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
    if (adminCloudMode) {
      writeCloudDoc('experiences', id, toFirestoreExperience(updated));
    }
    this.syncDestinationExperienceCounts(list);
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
      if (adminCloudMode) {
        deleteCloudDoc('experiences', id);
      }
      this.syncDestinationExperienceCounts(filtered);
      this.logActivity('Experience Deleted', `Removed experience "${target?.title || id}"`);
      return true;
    }
    return false;
  },

  duplicateExperience(id: string): Experience | null {
    const list = [...this.getExperiences()];
    const original = list.find((e) => e.id === id);
    if (!original) return null;
    const now = new Date().toISOString();
    const newId = createUniqueId('exp');
    const duplicated: Experience = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      titleAr: `${original.titleAr} (نسخة)`,
      slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(duplicated);
    saveCollection(STORAGE_KEYS.EXPERIENCES, list);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, list);
    if (adminCloudMode) {
      writeCloudDoc('experiences', newId, toFirestoreExperience(duplicated));
    }
    this.syncDestinationExperienceCounts(list);
    this.logActivity('Experience Duplicated', `Duplicated "${original.title}" as DRAFT`);
    return duplicated;
  },

  // Destinations
  getDestinations(): Destination[] {
    const loaded = loadCollection<Destination[]>(STORAGE_KEYS.DESTINATIONS);
    return Array.isArray(loaded) ? loaded : INITIAL_DESTINATIONS;
  },

  getPublishedDestinations(): Destination[] {
    return this.getDestinations().filter((d) => d.published);
  },

  subscribeDestinations(callback: (destinations: Destination[]) => void): () => void {
    return subscribeTo<Destination[]>(STORAGE_KEYS.DESTINATIONS, callback);
  },

  createDestination(dest: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Destination {
    const list = [...this.getDestinations()];
    const id = createUniqueId('dest');
    const now = new Date().toISOString();
    const newDest: Destination = {
      ...dest,
      id,
      createdAt: now,
      updatedAt: now,
    };
    list.push(newDest);
    saveCollection(STORAGE_KEYS.DESTINATIONS, list);
    notifyListeners(STORAGE_KEYS.DESTINATIONS, list);
    if (adminCloudMode) {
      writeCloudDoc('destinations', id, toFirestoreDestination(newDest));
    }
    this.logActivity('Destination Created', `Created destination "${newDest.name}"`);
    return newDest;
  },

  updateDestination(id: string, updates: Partial<Destination>): Destination | null {
    const list = [...this.getDestinations()];
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;
    const previousName = list[index].name;
    const updated: Destination = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.DESTINATIONS, list);
    notifyListeners(STORAGE_KEYS.DESTINATIONS, list);
    if (adminCloudMode) {
      writeCloudDoc('destinations', id, toFirestoreDestination(updated));
    }

    if (updates.name && updates.name !== previousName) {
      const exps = this.getExperiences();
      const modifiedExps: Experience[] = [];
      const updatedExps = exps.map((e) => {
        if (e.destinationId === id && e.destinationName !== updates.name) {
          const updatedExp = { ...e, destinationName: updates.name!, updatedAt: new Date().toISOString() };
          modifiedExps.push(updatedExp);
          return updatedExp;
        }
        return e;
      });
      if (modifiedExps.length > 0) {
        saveCollection(STORAGE_KEYS.EXPERIENCES, updatedExps);
        notifyListeners(STORAGE_KEYS.EXPERIENCES, updatedExps);
        if (adminCloudMode) {
          modifiedExps.forEach((exp) => {
            writeCloudDoc('experiences', exp.id, toFirestoreExperience(exp));
          });
        }
      }
    }

    this.logActivity('Destination Updated', `Updated destination "${updated.name}"`);
    return updated;
  },

  // Inquiries
  getInquiries(): Inquiry[] {
    const loaded = loadCollection<Inquiry[]>(STORAGE_KEYS.INQUIRIES);
    return Array.isArray(loaded) ? loaded : INITIAL_INQUIRIES;
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
    appliedCouponCode?: string;
  }): Inquiry {
    const list = [...this.getInquiries()];
    const id = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const { appliedCouponCode, ...inquiryFields } = data;
    const newInquiry: Inquiry = {
      ...inquiryFields,
      id,
      status: 'NEW',
      internalNotes: appliedCouponCode ? [`Applied promo code: ${appliedCouponCode}`] : [],
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newInquiry);
    saveCollection(STORAGE_KEYS.INQUIRIES, list);
    notifyListeners(STORAGE_KEYS.INQUIRIES, list);

    // Visitors AND admins are allowed by firestore.rules to create inquiries with status 'NEW'
    if (isFirebaseConfigured() && db) {
      writeCloudDoc('inquiries', id, toFirestoreInquiry(newInquiry));
    }

    if (appliedCouponCode) {
      this.incrementCouponUsage(appliedCouponCode);
    }

    // Sync CRM Customer record & admin activity log when admin session is active
    this.syncCustomerFromInquiry(newInquiry);

    // Visitors AND admins can record analytics events
    this.recordEvent('inquiry_submit', `/experience/${data.experienceId}`, {
      inquiryId: id,
      experienceId: data.experienceId,
      guests: data.guests,
    });

    this.logActivity('New Inquiry Received', `Inquiry ${id} from ${data.customerName} for ${data.experienceTitle}`);
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: InquiryStatus, internalNote?: string): Inquiry | null {
    const list = [...this.getInquiries()];
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
    if (adminCloudMode) {
      writeCloudDoc('inquiries', id, toFirestoreInquiry(updated));
    }

    if (status === 'CONFIRMED') {
      this.incrementCustomerBookings(updated.email);
      this.recordEvent('booking_confirm', undefined, { inquiryId: id, value: updated.estimatedValue });
    }

    this.logActivity('Inquiry Status Changed', `Inquiry ${id} status updated to ${status}`);
    return updated;
  },

  addInquiryNote(id: string, note: string): Inquiry | null {
    const list = [...this.getInquiries()];
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
    if (adminCloudMode) {
      writeCloudDoc('inquiries', id, toFirestoreInquiry(updated));
    }
    return updated;
  },

  // Customers CRM
  getCustomers(): Customer[] {
    const loaded = loadCollection<Customer[]>(STORAGE_KEYS.CUSTOMERS);
    return Array.isArray(loaded) ? loaded : INITIAL_CUSTOMERS;
  },

  subscribeCustomers(callback: (customers: Customer[]) => void): () => void {
    return subscribeTo<Customer[]>(STORAGE_KEYS.CUSTOMERS, callback);
  },

  syncCustomerFromInquiry(inquiry: Inquiry) {
    const customers = [...this.getCustomers()];
    const existing = customers.find((c) => c.email.toLowerCase() === inquiry.email.toLowerCase());
    let changedCustomer: Customer;
    if (existing) {
      existing.totalInquiries += 1;
      existing.lastInteraction = inquiry.createdAt || new Date().toISOString();
      if (!existing.phone && inquiry.phone) existing.phone = inquiry.phone;
      if (!existing.country && inquiry.country) existing.country = inquiry.country;
      changedCustomer = existing;
    } else {
      changedCustomer = {
        id: createUniqueId('cust'),
        name: inquiry.customerName,
        email: inquiry.email,
        phone: inquiry.phone,
        country: inquiry.country,
        totalInquiries: 1,
        confirmedBookings: 0,
        lastInteraction: inquiry.createdAt || new Date().toISOString(),
        notes: `First inquiry on ${new Date().toLocaleDateString()} for ${inquiry.experienceTitle}`,
        createdAt: inquiry.createdAt || new Date().toISOString(),
      };
      customers.unshift(changedCustomer);
    }
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
    if (adminCloudMode) {
      reconciledInquiryIds.add(inquiry.id);
      writeCloudDoc('customers', changedCustomer.id, toFirestoreCustomer(changedCustomer));
    }
  },

  incrementCustomerBookings(email: string) {
    const customers = [...this.getCustomers()];
    const existing = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.confirmedBookings += 1;
      existing.lastInteraction = new Date().toISOString();
      saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
      notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
      if (adminCloudMode) {
        writeCloudDoc('customers', existing.id, toFirestoreCustomer(existing));
      }
    }
  },

  updateCustomerNotes(id: string, notes: string): Customer | null {
    const customers = [...this.getCustomers()];
    const target = customers.find((c) => c.id === id);
    if (!target) return null;
    target.notes = notes;
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, customers);
    if (adminCloudMode) {
      writeCloudDoc('customers', id, toFirestoreCustomer(target));
    }
    return target;
  },

  // Promotions
  getPromotions(): Promotion[] {
    const loaded = loadCollection<Promotion[]>(STORAGE_KEYS.PROMOTIONS);
    return Array.isArray(loaded) ? loaded : INITIAL_PROMOTIONS;
  },

  getActivePromotions(): Promotion[] {
    return this.getPromotions().filter((p) => p.active);
  },

  subscribePromotions(callback: (promotions: Promotion[]) => void): () => void {
    return subscribeTo<Promotion[]>(STORAGE_KEYS.PROMOTIONS, callback);
  },

  createPromotion(promo: Omit<Promotion, 'id' | 'createdAt'>): Promotion {
    const list = [...this.getPromotions()];
    const id = createUniqueId('promo');
    const newPromo: Promotion = {
      ...promo,
      id,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newPromo);
    saveCollection(STORAGE_KEYS.PROMOTIONS, list);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, list);
    if (adminCloudMode) {
      writeCloudDoc('promotions', id, toFirestorePromotion(newPromo));
    }
    this.logActivity('Promotion Created', `Created campaign "${newPromo.title}"`);
    return newPromo;
  },

  updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const list = [...this.getPromotions()];
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Promotion = { ...list[index], ...updates };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.PROMOTIONS, list);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, list);
    if (adminCloudMode) {
      writeCloudDoc('promotions', id, toFirestorePromotion(updated));
    }
    this.logActivity('Promotion Updated', `Updated campaign "${updated.title}"`);
    return updated;
  },

  // Coupons
  getCoupons(): Coupon[] {
    const loaded = loadCollection<Coupon[]>(STORAGE_KEYS.COUPONS);
    if (cloudSeedKnown) {
      return Array.isArray(loaded) ? loaded : [];
    }
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : INITIAL_COUPONS;
  },

  subscribeCoupons(callback: (coupons: Coupon[]) => void): () => void {
    return subscribeTo<Coupon[]>(STORAGE_KEYS.COUPONS, callback);
  },

  createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const list = [...this.getCoupons()];
    const id = createUniqueId('cpn');
    const newCoupon: Coupon = {
      ...coupon,
      code: coupon.code.trim().toUpperCase(),
      id,
      usedCount: 0,
    };
    list.unshift(newCoupon);
    saveCollection(STORAGE_KEYS.COUPONS, list);
    notifyListeners(STORAGE_KEYS.COUPONS, list);
    if (adminCloudMode) {
      writeCloudDoc('coupons', id, toFirestoreCoupon(newCoupon));
    }
    this.logActivity('Promo Code Created', `Created voucher code "${newCoupon.code}"`);
    return newCoupon;
  },

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const list = [...this.getCoupons()];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated: Coupon = { ...list[index], ...updates };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.COUPONS, list);
    notifyListeners(STORAGE_KEYS.COUPONS, list);
    if (adminCloudMode) {
      writeCloudDoc('coupons', id, toFirestoreCoupon(updated));
    }
    this.logActivity('Promo Code Updated', `Updated voucher code "${updated.code}" (${updated.active ? 'Active' : 'Paused'})`);
    return updated;
  },

  incrementCouponUsage(code: string) {
    const list = [...this.getCoupons()];
    const index = list.findIndex((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (index === -1) return;
    const updated = {
      ...list[index],
      usedCount: list[index].usedCount + 1,
    };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.COUPONS, list);
    notifyListeners(STORAGE_KEYS.COUPONS, list);
    if (adminCloudMode && db) {
      updateDoc(doc(db, 'coupons', updated.id), { usedCount: updated.usedCount }).catch(() => {
        // Coupon updates require admin privileges in firestore.rules
      });
    }
  },

  // Quizzes & Interactive Mini-Game
  getQuizzes(): QuizQuestion[] {
    const loaded = loadCollection<QuizQuestion[]>(STORAGE_KEYS.QUIZZES);
    return Array.isArray(loaded) ? loaded : INITIAL_QUIZ_QUESTIONS;
  },

  getActiveQuizzes(): QuizQuestion[] {
    return this.getQuizzes().filter((q) => q.active);
  },

  subscribeQuizzes(callback: (quizzes: QuizQuestion[]) => void): () => void {
    return subscribeTo<QuizQuestion[]>(STORAGE_KEYS.QUIZZES, callback);
  },

  createQuizQuestion(q: Omit<QuizQuestion, 'id'>): QuizQuestion {
    const list = [...this.getQuizzes()];
    const id = createUniqueId('quiz');
    const newQ: QuizQuestion = {
      ...q,
      id,
    };
    list.push(newQ);
    saveCollection(STORAGE_KEYS.QUIZZES, list);
    notifyListeners(STORAGE_KEYS.QUIZZES, list);
    if (adminCloudMode) {
      writeCloudDoc('quizzes', id, toFirestoreQuiz(newQ));
    }
    this.logActivity('Quiz Question Added', `Added question "${newQ.question}"`);
    return newQ;
  },

  updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): QuizQuestion | null {
    const list = [...this.getQuizzes()];
    const index = list.findIndex((q) => q.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveCollection(STORAGE_KEYS.QUIZZES, list);
    notifyListeners(STORAGE_KEYS.QUIZZES, list);
    if (adminCloudMode) {
      writeCloudDoc('quizzes', id, toFirestoreQuiz(updated));
    }
    this.logActivity('Quiz Question Updated', `Updated question "${updated.question}"`);
    return updated;
  },

  deleteQuizQuestion(id: string): boolean {
    const list = this.getQuizzes();
    const target = list.find((q) => q.id === id);
    const filtered = list.filter((q) => q.id !== id);
    if (filtered.length !== list.length) {
      saveCollection(STORAGE_KEYS.QUIZZES, filtered);
      notifyListeners(STORAGE_KEYS.QUIZZES, filtered);
      if (adminCloudMode) {
        deleteCloudDoc('quizzes', id);
      }
      this.logActivity('Quiz Question Deleted', `Removed question "${target?.question || id}"`);
      return true;
    }
    return false;
  },

  // Website Content CMS
  getWebsiteContent(): WebsiteContent {
    const loaded = loadCollection<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT);
    if (loaded && typeof loaded === 'object' && 'heroHeadline' in loaded) {
      return loaded;
    }
    return INITIAL_WEBSITE_CONTENT;
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
      socialLinks: {
        ...current.socialLinks,
        ...(updates.socialLinks || {}),
      },
    };
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, updated);
    notifyListeners(STORAGE_KEYS.WEBSITE_CONTENT, updated);
    if (adminCloudMode) {
      writeCloudDoc('websiteContent', 'main', toFirestoreWebsiteContent(updated));
    }

    // Keep shared contact channels synced with BusinessSettings
    const currentSettings = this.getSettings();
    const syncedSettings: BusinessSettings = {
      ...currentSettings,
      businessEmail: updated.contactEmail,
      businessPhone: updated.contactPhone,
      whatsappNumber: updated.whatsappNumber,
      businessAddress: updated.officeAddress,
    };
    saveCollection(STORAGE_KEYS.SETTINGS, syncedSettings);
    notifyListeners(STORAGE_KEYS.SETTINGS, syncedSettings);
    if (adminCloudMode) {
      writeCloudDoc('settings', 'main', toFirestoreBusinessSettings(syncedSettings));
    }

    this.logActivity('Website CMS Updated', 'Homepage content & copy updated');
    return updated;
  },

  // Business Settings
  getSettings(): BusinessSettings {
    const loaded = loadCollection<BusinessSettings>(STORAGE_KEYS.SETTINGS);
    if (loaded && typeof loaded === 'object' && 'businessName' in loaded) {
      return loaded;
    }
    return INITIAL_SETTINGS;
  },

  subscribeSettings(callback: (settings: BusinessSettings) => void): () => void {
    return subscribeTo<BusinessSettings>(STORAGE_KEYS.SETTINGS, callback);
  },

  updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    saveCollection(STORAGE_KEYS.SETTINGS, updated);
    notifyListeners(STORAGE_KEYS.SETTINGS, updated);
    if (adminCloudMode) {
      writeCloudDoc('settings', 'main', toFirestoreBusinessSettings(updated));
    }

    // Keep shared contact channels synced with WebsiteContent
    const currentContent = this.getWebsiteContent();
    const syncedContent: WebsiteContent = {
      ...currentContent,
      contactEmail: updated.businessEmail,
      contactPhone: updated.businessPhone,
      whatsappNumber: updated.whatsappNumber,
      officeAddress: updated.businessAddress,
    };
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, syncedContent);
    notifyListeners(STORAGE_KEYS.WEBSITE_CONTENT, syncedContent);
    if (adminCloudMode) {
      writeCloudDoc('websiteContent', 'main', toFirestoreWebsiteContent(syncedContent));
    }

    this.logActivity('Settings Updated', 'Platform business settings updated');
    return updated;
  },

  // Analytics & Activity Logs
  recordEvent(type: AnalyticsEvent['type'], path?: string, metadata?: Record<string, any>) {
    const events = [...(loadCollection<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS) || [])];
    const id = createUniqueId('ev');
    const newEvent: AnalyticsEvent = {
      id,
      type,
      path,
      metadata,
      timestamp: new Date().toISOString(),
    };
    events.push(newEvent);
    if (events.length > 500) events.shift();
    saveCollection(STORAGE_KEYS.ANALYTICS, events);
    notifyListeners(STORAGE_KEYS.ANALYTICS, events);

    // Analytics creation is allowed for both Visitor & Admin in firestore.rules
    if (isFirebaseConfigured() && db) {
      writeCloudDoc('analyticsEvents', id, toFirestoreAnalyticsEvent(newEvent));
    }
  },

  getAnalyticsEvents(): AnalyticsEvent[] {
    return loadCollection<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS) || [];
  },

  subscribeAnalyticsEvents(callback: (events: AnalyticsEvent[]) => void): () => void {
    return subscribeTo<AnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, callback);
  },

  logActivity(action: string, details: string, adminUser?: string) {
    const resolvedUser =
      adminUser ||
      auth?.currentUser?.displayName ||
      auth?.currentUser?.email ||
      'Admin';
    const logs = [...(loadCollection<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS) || [])];
    const id = createUniqueId('log');
    const entry: ActivityLog = {
      id,
      action,
      details,
      adminUser: resolvedUser,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    if (logs.length > 100) logs.pop();
    saveCollection(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    notifyListeners(STORAGE_KEYS.ACTIVITY_LOGS, logs);

    if (adminCloudMode) {
      writeCloudDoc('activityLogs', id, toFirestoreActivityLog(entry));
    }
  },

  getActivityLogs(): ActivityLog[] {
    return loadCollection<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS) || [];
  },

  subscribeActivityLogs(callback: (logs: ActivityLog[]) => void): () => void {
    return subscribeTo<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, callback);
  },

  // Reset to initial demo data across local cache and cloud Firestore
  resetDemoData() {
    const initialEvents: AnalyticsEvent[] = [
      { id: 'ev-1', type: 'page_view', path: '/', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'ev-2', type: 'experience_view', path: '/experience/alula-desert-adventure', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 'ev-3', type: 'inquiry_submit', metadata: { exp: 'exp-alula-desert' }, timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
    ];
    const initialLogs: ActivityLog[] = [
      {
        id: createUniqueId('log'),
        action: 'Database Reset',
        details: 'Demo database restored to default seed state',
        adminUser: auth?.currentUser?.displayName || auth?.currentUser?.email || 'Admin',
        timestamp: new Date().toISOString(),
      },
    ];

    saveCollection(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    saveCollection(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    saveCollection(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    saveCollection(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    saveCollection(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    saveCollection(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    saveCollection(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
    saveCollection(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    saveCollection(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    saveCollection(STORAGE_KEYS.ANALYTICS, initialEvents);
    saveCollection(STORAGE_KEYS.ACTIVITY_LOGS, initialLogs);

    // Notify all local subscribers across tabs & panels
    notifyListeners(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    notifyListeners(STORAGE_KEYS.EXPERIENCES, INITIAL_EXPERIENCES);
    notifyListeners(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    notifyListeners(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    notifyListeners(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    notifyListeners(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    notifyListeners(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
    notifyListeners(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    notifyListeners(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    notifyListeners(STORAGE_KEYS.ANALYTICS, initialEvents);
    notifyListeners(STORAGE_KEYS.ACTIVITY_LOGS, initialLogs);

    // Push reset cleanly to Firestore so every connected device syncs immediately
    if (adminCloudMode && isFirebaseConfigured() && db) {
      const firestoreDb = db;
      (async () => {
        try {
          const collectionDefaults: Array<{ name: string; docs: { id: string }[] }> = [
            { name: 'destinations', docs: INITIAL_DESTINATIONS },
            { name: 'experiences', docs: INITIAL_EXPERIENCES },
            { name: 'promotions', docs: INITIAL_PROMOTIONS },
            { name: 'coupons', docs: INITIAL_COUPONS },
            { name: 'quizzes', docs: INITIAL_QUIZ_QUESTIONS },
            { name: 'inquiries', docs: INITIAL_INQUIRIES },
            { name: 'customers', docs: INITIAL_CUSTOMERS },
            { name: 'analyticsEvents', docs: initialEvents },
            { name: 'activityLogs', docs: initialLogs },
          ];

          const batch = writeBatch(firestoreDb);

          for (const col of collectionDefaults) {
            const existingSnap = await getDocs(collection(firestoreDb, col.name));
            const keepIds = new Set(col.docs.map((item) => item.id));
            existingSnap.docs.forEach((d) => {
              if (!keepIds.has(d.id)) {
                batch.delete(d.ref);
              }
            });
          }

          INITIAL_DESTINATIONS.forEach((d) => batch.set(doc(firestoreDb, 'destinations', d.id), toFirestoreDestination(d)));
          INITIAL_EXPERIENCES.forEach((e) => batch.set(doc(firestoreDb, 'experiences', e.id), toFirestoreExperience(e)));
          INITIAL_PROMOTIONS.forEach((p) => batch.set(doc(firestoreDb, 'promotions', p.id), toFirestorePromotion(p)));
          INITIAL_COUPONS.forEach((c) => batch.set(doc(firestoreDb, 'coupons', c.id), toFirestoreCoupon(c)));
          INITIAL_QUIZ_QUESTIONS.forEach((q) => batch.set(doc(firestoreDb, 'quizzes', q.id), toFirestoreQuiz(q)));
          INITIAL_INQUIRIES.forEach((i) => batch.set(doc(firestoreDb, 'inquiries', i.id), toFirestoreInquiry(i)));
          INITIAL_CUSTOMERS.forEach((c) => batch.set(doc(firestoreDb, 'customers', c.id), toFirestoreCustomer(c)));
          initialEvents.forEach((e) => batch.set(doc(firestoreDb, 'analyticsEvents', e.id), toFirestoreAnalyticsEvent(e)));
          initialLogs.forEach((l) => batch.set(doc(firestoreDb, 'activityLogs', l.id), toFirestoreActivityLog(l)));

          batch.set(doc(firestoreDb, 'websiteContent', 'main'), toFirestoreWebsiteContent(INITIAL_WEBSITE_CONTENT));
          batch.set(doc(firestoreDb, 'settings', 'main'), toFirestoreBusinessSettings(INITIAL_SETTINGS));

          await batch.commit();
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'resetDemoData');
        }
      })();
    }
  },
};
