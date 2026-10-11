import type { Field, Option } from "./fields";

/* Section definitions for the admin panel: what can be edited and how. */

const iconOptions: Option[] = [
  { value: "building", label: "ساختمان" },
  { value: "zap", label: "انرژی (صاعقه)" },
  { value: "cpu", label: "فناوری (پردازنده)" },
  { value: "ship", label: "کشتی" },
  { value: "chart", label: "نمودار" },
  { value: "factory", label: "کارخانه" },
  { value: "network", label: "شبکه" },
  { value: "leaf", label: "برگ" },
  { value: "shield", label: "سپر" },
  { value: "lightbulb", label: "لامپ" },
  { value: "handshake", label: "دست دادن" },
  { value: "target", label: "هدف" },
  { value: "compass", label: "قطب‌نما" },
  { value: "layers", label: "لایه‌ها" },
];

const shapeOptions: Option[] = [
  { value: "towers", label: "برج‌ها (شهر)" },
  { value: "crystal", label: "کریستال" },
  { value: "grid", label: "شبکه داده" },
  { value: "waves", label: "امواج" },
  { value: "rings", label: "حلقه‌ها" },
];

const stat: Field = {
  type: "list",
  name: "stats",
  label: "آمار و ارقام",
  itemLabel: "آمار",
  wide: true,
  fields: [
    { type: "number", name: "value", label: "عدد", required: true, min: 0 },
    { type: "text", name: "suffix", label: "پسوند", help: "مثلاً + (اختیاری)", max: 10 },
    { type: "text", name: "label", label: "عنوان", required: true, wide: true },
  ],
};

const timeline: Field = {
  type: "list",
  name: "timeline",
  label: "تایم‌لاین",
  itemLabel: "رویداد",
  wide: true,
  fields: [
    { type: "number", name: "year", label: "سال (شمسی)", required: true, min: 1300, max: 1500 },
    { type: "text", name: "title", label: "عنوان", required: true },
    { type: "textarea", name: "description", label: "توضیح", required: true, rows: 2, wide: true },
  ],
};

const iconCards = (name: string, label: string, itemLabel: string): Field => ({
  type: "list",
  name,
  label,
  itemLabel,
  wide: true,
  fields: [
    { type: "text", name: "title", label: "عنوان", required: true },
    { type: "select", name: "icon", label: "آیکون", options: iconOptions, required: true },
    { type: "textarea", name: "description", label: "توضیح", required: true, rows: 2, wide: true },
  ],
});

const heading = (name: string, label: string, withDescription = true): Field => ({
  type: "group",
  name,
  label,
  wide: true,
  fields: [
    { type: "text", name: "title", label: "عنوان", required: true, wide: true },
    ...(withDescription
      ? [{ type: "textarea", name: "description", label: "توضیح", required: true, rows: 2, wide: true } as Field]
      : []),
  ],
});

export type SingletonSection = {
  kind: "singleton";
  key: "settings" | "home" | "pages" | "about";
  title: string;
  description: string;
  fields: Field[];
};

export type CollectionSection = {
  kind: "collection";
  key: "subsidiaries" | "services" | "projects" | "news" | "jobs";
  title: string;
  singular: string;
  description: string;
  /** "slug": the admin types a URL-safe id; "auto": generated. */
  idField: "slug" | "auto";
  titleField: string;
  /** Extra columns shown in the list (field name → column title). */
  columns: { field: string; label: string }[];
  /** Public URL of a document, for "view on site" links. */
  publicPath?: (id: string) => string;
  /** Lists are shown in this order on the site; false when the site sorts them itself. */
  orderable: boolean;
  fields: Field[];
};

export type Section = SingletonSection | CollectionSection;

