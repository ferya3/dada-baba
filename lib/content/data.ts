import type {
  HoldingProfile,
  HomeContent,
  Job,
  NewsPost,
  PagesContent,
  Project,
  Service,
  SiteSettings,
  Subsidiary,
} from "./types";

/*
 * Seed content. On first start the database is filled from these values;
 * after that everything is edited from the admin panel (/admin). All copy below is sample content for the five
 * subsidiaries — replace it with real data or move it into the CMS.
 * Years are in the Solar Hijri calendar; news dates are ISO (Gregorian) and are
 * rendered with the Persian calendar by `formatFaDate`.
 * Subsidiary `website` URLs and the screenshots in /public/subsidiaries are
 * placeholders too — drop each site's real full-page screenshot in its place.
 */

export const settings: SiteSettings = {
  name: "هلدینگ آوند",
  nameEn: "Avand Holding",
  shortName: "آوند",
  description:
    "هلدینگ آوند؛ گروهی از پنج شرکت تخصصی در عمران، انرژی، فناوری، بازرگانی و سرمایه‌گذاری که با یک چشم‌انداز مشترک، آینده را می‌سازند.",
  foundedYear: 1385,
  email: "info@example.com",
  phone: "۰۲۱-۰۰۰۰۰۰۰۰",
  address: "تهران، خیابان ولیعصر، برج آوند، طبقه ۱۲",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};

export const home: HomeContent = {
  hero: {
    badge: "پنج تخصص، یک چشم‌انداز",
    title: "آینده را یکپارچه می‌سازیم",
    description:
      "هلدینگ آوند، گروهی از پنج شرکت پیشرو در عمران، انرژی، فناوری، بازرگانی و سرمایه‌گذاری است که زنجیره کامل ارزش را از ایده تا بهره‌برداری پوشش می‌دهد.",
  },
  intro: { title: "دو دهه ساختن، سرمایه‌گذاری و نوآوری" },
  showcase: {
    title: "پنج شرکت، یک مدار",
    description: "هر زیرمجموعه در صنعت خود پیشرو است و در کنار هم، توانی فراتر از مجموع اجزا می‌سازند.",
  },
  projects: { title: "کارهایی که به آن‌ها افتخار می‌کنیم" },
  services: {
    title: "از مطالعه تا بهره‌برداری، زیر یک سقف",
    description: "ترکیب توان مهندسی، مالی و فناوری گروه، راهکاری یکپارچه برای پروژه‌های پیچیده فراهم می‌کند.",
  },
  news: { title: "تازه‌ترین‌ها از گروه" },
  cta: {
    title: "پروژه بعدی را با هم بسازیم",
    description: "تیم‌های تخصصی پنج شرکت گروه آماده‌اند تا از ایده تا بهره‌برداری کنار شما باشند.",
  },
};

export const pages: PagesContent = {
  about: {
    title: "ما زنجیره کامل ارزش را می‌سازیم",
    description: "تبدیل شدن به معتبرترین هلدینگ چندرشته‌ای منطقه تا سال ۱۴۱۰، با تکیه بر نوآوری، شفافیت و توسعه پایدار.",
  },
  subsidiaries: {
    title: "پنج شرکت، پنج تخصص، یک هدف",
    description: "هر زیرمجموعه مستقل و متخصص است، اما همه از سرمایه، دانش و شبکه مشترک هلدینگ بهره می‌برند.",
  },
  services: {
    title: "یک قرارداد، پنج تخصص",
    description:
      "هر خدمت با مشارکت زیرمجموعه‌های مرتبط ارائه می‌شود تا کارفرما با یک تیم یکپارچه و یک پاسخ‌گو روبه‌رو باشد.",
  },
  projects: {
    title: "کارنامه‌ای که خود سخن می‌گوید",
    description: "گزیده‌ای از پروژه‌هایی که با هم‌افزایی زیرمجموعه‌های گروه به سرانجام رسیده‌اند.",
  },
  news: {
    title: "روایت ما از صنعت و آینده",
    description: "اخبار گروه، گزارش‌های عملکرد و دیدگاه‌های تخصصی مدیران و کارشناسان ما.",
  },
  careers: {
    title: "آینده را با ما بسازید",
    description:
      "در پنج شرکت گروه، فرصت رشد، یادگیری و کار روی پروژه‌هایی را دارید که اثرشان سال‌ها باقی می‌ماند.",
  },
  contact: {
    title: "با ما در ارتباط باشید",
    description: "برای همکاری، سرمایه‌گذاری یا هر پرسشی، پیام خود را بفرستید. پاسخ ما ظرف دو روز کاری.",
  },
};

