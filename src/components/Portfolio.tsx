import { useState } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function Portfolio() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="relative bg-charcoal py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="section-eyebrow text-xs font-medium uppercase text-[#cba463]">
              Selected Work
            </span>
            <h2 className="mt-4 font-display text-4xl text-bone sm:text-5xl">
              A Portfolio of <span className="text-gradient-gold">Elevated Spaces</span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-sm text-sm font-light text-white/50"
          >
            Each project is a bespoke collaboration — engineered in 3D, refined by hand, and
            built to last a lifetime.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
