import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-noir"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b8935a]/50 text-xl font-semibold text-gradient-gold serif-heading"
          >
            21
          </motion.div>
          <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute h-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a]"
            />
          </div>
          <span className="text-[11px] tracking-[0.3em] text-beige/50 uppercase">Cabinet21</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