export const sections: Section[] = [
  {
    kind: "singleton",
    key: "settings",
    title: "تنظیمات عمومی",
    description: "نام هلدینگ، اطلاعات تماس و شبکه‌های اجتماعی؛ در سربرگ، پاورقی و صفحه تماس نمایش داده می‌شوند.",
    fields: [
      { type: "text", name: "name", label: "نام کامل هلدینگ", required: true },
      { type: "text", name: "nameEn", label: "نام انگلیسی", dir: "ltr", required: true },
      { type: "text", name: "shortName", label: "نام کوتاه (لوگو)", required: true, max: 30 },
      { type: "number", name: "foundedYear", label: "سال تأسیس (شمسی)", required: true, min: 1300, max: 1500 },
      {
        type: "textarea",
        name: "description",
        label: "معرفی کوتاه",
        help: "در پاورقی و نتایج گوگل نمایش داده می‌شود.",
        required: true,
        rows: 3,
        wide: true,
      },
      { type: "email", name: "email", label: "ایمیل", required: true },
      { type: "text", name: "phone", label: "تلفن", required: true, max: 40 },
      { type: "text", name: "address", label: "نشانی", required: true, wide: true },
      {
        type: "list",
        name: "social",
        label: "شبکه‌های اجتماعی",
        itemLabel: "لینک",
        wide: true,
        fields: [
          { type: "text", name: "label", label: "نام", required: true, dir: "ltr", placeholder: "Instagram" },
          { type: "url", name: "href", label: "آدرس", required: true, placeholder: "https://instagram.com/..." },
        ],
      },
    ],
  },
  {
    kind: "singleton",
    key: "home",
    title: "صفحه اصلی",
    description: "متن‌های بخش‌های مختلف صفحه اصلی.",
    fields: [
      {
        type: "group",
        name: "hero",
        label: "بخش ابتدایی (Hero)",
        wide: true,
        fields: [
          { type: "text", name: "badge", label: "برچسب بالای عنوان", required: true, wide: true },
          { type: "text", name: "title", label: "عنوان اصلی", required: true, wide: true },
          { type: "textarea", name: "description", label: "توضیح", required: true, rows: 3, wide: true },
        ],
      },
      heading("intro", "بخش «درباره ما»", false),
      heading("showcase", "بخش زیرمجموعه‌ها"),
      heading("projects", "بخش پروژه‌های شاخص", false),
      heading("services", "بخش خدمات"),
      heading("news", "بخش اخبار", false),
      heading("cta", "دعوت به همکاری (پایین صفحات)"),
    ],
  },
  {
    kind: "singleton",
    key: "pages",
    title: "سربرگ صفحات",
    description: "عنوان و توضیح بالای هر صفحه داخلی. توضیح در نتایج گوگل هم استفاده می‌شود.",
    fields: [
      heading("about", "درباره هلدینگ"),
      heading("subsidiaries", "زیرمجموعه‌ها"),
      heading("services", "خدمات"),
      heading("projects", "پروژه‌ها"),
      heading("news", "اخبار و دیدگاه‌ها"),
      heading("careers", "فرصت‌های شغلی"),
      heading("contact", "تماس"),
    ],
  },
  {
    kind: "singleton",
    key: "about",
    title: "درباره هلدینگ",
    description: "مأموریت، داستان، ارزش‌ها، آمار، تایم‌لاین و مدیران. مزایای همکاری در صفحه فرصت‌های شغلی نمایش داده می‌شود.",
    fields: [
      { type: "textarea", name: "mission", label: "مأموریت", required: true, rows: 3, wide: true },
      { type: "textarea", name: "vision", label: "چشم‌انداز", required: true, rows: 3, wide: true },
      { type: "paragraphs", name: "story", label: "داستان ما", help: "پاراگراف‌ها را با یک خط خالی از هم جدا کنید.", wide: true },
      iconCards("values", "ارزش‌ها", "ارزش"),
      { ...stat, label: "آمار کلیدی هلدینگ" },
      timeline,
      {
        type: "list",
        name: "leadership",
        label: "مدیران",
        itemLabel: "مدیر",
        wide: true,
        fields: [
          { type: "text", name: "name", label: "نام", required: true },
          { type: "text", name: "role", label: "سمت", required: true },
        ],
      },
      iconCards("benefits", "مزایای همکاری (صفحه فرصت‌های شغلی)", "مزیت"),
    ],
  },
  {
    kind: "collection",
    key: "subsidiaries",
    title: "زیرمجموعه‌ها",
    singular: "زیرمجموعه",
    description: "شرکت‌های گروه. ترتیب این فهرست، ترتیب نمایش در سایت است.",
    idField: "slug",
    titleField: "name",
    columns: [{ field: "sector", label: "حوزه" }],
    publicPath: (id) => `/subsidiaries/${id}`,
    orderable: true,
    fields: [
      {
        type: "slug",
        name: "slug",
        label: "نامک (آدرس صفحه)",
        help: "در آدرس صفحه استفاده می‌شود و بعد از ساخت قابل تغییر نیست.",
        required: true,
        placeholder: "avand-energy",
      },
      { type: "text", name: "name", label: "نام", required: true },
      { type: "text", name: "nameEn", label: "نام انگلیسی", dir: "ltr", required: true },
      { type: "text", name: "sector", label: "حوزه فعالیت", required: true },
      { type: "text", name: "tagline", label: "شعار", required: true, wide: true },
      { type: "textarea", name: "summary", label: "خلاصه", required: true, rows: 2, wide: true },
      { type: "paragraphs", name: "description", label: "معرفی کامل", help: "پاراگراف‌ها را با یک خط خالی از هم جدا کنید.", wide: true },
      { type: "color", name: "color", label: "رنگ شاخص", required: true },
      { type: "select", name: "icon", label: "آیکون", options: iconOptions, required: true },
      { type: "select", name: "shape", label: "شکل سه‌بعدی صفحه", options: shapeOptions, required: true },
      { type: "number", name: "founded", label: "سال تأسیس (شمسی)", required: true, min: 1300, max: 1500 },
      { type: "url", name: "website", label: "وب‌سایت", help: "اختیاری؛ اگر خالی باشد دکمه وب‌سایت نمایش داده نمی‌شود.", placeholder: "https://..." },
      {
        type: "image",
        name: "screenshot",
        label: "تصویر وب‌سایت",
        help: "اسکرین‌شات تمام‌صفحه با عرض حدود ۱۴۴۰ پیکسل. در صفحه اصلی داخل قاب مرورگر اسکرول می‌شود.",
        required: true,
        wide: true,
      },
      { ...stat, help: "دو مورد اول در صفحه اصلی هم نمایش داده می‌شوند." },
      timeline,
      { type: "strings", name: "capabilities", label: "توانمندی‌ها", itemLabel: "توانمندی", wide: true },
    ],
  },
  {
    kind: "collection",
    key: "services",
    title: "خدمات",
    singular: "خدمت",
    description: "خدمات گروه و زیرمجموعه‌هایی که هر خدمت را ارائه می‌دهند.",
    idField: "auto",
    titleField: "title",
    columns: [],
    orderable: true,
    fields: [
      { type: "text", name: "title", label: "عنوان", required: true },
      { type: "select", name: "icon", label: "آیکون", options: iconOptions, required: true },
      { type: "textarea", name: "description", label: "توضیح", required: true, rows: 3, wide: true },
      { type: "multiselect", name: "subsidiaries", label: "زیرمجموعه‌های ارائه‌دهنده", options: "subsidiaries", wide: true },
    ],
  },
  {
    kind: "collection",
    key: "projects",
    title: "پروژه‌ها",
    singular: "پروژه",
    description: "پروژه‌های شاخص. شش مورد اول در صفحه اصلی نمایش داده می‌شوند.",
    idField: "slug",
    titleField: "title",
    columns: [
      { field: "location", label: "محل" },
      { field: "year", label: "سال" },
    ],
    orderable: true,
    fields: [
      { type: "slug", name: "slug", label: "شناسه", help: "انگلیسی و یکتا؛ بعد از ساخت قابل تغییر نیست.", required: true, placeholder: "yazd-solar" },
      { type: "text", name: "title", label: "عنوان", required: true },
      { type: "select", name: "subsidiary", label: "زیرمجموعه", options: "subsidiaries", required: true },
      { type: "text", name: "category", label: "دسته", required: true },
      { type: "text", name: "location", label: "محل", required: true },
      { type: "number", name: "year", label: "سال (شمسی)", required: true, min: 1300, max: 1500 },
      { type: "text", name: "highlight", label: "عدد شاخص کارت", help: "مثلاً «۱۲۰ مگاوات»", required: true },
      { type: "textarea", name: "summary", label: "خلاصه", required: true, rows: 3, wide: true },
    ],
  },
  {
    kind: "collection",
    key: "news",
    title: "اخبار و دیدگاه‌ها",
    singular: "مطلب",
    description: "خبرها، گزارش‌ها و یادداشت‌ها. در سایت بر اساس تاریخ (جدیدترین اول) مرتب می‌شوند.",
    idField: "slug",
    titleField: "title",
    columns: [
      { field: "category", label: "نوع" },
      { field: "date", label: "تاریخ" },
    ],
    publicPath: (id) => `/news/${id}`,
    orderable: false,
    fields: [
      { type: "slug", name: "slug", label: "نامک (آدرس صفحه)", help: "انگلیسی؛ بعد از انتشار قابل تغییر نیست.", required: true, placeholder: "annual-report-1404" },
      { type: "text", name: "title", label: "عنوان", required: true, wide: true },
      {
        type: "select",
        name: "category",
        label: "نوع",
        required: true,
        options: [
          { value: "خبر", label: "خبر" },
          { value: "دیدگاه", label: "دیدگاه" },
          { value: "گزارش", label: "گزارش" },
        ],
      },
      { type: "date", name: "date", label: "تاریخ انتشار", required: true },
      { type: "select", name: "subsidiary", label: "زیرمجموعه مرتبط", options: "subsidiaries", help: "اختیاری" },
      { type: "number", name: "readingMinutes", label: "زمان مطالعه (دقیقه)", required: true, min: 1, max: 120 },
      { type: "textarea", name: "excerpt", label: "خلاصه", required: true, rows: 2, wide: true },
      { type: "paragraphs", name: "body", label: "متن کامل", help: "پاراگراف‌ها را با یک خط خالی از هم جدا کنید.", required: true, wide: true },
    ],
  },
  {
    kind: "collection",
    key: "jobs",
    title: "فرصت‌های شغلی",
    singular: "موقعیت شغلی",
    description: "موقعیت‌های شغلی باز. متقاضیان از صفحه فرصت‌های شغلی رزومه می‌فرستند.",
    idField: "auto",
    titleField: "title",
    columns: [
      { field: "location", label: "محل" },
      { field: "type", label: "نوع همکاری" },
    ],
    orderable: true,
    fields: [
      { type: "text", name: "title", label: "عنوان شغل", required: true },
      { type: "select", name: "subsidiary", label: "زیرمجموعه", options: "subsidiaries", required: true },
      { type: "text", name: "department", label: "واحد", required: true },
      { type: "text", name: "location", label: "محل کار", required: true },
      {
        type: "select",
        name: "type",
        label: "نوع همکاری",
        required: true,
        options: ["تمام‌وقت", "پاره‌وقت", "کارآموزی", "قراردادی"].map((v) => ({ value: v, label: v })),
      },
    ],
  },
];

export function getSection(key: string) {
  return sections.find((s) => s.key === key) ?? null;
}
