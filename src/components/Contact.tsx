import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiCircleNotchDuotone,
  PiPhoneCallDuotone,
  PiInstagramLogoDuotone,
  PiPaperPlaneTiltDuotone,
} from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";
import { createMessage } from "../api/messages";
import { apiErrorMessage } from "../api/errorMessage";

const PHONE = "09115763911";
const PHONE_INTL = "+989115763911";
const INSTAGRAM = "https://instagram.com/cabinet.21";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface FormValues {
  name: string;
  phone: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = { name: "", phone: "", message: "" };

const PHONE_RE = /^(?:\+98|0098|98|0)?9\d{9}$/;

export default function Contact() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const successTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimer.current !== null) window.clearTimeout(successTimer.current);
    };
  }, []);

  const validate = (values: FormValues): FormErrors => {
    const next: FormErrors = {};

    if (values.name.trim().length < 2) next.name = t.contact.errName;

    const phone = values.phone.replace(/[\s\-().]/g, "");
    if (!PHONE_RE.test(phone)) next.phone = t.contact.errPhone;

    if (values.message.trim().length < 5) next.message = t.contact.errMessage;

    return next;
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setSubmitError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return; // no double submit

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus("submitting");
    setSubmitError(null);

    try {
      await createMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });

      setForm(EMPTY_FORM);
      setStatus("success");
      if (successTimer.current !== null) window.clearTimeout(successTimer.current);
      successTimer.current = window.setTimeout(() => {
        setStatus((current) => (current === "success" ? "idle" : current));
      }, 6000);
    } catch (error) {
      setSubmitError(apiErrorMessage(error, t, t.contact.sendError));
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";
  const inputClass = (invalid?: string) =>
    [
      "rounded-xl border bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5",
      invalid ? "border-red-400/60" : "border-white/10",
    ].join(" ");

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
            noValidate
            initial={{ opacity: 0, x: lang === "fa" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="glass-panel flex flex-col gap-5 rounded-2xl p-8 lg:col-span-3"
          >
            <h3 className="serif-heading mb-1 text-2xl font-semibold text-beige-light">
              {t.contact.formTitle}
            </h3>

            <div className="flex flex-col gap-1.5">
              <input
                required
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={t.contact.namePh}
                aria-invalid={Boolean(errors.name)}
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder={t.contact.phonePh}
                dir="ltr"
                aria-invalid={Boolean(errors.phone)}
                className={inputClass(errors.phone)}
              />
              {errors.phone && <p className="text-xs text-red-300" dir="auto">{errors.phone}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <textarea
                required
                rows={4}
                name="message"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder={t.contact.messagePh}
                aria-invalid={Boolean(errors.message)}
                className={`resize-none ${inputClass(errors.message)}`}
              />
              {errors.message && <p className="text-xs text-red-300">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-6 py-3.5 text-sm font-semibold text-[#0a0908] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#b8935a]/20 disabled:cursor-wait disabled:scale-100 disabled:opacity-75"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <PiCircleNotchDuotone className="animate-spin text-lg" />
                    {t.contact.sending}
                  </motion.span>
                ) : status === "success" ? (
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

            <div aria-live="polite">
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    className="mt-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm font-medium text-emerald-200"
                  >
                    {t.contact.sendSuccess}
                  </motion.p>
                )}
                {status === "error" && submitError && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="mt-1 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-medium text-red-200"
                  >
                    {submitError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
