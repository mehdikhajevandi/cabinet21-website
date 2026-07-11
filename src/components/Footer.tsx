const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const socials = ["Instagram", "Pinterest", "LinkedIn"];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink px-6 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cba463]/50 font-display text-lg text-[#e0c393]">
                C21
              </span>
              <span className="font-display text-xl tracking-wide text-bone">
                Cabinet<span className="text-[#cba463]">21</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/50">
              Premium kitchen and cabinet design studio crafting timeless, minimalist, and luxury
              interiors through cinematic 3D visualization.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Navigate</p>
            <ul className="mt-4 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-white/60 transition-colors hover:text-[#e0c393]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Connect</p>
            <ul className="mt-4 space-y-3">
              {socials.map((s) => (
                <li key={s}>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-[#e0c393]">
                    {s}
                  </a>
                </li>
              ))}
              <li className="text-sm text-white/60">hello@cabinet21.design</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Cabinet21. All rights reserved.</p>
          <p>
            Designed by <span className="text-[#e0c393]">Mehdi Khajevandi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
