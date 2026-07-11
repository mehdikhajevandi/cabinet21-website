import { motion } from "framer-motion";

const stats = [
  { value: "12+", label: "Years of Experience" },
  { value: "180+", label: "Kitchens Designed" },
  { value: "40+", label: "Luxury Residences" },
  { value: "100%", label: "Bespoke 3D Visualized" },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-charcoal py-28 md:py-36">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#6b4327]/20 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="group relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src="/images/about-mehdi.jpg"
              alt="Design studio workspace of Mehdi Khajevandi, featuring wood material samples and 3D kitchen renderings"
              loading="lazy"
              className="h-full w-full scale-105 object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="glass-strong absolute -bottom-8 -right-4 max-w-[240px] rounded-2xl p-5 shadow-2xl shadow-black/40 sm:-right-10">
            <p className="font-display text-3xl text-[#e0c393]">15+</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/60">
              Years crafting timeless interiors
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="section-eyebrow text-xs font-medium uppercase text-[#cba463]">
            About the Designer
          </span>
          <h2 className="mt-4 font-display text-4xl leading-tight text-bone sm:text-5xl">
            Meet <span className="text-gradient-gold">Mehdi Khajevandi</span>
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-white/70">
            Mehdi Khajevandi is a professional kitchen and cabinet designer focused on creating
            functional, elegant, and realistic interior spaces using advanced 3D visualization.
          </p>
          <p className="mt-4 text-base font-light leading-relaxed text-white/50">
            With a rare balance of architectural precision and artistic intuition, Mehdi partners
            with homeowners, architects, and builders to translate ambitious visions into
            timeless, livable spaces — every cabinet line, material pairing, and light source
            considered down to the millimeter.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="border-l border-white/10 pl-4"
              >
                <p className="font-display text-2xl text-[#e0c393] sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
