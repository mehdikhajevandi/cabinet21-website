import { useLanguage } from "../i18n/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative flex items-center rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md">
      {(["fa", "en"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className="relative px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-300 cursor-pointer"
          style={{ color: lang === code ? "#0a0908" : "#ded2bd" }}
          aria-label={code === "fa" ? "فارسی" : "English"}
        >
          {lang === code && (
            <motion.span
              layoutId="lang-pill"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#e0bd85,#b8935a)]"
            />
          )}
          <span className="relative z-10">{code === "fa" ? "FA" : "EN"}</span>
        </button>
      ))}
    </div>
  );
}
