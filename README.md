# Cabinet21 — استودیو کابینت ۲۱

وب‌سایت استودیو کابینت ۲۱ — ساخته‌شده با Vite + React 19 + TypeScript + Tailwind CSS.

## سیستم پیام‌ها (JSONBin)

فرم تماس سایت پیام‌ها را در **JSONBin** ذخیره می‌کند و صفحه مدیریت پیام‌ها از همان محل خواندن/ویرایش/حذف می‌کند.

- **کلید دسترسی (`JSONBIN_ACCESS_KEY`) فقط در سرور نگهداری می‌شود** — هیچ‌وقت داخل کد فرانت‌اند، HTML یا `import.meta.env` قرار نمی‌گیرد.
- فرانت‌اند فقط با `/api/messages` هم‌مبدأ صحبت می‌کند و سرور Node با هدر `X-Access-Key` به JSONBin وصل می‌شود.

### راه‌اندازی

```bash
npm install

# ۱) متغیرهای محیطی را بسازید
cp .env.example .env
#    سپس JSONBIN_ACCESS_KEY را در .env وارد کنید

# ۲) ساخت Bin (شناسه Bin را خودکار در .env می‌نویسد)
npm run jsonbin:init

# ۳) اجرای development (API داخل همان dev server است)
npm run dev
```

ساختار داده داخل Bin:

```json
{
  "messages": [
    {
      "id": "unique-id",
      "name": "نام کاربر",
      "email": "example@email.com",
      "phone": "09123456789",
      "message": "متن پیام",
      "createdAt": "2026-01-01T10:00:00.000Z",
      "status": "new"
    }
  ]
}
```

### صفحه مدیریت پیام‌ها

آدرس: **`/admin/messages`**

- نمایش پیام‌های `new` بالای لیست (سپس جدیدترین بر اساس تاریخ ارسال)
- نمایش تعداد پیام‌های جدید در بالای صفحه
- مشاهده کامل متن هر پیام
- تغییر وضعیت: `new` / `read` / `answered`
- حذف پیام (با تأیید)
- دکمه Refresh برای دریافت آخرین پیام‌ها
- ریسپانسیو برای موبایل و دسکتاپ

### API سروری `/api/messages`

| متد   | عملکرد                                          |
| ----- | ----------------------------------------------- |
| GET   | خواندن آخرین پیام‌ها از JSONBin (`/latest`)      |
| POST  | افزودن پیام جدید (اعتبارسنجی + محدودیت نرخ)     |
| PATCH | تغییر وضعیت پیام (`{ "id", "status" }`)         |
| DELETE| حذف پیام (`?id=...`)                            |

پیام‌های خطا دارای `code` ماشین‌خوان هستند (`missing_bin_id`، `rate_limited`، …) و فرانت‌اند آن‌ها را بومی‌سازی می‌کند.

### تولید و استقرار

```bash
npm run build     # خروجی تک‌فایل در dist/
npm start         # سرور production: استاتیک + /api/messages (پورت 3000)
```

متغیرهای محیطی موردنیاز در محیط استقرار:

```bash
JSONBIN_ACCESS_KEY=...
JSONBIN_BIN_ID=...
# اختیاری:
PORT=3000
JSONBIN_API_BASE=https://api.jsonbin.io/v3
```

> اگر سایت روی هاست استاتیک (بدون Node) مستقر شود، مسیر `/admin/messages` و API در دسترس نخواهند بود؛ برای این قابلیت‌ها باید `npm start` (یا معادل آن) روی یک محیط Node اجرا شود.

### توسعه بدون دسترسی به JSONBin (اختیاری)

یک شبیه‌ساز محلی JSONBin وجود دارد:

```bash
npm run mock:jsonbin                                  # پورت 4444
JSONBIN_API_BASE=http://127.0.0.1:4444/v3 npm run dev    # استفاده از شبیه‌ساز
```

### دستورات مفید

```bash
npm run dev         # dev server (سایت + API)
npm run build       # بیلد production
npm run preview     # پیش‌نمایش بیلد + API
npm run start       # سرور production
npm run typecheck   # بررسی تایپ‌ها
```

### نکات امنیتی

- کلید دسترسی JSONBin فقط در `.env` (gitignored) و environment سرور نگه داشته می‌شود.
- `.env.example` مقادیر نمونه دارد؛ هرگز `.env` را کامیت نکنید.
- Endpoint عمومی POST برای هر IP در هر دقیقه محدودیت دارد.
- پیشنهاد: برای محیط production می‌توانید روی `/api/messages` یک لایه احراز هویت (مثلاً توکن ادمین) اضافه کنید.
