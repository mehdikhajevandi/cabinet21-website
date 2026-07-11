import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/projects";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-3xl md:grid-cols-2"
          >
            <button
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
            >
              ✕
            </button>
            <div className="h-64 md:h-full">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#e0c393]">
                {project.style} · {project.year}
              </p>
              <h3 className="mt-3 font-display text-3xl text-bone sm:text-4xl">{project.title}</h3>

              <div className="mt-6 space-y-4 text-sm text-white/60">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">Materials</p>
                  <p className="mt-1 text-white/75">{project.materials}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">Location</p>
                  <p className="mt-1 text-white/75">{project.location}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">Style</p>
                  <p className="mt-1 text-white/75">{project.style}</p>
                </div>
              </div>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  setTimeout(
                    () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }),
                    200
                  );
                }}
                className="btn-shine mt-8 inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
              >
                Start a Similar Project →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
