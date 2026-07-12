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
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
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
                className={`group glass-panel relative overflow-hidden rounded-2xl p-8 transition-colors duration-500 hover:border-[#b8935a]/40 ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-[#b8935a]/0 blur-2xl transition-colors duration-500 group-hover:bg-[#b8935a]/15" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#b8935a]/30 bg-[#b8935a]/5 text-3xl text-[#e0bd85] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
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
