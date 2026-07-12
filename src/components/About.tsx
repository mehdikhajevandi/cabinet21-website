import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative overflow-hidden bg-noir py-24 sm:py-32">
      <div className="pointer-events-none absolute -top-40 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#b8935a]/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <img
              src="/images/about-kitchen.jpg"
              alt="Cabinet21 walnut cabinetry detail"
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="glass-panel absolute -bottom-8 -end-6 max-w-[240px] rounded-2xl p-5 shadow-2xl">
            <p className="serif-heading text-3xl font-semibold text-gradient-gold">9+</p>
            <p className="mt-1 text-xs leading-relaxed text-beige/70">{t.about.designer}</p>
            <p className="text-sm font-medium text-beige-light">{t.about.designerName}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#b8935a]" />
            <span className="text-xs font-medium tracking-[0.25em] text-[#e0bd85] uppercase">
              {t.about.eyebrow}
            </span>
          </div>
          <h2 className="serif-heading mb-6 text-4xl font-semibold text-beige-light sm:text-5xl">
            {t.about.title}
          </h2>
          <p className="mb-10 max-w-xl text-lg leading-loose text-beige/75">{t.about.text}</p>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {t.about.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-s border-white/10 ps-4"
              >
                <p className="serif-heading text-2xl font-semibold text-gradient-gold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-beige/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
