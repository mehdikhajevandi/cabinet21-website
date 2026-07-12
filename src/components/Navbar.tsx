import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const sections = ["home", "about", "services", "portfolio", "process", "contact"] as const;

export default function Navbar() {
  const { t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass-panel border-b border-white/10 py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b8935a]/50 text-sm font-semibold text-gradient-gold serif-heading">
            21
          </span>
          <span className="text-lg font-semibold tracking-[0.15em] text-beige-light en-only" style={{ fontFamily: "var(--font-serif-en)" }}>
            CABINET21
          </span>
          <span className="fa-only text-lg font-bold tracking-wide">کابینت ۲۱</span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="text-sm font-medium tracking-wide text-beige/80 transition-colors hover:text-[#e0bd85] cursor-pointer"
            >
              {t.nav[s]}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <button
            onClick={() => scrollTo("contact")}
            className="rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-5 py-2 text-sm font-semibold text-[#0a0908] shadow-lg shadow-black/30 transition-transform hover:scale-105 cursor-pointer"
          >
            {t.nav.cta}
          </button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 cursor-pointer"
            aria-label="menu"
          >
            <span className={`h-[1.5px] w-5 bg-beige-light transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-beige-light transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="glass-panel mx-4 mt-4 flex flex-col gap-1 rounded-2xl p-4" dir={dir}>
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="rounded-lg px-4 py-3 text-start text-sm font-medium text-beige/90 transition-colors hover:bg-white/5 cursor-pointer"
                >
                  {t.nav[s]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