export const holding: HoldingProfile = {
  mission:
    "خلق ارزش پایدار برای جامعه، سهامداران و همکاران از طریق هم‌افزایی پنج کسب‌وکار تخصصی و سرمایه‌گذاری هوشمند در صنایع زیربنایی.",
  vision: "تبدیل شدن به معتبرترین هلدینگ چندرشته‌ای منطقه تا سال ۱۴۱۰، با تکیه بر نوآوری، شفافیت و توسعه پایدار.",
  story: [
    "هلدینگ آوند در سال ۱۳۸۵ با یک شرکت پیمانکاری کوچک و تیمی دوازده‌نفره کار خود را آغاز کرد. باور ما از روز اول ساده بود: کیفیت در اجرا، صداقت در تعهد.",
    "با گذر زمان و اعتماد کارفرمایان، دامنه فعالیت گروه به انرژی، فناوری اطلاعات، بازرگانی بین‌المللی و تأمین مالی گسترش یافت. امروز پنج شرکت تخصصی زیر یک چتر واحد، زنجیره کامل ارزش را از ایده تا بهره‌برداری پوشش می‌دهند.",
    "ساختار هلدینگ به ما اجازه می‌دهد تجربه، سرمایه و دانش را میان زیرمجموعه‌ها جابه‌جا کنیم و برای هر پروژه، تیمی چندتخصصی و یکپارچه فراهم آوریم.",
  ],
  values: [
    { title: "یکپارچگی", description: "پنج تخصص، یک تیم؛ هم‌افزایی واقعی میان زیرمجموعه‌ها.", icon: "layers" },
    { title: "شفافیت", description: "گزارش‌دهی دقیق و حاکمیت شرکتی مطابق استانداردهای روز.", icon: "shield" },
    { title: "نوآوری", description: "سرمایه‌گذاری مستمر بر فناوری و راهکارهای هوشمند.", icon: "lightbulb" },
    { title: "پایداری", description: "توسعه‌ای که به محیط زیست و نسل آینده متعهد است.", icon: "leaf" },
  ],
  stats: [
    { label: "سال تجربه", value: 20, suffix: "+" },
    { label: "پروژه تکمیل‌شده", value: 340, suffix: "+" },
    { label: "همکار متخصص", value: 1800 },
    { label: "استان تحت پوشش", value: 22 },
  ],
  timeline: [
    { year: 1385, title: "آغاز راه", description: "تأسیس شرکت آوند سازه و اجرای نخستین پروژه‌های مسکونی." },
    { year: 1390, title: "ورود به انرژی", description: "راه‌اندازی آوند انرژی و نخستین نیروگاه خورشیدی گروه." },
    { year: 1394, title: "تشکیل هلدینگ", description: "ساختاردهی گروه در قالب هلدینگ و تأسیس آوند سرمایه." },
    { year: 1397, title: "تحول دیجیتال", description: "تأسیس آوند فناوری برای هوشمندسازی صنایع گروه و بازار." },
    { year: 1400, title: "تجارت بین‌الملل", description: "آغاز فعالیت آوند تجارت و گشایش دفاتر منطقه‌ای." },
    { year: 1404, title: "افق ۱۴۱۰", description: "تدوین راهبرد توسعه پایدار و برنامه سرمایه‌گذاری سبز." },
  ],
  leadership: [
    { name: "دکتر علی رضایی", role: "رئیس هیئت‌مدیره" },
    { name: "مهندس سارا محمدی", role: "مدیرعامل هلدینگ" },
    { name: "دکتر حمید کریمی", role: "معاون سرمایه‌گذاری" },
    { name: "مهندس نگار احمدی", role: "معاون توسعه و نوآوری" },
  ],
  benefits: [
    { title: "رشد حرفه‌ای", description: "مسیر شغلی روشن و جابه‌جایی میان پنج شرکت گروه.", icon: "target" },
    { title: "آموزش مستمر", description: "آکادمی آوند با دوره‌های تخصصی و مدیریتی.", icon: "lightbulb" },
    { title: "محیط همکارانه", description: "تیم‌های چندتخصصی و فرهنگ احترام متقابل.", icon: "handshake" },
    { title: "رفاه و سلامت", description: "بیمه تکمیلی، تسهیلات رفاهی و ساعات کاری منعطف.", icon: "shield" },
  ],
};

