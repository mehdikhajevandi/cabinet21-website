export type Lang = "fa" | "en";

export const translations: Record<Lang, any> = {
  fa: {
    dir: "rtl" as const,
    nav: {
      home: "خانه",
      about: "درباره ما",
      services: "خدمات",
      portfolio: "نمونه‌کارها",
      process: "فرآیند کار",
      contact: "تماس",
      cta: "مشاوره رایگان",
    },
    hero: {
      eyebrow: "استودیو طراحی کابینت ۲۱",
      title: "طراحی آشپزخانه‌ای فراتر از یک فضا",
      subtitle:
        "طراحی کابینت و آشپزخانه‌های مدرن با جزئیات دقیق و رندرهای واقع‌گرایانه",
      ctaPrimary: "مشاهده پروژه‌ها",
      ctaSecondary: "دریافت مشاوره رایگان",
      scroll: "پیمایش",
    },
    about: {
      eyebrow: "درباره ما",
      title: "Cabinet21",
      text: "کابینت ۲۱ با تمرکز بر طراحی مدرن، زیبایی‌شناسی معماری و اجرای دقیق، فضاهایی خلق می‌کند که ترکیبی از عملکرد و زیبایی هستند.",
      designer: "طراح و مدیر استودیو",
      designerName: "مهدی خواجه‌وندی",
      stats: [
        { value: "+120", label: "پروژه اجرا شده" },
        { value: "9", label: "سال تجربه" },
        { value: "100%", label: "رضایت مشتریان" },
        { value: "24/7", label: "پشتیبانی مشاوره" },
      ],
    },
    services: {
      eyebrow: "خدمات",
      title: "خدمات تخصصی استودیو",
      subtitle: "از ایده تا اجرا، تمام مراحل طراحی با دقت و ظرافت انجام می‌شود",
      items: [
        {
          title: "طراحی آشپزخانه",
          desc: "طراحی اختصاصی آشپزخانه متناسب با سبک زندگی و معماری فضای شما",
        },
        {
          title: "طراحی کابینت",
          desc: "کابینت‌های سفارشی با متریال درجه یک و جزئیات دقیق اجرایی",
        },
        {
          title: "مدل‌سازی و رندر سه‌بعدی",
          desc: "پیش‌نمایش واقع‌گرایانه از پروژه شما پیش از اجرا",
        },
        {
          title: "طراحی داخلی",
          desc: "طراحی هماهنگ فضای داخلی با رویکرد مدرن و لوکس",
        },
        {
          title: "طراحی مبلمان سفارشی",
          desc: "ساخت مبلمان اختصاصی متناسب با هویت طراحی پروژه",
        },
      ],
    },
    portfolio: {
      eyebrow: "نمونه‌کارها",
      title: "گالری پروژه‌های منتخب",
      subtitle: "نگاهی به آثار برگزیده استودیو کابینت ۲۱",
      viewProject: "مشاهده پروژه",
      material: "متریال",
      style: "سبک طراحی",
      items: [
        {
          category: "Modern Kitchen",
          categoryFa: "آشپزخانه مدرن",
          title: "پروژه مدرن ولنجک",
          material: "والنوت طبیعی و کوارتز",
          image: "/images/portfolio-modern.jpg",
        },
        {
          category: "Luxury Kitchen",
          categoryFa: "آشپزخانه لوکس",
          title: "پروژه لوکس زعفرانیه",
          material: "مرمر و برنج",
          image: "/images/portfolio-luxury.jpg",
        },
        {
          category: "Minimal Kitchen",
          categoryFa: "آشپزخانه مینیمال",
          title: "پروژه مینیمال الهیه",
          material: "چوب روشن و لاکوبل",
          image: "/images/portfolio-minimal.jpg",
        },
        {
          category: "Neoclassical Kitchen",
          categoryFa: "آشپزخانه نئوکلاسیک",
          title: "پروژه نئوکلاسیک نیاوران",
          material: "چوب کلاسیک و طلایی",
          image: "/images/portfolio-neoclassical.jpg",
        },
      ],
    },
    process: {
      eyebrow: "فرآیند کار",
      title: "مسیر طراحی تا اجرا",
      subtitle: "فرآیندی شفاف، حرفه‌ای و مبتنی بر دقت در جزئیات",
      steps: [
        { title: "مشاوره", desc: "شناخت نیاز، سبک زندگی و بودجه پروژه شما" },
        { title: "طراحی اولیه", desc: "ارائه ایده‌های اولیه و کانسپت طراحی" },
        { title: "مدل‌سازی و رندر", desc: "ساخت مدل سه‌بعدی و رندر واقع‌گرایانه" },
        { title: "اجرای نهایی", desc: "ساخت و نصب با نظارت دقیق کیفیت" },
      ],
    },
    contact: {
      eyebrow: "تماس با ما",
      title: "بیایید فضای رویایی شما را طراحی کنیم",
      subtitle: "همین حالا با استودیو کابینت ۲۱ در ارتباط باشید",
      phoneLabel: "تماس تلفنی",
      instaLabel: "اینستاگرام",
      callNow: "تماس بگیرید",
      instagram: "اینستاگرام",
      consultation: "مشاوره رایگان",
      formTitle: "درخواست مشاوره رایگان",
      namePh: "نام و نام خانوادگی",
      phonePh: "شماره تماس",
      messagePh: "توضیحات پروژه شما",
      send: "ارسال درخواست",
    },
    footer: {
      rights: "تمامی حقوق برای استودیو کابینت ۲۱ محفوظ است.",
      designer: "طراح: مهدی خواجه‌وندی",
    },
  },
  en: {
    dir: "ltr" as const,
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      process: "Process",
      contact: "Contact",
      cta: "Free Consultation",
    },
    hero: {
      eyebrow: "Cabinet21 Design Studio",
      title: "Designing Kitchens Beyond Spaces",
      subtitle:
        "Luxury kitchen and cabinet design with realistic visualization and exceptional details",
      ctaPrimary: "View Projects",
      ctaSecondary: "Free Consultation",
      scroll: "Scroll",
    },
    about: {
      eyebrow: "About Us",
      title: "Cabinet21",
      text: "Cabinet21 creates modern kitchen spaces where functionality meets timeless design, blending architectural aesthetics with meticulous execution.",
      designer: "Designer & Studio Director",
      designerName: "Mehdi Khajevandi",
      stats: [
        { value: "+120", label: "Completed Projects" },
        { value: "9", label: "Years Experience" },
        { value: "100%", label: "Client Satisfaction" },
        { value: "24/7", label: "Consultation Support" },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Our Signature Services",
      subtitle: "From concept to execution, every detail is crafted with precision",
      items: [
        {
          title: "Kitchen Design",
          desc: "Bespoke kitchen design tailored to your lifestyle and architecture",
        },
        {
          title: "Cabinet Design",
          desc: "Custom cabinets crafted from premium materials with precise detailing",
        },
        {
          title: "3D Visualization",
          desc: "Photorealistic previews of your project before execution",
        },
        {
          title: "Interior Design",
          desc: "Cohesive interior spaces with a modern, luxurious approach",
        },
        {
          title: "Custom Furniture",
          desc: "Bespoke furniture pieces aligned with your project's identity",
        },
      ],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Selected Project Gallery",
      subtitle: "A curated look into Cabinet21's finest work",
      viewProject: "View Project",
      material: "Material",
      style: "Design Style",
      items: [
        {
          category: "Modern Kitchen",
          categoryFa: "آشپزخانه مدرن",
          title: "Velenjak Modern Residence",
          material: "Natural Walnut & Quartz",
          image: "/images/portfolio-modern.jpg",
        },
        {
          category: "Luxury Kitchen",
          categoryFa: "آشپزخانه لوکس",
          title: "Zafaraniyeh Luxury Villa",
          material: "Marble & Brass",
          image: "/images/portfolio-luxury.jpg",
        },
        {
          category: "Minimal Kitchen",
          categoryFa: "آشپزخانه مینیمال",
          title: "Elahiyeh Minimal Loft",
          material: "Light Oak & Lacobel",
          image: "/images/portfolio-minimal.jpg",
        },
        {
          category: "Neoclassical Kitchen",
          categoryFa: "آشپزخانه نئوکلاسیک",
          title: "Niavaran Neoclassical Estate",
          material: "Classic Wood & Gold",
          image: "/images/portfolio-neoclassical.jpg",
        },
      ],
    },
    process: {
      eyebrow: "Our Process",
      title: "From Concept to Reality",
      subtitle: "A transparent, professional process built on precision",
      steps: [
        { title: "Consultation", desc: "Understanding your needs, lifestyle and budget" },
        { title: "Concept Design", desc: "Initial ideas and design concepts presented" },
        { title: "3D Visualization", desc: "Photorealistic 3D modeling and rendering" },
        { title: "Final Result", desc: "Precise execution with quality supervision" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's Design Your Dream Space",
      subtitle: "Get in touch with Cabinet21 studio today",
      phoneLabel: "Call Us",
      instaLabel: "Instagram",
      callNow: "Call Now",
      instagram: "Instagram",
      consultation: "Free Consultation",
      formTitle: "Request a Free Consultation",
      namePh: "Full Name",
      phonePh: "Phone Number",
      messagePh: "Tell us about your project",
      send: "Send Request",
    },
    footer: {
      rights: "All rights reserved to Cabinet21 Studio.",
      designer: "Designer: Mehdi Khajevandi",
    },
  },
} as const;

export interface Translations {
  dir: "rtl" | "ltr";
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    process: string;
    contact: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    designer: string;
    designerName: string;
    stats: { value: string; label: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  portfolio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewProject: string;
    material: string;
    style: string;
    items: {
      category: string;
      categoryFa: string;
      title: string;
      material: string;
      image: string;
    }[];
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    phoneLabel: string;
    instaLabel: string;
    callNow: string;
    instagram: string;
    consultation: string;
    formTitle: string;
    namePh: string;
    phonePh: string;
    messagePh: string;
    send: string;
  };
  footer: {
    rights: string;
    designer: string;
  };
}
