import { PiInstagramLogoDuotone, PiPhoneCallDuotone } from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-noir py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 lg:flex-row lg:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b8935a]/50 text-sm font-semibold text-gradient-gold serif-heading">
            21
          </span>
          <span className="text-sm font-semibold tracking-[0.15em] text-beige-light en-only">CABINET21</span>
          <span className="fa-only text-sm font-bold">کابینت ۲۱</span>
        </div>

        <p className="text-center text-xs text-beige/50">
          © {year} Cabinet21 — {t.footer.rights}
        </p>

        <div className="flex items-center gap-4">
          <a
            href="tel:+989115763911"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-beige/70 transition-colors hover:border-[#e0bd85]/50 hover:text-[#e0bd85]"
            aria-label="phone"
          >
            <PiPhoneCallDuotone />
          </a>
          <a
            href="https://instagram.com/cabinet.21"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-beige/70 transition-colors hover:border-[#e0bd85]/50 hover:text-[#e0bd85]"
            aria-label="instagram"
          >
            <PiInstagramLogoDuotone />
          </a>
        </div>
      </div>
      <p className="mt-6 text-center text-[11px] text-beige/30">{t.footer.designer}</p>
    </footer>
  );
}