export const subsidiaries: Subsidiary[] = [
  {
    slug: "avand-sazeh",
    name: "آوند سازه",
    nameEn: "Avand Sazeh",
    sector: "عمران و ساختمان",
    tagline: "سازه‌هایی که نسل‌ها می‌مانند",
    summary: "طراحی، مهندسی و اجرای پروژه‌های ساختمانی، تجاری و زیرساختی در مقیاس بزرگ.",
    description: [
      "آوند سازه هسته اولیه هلدینگ است و با بیش از هجده سال تجربه، پروژه‌های مسکونی، تجاری، اداری و زیرساختی را به‌صورت EPC اجرا می‌کند.",
      "تیم مهندسی ما با بهره‌گیری از BIM و روش‌های ساخت صنعتی، زمان و هزینه اجرا را کاهش و کیفیت را تضمین می‌کند.",
    ],
    icon: "building",
    color: "#e0b25b",
    shape: "towers",
    founded: 1385,
    stats: [
      { label: "متر مربع ساخته‌شده", value: 1200000 },
      { label: "پروژه تحویل‌شده", value: 145 },
      { label: "مهندس و متخصص", value: 620 },
    ],
    timeline: [
      { year: 1385, title: "تأسیس", description: "آغاز فعالیت با پروژه‌های مسکونی در تهران." },
      { year: 1391, title: "رتبه یک پیمانکاری", description: "اخذ رتبه یک ابنیه و تأسیسات." },
      { year: 1398, title: "پیاده‌سازی BIM", description: "یکپارچه‌سازی کامل طراحی و اجرا بر بستر BIM." },
      { year: 1403, title: "برج‌های آوند", description: "تحویل مجموعه ۴۲ طبقه برج‌های آوند." },
    ],
    capabilities: ["طراحی و مهندسی سازه", "اجرای EPC", "مدیریت پروژه", "ساخت صنعتی و پیش‌ساخته", "مقاوم‌سازی"],
    website: "https://sazeh.example.com",
    screenshot: { src: "/subsidiaries/avand-sazeh.jpg", width: 1440, height: 2700 },
  },
  {
    slug: "avand-energy",
    name: "آوند انرژی",
    nameEn: "Avand Energy",
    sector: "انرژی و نیرو",
    tagline: "انرژی پاک برای فردای روشن",
    summary: "توسعه، ساخت و بهره‌برداری نیروگاه‌های تجدیدپذیر و راهکارهای بهینه‌سازی مصرف انرژی.",
    description: [
      "آوند انرژی در حوزه نیروگاه‌های خورشیدی، بادی و تولید پراکنده فعالیت می‌کند و تا امروز صدها مگاوات ظرفیت جدید به شبکه افزوده است.",
      "علاوه بر ساخت، خدمات بهره‌برداری و نگهداری، ممیزی انرژی و ذخیره‌سازی را برای صنایع ارائه می‌دهیم.",
    ],
    icon: "zap",
    color: "#4fd1c5",
    shape: "crystal",
    founded: 1390,
    stats: [
      { label: "مگاوات ظرفیت نصب‌شده", value: 480 },
      { label: "تن کاهش سالانه CO₂", value: 310000 },
      { label: "نیروگاه در حال بهره‌برداری", value: 36 },
    ],
    timeline: [
      { year: 1390, title: "تأسیس", description: "ورود گروه به صنعت انرژی‌های تجدیدپذیر." },
      { year: 1395, title: "نخستین مزرعه خورشیدی", description: "بهره‌برداری از نیروگاه ۱۰ مگاواتی یزد." },
      { year: 1400, title: "انرژی بادی", description: "آغاز ساخت مزرعه بادی ۵۰ مگاواتی." },
      { year: 1404, title: "ذخیره‌سازی", description: "راه‌اندازی نخستین سامانه ذخیره باتری صنعتی." },
    ],
    capabilities: ["نیروگاه خورشیدی", "مزرعه بادی", "ممیزی انرژی", "ذخیره‌سازی باتری", "بهره‌برداری و نگهداری"],
    website: "https://energy.example.com",
    screenshot: { src: "/subsidiaries/avand-energy.jpg", width: 1440, height: 2700 },
  },
  {
    slug: "avand-tech",
    name: "آوند فناوری",
    nameEn: "Avand Tech",
    sector: "فناوری اطلاعات",
    tagline: "هوشمندی در قلب کسب‌وکار",
    summary: "تحول دیجیتال، نرم‌افزارهای سازمانی، اینترنت اشیا و هوش مصنوعی برای صنعت.",
    description: [
      "آوند فناوری بازوی دیجیتال هلدینگ است و راهکارهای نرم‌افزاری، زیرساخت ابری و تحلیل داده را برای سازمان‌های بزرگ طراحی و پیاده‌سازی می‌کند.",
      "از سامانه‌های پایش هوشمند نیروگاه‌ها تا پلتفرم‌های مدیریت پروژه، محصولات ما در خط مقدم تحول صنعت قرار دارند.",
    ],
    icon: "cpu",
    color: "#7c8cff",
    shape: "grid",
    founded: 1397,
    stats: [
      { label: "سازمان مشتری", value: 120 },
      { label: "محصول نرم‌افزاری", value: 18 },
      { label: "حسگر IoT فعال", value: 45000 },
    ],
    timeline: [
      { year: 1397, title: "تأسیس", description: "تشکیل تیم فناوری برای هوشمندسازی پروژه‌های گروه." },
      { year: 1399, title: "پلتفرم پایش", description: "عرضه سامانه پایش هوشمند تأسیسات صنعتی." },
      { year: 1401, title: "مرکز داده", description: "راه‌اندازی مرکز داده و سرویس‌های ابری اختصاصی." },
      { year: 1404, title: "هوش مصنوعی", description: "تأسیس آزمایشگاه هوش مصنوعی صنعتی." },
    ],
    capabilities: ["نرم‌افزار سازمانی", "اینترنت اشیای صنعتی", "تحلیل داده و هوش مصنوعی", "زیرساخت ابری", "امنیت سایبری"],
    website: "https://tech.example.com",
    screenshot: { src: "/subsidiaries/avand-tech.jpg", width: 1440, height: 2700 },
  },
  {
    slug: "avand-trade",
    name: "آوند تجارت",
    nameEn: "Avand Trade",
    sector: "بازرگانی و لجستیک",
    tagline: "پل ارتباط بازارها",
    summary: "تأمین کالا، صادرات و واردات، زنجیره تأمین و خدمات لجستیک بین‌المللی.",
    description: [
      "آوند تجارت با شبکه‌ای از شرکای بین‌المللی، تأمین مواد اولیه، تجهیزات صنعتی و صادرات محصولات ایرانی را مدیریت می‌کند.",
      "خدمات لجستیک یکپارچه ما شامل حمل چندوجهی، انبارداری و ترخیص است و زنجیره تأمین سایر زیرمجموعه‌ها را نیز پشتیبانی می‌کند.",
    ],
    icon: "ship",
    color: "#f2789f",
    shape: "waves",
    founded: 1400,
    stats: [
      { label: "کشور مقصد", value: 17 },
      { label: "میلیون دلار حجم مبادلات", value: 260 },
      { label: "متر مربع انبار", value: 85000 },
    ],
    timeline: [
      { year: 1400, title: "تأسیس", description: "آغاز فعالیت بازرگانی خارجی گروه." },
      { year: 1401, title: "دفتر دبی", description: "گشایش نخستین دفتر منطقه‌ای." },
      { year: 1402, title: "مرکز لجستیک", description: "بهره‌برداری از مرکز لجستیک بندرعباس." },
      { year: 1404, title: "کریدور شمال-جنوب", description: "ورود به ترانزیت در کریدور بین‌المللی." },
    ],
    capabilities: ["صادرات و واردات", "تأمین تجهیزات صنعتی", "حمل‌ونقل چندوجهی", "انبارداری", "ترخیص کالا"],
    website: "https://trade.example.com",
    screenshot: { src: "/subsidiaries/avand-trade.jpg", width: 1440, height: 2700 },
  },
  {
    slug: "avand-capital",
    name: "آوند سرمایه",
    nameEn: "Avand Capital",
    sector: "سرمایه‌گذاری و تأمین مالی",
    tagline: "سرمایه هوشمند، رشد پایدار",
    summary: "مدیریت سرمایه، تأمین مالی پروژه‌ها و سرمایه‌گذاری خطرپذیر در کسب‌وکارهای نوآور.",
    description: [
      "آوند سرمایه بازوی مالی هلدینگ است و تأمین مالی پروژه‌های بزرگ گروه و شرکا را از طریق ابزارهای نوین مالی انجام می‌دهد.",
      "صندوق خطرپذیر ما در استارتاپ‌های حوزه انرژی، فناوری ساخت و لجستیک سرمایه‌گذاری می‌کند تا آینده صنعت را زودتر بسازد.",
    ],
    icon: "chart",
    color: "#a3e635",
    shape: "rings",
    founded: 1394,
    stats: [
      { label: "میلیارد تومان دارایی تحت مدیریت", value: 9500 },
      { label: "پروژه تأمین مالی‌شده", value: 64 },
      { label: "استارتاپ در پورتفوی", value: 23 },
    ],
    timeline: [
      { year: 1394, title: "تأسیس", description: "تشکیل بازوی مالی و سرمایه‌گذاری هلدینگ." },
      { year: 1397, title: "صکوک پروژه", description: "انتشار نخستین اوراق تأمین مالی پروژه‌های گروه." },
      { year: 1400, title: "صندوق خطرپذیر", description: "راه‌اندازی صندوق سرمایه‌گذاری خطرپذیر آوند." },
      { year: 1403, title: "سرمایه‌گذاری سبز", description: "اختصاص سبد ویژه به پروژه‌های پایدار." },
    ],
    capabilities: ["تأمین مالی پروژه", "مدیریت دارایی", "سرمایه‌گذاری خطرپذیر", "مشاوره ادغام و تملک", "انتشار اوراق"],
    website: "https://capital.example.com",
    screenshot: { src: "/subsidiaries/avand-capital.jpg", width: 1440, height: 2700 },
  },
];

