import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "../data/projects";

const sizeClasses: Record<Project["size"], string> = {
  wide: "sm:col-span-2 aspect-[16/10]",
  tall: "aspect-[3/4] sm:row-span-2",
  square: "aspect-square",
};

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02,1.02,1.02)`,
    });
  }

  function handleMouseLeave() {
    setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 ${sizeClasses[project.size]}`}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: "transform 0.35s ease-out" }}
    >
      <img
        src={project.image}
        alt={`${project.title} — ${project.style} kitchen in ${project.location}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full scale-110 object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-100 transition-all duration-500 group-hover:translate-y-0 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#e0c393]">{project.style}</p>
        <h3 className="mt-2 font-display text-2xl text-bone sm:text-3xl">{project.title}</h3>
        <p className="mt-1 text-xs text-white/60">{project.location}</p>

        <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-24 group-hover:opacity-100">
          <p className="text-xs text-white/50">{project.materials}</p>
          <button
            onClick={() => onOpen(project)}
            className="btn-shine mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-bone backdrop-blur transition-colors hover:border-[#cba463] hover:text-[#e0c393]"
          >
            View Project
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-widest text-white/70 backdrop-blur">
        {project.year}
      </span>
    </motion.div>
  );
}
