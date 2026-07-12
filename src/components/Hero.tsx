import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import HeroScene from "./HeroScene";

export default function Hero() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-noir"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{
          y: bgY,
          x: mouse.x * -12,
          scale: 1.12,
        }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/hero-kitchen.jpg"
          alt="Luxury modern kitchen by Cabinet21"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/50 to-noir" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-transparent to-black/60" />
      <div className="absolute inset-0 z-[1] bg-noir/20" />

      {/* 3D layer */}
      <div
        style={{ transform: `translate(${mouse.x * 8}px, ${mouse.y * 6}px)` }}
        className="pointer-events-none absolute inset-0 z-[2] hidden opacity-70 transition-transform duration-300 ease-out md:block"
      >
        <HeroScene />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-6 flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#e0bd85]" />
          <span className="text-xs font-medium tracking-[0.25em] text-beige/90 uppercase">
            {t.hero.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`serif-heading mb-6 text-4xl leading-[1.25] font-semibold text-beige-light sm:text-5xl md:text-6xl lg:text-7xl ${
            lang === "fa" ? "leading-[1.5]" : ""
          }`}
        >
          {t.hero.title.split(" ").map((word, i) => (
            <span key={i} className="inline-block">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.08 }}
                className="inline-block"
              >
                {word}
                &nbsp;
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mb-10 max-w-2xl text-base leading-relaxed text-beige/80 sm:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#0a0908] shadow-xl shadow-black/40 transition-transform hover:scale-105 cursor-pointer"
          >
            {t.hero.ctaPrimary}
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold tracking-wide text-beige-light backdrop-blur-md transition-colors hover:bg-white/10 cursor-pointer"
          >
            {t.hero.ctaSecondary}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-beige/50 uppercase">{t.hero.scroll}</span>
        <div className="relative h-10 w-[1px] overflow-hidden bg-white/20">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute h-full w-full bg-[#e0bd85]"
          />
        </div>
      </motion.div>
    </section>
  );
}
