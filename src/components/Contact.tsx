import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiPhoneCallDuotone, PiInstagramLogoDuotone, PiPaperPlaneTiltDuotone, PiSpinnerGapDuotone, PiWarningCircleDuotone, PiCheckCircleDuotone } from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";
import { submitMessage } from "../lib/api";

const PHONE = "09115763911";
const PHONE_INTL = "+989115763911";
const INSTAGRAM = "https://instagram.com/cabinet.21";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({ name: "", phone: "", message: "", website: "" });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      await submitMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        lang,
        website: form.website, // honeypot — must stay empty for real visitors
      });
      setStatus("sent");
      setSent(true);
      setForm({ name: "", phone: "", message: "", website: "" });
      setTimeout(() => {
        setSent(false);
        setStatus("idle");
      }, 6000);
    } catch {
      setStatus("error");
    }
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
            className="glass-panel relative flex flex-col gap-5 rounded-2xl p-8 lg:col-span-3"
          >
            <h3 className="serif-heading mb-1 text-2xl font-semibold text-beige-light">
              {t.contact.formTitle}
            </h3>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={update("name")}
              maxLength={80}
              placeholder={t.contact.namePh}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />
            <input
              required
              type="tel"
              name="phone"
              value={form.phone}
              onChange={update("phone")}
              maxLength={40}
              placeholder={t.contact.phonePh}
              dir="ltr"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />
            <textarea
              required
              rows={4}
              name="message"
              value={form.message}
              onChange={update("message")}
              maxLength={2000}
              placeholder={t.contact.messagePh}
              className="resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
            />

            {/* Honeypot field — invisible to humans, catches most spam bots */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={update("website")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0"
              style={{ pointerEvents: "none" }}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-6 py-3.5 text-sm font-semibold text-[#0a0908] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#b8935a]/20 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {status === "sending" ? (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <PiSpinnerGapDuotone className="animate-spin text-lg" />
                    {t.contact.sending}
                  </motion.span>
                ) : sent ? (
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

            <AnimatePresence>
              {status === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200"
                >
                  <PiCheckCircleDuotone className="shrink-0 text-base" />
                  {t.contact.sentNote}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-xs text-red-200"
                >
                  <PiWarningCircleDuotone className="shrink-0 text-base" />
                  {t.contact.errorNote}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
