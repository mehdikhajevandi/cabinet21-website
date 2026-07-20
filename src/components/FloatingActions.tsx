import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { PiPhoneCallDuotone, PiInstagramLogoDuotone, PiArrowUpDuotone } from "react-icons/pi";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowTop(latest > 600);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="fixed bottom-6 z-40 flex flex-col gap-3 end-6"
    >
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-noir/80 text-lg text-beige-light shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:scale-110 hover:border-[#e0bd85]/50 hover:text-[#e0bd85]"
          >
            <PiArrowUpDuotone />
          </motion.button>
        )}
      </AnimatePresence>
      <a
        href="https://instagram.com/cabinet.21"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-noir/80 text-lg text-beige-light shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:scale-110 hover:border-[#e0bd85]/50 hover:text-[#e0bd85]"
      >
        <PiInstagramLogoDuotone />
      </a>
      <a
        href="tel:+989115763911"
        aria-label="Call"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#e0bd85] to-[#b8935a] text-lg text-[#0a0908] shadow-lg shadow-black/40 transition-transform hover:scale-110"
      >
        <PiPhoneCallDuotone />
      </a>
    </motion.div>
  );
}