export const services: Service[] = [
  {
    id: "epc",
    title: "طراحی، تأمین و اجرا (EPC)",
    description: "مسئولیت کامل پروژه از مطالعات اولیه تا تحویل کلید، با یک قرارداد و یک پاسخ‌گو.",
    icon: "building",
    subsidiaries: ["avand-sazeh", "avand-energy", "avand-trade"],
  },
  {
    id: "renewables",
    title: "توسعه انرژی‌های تجدیدپذیر",
    description: "امکان‌سنجی، تأمین مالی، ساخت و بهره‌برداری نیروگاه‌های خورشیدی و بادی.",
    icon: "zap",
    subsidiaries: ["avand-energy", "avand-capital"],
  },
  {
    id: "digital",
    title: "تحول دیجیتال صنعتی",
    description: "هوشمندسازی تأسیسات، پایش برخط، تحلیل داده و نرم‌افزارهای سازمانی.",
    icon: "cpu",
    subsidiaries: ["avand-tech"],
  },
  {
    id: "supply-chain",
    title: "زنجیره تأمین و لجستیک",
    description: "تأمین بین‌المللی تجهیزات، حمل چندوجهی، انبارداری و ترخیص.",
    icon: "ship",
    subsidiaries: ["avand-trade"],
  },
  {
    id: "finance",
    title: "تأمین مالی پروژه",
    description: "ساختاردهی مالی، انتشار اوراق و جذب سرمایه برای پروژه‌های زیربنایی.",
    icon: "chart",
    subsidiaries: ["avand-capital"],
  },
  {
    id: "consulting",
    title: "مشاوره و مدیریت پروژه",
    description: "کنترل پروژه، مدیریت ریسک و مشاوره فنی-اقتصادی برای کارفرمایان.",
    icon: "compass",
    subsidiaries: ["avand-sazeh", "avand-tech", "avand-capital"],
  },
];

