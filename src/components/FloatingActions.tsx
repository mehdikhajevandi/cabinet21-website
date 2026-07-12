import { motion } from "framer-motion";
import { PiPhoneCallDuotone, PiInstagramLogoDuotone } from "react-icons/pi";

export default function FloatingActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="fixed bottom-6 z-40 flex flex-col gap-3 end-6"
    >
      <a
        href="https://instagram.com/cabinet.21"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-noir/80 text-lg text-beige-light shadow-lg shadow-black/40 backdrop-blur-md transition-transform hover:scale-110 hover:text-[#e0bd85]"
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
