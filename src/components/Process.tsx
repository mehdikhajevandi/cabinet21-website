import { motion } from "framer-motion";
import { PiPhoneCallDuotone, PiPencilLineDuotone, PiCubeTransparentDuotone, PiCheckCircleDuotone } from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";

const icons = [PiPhoneCallDuotone, PiPencilLineDuotone, PiCubeTransparentDuotone, PiCheckCircleDuotone];

export default function Process() {
  const { t } = useLanguage();

  return (
    <section id="process" className="relative overflow-hidden bg-graphite py-24 sm:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 start-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b8935a]/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b8935a]" />
            <span className="text-xs font-medium tracking-[0.25em] text-[#e0bd85] uppercase">
              {t.process.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#b8935a]" />
          </div>
          <h2 className="serif-heading mb-5 text-4xl font-semibold text-beige-light sm:text-5xl">
            {t.process.title}
          </h2>
          <p className="text-beige/70">{t.process.subtitle}</p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line */}
          <div className="absolute top-9 hidden h-px w-full bg-gradient-to-r from-transparent via-[#b8935a]/40 to-transparent lg:block" />

          {t.process.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Pulse ring on hover */}
                <div className="relative z-10 mb-6">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#b8935a]/40 bg-noir text-3xl text-[#e0bd85] shadow-lg shadow-black/40 transition-all duration-500 group-hover:border-[#e0bd85]/60 group-hover:shadow-[#e0bd85]/10 group-hover:shadow-xl group-hover:scale-110">
                    <Icon />
                    <span className="absolute -end-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#e0bd85] to-[#b8935a] text-[11px] font-bold text-[#0a0908]">
                      {i + 1}
                    </span>
                  </div>
                </div>
                <h3 className="serif-heading mb-2 text-lg font-semibold text-beige-light transition-colors duration-300 group-hover:text-[#e0bd85]">
                  {step.title}
                </h3>
                <p className="max-w-[220px] text-sm leading-relaxed text-beige/60">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