export const projects: Project[] = [
  {
    slug: "avand-towers",
    title: "برج‌های دوقلوی آوند",
    subsidiary: "avand-sazeh",
    year: 1403,
    location: "تهران",
    category: "تجاری و اداری",
    summary: "مجموعه دو برج ۴۲ طبقه با کاربری اداری و تجاری، طراحی‌شده بر بستر BIM.",
    highlight: "۱۸۰,۰۰۰ متر مربع",
  },
  {
    slug: "yazd-solar",
    title: "نیروگاه خورشیدی کویر",
    subsidiary: "avand-energy",
    year: 1402,
    location: "یزد",
    category: "انرژی خورشیدی",
    summary: "یکی از بزرگ‌ترین مزارع خورشیدی کشور با سامانه ردیاب تک‌محوره.",
    highlight: "۱۲۰ مگاوات",
  },
  {
    slug: "smart-grid",
    title: "پلتفرم پایش هوشمند شبکه",
    subsidiary: "avand-tech",
    year: 1403,
    location: "سراسری",
    category: "اینترنت اشیا",
    summary: "پایش لحظه‌ای ۳۶ نیروگاه و پیش‌بینی خرابی تجهیزات با یادگیری ماشین.",
    highlight: "۴۵,۰۰۰ حسگر",
  },
  {
    slug: "bandar-logistics",
    title: "مرکز لجستیک بندرعباس",
    subsidiary: "avand-trade",
    year: 1402,
    location: "بندرعباس",
    category: "لجستیک",
    summary: "هاب لجستیک چندوجهی با انبار هوشمند و ارتباط مستقیم ریلی به بندر.",
    highlight: "۸۵,۰۰۰ متر مربع",
  },
  {
    slug: "green-fund",
    title: "صندوق سرمایه‌گذاری سبز",
    subsidiary: "avand-capital",
    year: 1403,
    location: "تهران",
    category: "سرمایه‌گذاری",
    summary: "سبد اختصاصی سرمایه‌گذاری در پروژه‌های انرژی پاک و فناوری‌های پایدار.",
    highlight: "۲,۰۰۰ میلیارد تومان",
  },
  {
    slug: "manjil-wind",
    title: "مزرعه بادی منجیل",
    subsidiary: "avand-energy",
    year: 1404,
    location: "گیلان",
    category: "انرژی بادی",
    summary: "مزرعه ۵۰ مگاواتی با توربین‌های نسل جدید و بهره‌برداری از راه دور.",
    highlight: "۵۰ مگاوات",
  },
  {
    slug: "shiraz-hospital",
    title: "بیمارستان تخصصی شیراز",
    subsidiary: "avand-sazeh",
    year: 1401,
    location: "شیراز",
    category: "درمانی",
    summary: "بیمارستان ۴۰۰ تختخوابی با سازه جداسازی‌شده لرزه‌ای.",
    highlight: "۴۰۰ تخت",
  },
  {
    slug: "erp-suite",
    title: "سامانه یکپارچه مدیریت پروژه",
    subsidiary: "avand-tech",
    year: 1402,
    location: "سراسری",
    category: "نرم‌افزار سازمانی",
    summary: "پلتفرم مدیریت پروژه، قرارداد و منابع برای پیمانکاران بزرگ.",
    highlight: "۱۲۰ سازمان",
  },
];

