import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import portfolioData from "../data/portfolio.json";

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<
    (typeof portfolioData)[typeof lang]["items"][number] | null
  >(null);

  const items = useMemo(() => portfolioData[lang].items, [lang]);

  return (
    <section id="portfolio" className="relative bg-noir py-24 sm:py-32">
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
              {t.portfolio.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#b8935a]" />
          </div>
          <h2 className="serif-heading mb-5 text-4xl font-semibold text-beige-light sm:text-5xl">
            {t.portfolio.title}
          </h2>
          <p className="text-beige/70">{t.portfolio.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.15 }}
            >
              <TiltCard className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[16/11]">
                <div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="relative h-full w-full"
                >
                  <motion.img
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    loading="lazy"
                    animate={{ scale: active === i ? 1.08 : 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-[#e0bd85]/50" />

                  <div className="absolute top-5 flex w-full justify-between px-5 start-0">
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-wider text-beige-light uppercase backdrop-blur-md">
                      {lang === "fa" ? item.categoryFa : item.category}
                    </span>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ y: active === i ? 0 : 12, opacity: active === i ? 1 : 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-0 w-full p-6 sm:p-7"
                  >
                    <h3 className="serif-heading mb-2 text-2xl font-semibold text-beige-light sm:text-3xl">
                      {item.title}
                    </h3>
                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-beige/70">
                      <span>
                        {t.portfolio.material}: <span className="text-[#e0bd85]">{item.material}</span>
                      </span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedProject(item)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e0bd85]/50 bg-[#e0bd85]/10 px-5 py-2 text-xs font-semibold tracking-wide text-[#e0bd85] backdrop-blur-md transition-colors hover:bg-[#e0bd85]/20"
                      >
                        {t.portfolio.viewProject}
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-[#b8935a]/30 bg-[#111111] shadow-2xl shadow-black/60"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-xl text-beige-light transition hover:bg-black/70"
                aria-label="Close project"
              >
                ×
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <img src={selectedProject.image} alt={selectedProject.title} className="h-full min-h-[280px] w-full object-cover" />

                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e0bd85]">
                      {lang === "fa" ? selectedProject.categoryFa : selectedProject.category}
                    </p>
                    <h3 className="serif-heading text-3xl font-semibold text-beige-light">
                      {selectedProject.title}
                    </h3>
                    <p className="text-sm leading-7 text-beige/70">{selectedProject.description}</p>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-beige/80">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-beige/50">{t.portfolio.material}</span>
                      <span className="font-medium text-[#e0bd85]">{selectedProject.material}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-beige/50">{lang === "fa" ? "موقعیت" : "Location"}</span>
                      <span className="font-medium">{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-beige/50">{lang === "fa" ? "سال" : "Year"}</span>
                      <span className="font-medium">{selectedProject.year}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-beige/50">{lang === "fa" ? "حوزه پروژه" : "Scope"}</span>
                      <span className="font-medium">{selectedProject.scope}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#e0bd85]">
                      {lang === "fa" ? "نکات برجسته" : "Highlights"}
                    </h4>
                    <ul className="space-y-2 text-sm text-beige/75">
                      {selectedProject.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="mt-1 text-[#e0bd85]">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
