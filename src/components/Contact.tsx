import { useState } from "react";
import { motion } from "framer-motion";

const budgets = ["$25k – $50k", "$50k – $100k", "$100k – $250k", "$250k+"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [budget, setBudget] = useState(budgets[1]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-[#cba463]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-xs font-medium uppercase text-[#cba463]">
            Get In Touch
          </span>
          <h2 className="mt-4 font-display text-4xl text-bone sm:text-5xl">
            Let's Design Your <span className="text-gradient-gold">Dream Kitchen</span>
          </h2>
          <p className="mt-5 text-base font-light text-white/60">
            Share a few details about your project and Mehdi will personally follow up to
            schedule your complimentary design consultation.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="glass-strong mt-14 rounded-[2rem] p-6 sm:p-10"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#cba463]/60 text-2xl text-[#e0c393]">
                ✓
              </div>
              <h3 className="font-display text-3xl text-bone">Thank you.</h3>
              <p className="mt-3 max-w-sm text-sm font-light text-white/60">
                Your message has been received. Mehdi will reach out within 24 hours to schedule
                your consultation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-white/70 hover:border-[#cba463]/50 hover:text-[#e0c393]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-white/50">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Appleseed"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-bone outline-none transition-colors placeholder:text-white/30 focus:border-[#cba463]/60"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-white/50">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@email.com"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-bone outline-none transition-colors placeholder:text-white/30 focus:border-[#cba463]/60"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="details" className="text-xs uppercase tracking-widest text-white/50">
                  Project Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={5}
                  placeholder="Tell us about your space, timeline, and vision..."
                  className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-bone outline-none transition-colors placeholder:text-white/30 focus:border-[#cba463]/60"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <span className="text-xs uppercase tracking-widest text-white/50">Budget</span>
                <div className="flex flex-wrap gap-3">
                  {budgets.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-full border px-5 py-2.5 text-xs uppercase tracking-wide transition-colors ${
                        budget === b
                          ? "border-[#cba463] bg-[#cba463]/15 text-[#e0c393]"
                          : "border-white/15 text-white/60 hover:border-white/30"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="btn-shine w-full rounded-full bg-bone py-4 text-sm font-medium uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 sm:w-auto sm:px-12"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
