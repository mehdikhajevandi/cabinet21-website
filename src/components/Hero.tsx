import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import gsap from "gsap";
import KitchenScene from "../three/KitchenScene";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { y: 60, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, []);

  return (
    <section id="top" className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ink">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 1.6]}
          camera={{ position: [0, 1.4, 6.4], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#08090a"]} />
          <Suspense fallback={null}>
            <KitchenScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />

      {/* Animated background gradient blobs */}
      <motion.div
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#cba463]/10 blur-[110px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-[#6b4327]/20 blur-[110px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="section-eyebrow mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-medium uppercase text-[#e0c393] backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#cba463]" />
          Cabinet21 · Kitchen &amp; Cabinet Design Studio
        </motion.span>

        <h1
          ref={headlineRef}
          className="font-display text-5xl leading-[1.05] text-bone sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="word inline-block">Designing</span>{" "}
          <span className="word inline-block text-gradient-gold">Timeless</span>{" "}
          <span className="word inline-block">Kitchens.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="mt-8 max-w-2xl text-balance text-base font-light leading-relaxed text-white/70 sm:text-lg"
        >
          Premium Kitchen &amp; Cabinet Designer specializing in modern, minimalist and luxury
          interiors — crafted with cinematic 3D visualization by Mehdi Khajevandi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.9 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-shine rounded-full bg-bone px-8 py-4 text-sm font-medium uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
          >
            View Portfolio
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-shine rounded-full border border-[#cba463]/60 bg-white/5 px-8 py-4 text-sm font-medium uppercase tracking-widest text-[#e0c393] backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-[#cba463]/10"
          >
            Get Free Design Consultation
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="h-10 w-px overflow-hidden bg-white/20">
            <motion.div
              className="h-4 w-px bg-[#cba463]"
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
