# سایت هلدینگ (۵ زیرمجموعه)

سایت معرفی هلدینگ با Next.js 15 (App Router)، TypeScript، Tailwind CSS 4 + shadcn/ui، Framer Motion، GSAP ScrollTrigger، Lenis و React Three Fiber.
زبان سایت فارسی و راست‌به‌چپ (`lang="fa" dir="rtl"`) با فونت Vazirmatn است.

> نام «هلدینگ آوند»، زیرمجموعه‌ها و همه محتوا **نمونه** هستند. اطلاعات واقعی را در `lib/site.ts` و `lib/content/data.ts` (یا CMS) جایگزین کنید.

## اجرا

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

متغیر محیطی: `NEXT_PUBLIC_SITE_URL` (آدرس نهایی سایت، برای canonical، sitemap و Open Graph) — نمونه در `.env.example`.

## ساختار صفحات

| مسیر | صفحه |
| --- | --- |
| `/` | خانه: Hero سه‌بعدی، آمار، ویترین ۵ زیرمجموعه (تصویر سایت هر شرکت که با اسکرول عوض می‌شود)، پروژه‌ها با اسکرول افقی pin‌شده، خدمات، اخبار |
| `/about` | درباره هلدینگ: مأموریت، داستان، ارزش‌ها، تایم‌لاین، مدیران |
| `/subsidiaries` | نمای کلی با کارت‌های tilt + glow |
| `/subsidiaries/[slug]` | صفحه هر زیرمجموعه: Hero سه‌بعدی اختصاصی، شمارنده‌ها، پیش‌نمایش وب‌سایت، تایم‌لاین، پروژه‌ها، اخبار |
| `/services` | خدمات و زیرمجموعه‌های ارائه‌دهنده |
| `/projects` | پروژه‌ها با فیلتر انیمیشنی |
| `/news`، `/news/[slug]` | اخبار و دیدگاه‌ها |
| `/careers` | فرصت‌های شغلی |
| `/contact` | فرم تماس (Server Action با اعتبارسنجی) |

همه صفحات در زمان build به‌صورت استاتیک تولید می‌شوند (SSG).

## ساختار پوشه‌ها

```
app/                    صفحات، sitemap.ts، robots.ts، template.tsx (page transition)
components/
  3d/                   HeroScene، SubsidiaryScene، Logo3D، City، SceneFallback
                        index.tsx = نقطه ورود lazy با تشخیص کیفیت و fallback
  motion/               SmoothScroll (Lenis)، Reveal، Parallax، MagneticButton، SplitText،
                        Counter، TiltCard، HorizontalScroll (GSAP)، CustomCursor، ScrollProgress
  layout/               Header، Navigation (منوی موبایل)، Footer، Logo
  sections/             بخش‌های مشترک صفحات
  seo/JsonLd.tsx        Schema.org: Organization + subOrganization، BreadcrumbList، Article
  ui/                   کامپوننت‌های shadcn
lib/content/            مدل محتوا (types.ts)، داده نمونه (data.ts)، لایه دسترسی (index.ts)
store/ui.ts             Zustand: وضعیت منوی موبایل
hooks/                  useMediaQuery، use3DQuality
```

## تصویر سایت زیرمجموعه‌ها

تصاویر فعلی در `public/subsidiaries/` **نمونه** هستند. برای هر شرکت:

1. از سایت واقعی یک **اسکرین‌شات تمام‌صفحه** (Full-page) با عرض ۱۴۴۰ پیکسل بگیرید؛ مثلاً در Chrome: DevTools ← `Ctrl+Shift+P` ← «Capture full size screenshot».
2. فایل را با نام همان slug (مثلاً `public/subsidiaries/avand-energy.jpg`) جایگزین کنید.
3. در `lib/content/data.ts` مقدار `screenshot.width` و `screenshot.height` را با اندازه واقعی فایل و `website` را با آدرس سایت به‌روز کنید.

هر ارتفاعی قابل قبول است: تصویر داخل قاب مرورگر به اندازه طول صفحه اسکرول می‌شود. Next.js تصاویر را خودکار به AVIF/WebP و اندازه مناسب تبدیل می‌کند. اگر شرکتی وب‌سایت ندارد، `website` را حذف کنید تا دکمه «وب‌سایت» نمایش داده نشود.

## اتصال به CMS

همه صفحات محتوا را فقط از توابع `lib/content/index.ts` می‌خوانند (`getSubsidiaries`، `getProjects` و …).
برای Sanity/Strapi/Contentful کافی است همین توابع را با کوئری CMS بازنویسی کنید؛ تایپ‌ها در `types.ts` همان اسکیمای اسناد CMS هستند.
فرم تماس فعلاً فقط اعتبارسنجی می‌کند؛ ارسال ایمیل یا ثبت در CRM را در `app/contact/actions.ts` (محل TODO) اضافه کنید.

## سه‌بعدی و عملکرد

- همه مدل‌ها **رویه‌ای (procedural)** هستند و هیچ فایل glb دانلود نمی‌شود. برای مدل واقعی از `useGLTF` با فایل فشرده (Draco/Meshopt، زیر ۱.۵MB) استفاده کنید.
- Three.js فقط وقتی دانلود می‌شود که صحنه نزدیک viewport باشد (`next/dynamic` + IntersectionObserver). خارج از دید، رندر متوقف می‌شود (`frameloop="never"`).
- سه سطح کیفیت (`hooks/use-3d-quality.ts`):
  - `full`: دسکتاپ
  - `lite`: موبایل/دستگاه ضعیف — اشیای کمتر، DPR پایین، بدون antialias
  - `off`: بدون WebGL، `prefers-reduced-motion` یا Data Saver — fallback دوبعدی
- LOD با `Detailed`، و `PerformanceMonitor` / `AdaptiveDpr` برای تنظیم خودکار DPR.

## دسترس‌پذیری

- `prefers-reduced-motion`: Lenis، cursor سفارشی، اسکرول افقی pin‌شده و صحنه‌های ۳D غیرفعال می‌شوند. Framer Motion با `MotionConfig reducedMotion="user"` تنظیم شده است.
- لینک «پرش به محتوا»، `aria-current` در ناوبری، بستن منوی موبایل با Escape. Canvasها `aria-hidden` هستند و هر لینک داخل صحنه ۳D معادل HTML قابل دسترس دارد.
- SplitText متن فارسی را **کلمه‌به‌کلمه** تقسیم می‌کند (نه حرف‌به‌حرف) تا اتصال حروف حفظ شود.

## Deploy

پروژه آماده Vercel است: ریپو را import کنید و `NEXT_PUBLIC_SITE_URL` را تنظیم کنید.
