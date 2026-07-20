import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiPhoneCallDuotone, PiInstagramLogoDuotone, PiPaperPlaneTiltDuotone } from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";

const PHONE = "09115763911";
const PHONE_INTL = "+989115763911";
const INSTAGRAM = "https://instagram.com/cabinet.21";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-noir py-24 sm:py-32">
      <div className="absolute inset-0">
        <img src="/images/contact-bg.jpg" alt="" className="h-full w-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir via-noir/90 to-noir" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b8935a]" />
            <span className="text-xs font-medium tracking-[0.25em] text-[#e0bd85] uppercase">
              {t.contact.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#b8935a]" />
          </div>
          <h2 className="serif-heading mb-5 text-4xl font-semibold text-beige-light sm:text-5xl">
            {t.contact.title}
          </h2>
          <p className="text-beige/70">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: lang === "fa" ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="glass-panel flex flex-col justify-between gap-8 rounded-2xl p-8 lg:col-span-2"
          >
            <div>
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl border border-[#b8935a]/30 bg-[#b8935a]/5 text-2xl text-[#e0bd85]">
                21
              </div>
              <h3 className="serif-heading mt-4 text-2xl font-semibold text-beige-light">Cabinet21</h3>
              <p className="mt-2 text-sm text-beige/60">{t.about.designerName}</p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`tel:${PHONE_INTL}`}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-300 hover:border-[#b8935a]/40 hover:bg-white/10 hover:shadow-lg hover:shadow-[#b8935a]/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b8935a]/10 text-[#e0bd85] transition-transform duration-300 group-hover:scale-110">
                    <PiPhoneCallDuotone className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[11px] tracking-wide text-beige/50 uppercase">{t.contact.phoneLabel}</p>
                    <p className="font-medium text-beige-light" dir="ltr">{PHONE}</p>
                  </div>
                </div>
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-300 hover:border-[#b8935a]/40 hover:bg-white/10 hover:shadow-lg hover:shadow-[#b8935a]/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b8935a]/10 text-[#e0bd85] transition-transform duration-300 group-hover:scale-110">
                    <PiInstagramLogoDuotone className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[11px] tracking-wide text-beige/50 uppercase">{t.contact.instaLabel}</p>
                    <p className="font-medium text-beige-light" dir="ltr">@cabinet.21</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_INTL}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-5 py-3 text-sm font-semibold text-[#0a0908] transition-transform hover:scale-105"
              >
                {t.contact.callNow}
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-beige-light transition-colors hover:bg-white/10"
              >
                {t.contact.instagram}
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: lang === "fa" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="glass-panel flex flex-col gap-5 rounded-2xl p-8 lg:col-span-3"
          >
            <h3 className="serif-heading mb-1 text-2xl font-semibold text-beige-light">
              {t.contact.formTitle}
            </h3>
            <input
              required
              type="text"
              placeholder={t.contact.namePh}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />
            <input
              required
              type="tel"
              placeholder={t.contact.phonePh}
              dir="ltr"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />
            <textarea
              required
              rows={4}
              placeholder={t.contact.messagePh}
              className="resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />
            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-6 py-3.5 text-sm font-semibold text-[#0a0908] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#b8935a]/20 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="text-lg"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2"
                  >
                    <PiPaperPlaneTiltDuotone className="text-lg" />
                    {t.contact.send}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
