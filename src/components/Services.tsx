import { motion } from "framer-motion";

const services = [
  {
    title: "Kitchen Design",
    description:
      "Full concept-to-completion kitchen design blending ergonomic layouts with sculptural, timeless forms.",
    icon: "01",
  },
  {
    title: "Cabinet Design",
    description:
      "Bespoke cabinetry crafted from premium oak, walnut and lacquered finishes, engineered to last generations.",
    icon: "02",
  },
  {
    title: "Interior Visualization",
    description:
      "Photorealistic interior visualization that lets you experience your space long before construction begins.",
    icon: "03",
  },
  {
    title: "3D Rendering",
    description:
      "Cinematic, render-quality imagery and walkthroughs used to refine every material and lighting decision.",
    icon: "04",
  },
  {
    title: "Custom Furniture Design",
    description:
      "One-of-a-kind furniture pieces designed to complement architectural details and elevate everyday living.",
    icon: "05",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-xs font-medium uppercase text-[#cba463]">
            What We Do
          </span>
          <h2 className="mt-4 font-display text-4xl text-bone sm:text-5xl">
            Services crafted for <span className="text-gradient-gold">discerning spaces</span>
          </h2>
          <p className="mt-5 text-base font-light text-white/60">
            Every project begins with listening — followed by precise design, engineering, and
            visualization to make sure the final result feels inevitable.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 transition-colors duration-500 hover:border-[#cba463]/40 ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#cba463]/0 blur-3xl transition-all duration-700 group-hover:bg-[#cba463]/15" />
              <span className="font-display text-5xl text-white/10 transition-colors duration-500 group-hover:text-[#cba463]/40">
                {service.icon}
              </span>
              <h3 className="mt-6 font-display text-2xl text-bone">{service.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/55">
                {service.description}
              </p>
              <div className="mt-6 h-px w-10 bg-[#cba463]/50 transition-all duration-500 group-hover:w-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
