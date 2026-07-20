import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-noir"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#b8935a]/50 text-2xl font-semibold text-gradient-gold serif-heading">
              21
            </div>
            {/* Spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-6px] rounded-full border border-transparent border-t-[#e0bd85]/40"
            />
          </motion.div>

          {/* Text */}
          <div className="flex flex-col items-center gap-3">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="serif-heading text-2xl font-semibold tracking-[0.15em] text-beige-light"
            >
              CABINET21
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-[11px] tracking-[0.3em] text-beige/40 uppercase"
            >
              Luxury Kitchen Design
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="relative h-[1px] w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-full bg-gradient-to-r from-[#e0bd85] via-[#b8935a] to-[#8a6141]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