export const news: NewsPost[] = [
  {
    slug: "avand-towers-handover",
    title: "تحویل برج‌های دوقلوی آوند به بهره‌برداران",
    excerpt: "پس از چهار سال اجرا، بزرگ‌ترین پروژه تجاری-اداری گروه با حضور مقامات افتتاح شد.",
    date: "2025-03-02",
    category: "خبر",
    subsidiary: "avand-sazeh",
    readingMinutes: 3,
    body: [
      "پروژه برج‌های دوقلوی آوند با زیربنای ۱۸۰ هزار متر مربع، در موعد مقرر و با رعایت کامل استانداردهای ایمنی و کیفیت به بهره‌برداران تحویل شد.",
      "این پروژه نخستین تجربه اجرای کامل یک ابرپروژه بر بستر BIM در گروه بود و به کاهش ۱۲ درصدی هزینه‌ها و ۸ درصدی زمان اجرا انجامید.",
      "هم‌افزایی آوند سازه با آوند فناوری در هوشمندسازی ساختمان و آوند سرمایه در تأمین مالی، نمونه‌ای روشن از مزیت ساختار هلدینگی است.",
    ],
  },
  {
    slug: "future-of-renewables",
    title: "آینده انرژی‌های تجدیدپذیر در ایران؛ فرصت‌ها و چالش‌ها",
    excerpt: "نگاهی تحلیلی به ظرفیت‌ها، موانع تأمین مالی و نقش بخش خصوصی در گذار انرژی.",
    date: "2025-05-18",
    category: "دیدگاه",
    subsidiary: "avand-energy",
    readingMinutes: 6,
    body: [
      "ایران با بیش از ۳۰۰ روز آفتابی در سال، یکی از بالاترین پتانسیل‌های انرژی خورشیدی جهان را در اختیار دارد؛ اما سهم تجدیدپذیرها در سبد تولید هنوز اندک است.",
      "به باور ما، کلید عبور از این شکاف، ترکیب فناوری بومی‌شده، مدل‌های نوین تأمین مالی و قراردادهای خرید تضمینی بلندمدت است.",
      "آوند انرژی با همراهی آوند سرمایه، مدلی را طراحی کرده که در آن سرمایه‌گذاران خرد نیز می‌توانند در مالکیت نیروگاه‌ها سهیم شوند.",
    ],
  },
  {
    slug: "annual-report-1403",
    title: "گزارش عملکرد سالانه هلدینگ آوند",
    excerpt: "رشد ۳۴ درصدی درآمد، ورود به دو بازار جدید و افزایش سهم پروژه‌های پایدار.",
    date: "2025-06-10",
    category: "گزارش",
    readingMinutes: 5,
    body: [
      "هلدینگ آوند در سال گذشته با رشد ۳۴ درصدی درآمد تلفیقی و افزایش حاشیه سود عملیاتی، یکی از موفق‌ترین سال‌های خود را پشت سر گذاشت.",
      "سهم پروژه‌های انرژی پاک و فناوری از درآمد گروه به ۴۱ درصد رسید که نشان‌دهنده حرکت پیوسته به سمت مدل کسب‌وکار پایدار است.",
      "در سال پیش‌رو، تمرکز گروه بر توسعه کریدورهای تجاری، ذخیره‌سازی انرژی و هوش مصنوعی صنعتی خواهد بود.",
    ],
  },
  {
    slug: "ai-lab-launch",
    title: "افتتاح آزمایشگاه هوش مصنوعی صنعتی آوند فناوری",
    excerpt: "آزمایشگاهی برای توسعه مدل‌های پیش‌بینی خرابی و بهینه‌سازی مصرف انرژی در صنایع.",
    date: "2025-08-24",
    category: "خبر",
    subsidiary: "avand-tech",
    readingMinutes: 2,
    body: [
      "آزمایشگاه هوش مصنوعی صنعتی آوند با هدف توسعه مدل‌های یادگیری ماشین برای نگهداری پیش‌گویانه و بهینه‌سازی انرژی افتتاح شد.",
      "این آزمایشگاه با همکاری دانشگاه‌های برتر کشور، پذیرای پژوهشگران و دانشجویان تحصیلات تکمیلی خواهد بود.",
    ],
  },
];

