import { motion } from "framer-motion";
import {
  PiCookingPotDuotone,
  PiCubeDuotone,
  PiArmchairDuotone,
  PiSquaresFourDuotone,
  PiHammerDuotone,
} from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";

const icons = [PiCookingPotDuotone, PiSquaresFourDuotone, PiCubeDuotone, PiArmchairDuotone, PiHammerDuotone];

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative bg-graphite py-24 sm:py-32">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 h-80 w-80 rounded-full bg-[#b8935a]/5 blur-[100px]" />
        <div className="absolute -bottom-40 -end-40 h-80 w-80 rounded-full bg-[#b8935a]/5 blur-[100px]" />
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
              {t.services.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#b8935a]" />
          </div>
          <h2 className="serif-heading mb-5 text-4xl font-semibold text-beige-light sm:text-5xl">
            {t.services.title}
          </h2>
          <p className="text-beige/70">{t.services.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
                whileHover={{ y: -8 }}
                className={`group glass-panel relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:border-[#b8935a]/40 hover:shadow-xl hover:shadow-[#b8935a]/5 ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Glow effect on hover */}
                <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-[#b8935a]/0 blur-2xl transition-all duration-700 group-hover:bg-[#b8935a]/15 group-hover:scale-150" />

                {/* Number badge */}
                <span className="absolute top-6 end-6 text-[10px] font-bold tracking-wider text-white/10 transition-colors duration-500 group-hover:text-[#e0bd85]/30">
                  0{i + 1}
                </span>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#b8935a]/30 bg-[#b8935a]/5 text-3xl text-[#e0bd85] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#b8935a]/60 group-hover:shadow-lg group-hover:shadow-[#b8935a]/10">
                  <Icon />
                </div>
                <h3 className="serif-heading mb-3 text-xl font-semibold text-beige-light">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-beige/65">{item.desc}</p>
                <div className="mt-6 h-px w-0 bg-gradient-to-r from-[#e0bd85] to-transparent transition-all duration-700 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