export const jobs: Job[] = [
  { id: "j1", title: "مهندس ارشد سازه", subsidiary: "avand-sazeh", department: "مهندسی", location: "تهران", type: "تمام‌وقت" },
  { id: "j2", title: "کارشناس بهره‌برداری نیروگاه", subsidiary: "avand-energy", department: "عملیات", location: "یزد", type: "تمام‌وقت" },
  { id: "j3", title: "توسعه‌دهنده ارشد فرانت‌اند", subsidiary: "avand-tech", department: "محصول", location: "تهران / دورکاری", type: "تمام‌وقت" },
  { id: "j4", title: "متخصص یادگیری ماشین", subsidiary: "avand-tech", department: "هوش مصنوعی", location: "تهران", type: "تمام‌وقت" },
  { id: "j5", title: "کارشناس بازرگانی خارجی", subsidiary: "avand-trade", department: "بازرگانی", location: "بندرعباس", type: "تمام‌وقت" },
  { id: "j6", title: "تحلیلگر سرمایه‌گذاری", subsidiary: "avand-capital", department: "سرمایه‌گذاری", location: "تهران", type: "تمام‌وقت" },
  { id: "j7", title: "کارآموز مدیریت پروژه", subsidiary: "avand-sazeh", department: "کنترل پروژه", location: "تهران", type: "کارآموزی" },
];
